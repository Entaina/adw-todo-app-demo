# Plan: Tasks Controller CRUD Completo

## Metadata
task_path: `features/2026-02-06-073443-todo-list-rails-react/tasks/003-tasks-controller`
feature_id: `2026-02-06-073443-todo-list-rails-react`
created_at: `2026-02-06T09:15:00Z`
status: `planned`

## Análisis de Código Existente

### Búsqueda Realizada
Se analizó el codebase del backend Rails y se encontró:
- ✅ Modelo `Task` existente en `backend/app/models/task.rb` con validaciones completas
- ✅ Migración de base de datos creada y aplicada
- ✅ Tests del modelo en `backend/test/models/task_test.rb` (6 tests pasando)
- ✅ Fixtures de prueba en `backend/test/fixtures/tasks.yml` (3 tareas de ejemplo)
- ✅ CORS configurado en `backend/config/initializers/cors.rb` para localhost:5173
- ✅ Namespace API preparado en `backend/config/routes.rb` (línea 9-11)
- ❌ NO existe controlador de tasks todavía
- ❌ NO existen tests del controlador todavía
- ❌ NO hay rutas de resources definidas en el namespace API

### Matriz de Impacto

| Componente | Archivo Existente | Líneas | Impacto |
|------------|-------------------|--------|---------|
| Controller | N/A | N/A | CREAR |
| Routes | `backend/config/routes.rb` | 10-11 | MODIFICAR |
| Controller Tests | N/A | N/A | CREAR |
| Model | `backend/app/models/task.rb` | 1-4 | USAR (sin cambios) |
| Fixtures | `backend/test/fixtures/tasks.yml` | 1-11 | USAR (sin cambios) |

**Archivos Nuevos Requeridos**: 2
- `backend/app/controllers/api/tasks_controller.rb`
- `backend/test/controllers/api/tasks_controller_test.rb`

**Archivos a Modificar**: 1
- `backend/config/routes.rb`

### Evaluación de Patrones

**Convenciones Rails identificadas en el proyecto:**
- API mode: `ApplicationController < ActionController::API` (no hay views HTML)
- Namespace API: Todos los endpoints bajo `/api/*`
- Testing framework: Minitest (no RSpec)
- Test style: `test "description" do ... end` con assertions explícitas
- Fixtures: Usados por todos los tests (línea 11 de test_helper.rb)
- Validaciones: En el modelo, no en el controlador
- Naming: Snake_case para archivos, CamelCase para clases

**Patrones de Rails API Controller a seguir:**
- Respuestas JSON automáticas (render json:)
- Status codes HTTP semánticos (200, 201, 204, 422, 404)
- Strong parameters para filtrar parámetros permitidos
- Rescue de ActiveRecord::RecordNotFound para 404
- Manejo de errores de validación con .errors.full_messages

### Matriz de Conflictos

| Tipo | Recurso | Otra Tarea | Resolución |
|------|---------|------------|------------|
| N/A | N/A | N/A | N/A |

**Conflictos Encontrados**: 0

La user story indica que las tareas 001 (backend base) y 002 (modelo Task) están completadas, lo cual confirma el análisis de código. No hay dependencias pendientes ni conflictos con otros features.

## Resumen

Implementar el controlador REST completo para tareas (CRUD) bajo el namespace `/api/tasks`. El controlador manejará las 4 operaciones estándar: listar todas las tareas (index), crear nueva tarea (create), actualizar tarea existente (update), y eliminar tarea (destroy). El controlador devolverá respuestas JSON con códigos HTTP apropiados, validará parámetros usando strong parameters, y manejará errores de validación devolviendo status 422 con los mensajes de error del modelo. Se incluirán tests completos para todos los endpoints cubriendo casos exitosos y de error.

## Historia de Usuario

**Como** desarrollador backend
**Quiero** endpoints REST completos para gestionar tareas
**Para** que el frontend pueda realizar operaciones CRUD vía API

## Archivos a Modificar

- `backend/config/routes.rb` - Añadir `resources :tasks` dentro del namespace api para generar las rutas RESTful

## Archivos a Crear

- `backend/app/controllers/api/tasks_controller.rb` - Controlador con acciones index, create, update, destroy que devuelven JSON
- `backend/test/controllers/api/tasks_controller_test.rb` - Tests de integración para cada endpoint con casos exitosos y de error

## Plan de Implementación

### Fase 1: Fundamentos (Rutas)
Configurar las rutas RESTful en el namespace API para exponer los endpoints `/api/tasks` con los 4 métodos HTTP necesarios.

### Fase 2: Implementación Principal (Controlador)
Crear el controlador con las 4 acciones CRUD:
- `index`: Retorna todas las tareas en formato JSON
- `create`: Crea una nueva tarea validando parámetros y maneja errores
- `update`: Actualiza una tarea existente (principalmente el campo completed)
- `destroy`: Elimina una tarea y retorna 204 No Content

### Fase 3: Integración (Tests)
Crear tests de integración que verifiquen cada endpoint, validando respuestas exitosas, códigos de status, formato JSON, y manejo de errores (validación, registro no encontrado).

## Pasos de Implementación

IMPORTANTE: Ejecutar cada paso en orden.

### 0. Refactorización Previa

**NO SE REQUIERE REFACTORIZACIÓN**

No se encontraron violaciones de diseño, código duplicado, o conflictos de responsabilidad. El código existente sigue correctamente el patrón Rails API con separación limpia entre modelo y controlador.

### 1. Crear directorio para controladores API

- Verificar que existe `backend/app/controllers/api/` (debería existir)
- Si no existe, crearlo con `mkdir -p backend/app/controllers/api/`

### 2. Crear el Tasks Controller

- Crear `backend/app/controllers/api/tasks_controller.rb`
- Heredar de `ApplicationController`
- Implementar acción `index` que retorna `Task.all` como JSON
- Implementar acción `create` con strong parameters
  - Usar `task_params` private method permitiendo solo `:title` y `:completed`
  - Si valid, retornar JSON con status 201
  - Si invalid, retornar errors.full_messages con status 422
- Implementar acción `update` con strong parameters
  - Encontrar tarea por params[:id]
  - Actualizar con task_params
  - Si valid, retornar JSON con status 200
  - Si invalid, retornar errors.full_messages con status 422
- Implementar acción `destroy`
  - Encontrar tarea por params[:id]
  - Llamar .destroy
  - Retornar status 204 (no content)
- Añadir rescue para `ActiveRecord::RecordNotFound` que retorne JSON con status 404

### 3. Configurar las rutas RESTful

- Editar `backend/config/routes.rb`
- Dentro del bloque `namespace :api`, añadir `resources :tasks, only: [:index, :create, :update, :destroy]`
- Reemplazar el comentario actual (línea 10) con la línea resources

### 4. Verificar las rutas generadas

- Ejecutar `rails routes | grep tasks` para confirmar que se generaron las 4 rutas
- Verificar que todas tengan el prefijo `/api/tasks`

### 5. Crear directorio para tests de controladores API

- Verificar que existe `backend/test/controllers/api/`
- Si no existe, crearlo con `mkdir -p backend/test/controllers/api/`

### 6. Crear tests del controlador

- Crear `backend/test/controllers/api/tasks_controller_test.rb`
- Requerir `test_helper`
- Definir clase `Api::TasksControllerTest < ActionDispatch::IntegrationTest`
- Implementar test para GET index exitoso
  - Verificar status 200
  - Parsear JSON y verificar que es un array
  - Verificar que contiene las 3 tareas de fixtures
  - Verificar estructura de cada tarea (tiene keys: id, title, completed, created_at, updated_at)
- Implementar test para POST create exitoso
  - Enviar JSON con title válido
  - Verificar status 201
  - Verificar que se creó el registro en DB
  - Verificar que el JSON de respuesta contiene la tarea creada
  - Verificar que completed es false por defecto
- Implementar test para POST create con título vacío
  - Enviar JSON con title: ""
  - Verificar status 422
  - Verificar que el JSON contiene errors array
  - Verificar que no se creó registro en DB
- Implementar test para POST create con título muy largo
  - Enviar JSON con title de 201 caracteres
  - Verificar status 422
  - Verificar que el JSON contiene mensaje de error sobre longitud
- Implementar test para PATCH update exitoso
  - Actualizar completed de una fixture
  - Verificar status 200
  - Verificar que se actualizó en DB
  - Verificar JSON de respuesta con nuevo valor
- Implementar test para PATCH update con datos inválidos
  - Enviar title vacío
  - Verificar status 422
  - Verificar que no se actualizó en DB
- Implementar test para DELETE destroy exitoso
  - Eliminar una fixture
  - Verificar status 204
  - Verificar que no hay content en respuesta
  - Verificar que se eliminó de DB
- Implementar test para acciones con ID no existente (update y destroy)
  - Verificar status 404
  - Verificar JSON con mensaje de error

### 7. Ejecutar los tests del controlador

- Correr `rails test test/controllers/api/tasks_controller_test.rb`
- Verificar que todos los tests pasan (debe haber al menos 8 tests)

### 8. Ejecutar todos los tests del proyecto

- Correr `rails test` para verificar que no rompimos nada
- Confirmar que todos los tests existentes (modelo + controlador) pasan

### 9. Validar manualmente con curl (opcional pero recomendado)

- Arrancar el servidor con `rails server`
- Probar GET: `curl http://localhost:3000/api/tasks`
- Probar POST: `curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Test task"}'`
- Probar PATCH: `curl -X PATCH http://localhost:3000/api/tasks/1 -H "Content-Type: application/json" -d '{"completed":true}'`
- Probar DELETE: `curl -X DELETE http://localhost:3000/api/tasks/1`

### 10. Validación Final

- Ejecutar comandos de validación (ver sección siguiente)
- Verificar que todos los criterios de aceptación están cumplidos
- Confirmar que el controlador está listo para integración con frontend

## Criterios de Aceptación

- [ ] Existe controlador `backend/app/controllers/api/tasks_controller.rb` con acciones index, create, update, destroy
- [ ] Las rutas en `backend/config/routes.rb` exponen `/api/tasks` con recursos RESTful
- [ ] Los tests en `backend/test/controllers/api/tasks_controller_test.rb` verifican cada endpoint
- [ ] Todos los tests del controlador pasan con `rails test test/controllers/api/`
- [ ] El controlador devuelve JSON y maneja errores de validación con status 422
- [ ] GET /api/tasks retorna array de tareas con status 200
- [ ] POST /api/tasks crea tarea y retorna status 201
- [ ] POST /api/tasks con datos inválidos retorna status 422 con errores
- [ ] PATCH /api/tasks/:id actualiza tarea y retorna status 200
- [ ] PATCH /api/tasks/:id con datos inválidos retorna status 422
- [ ] DELETE /api/tasks/:id elimina tarea y retorna status 204
- [ ] Requests con ID no existente retornan status 404

## Comandos de Validación

```bash
# Verificar que el plan tiene todas las secciones requeridas
test -f features/2026-02-06-073443-todo-list-rails-react/tasks/003-tasks-controller/plan.md && echo "✓ Plan existe"

# Verificar que los archivos nuevos fueron creados
test -f backend/app/controllers/api/tasks_controller.rb && echo "✓ Controller creado" || echo "✗ Controller NO creado"
test -f backend/test/controllers/api/tasks_controller_test.rb && echo "✓ Tests creados" || echo "✗ Tests NO creados"

# Verificar que las rutas fueron añadidas
grep -q "resources :tasks" backend/config/routes.rb && echo "✓ Routes configuradas" || echo "✗ Routes NO configuradas"

# Verificar las rutas generadas
cd backend && rails routes | grep -E "tasks.*api" && echo "✓ Rutas API generadas"

# Ejecutar tests del controlador
cd backend && rails test test/controllers/api/tasks_controller_test.rb

# Ejecutar TODOS los tests (modelo + controlador)
cd backend && rails test

# Verificar que hay al menos 14 tests pasando (6 del modelo + 8+ del controlador)
cd backend && rails test | grep -E "[0-9]+ runs, [0-9]+ assertions"
```

### Comandos de Verificación de Archivos

```bash
# Verificar que todos los archivos referenciados existen
for file in backend/app/controllers/api/tasks_controller.rb backend/test/controllers/api/tasks_controller_test.rb backend/config/routes.rb backend/app/models/task.rb backend/test/fixtures/tasks.yml; do
  test -f "$file" && echo "✓ $file" || echo "✗ $file NO ENCONTRADO"
done
```

## Notas

**Decisiones de Diseño:**

1. **Solo 4 acciones en lugar de 7 RESTful completas**: No implementamos `show` ni `new/edit` porque:
   - El frontend cargará todas las tareas en index (app pequeña)
   - No hay formularios HTML (API mode)
   - Simplifica el código y los tests
   - Suficiente para los requisitos funcionales

2. **Strong parameters solo permite title y completed**: Esto previene mass assignment de atributos protegidos como id, created_at, updated_at.

3. **Uso de fixtures en lugar de FactoryBot**: Minitest fixtures son suficientes para esta aplicación simple y ya están configuradas en el proyecto.

4. **Manejo de errores centralizado con rescue**: El rescue de RecordNotFound aplica a todas las acciones que buscan por ID (update, destroy).

5. **Status codes siguiendo convenciones REST**:
   - 200 OK: update exitoso
   - 201 Created: create exitoso
   - 204 No Content: destroy exitoso
   - 404 Not Found: registro no existe
   - 422 Unprocessable Entity: validación falló

6. **Tests de integración en lugar de unit tests**: Usamos `ActionDispatch::IntegrationTest` porque probamos la pila completa (rutas + controlador + modelo), no solo el controlador aislado.

**Consideraciones de Seguridad:**

- CORS ya configurado para permitir solo localhost:5173
- Strong parameters previenen mass assignment
- No hay autenticación en v1 (feature futuro)
- SQLite en desarrollo (OK para esta demo)

**Huecos Intencionales (para labs posteriores):**

- No hay paginación (index retorna todas las tareas)
- No hay ordenamiento o filtrado
- No hay rate limiting
- No hay logging estructurado de errores
- No hay versionado de API (/api/v1)
- Tests no cubren casos edge como concurrencia

Estos huecos son intencionales según el PRD (RNF-07) para dar material práctico a los estudiantes en labs de Nivel 1 y 2.
