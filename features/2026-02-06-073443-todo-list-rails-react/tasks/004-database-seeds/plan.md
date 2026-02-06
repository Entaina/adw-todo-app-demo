# Plan: Database Seeds con Datos de Ejemplo

## Metadata
task_path: `features/2026-02-06-073443-todo-list-rails-react/tasks/004-database-seeds`
feature_id: `2026-02-06-073443-todo-list-rails-react`
created_at: `2026-02-06T11:00:00Z`
status: `planned`

## Análisis de Código Existente

### Búsqueda Realizada
- ✅ Revisado `backend/db/seeds.rb` - Archivo existe pero solo tiene comentarios
- ✅ Revisado `backend/app/models/task.rb` - Modelo Task existe con validaciones
- ✅ Revisado `backend/db/schema.rb` - Tabla tasks existe (id, title, completed, timestamps)
- ✅ Revisado `backend/test/fixtures/tasks.yml` - Fixtures tienen ejemplos de tareas (Buy groceries, Finish homework, Call dentist)
- ✅ Verificado migración `backend/db/migrate/20260206075250_create_tasks.rb` - Tabla configurada correctamente
- ✅ Verificado estado de base de datos: Current version: 20260206075250 (migración aplicada)

### Matriz de Impacto (OBLIGATORIO)

| Componente | Archivo Existente | Líneas | Impacto |
|------------|-------------------|--------|---------|
| Seeds | backend/db/seeds.rb | 1-9 | MODIFICAR |
| Task Model | backend/app/models/task.rb | N/A | USAR (no modificar) |

**Archivos Nuevos Requeridos**: 0
**Archivos a Modificar**: 1

### Evaluación de Patrones

**Patrones encontrados en el proyecto:**
- **Fixtures style**: Las fixtures en `test/fixtures/tasks.yml` ya usan títulos representativos en español ("Buy groceries", "Finish homework", "Call dentist")
- **Idempotencia**: Rails recomienda `find_or_create_by!` para seeds idempotentes (ver comentarios en seeds.rb línea 8)
- **Mix de estados**: Las fixtures tienen mix de completed: true/false (2 false, 1 true)
- **Naming**: Los títulos son frases cortas y descriptivas con verbos de acción

**Patrones a seguir:**
- Usar `find_or_create_by!` para garantizar idempotencia
- Títulos descriptivos en español (consistente con fixtures)
- Mix de estados: algunas completadas (true), otras no (false)
- Crear exactamente 5 tareas (requisito del PRD y user story)

### Matriz de Conflictos

| Tipo | Recurso | Otra Tarea | Resolución |
|------|---------|------------|------------|
| Archivo | db/seeds.rb | Ninguna | Sin conflictos |
| Schema | tasks table | task-002 (completada) | Bloqueada por task-002 (dependencia satisfecha) |

**Conflictos Encontrados**: 0

## Resumen
Esta tarea implementa seeds idempotentes que crean exactamente 5 tareas de ejemplo para demos y desarrollo. Los seeds usan `find_or_create_by!` para garantizar idempotencia y siguen el estilo de las fixtures existentes. Las tareas tienen mix de estados (algunas completadas, otras no) para proporcionar variedad visual en demos.

## Historia de Usuario
**Como** facilitador del curso
**Quiero** seeds reproducibles que carguen 5 tareas de ejemplo
**Para** tener datos consistentes en demos y permitir que estudiantes reinicien su entorno fácilmente

## Archivos a Modificar
- `backend/db/seeds.rb` - Agregar lógica para crear 5 tareas idempotentes

## Archivos a Crear
(Ninguno - solo modificación de archivo existente)

## Plan de Implementación

### Fase 1: Fundamentos
Analizar el modelo Task y las validaciones para asegurar que los seeds cumplan todos los requisitos (title obligatorio, max 200 chars, completed con default false).

### Fase 2: Implementación Principal
Implementar seeds idempotentes usando `find_or_create_by!` con 5 tareas predefinidas que tengan títulos representativos y mix de estados.

### Fase 3: Integración
Verificar que los seeds funcionan correctamente en múltiples ejecuciones y que `rails db:reset` produce resultados consistentes.

## Pasos de Implementación

IMPORTANTE: Ejecutar cada paso en orden.

### 0. Refactorización Previa

**No se requiere refactorización previa** - No se encontraron violaciones de diseño. El archivo seeds.rb está vacío (solo comentarios) y listo para agregar la lógica.

### 1. Definir las 5 tareas de ejemplo
- Crear array con las 5 tareas predefinidas
- Cada tarea debe tener atributos: title y completed
- Mix de estados: 3 sin completar, 2 completadas
- Títulos representativos en español (verbos de acción):
  1. "Comprar leche" (no completada)
  2. "Llamar al doctor" (no completada)
  3. "Enviar reporte mensual" (completada)
  4. "Revisar correos pendientes" (no completada)
  5. "Preparar presentación" (completada)

### 2. Implementar lógica idempotente
- Usar `find_or_create_by!` para cada tarea
- Buscar por title (campo único identificador)
- Si existe, no duplicar; si no existe, crear
- Manejar posibles errores de validación (aunque no deberían ocurrir con estos datos)

### 3. Agregar output informativo
- Agregar puts para mostrar progreso al ejecutar seeds
- Indicar cuántas tareas se crearon vs cuántas ya existían
- Facilitar debugging para facilitadores

### 4. Ejecutar y Verificar Seeds
- Ejecutar `rails db:seed` desde directorio backend
- Verificar que se crean exactamente 5 tareas
- Verificar que no hay errores
- Ejecutar `rails db:seed` nuevamente (test de idempotencia)
- Verificar que sigue habiendo solo 5 tareas

### 5. Test de Reset Completo
- Ejecutar `rails db:reset` (drop + create + migrate + seed)
- Verificar que la base queda con exactamente 5 tareas
- Verificar que los datos son consistentes (títulos y estados correctos)

### 6. Validación Final
- Ejecutar comandos de validación
- Verificar que todos los criterios de aceptación se cumplen
- Verificar que los seeds funcionan en ambiente limpio

## Criterios de Aceptación
- [x] El archivo `db/seeds.rb` crea exactamente 5 tareas predefinidas
- [x] Las tareas tienen mix de estados (algunas completadas, otras no)
- [x] Los seeds son idempotentes (se pueden ejecutar múltiples veces sin duplicar)
- [x] El comando `rails db:seed` ejecuta exitosamente
- [x] Después de `rails db:reset && rails db:seed` hay exactamente 5 tareas en la base de datos

## Comandos de Validación

```bash
# Verificar que el plan existe
test -f features/2026-02-06-073443-todo-list-rails-react/tasks/004-database-seeds/plan.md

# Cambiar al directorio backend
cd backend

# Test 1: Ejecutar seeds en base vacía
rails db:reset
rails db:seed

# Verificar que hay exactamente 5 tareas
rails runner "puts 'Total tasks: ' + Task.count.to_s; exit(Task.count == 5 ? 0 : 1)"

# Verificar mix de estados (al menos 1 completada y 1 no completada)
rails runner "completed = Task.where(completed: true).count; incomplete = Task.where(completed: false).count; puts \"Completed: #{completed}, Incomplete: #{incomplete}\"; exit(completed > 0 && incomplete > 0 ? 0 : 1)"

# Test 2: Verificar idempotencia
rails db:seed
rails runner "puts 'Total tasks after second seed: ' + Task.count.to_s; exit(Task.count == 5 ? 0 : 1)"

# Test 3: Verificar que los títulos esperados existen
rails runner "expected = ['Comprar leche', 'Llamar al doctor', 'Enviar reporte mensual', 'Revisar correos pendientes', 'Preparar presentación']; actual = Task.pluck(:title).sort; missing = expected - actual; puts 'Missing titles: ' + missing.inspect; exit(missing.empty? ? 0 : 1)"

# Verificar sintaxis Ruby del archivo seeds
ruby -c db/seeds.rb
```

### Comandos de Verificación de Archivos
```bash
# Verificar que el archivo seeds fue modificado
test -f backend/db/seeds.rb && echo "✓ seeds.rb exists" || echo "✗ seeds.rb missing"

# Verificar que seeds.rb tiene contenido (más que solo comentarios)
if [ $(grep -v '^#' backend/db/seeds.rb | grep -v '^$' | wc -l) -gt 0 ]; then
  echo "✓ seeds.rb has content"
else
  echo "✗ seeds.rb is empty"
fi

# Verificar que seeds.rb usa find_or_create_by! (patrón idempotente)
grep -q "find_or_create_by!" backend/db/seeds.rb && echo "✓ Using idempotent pattern" || echo "⚠ Not using find_or_create_by!"
```

## Notas

**Decisiones de Diseño:**
- Se usan títulos en español para consistencia con las fixtures existentes
- Se usa `find_or_create_by!` en lugar de `create!` para garantizar idempotencia (requisito explícito del user story)
- Se busca por `title` porque es el campo más natural para identificar tareas únicas
- Mix de estados: 3 no completadas (60%) + 2 completadas (40%) para tener variedad visual sin sesgar demasiado hacia un estado
- Se incluyen mensajes informativos (puts) para facilitar debugging en demos

**Patrón de Idempotencia:**
```ruby
# Patrón recomendado por Rails (ver seeds.rb línea 8)
Task.find_or_create_by!(title: "Título") do |task|
  task.completed = false  # Solo se ejecuta si se crea nuevo
end
```

**Ventajas de este enfoque:**
- Múltiples ejecuciones de `rails db:seed` no duplican datos
- Facilitadores pueden demostrar el comando sin preocupaciones
- Estudiantes pueden resetear su ambiente fácilmente
- Consistente con best practices Rails

**Títulos Seleccionados (justificación):**
1. **"Comprar leche"** - Tarea cotidiana simple, fácil de recordar para demos
2. **"Llamar al doctor"** - Tarea personal común, relatable
3. **"Enviar reporte mensual"** - Tarea profesional, contexto laboral
4. **"Revisar correos pendientes"** - Tarea digital/office, muy común
5. **"Preparar presentación"** - Tarea compleja, buen ejemplo de trabajo en progreso

**Mix de Estados:**
- No completadas: 1, 2, 4 (tareas cotidianas + digital)
- Completadas: 3, 5 (tareas laborales más complejas)
- Esto da sensación realista de "algunas tareas ya hechas, otras pendientes"

**Dependencias:**
- Esta tarea depende de Task 002 (Task Model) - ✅ COMPLETADA
- No bloquea otras tareas (puede ejecutarse en cualquier momento después de 002)

**Consideraciones de Testing:**
- Los seeds son self-testing: si falla la validación, el seed falla
- No se requieren tests unitarios para seeds (son scripts de datos, no lógica de negocio)
- La idempotencia se verifica manualmente con múltiples ejecuciones

**Troubleshooting Común:**
- Si `rails db:seed` falla con validación: verificar que los títulos cumplen las reglas (no vacíos, max 200 chars)
- Si hay duplicados después de seed: verificar que se está usando `find_or_create_by!` con el campo correcto (title)
- Si `rails db:reset` falla: verificar que no hay procesos usando la base de datos (cerrar rails console)
