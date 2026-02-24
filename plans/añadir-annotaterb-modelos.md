# Chore: Añadir annotaterb y anotar los modelos

## Descripción del Chore
Añadir la gema `annotaterb` al proyecto Rails backend y configurarla para que todos los modelos tengan anotaciones automáticas con el esquema de base de datos. La gema `annotaterb` es el sucesor moderno de `annotate_models` y genera comentarios al inicio de cada fichero de modelo con información sobre las columnas de la tabla correspondiente (nombre, tipo, default, nullability, etc.).

## Archivos Relevantes
Usa estos ficheros para resolver el chore:

- `backend/Gemfile` - Para añadir la gema `annotaterb` al grupo de desarrollo
- `backend/Gemfile.lock` - Se actualizará automáticamente al ejecutar `bundle install`
- `backend/app/models/task.rb` - Modelo existente que recibirá las anotaciones del esquema
- `backend/app/models/application_record.rb` - Modelo base abstracto (no se anota porque no tiene tabla)
- `backend/db/schema.rb` - Esquema actual de la base de datos, referencia para verificar que las anotaciones son correctas

### Ficheros Nuevos
- `backend/lib/generators/annotate_rb/install/install_generator.rb` - No se crea manualmente; lo genera el instalador de annotaterb
- `backend/.annotaterb.yml` - Fichero de configuración generado por el instalador de annotaterb

## Tareas Paso a Paso
IMPORTANTE: Ejecuta cada paso en orden, de arriba a abajo.

### Paso 1: Añadir la gema annotaterb al Gemfile
- Edita `backend/Gemfile` y añade `gem "annotaterb"` dentro del grupo `:development, :test` existente (después de las gemas ya presentes en ese grupo).

### Paso 2: Instalar la gema
- Ejecuta `cd backend && bundle install` para instalar la gema y actualizar el `Gemfile.lock`.

### Paso 3: Ejecutar el instalador de annotaterb
- Ejecuta `cd backend && bin/rails g annotate_rb:install` para generar el fichero de configuración `.annotaterb.yml` y el rake task de integración con migraciones.
- Verifica que se ha creado el fichero `backend/.annotaterb.yml` con la configuración por defecto.

### Paso 4: Anotar todos los modelos existentes
- Ejecuta `cd backend && bundle exec annotaterb models` para generar las anotaciones de esquema en todos los modelos existentes.
- Verifica que `backend/app/models/task.rb` ahora contiene un bloque de comentarios al inicio del fichero con las columnas de la tabla `tasks` (id, title, completed, created_at, updated_at).

### Paso 5: Validar las anotaciones generadas
- Lee `backend/app/models/task.rb` y confirma que las anotaciones reflejan correctamente el esquema definido en `backend/db/schema.rb`:
  - `id` (bigint, primary key)
  - `completed` (boolean, default: false, not null)
  - `created_at` (datetime, not null)
  - `title` (string, not null)
  - `updated_at` (datetime, not null)

### Paso 6: Ejecutar los Comandos de Validación
- Ejecuta los comandos de validación para confirmar que no hay regresiones.

## Comandos de Validación
Ejecuta cada comando para validar que el chore está completo sin regresiones.

- `cd backend && bin/rails test` - Ejecuta los tests del backend para validar que el chore está completo sin regresiones
- `cd frontend && npm test` - Ejecuta los tests del frontend para validar que el chore está completo sin regresiones

## Notas
- `annotaterb` es el sucesor de la gema `annotate` (también conocida como `annotate_models`). Se usa `annotaterb` porque es la versión mantenida activamente y compatible con Rails 8.
- Las anotaciones se añaden como comentarios Ruby (`#`) al inicio de cada fichero de modelo, por lo que no afectan al comportamiento del código.
- Tras la configuración, las anotaciones se actualizarán automáticamente cada vez que se ejecute una migración (`rails db:migrate`), gracias al rake task generado por el instalador.
- El fichero `application_record.rb` no se anota porque usa `primary_abstract_class` y no tiene tabla asociada.
