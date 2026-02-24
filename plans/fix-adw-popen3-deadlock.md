# Bug: Deadlock en Open3.popen3 detiene el workflow ADW en classify_issue

## Descripción del Bug
Al ejecutar el ADW workflow para la issue #1 de GitHub, el proceso se detiene indefinidamente en el paso `classify_issue`. El fichero `raw_output.jsonl` queda vacío (0 bytes) y el log de ejecución se corta tras enviar el `issue_template_request`, sin llegar nunca a registrar la respuesta. El comportamiento esperado es que `classify_issue` retorne `/feature`, `/bug`, `/chore` o `none` y el workflow continúe con los pasos siguientes (crear rama, planificar, implementar, crear PR).

## Planteamiento del Problema
El método `prompt_claude_code` en `agent.rb` usa `Open3.popen3` con un patrón de lectura secuencial (lee todo stdout, luego stderr) que causa un deadlock cuando el proceso hijo produce output en stderr antes que en stdout. Además, no hay mecanismo de timeout ni se cierra stdin.

## Propuesta de Solución
Reemplazar `Open3.popen3` (manejo manual de pipes) por `Open3.capture3` (que ya maneja la concurrencia internamente). Es el mismo patrón que ya se usa en `github.rb`. Después de capturar stdout, escribirlo al fichero de output.

## Pasos para Reproducir
1. Crear una issue en el repositorio GitHub (ej: issue #1)
2. Ejecutar `./adws/bin/adw_plan_build 1` o dejar que `trigger_cron` lo lance
3. Observar que el proceso se cuelga tras el log `issue_template_request`
4. Verificar que `agents/<adw_id>/issue_classifier/raw_output.jsonl` está vacío (0 bytes)
5. El log de ejecución (`agents/<adw_id>/adw_plan_build/execution.log`) no contiene `issue_response`

## Análisis de Causa Raíz
En `adws/lib/adw/agent.rb` líneas 122-137, el código actual hace:

```ruby
_stdin, stdout_io, stderr_io, wait_thr = Open3.popen3(env, *cmd)
while (line = stdout_io.gets)  # Parent bloquea aquí leyendo stdout
  f.write(line)
end
stderr_output = stderr_io.read  # Solo lee stderr DESPUÉS de que stdout termine
exit_status = wait_thr.value
```

El comando Claude CLI se ejecuta con `--verbose`, que produce output en stderr. Cuando el buffer de stderr del OS (~64KB en macOS) se llena:
1. El proceso hijo (Claude CLI) se bloquea intentando escribir más en stderr
2. El proceso padre (Ruby) está bloqueado en `stdout_io.gets` esperando stdout que nunca llega
3. Deadlock permanente - ambos procesos esperan al otro

Problemas adicionales:
- `_stdin` nunca se cierra, pudiendo causar que el CLI espere EOF en stdin
- No hay mecanismo de timeout, así que un proceso colgado bloquea el workflow para siempre

## Archivos Relevantes
Usar estos ficheros para corregir el bug:

- `adws/lib/adw/agent.rb` - Contiene el método `prompt_claude_code` (líneas 100-167) con el bug del deadlock. Es el ÚNICO fichero que necesita modificación.
- `adws/bin/adw_plan_build` - Orquestador principal del workflow. No necesita cambios pero es esencial para testing manual.
- `adws/lib/adw/data_types.rb` - Define `AgentPromptResponse` y `AgentPromptRequest`. Referencia para los tipos de retorno, no necesita cambios.
- `adws/lib/adw/github.rb` - Referencia de uso correcto de `Open3.capture3` que ya maneja concurrencia internamente.

## Tareas Paso a Paso

### 1. Reemplazar popen3 por capture3 en `prompt_claude_code`
- En `adws/lib/adw/agent.rb`, reemplazar el bloque `File.open` con `popen3` (líneas 123-138) por:
  ```ruby
  stdout, stderr_output, status = Open3.capture3(env, *cmd)
  File.write(request.output_file, stdout)

  unless status.success?
    error_msg = "Claude Code error: #{stderr_output}"
    warn error_msg
    return AgentPromptResponse.new(output: error_msg, success: false)
  end
  ```
- Eliminar el bloque `File.open(...) do |f|` completo y su `end`
- `capture3` maneja la lectura concurrente de stdout y stderr internamente, eliminando el deadlock
- Es el mismo patrón ya usado en `github.rb` (líneas 40, 69, 91, etc.)

### 2. Validar el fix
- Ejecutar los `Comandos de Validación` para confirmar que el bug está corregido

## Comandos de Validación
- `cd adws && ruby -c lib/adw/agent.rb` - Validar sintaxis Ruby del fichero modificado
- `./adws/bin/adw_plan_build 1` - Ejecutar el workflow contra la issue #1 y verificar que pasa del paso classify_issue produciendo `raw_output.jsonl` con contenido

## Notas
- No se necesitan gemas ni paquetes nuevos. `Open3.capture3` ya está disponible con `require "open3"`.
- El codebase ya usa `Open3.capture3` correctamente en `github.rb`. El bug es específico de `popen3` que requiere manejo manual de pipes.
- `capture3` acumula stdout en memoria antes de escribirlo al fichero. Para los tamaños de output típicos de Claude CLI (JSONL) esto no es un problema.
- El directorio `adws/` no está trackeado en git, por lo que los tests de backend/frontend no aplican a este cambio.
