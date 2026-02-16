# Chore: Añadir factory_bot y faker y generar factorías para cada modelo existente

## Descripcion del Chore
Añadir las gemas `factory_bot_rails` y `faker` al proyecto Rails backend como dependencias de desarrollo/test. Configurar factory_bot para que se integre con Minitest y generar factorías para cada modelo existente en la aplicación (actualmente solo el modelo `Task`). Actualizar los tests existentes para que utilicen las factorías en lugar de fixtures o instanciación manual donde sea apropiado.

## Archivos Relevantes
Usa estos ficheros para resolver el chore:

- `backend/Gemfile` - Donde se añadirán las gemas `factory_bot_rails` y `faker` en el grupo `:development, :test`.
- `backend/test/test_helper.rb` - Donde se incluirá `FactoryBot::Syntax::Methods` para que los métodos `build`, `create`, etc. estén disponibles en todos los tests.
- `backend/app/models/task.rb` - Modelo Task con validaciones `presence: true` y `length: { maximum: 200 }` en `title`. Necesario para entender qué atributos definir en la factoría.
- `backend/db/schema.rb` - Schema con tabla `tasks` (campos: `title` string NOT NULL, `completed` boolean default false NOT NULL, `created_at`, `updated_at`). Referencia para los tipos de datos.
- `backend/test/models/task_test.rb` - Tests del modelo Task que actualmente crean instancias manualmente con `Task.new`/`Task.create`. Se actualizarán para usar factorías.
- `backend/test/controllers/api/tasks_controller_test.rb` - Tests del controlador que usan fixtures (`tasks(:one)`) y creación manual. Se actualizarán para usar factorías.
- `backend/test/fixtures/tasks.yml` - Fixtures actuales de tasks. Se mantendrán por compatibilidad pero los tests migrarán a factorías.

### Ficheros Nuevos
- `backend/test/factories/tasks.rb` - Factoría de Task con Faker para generar datos realistas.

## Tareas Paso a Paso
IMPORTANTE: Ejecuta cada paso en orden, de arriba a abajo.

### 1. Añadir gemas factory_bot_rails y faker al Gemfile
- Editar `backend/Gemfile` y añadir dentro del grupo `:development, :test` existente:
  ```ruby
  gem "factory_bot_rails"
  gem "faker"
  ```
- Ejecutar `cd backend && bundle install` para instalar las dependencias.

### 2. Configurar factory_bot en test_helper.rb
- Editar `backend/test/test_helper.rb` para incluir los métodos de FactoryBot en todos los tests:
  ```ruby
  module ActiveSupport
    class TestCase
      include FactoryBot::Syntax::Methods
      # ... resto de la configuración existente
    end
  end
  ```

### 3. Crear la factoría de Task
- Crear el directorio `backend/test/factories/` si no existe.
- Crear el fichero `backend/test/factories/tasks.rb` con el siguiente contenido:
  ```ruby
  FactoryBot.define do
    factory :task do
      title { Faker::Lorem.sentence(word_count: 3) }
      completed { false }

      trait :completed do
        completed { true }
      end
    end
  end
  ```
- El trait `:completed` permite crear tareas completadas fácilmente con `create(:task, :completed)`.

### 4. Actualizar tests del modelo Task para usar factorías
- Editar `backend/test/models/task_test.rb` para reemplazar la creación manual por factorías:
  - `Task.new(title: "Valid task")` → `build(:task)`
  - `Task.create(title: "New task")` → `create(:task)`
  - `Task.new(completed: false)` → `build(:task, title: nil)` (test de presencia)
  - `Task.new(title: "")` → `build(:task, title: "")`
  - `Task.new(title: "a" * 201)` → `build(:task, title: "a" * 201)`
  - `Task.new(title: "a" * 200)` → `build(:task, title: "a" * 200)`

### 5. Actualizar tests del controlador para usar factorías
- Editar `backend/test/controllers/api/tasks_controller_test.rb` para reemplazar fixtures y creación manual por factorías:
  - Añadir un `setup` block que cree las tareas necesarias con `create(:task)` y `create(:task, :completed)`.
  - Reemplazar `tasks(:one)` por una variable de instancia `@task` creada en el setup.
  - Actualizar el test de index para verificar el número correcto de tareas creadas en setup.
  - Reemplazar las cadenas hardcoded en create/update por datos generados con Faker o factorías.

### 6. Ejecutar los comandos de validación
- Ejecutar `cd backend && bin/rails test` para verificar que todos los tests pasan correctamente.
- Ejecutar `cd frontend && npm test` para verificar que no hay regresiones en el frontend.

## Comandos de Validacion
Ejecuta cada comando para validar que el chore esta completo sin regresiones.

- `cd backend && bin/rails test` - Ejecuta los tests del backend para validar que el chore esta completo sin regresiones
- `cd frontend && npm test` - Ejecuta los tests del frontend para validar que el chore esta completo sin regresiones

## Notas
- El proyecto actualmente solo tiene un modelo (`Task`), por lo que solo se necesita una factoría.
- Los fixtures existentes en `backend/test/fixtures/tasks.yml` se mantienen por si hubiera alguna dependencia, pero los tests se migran a factorías.
- `factory_bot_rails` (en vez de `factory_bot` a secas) se usa porque auto-detecta el directorio de factorías y se integra con los generadores de Rails.
- Se usa `Faker::Lorem.sentence` para los títulos, lo que genera frases cortas realistas que cumplen la restricción de 200 caracteres máximo.
