# Tarea 002: Modelo Task con Validaciones

## Metadata
task_id: `002`
feature_id: `2026-02-06-073443-todo-list-rails-react`
requisito: `RF-05, RF-06, RF-07, RNF-02`
created_at: `2026-02-06T09:00:00Z`
status: `defined`
priority: `1`

## Análisis de Conflictos

### Tareas Relacionadas
No hay tareas existentes en otros features.

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| app/models/task.rb | Creación | Ninguna | NO |
| db/migrate/*_create_tasks.rb | Creación | Ninguna | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 001
- **Bloquea a**: 003, 004

## Historia de Usuario
**Como** desarrollador backend
**Quiero** un modelo Task con validaciones y schema de base de datos
**Para** asegurar integridad de datos y tener la base para el CRUD

## Criterios de Aceptación
- [ ] Existe migración que crea tabla `tasks` con columnas: id, title (string), completed (boolean, default false), timestamps
- [ ] Existe modelo `app/models/task.rb` con validaciones de title (presencia y longitud máx 200)
- [ ] Los tests en `test/models/task_test.rb` verifican validaciones y valores por defecto
- [ ] La migración se ejecuta exitosamente con `rails db:migrate`
- [ ] Los tests del modelo pasan con `rails test test/models/task_test.rb`

## Escenarios

### Escenario 1: Crear tarea válida
- **Dado** que tengo un título válido "Comprar leche"
- **Cuando** creo Task.create(title: "Comprar leche")
- **Entonces** la tarea se guarda con completed = false por defecto

### Escenario 2: Validación de título obligatorio
- **Dado** que intento crear una tarea sin título
- **Cuando** ejecuto Task.create(title: "")
- **Entonces** el modelo devuelve error de validación

### Escenario 3: Validación de longitud máxima
- **Dado** que tengo un título de 201 caracteres
- **Cuando** intento crear la tarea
- **Entonces** el modelo devuelve error de validación

## Notas
Esta tarea se enfoca exclusivamente en el modelo y la base de datos. No incluye endpoints ni controladores todavía. Los tests deben cubrir los casos de validación exitosa, título vacío, y título demasiado largo.
