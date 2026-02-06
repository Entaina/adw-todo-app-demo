# Plan: Modelo Task con Validaciones

## Metadata
task_path: `features/2026-02-06-073443-todo-list-rails-react/tasks/002-task-model`
feature_id: `2026-02-06-073443-todo-list-rails-react`
created_at: `2026-02-06T09:30:00Z`
status: `planned`

## Análisis de Código Existente

### Búsqueda Realizada
- ✅ Revisado `backend/app/models/application_record.rb` - Clase base para modelos
- ✅ Revisado `backend/config/routes.rb` - Ya existe namespace :api preparado
- ✅ Revisado `backend/config/initializers/cors.rb` - CORS configurado para localhost:5173
- ✅ Revisado `backend/test/test_helper.rb` - Configuración de tests con Minitest
- ✅ Revisado `backend/Gemfile` - Rails 8.1.1, SQLite3, Puma, rack-cors
- ✅ Verificado estructura de directorios test/ - test/models/ y test/controllers/ existen pero vacíos
- ✅ Verificado db/migrate/ - No existen migraciones aún (Current version: 0)
- ✅ Verificado db/seeds.rb - Archivo existe pero vacío (se usará en task 004)

### Matriz de Impacto

| Componente | Archivo Existente | Líneas | Impacto |
|------------|-------------------|--------|---------|
| Modelo Task | N/A | N/A | CREAR |
| Migración create_tasks | N/A | N/A | CREAR |
| Test del modelo | N/A | N/A | CREAR |
| Fixture de tasks | N/A | N/A | CREAR |

**Archivos Nuevos Requeridos**: 4
**Archivos a Modificar**: 0

### Evaluación de Patrones

**Convenciones Rails encontradas:**
- Modelos heredan de `ApplicationRecord` (no de `ActiveRecord::Base`)
- ApplicationRecord usa `primary_abstract_class` (Rails 7+)
- Tests usan Minitest (no RSpec) - configurado en test_helper.rb
- Tests usan fixtures (configurado `fixtures :all` en test_helper.rb)
- Estructura de directorios estándar Rails 8.1.1
- Base de datos SQLite3 en `storage/development.sqlite3`

**Patrones a seguir:**
- Naming: snake_case para archivos, CamelCase para clases
- Modelo Task en `app/models/task.rb`
- Test en `test/models/task_test.rb`
- Migración con timestamp YYYYMMDDHHMMSS_create_tasks.rb
- Fixture en `test/fixtures/tasks.yml`
- Validaciones usando DSL de ActiveRecord (validates)
- Tests usando Minitest assertions (assert, assert_not)

### Matriz de Conflictos

| Tipo | Recurso | Otra Tarea | Resolución |
|------|---------|------------|------------|
| Schema | tasks table | task-003, task-004 | task-002 debe completarse primero (bloqueante) |

**Conflictos Encontrados**: 0 (pero task-002 es dependencia bloqueante para task-003 y task-004)

## Resumen
Esta tarea crea el modelo Task con validaciones y su schema de base de datos. Incluye migración para crear la tabla `tasks` con columnas id, title (string), completed (boolean con default false), y timestamps. El modelo tendrá validaciones de presencia y longitud máxima para el título. Los tests verificarán las validaciones y el comportamiento por defecto del campo completed.

## Historia de Usuario
**Como** desarrollador backend
**Quiero** un modelo Task con validaciones y schema de base de datos
**Para** asegurar integridad de datos y tener la base para el CRUD

## Archivos a Modificar
(Ninguno - esta tarea solo crea archivos nuevos)

## Archivos a Crear
- `backend/db/migrate/YYYYMMDDHHMMSS_create_tasks.rb` - Migración para crear tabla tasks
- `backend/app/models/task.rb` - Modelo Task con validaciones
- `backend/test/models/task_test.rb` - Tests del modelo Task
- `backend/test/fixtures/tasks.yml` - Fixtures para los tests

## Plan de Implementación

### Fase 1: Fundamentos (Migración y Schema)
Crear la migración que define el schema de la tabla tasks en la base de datos. La migración debe ser reversible (usar change en lugar de up/down) y seguir las convenciones Rails.

### Fase 2: Implementación Principal (Modelo y Validaciones)
Crear el modelo Task con las validaciones requeridas. El modelo debe heredar de ApplicationRecord y usar el DSL de validaciones de ActiveRecord para garantizar integridad de datos.

### Fase 3: Testing (Tests y Fixtures)
Crear los tests del modelo usando Minitest y fixtures para datos de prueba. Los tests deben cubrir todos los criterios de aceptación: validaciones, valores por defecto, y casos edge.

## Pasos de Implementación

### 0. Refactorización Previa

**No se requiere refactorización previa** - No se encontraron violaciones de diseño, código duplicado, ni conflictos. Esta es la primera implementación del modelo Task.

### 1. Crear Migración
- Generar migración con timestamp usando convención Rails
- Nombre: `create_tasks.rb` con prefijo timestamp YYYYMMDDHHMMSS
- Usar método `change` para reversibilidad automática
- Definir tabla `tasks` con:
  - `t.string :title, null: false` - título obligatorio a nivel de schema
  - `t.boolean :completed, default: false, null: false` - estado completado con default
  - `t.timestamps` - created_at y updated_at automáticos
- Agregar índice si es necesario (no requerido para v1 mínima)

### 2. Crear Modelo Task
- Crear archivo `backend/app/models/task.rb`
- Clase `Task` hereda de `ApplicationRecord`
- Agregar validaciones:
  - `validates :title, presence: true` - título obligatorio
  - `validates :title, length: { maximum: 200 }` - máximo 200 caracteres
- No es necesario definir atributos (Rails los infiere del schema)
- No es necesario definir default de completed (está en la migración)

### 3. Crear Fixtures para Tests
- Crear archivo `backend/test/fixtures/tasks.yml`
- Definir al menos 3 fixtures:
  - `one`: Tarea válida sin completar
  - `two`: Tarea válida completada
  - `three`: Otra tarea válida para tests diversos
- Usar sintaxis YAML de fixtures Rails:
  ```yaml
  one:
    title: "Task title"
    completed: false
  ```

### 4. Crear Tests del Modelo
- Crear archivo `backend/test/models/task_test.rb`
- Clase `TaskTest` hereda de `ActiveSupport::TestCase`
- Escribir tests para cada criterio de aceptación:
  - **test_valid_task**: Verificar que tarea con título válido se guarda correctamente
  - **test_completed_defaults_to_false**: Verificar que completed es false por defecto
  - **test_title_presence**: Verificar que tarea sin título no es válida
  - **test_title_blank**: Verificar que tarea con título vacío no es válida
  - **test_title_too_long**: Verificar que título > 200 chars no es válido
  - **test_title_max_length**: Verificar que título de exactamente 200 chars es válido (edge case)
- Usar assertions de Minitest: `assert`, `assert_not`, `assert_equal`, `assert_includes`

### 5. Ejecutar Migración
- Ejecutar `rails db:migrate` en el directorio backend
- Verificar que la migración se aplica sin errores
- Verificar que db/schema.rb se actualiza con la tabla tasks
- Verificar que `rails db:version` muestra la nueva versión

### 6. Ejecutar Tests
- Ejecutar `rails test test/models/task_test.rb` para verificar solo tests del modelo
- Verificar que todos los tests pasan (verde)
- Si hay fallos, corregir y volver a ejecutar

### 7. Validación Final
- Ejecutar suite completa de tests: `rails test`
- Verificar que no hay regresiones
- Verificar que el modelo funciona en consola: `rails console`
  - Crear tarea válida: `Task.create(title: "Test")`
  - Verificar completed: `Task.last.completed # => false`
  - Probar validación: `Task.new.valid? # => false`

## Criterios de Aceptación
- [ ] Existe migración que crea tabla `tasks` con columnas: id, title (string), completed (boolean, default false), timestamps
- [ ] Existe modelo `app/models/task.rb` con validaciones de title (presencia y longitud máx 200)
- [ ] Los tests en `test/models/task_test.rb` verifican validaciones y valores por defecto
- [ ] La migración se ejecuta exitosamente con `rails db:migrate`
- [ ] Los tests del modelo pasan con `rails test test/models/task_test.rb`

## Comandos de Validación

```bash
# Verificar que el plan existe
test -f features/2026-02-06-073443-todo-list-rails-react/tasks/002-task-model/plan.md

# Cambiar al directorio backend
cd backend

# Ejecutar migración
rails db:migrate

# Verificar schema
test -f db/schema.rb
grep -q "create_table \"tasks\"" db/schema.rb

# Ejecutar tests del modelo
rails test test/models/task_test.rb

# Ejecutar suite completa de tests
rails test

# Verificar que el modelo se puede cargar en consola (smoke test)
rails runner "puts Task.new.class.name"
```

### Comandos de Verificación de Archivos
```bash
# Verificar que todos los archivos fueron creados
test -f backend/db/migrate/*_create_tasks.rb && echo "✓ Migration exists" || echo "✗ Migration missing"
test -f backend/app/models/task.rb && echo "✓ Model exists" || echo "✗ Model missing"
test -f backend/test/models/task_test.rb && echo "✓ Test exists" || echo "✗ Test missing"
test -f backend/test/fixtures/tasks.yml && echo "✓ Fixture exists" || echo "✗ Fixture missing"

# Verificar sintaxis Ruby
cd backend && ruby -c app/models/task.rb
cd backend && ruby -c test/models/task_test.rb
```

## Notas

**Decisiones de Diseño:**
- El campo `completed` tiene default en la migración (no en el modelo) siguiendo best practices Rails
- La validación de presence usa el DSL de ActiveRecord (no validaciones personalizadas)
- La longitud máxima de 200 caracteres es suficiente para títulos de tareas según el PRD
- No se agrega índice en title porque no hay búsquedas por título en v1 (YAGNI)
- Se usa `null: false` en la migración para title y completed para garantizar integridad a nivel de base de datos

**Orden de Implementación:**
1. Migración primero (define el schema)
2. Modelo segundo (usa el schema)
3. Fixtures tercero (usan el modelo)
4. Tests cuarto (usan fixtures y modelo)

**Dependencias:**
- Esta tarea es bloqueante para:
  - Task 003: Tasks Controller (necesita el modelo)
  - Task 004: Database Seeds (necesita el modelo)
- Esta tarea depende de:
  - Task 001: Backend Base Setup (completada) ✅

**Consideraciones de Testing:**
- Los tests cubren happy path y edge cases (título vacío, título demasiado largo, exactamente 200 chars)
- Se usan fixtures para datos de prueba (no factories) siguiendo las convenciones Rails estándar
- Los tests son independientes y no dependen del orden de ejecución
- Se usa `assert_not` para verificar validaciones fallidas (más claro que `assert_equal false`)

**Troubleshooting Común:**
- Si la migración falla: verificar que no existe ya una tabla tasks con `rails db:migrate:status`
- Si los tests fallan: verificar que las fixtures tienen sintaxis YAML correcta (indentación)
- Si el modelo no se carga: verificar que el archivo está en `app/models/` y la clase se llama `Task` (singular)
