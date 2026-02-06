# Tarea 003: Tasks Controller CRUD Completo

## Metadata
task_id: `003`
feature_id: `2026-02-06-073443-todo-list-rails-react`
requisito: `RF-01, RF-02, RF-03, RF-04, RF-08, RNF-02`
created_at: `2026-02-06T09:00:00Z`
status: `defined`
priority: `1`

## Análisis de Conflictos

### Tareas Relacionadas
No hay tareas existentes en otros features.

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| app/controllers/api/tasks_controller.rb | Creación | Ninguna | NO |
| config/routes.rb | Modificación | Ninguna | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 001, 002
- **Bloquea a**: 005, 006

## Historia de Usuario
**Como** desarrollador backend
**Quiero** endpoints REST completos para gestionar tareas
**Para** que el frontend pueda realizar operaciones CRUD vía API

## Criterios de Aceptación
- [ ] Existe controlador `app/controllers/api/tasks_controller.rb` con acciones index, create, update, destroy
- [ ] Las rutas en `config/routes.rb` exponen `/api/tasks` con recursos RESTful
- [ ] Los tests en `test/controllers/api/tasks_controller_test.rb` verifican cada endpoint
- [ ] Todos los tests del controlador pasan con `rails test test/controllers/api/`
- [ ] El controlador devuelve JSON y maneja errores de validación con status 422

## Escenarios

### Escenario 1: Listar tareas (GET /api/tasks)
- **Dado** que existen 3 tareas en la base de datos
- **Cuando** hago GET /api/tasks
- **Entonces** recibo un array JSON con las 3 tareas

### Escenario 2: Crear tarea (POST /api/tasks)
- **Dado** que envío JSON válido con title: "Nueva tarea"
- **Cuando** hago POST /api/tasks
- **Entonces** recibo status 201 y la tarea creada en JSON

### Escenario 3: Actualizar tarea (PATCH /api/tasks/:id)
- **Dado** que tengo una tarea con id=1 y completed=false
- **Cuando** hago PATCH /api/tasks/1 con completed: true
- **Entonces** la tarea se actualiza y recibo status 200

### Escenario 4: Eliminar tarea (DELETE /api/tasks/:id)
- **Dado** que tengo una tarea con id=1
- **Cuando** hago DELETE /api/tasks/1
- **Entonces** la tarea se elimina y recibo status 204

### Escenario 5: Manejo de errores de validación
- **Dado** que envío title vacío en POST
- **Cuando** intento crear la tarea
- **Entonces** recibo status 422 con los errores en JSON

## Notas
Esta tarea implementa toda la API REST del backend. Los tests deben cubrir casos exitosos y de error para cada endpoint. El controlador debe retornar JSON en todos los casos y usar los códigos HTTP apropiados (200, 201, 204, 422, 404).
