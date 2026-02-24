# Bug: Colisión de nombre de comando /feature entre proyecto y plugin product-dev

## Descripción del Bug
Cuando el ADW workflow (`adws/bin/adw_plan_build`) ejecuta el paso de planificación para una issue clasificada como `/feature`, Claude Code resuelve el comando `/feature` al plugin `product-dev:feature` en vez del comando de proyecto `.claude/commands/feature.md`. Esto causa que se cree una estructura de feature en `features/` (workflow PRD del plugin product-dev) en lugar de un plan de implementación en `plans/`. Posteriormente, el paso `plan_finder` no encuentra ningún fichero de plan en `plans/` y lanza el error "No plan file found in output".

**Comportamiento esperado**: El SDLCPlanner ejecuta `/feature` → se usa `.claude/commands/feature.md` → se crea un plan en `plans/*.md` → el plan_finder lo localiza → el workflow continúa.

**Comportamiento actual**: El SDLCPlanner ejecuta `/feature` → se resuelve a `product-dev:feature` → se crea un feature en `features/` → no se crea plan en `plans/` → plan_finder devuelve `none` → error "No plan file found in output".

## Planteamiento del Problema
Los comandos de proyecto `/feature`, `/bug` y `/chore` (en `.claude/commands/`) colisionan con los comandos del plugin `product-dev` (especialmente `product-dev:feature`). Cuando se ejecutan en modo no-interactivo (`claude -p`), Claude Code resuelve `/feature` al plugin en vez del comando de proyecto. Esto rompe el flujo completo del ADW workflow.

## Propuesta de Solución
Mover los comandos de planificación del proyecto (`feature.md`, `bug.md`, `chore.md`) bajo el namespace `adw:` (directorio `.claude/commands/adw/`) para evitar la colisión con los comandos del plugin `product-dev`. Actualizar el clasificador de issues y las constantes del ADW para usar los nuevos nombres (`/adw:feature`, `/adw:bug`, `/adw:chore`).

## Pasos para Reproducir
1. Tener el plugin `product-dev` instalado (que registra `product-dev:feature`)
2. Tener `.claude/commands/feature.md` como comando de proyecto
3. Ejecutar `adws/bin/adw_plan_build <issue-number>` con una issue clasificada como feature
4. Observar en los logs (`agents/<adw-id>/adw_plan_build/execution.log`) que el SDLCPlanner ejecuta `product-dev:feature` en vez del comando de proyecto
5. Observar el error "No plan file found in output" cuando el plan_finder no encuentra fichero en `plans/`

## Análisis de Causa Raíz
El flujo del ADW es:
1. `classify_issue` clasifica la issue y devuelve `/feature`
2. `build_plan` construye el prompt `/feature <descripción>` y lo envía a Claude Code vía `claude -p`
3. Claude Code resuelve `/feature` y encuentra dos coincidencias: el comando de proyecto `feature` (de `.claude/commands/feature.md`) y el comando de plugin `product-dev:feature`
4. Claude Code prioriza el plugin `product-dev:feature` sobre el comando de proyecto
5. `product-dev:feature` crea una estructura en `features/` y sugiere ejecutar `/prd` — NO crea un plan en `plans/`
6. El paso `plan_finder` recibe esta salida, busca un fichero `plans/*.md` y no lo encuentra
7. Devuelve `none`, lo que genera el error

La causa raíz es la **colisión de nombres** entre el comando de proyecto `/feature` y el comando de plugin `product-dev:feature`, combinada con la resolución de comandos de Claude Code que prioriza el plugin.

## Archivos Relevantes
Usa estos ficheros para corregir el bug:

- `.claude/commands/feature.md` — Comando de proyecto que debe moverse a `.claude/commands/adw/feature.md` para evitar colisión
- `.claude/commands/bug.md` — Comando de proyecto que debe moverse a `.claude/commands/adw/bug.md` por consistencia y para prevenir futuras colisiones
- `.claude/commands/chore.md` — Comando de proyecto que debe moverse a `.claude/commands/adw/chore.md` por consistencia
- `.claude/commands/adw/classify_issue.md` — Clasificador de issues que debe actualizar sus valores de salida de `/feature`, `/bug`, `/chore` a `/adw:feature`, `/adw:bug`, `/adw:chore`
- `adws/bin/adw_plan_build` — Script principal del ADW que define `ISSUE_CLASS_COMMANDS` y contiene la lógica del workflow

## Tareas Paso a Paso
IMPORTANTE: Ejecuta cada paso en orden, de arriba a abajo.

### Paso 1: Mover comandos de planificación al namespace adw
- Mover `.claude/commands/feature.md` → `.claude/commands/adw/feature.md`
- Mover `.claude/commands/bug.md` → `.claude/commands/adw/bug.md`
- Mover `.claude/commands/chore.md` → `.claude/commands/adw/chore.md`
- Usar `git mv` para preservar el historial de los ficheros

### Paso 2: Actualizar ISSUE_CLASS_COMMANDS en adw_plan_build
- En `adws/bin/adw_plan_build`, línea ~13, cambiar:
  ```ruby
  # Antes
  ISSUE_CLASS_COMMANDS = %w[/chore /bug /feature].freeze
  # Después
  ISSUE_CLASS_COMMANDS = %w[/adw:chore /adw:bug /adw:feature].freeze
  ```
  (Nota: esta constante está en `adws/lib/adw/data_types.rb`, verificar su ubicación exacta)

### Paso 3: Actualizar el clasificador de issues
- En `.claude/commands/adw/classify_issue.md`, actualizar:
  - La descripción del frontmatter: cambiar `/chore, /bug, /feature` por `/adw:chore, /adw:bug, /adw:feature`
  - Los criterios de clasificación: cambiar `/bug`, `/feature`, `/chore` por `/adw:bug`, `/adw:feature`, `/adw:chore`
  - La sección de Reporte: actualizar los valores de respuesta esperados
  - Mantener `none` sin cambios

### Paso 4: Ejecutar Comandos de Validación
- Ejecutar los comandos de validación para verificar que los cambios son correctos

## Comandos de Validación
Ejecuta cada comando para validar que el bug está corregido sin regresiones.

- `test -f .claude/commands/adw/feature.md && echo "OK: adw/feature.md exists" || echo "FAIL: adw/feature.md missing"` — Verificar que feature.md se movió correctamente
- `test -f .claude/commands/adw/bug.md && echo "OK: adw/bug.md exists" || echo "FAIL: adw/bug.md missing"` — Verificar que bug.md se movió correctamente
- `test -f .claude/commands/adw/chore.md && echo "OK: adw/chore.md exists" || echo "FAIL: adw/chore.md missing"` — Verificar que chore.md se movió correctamente
- `test ! -f .claude/commands/feature.md && echo "OK: old feature.md removed" || echo "FAIL: old feature.md still exists"` — Verificar que el fichero original se eliminó
- `test ! -f .claude/commands/bug.md && echo "OK: old bug.md removed" || echo "FAIL: old bug.md still exists"` — Verificar que el fichero original se eliminó
- `test ! -f .claude/commands/chore.md && echo "OK: old chore.md removed" || echo "FAIL: old chore.md still exists"` — Verificar que el fichero original se eliminó
- `grep -q '/adw:chore' adws/lib/adw/data_types.rb && echo "OK: ISSUE_CLASS_COMMANDS updated" || echo "FAIL: ISSUE_CLASS_COMMANDS not updated"` — Verificar que las constantes se actualizaron
- `grep -q '/adw:feature' .claude/commands/adw/classify_issue.md && echo "OK: classify_issue updated" || echo "FAIL: classify_issue not updated"` — Verificar que el clasificador se actualizó

## Notas
- El comando `/implement` no tiene colisión con ningún plugin, por lo que no necesita moverse.
- Los comandos `adw:find_plan_file`, `adw:classify_issue`, `adw:generate_branch_name`, `adw:pull_request` ya están correctamente bajo el namespace `adw:`.
- Aunque actualmente solo `/feature` tiene colisión confirmada con `product-dev:feature`, es prudente mover también `/bug` y `/chore` al namespace `adw:` para prevenir futuras colisiones si se instalan plugins con esos nombres.
- La constante `ISSUE_CLASS_COMMANDS` está definida en `adws/lib/adw/data_types.rb` (línea 13), no en `adws/bin/adw_plan_build`.
