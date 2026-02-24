# Feature: Drag and Drop para reordenar tareas

## Descripcion de la Funcionalidad
Permitir a los usuarios reordenar las tareas de la lista de todos mediante drag and drop. El nuevo orden se persiste en el backend para que se mantenga entre sesiones. Cada tarea tendra un campo `position` que determinara su orden en la lista. Al arrastrar una tarea a una nueva posicion, se actualizaran las posiciones de todas las tareas afectadas en el servidor.

## Historia de Usuario
Como usuario de la aplicacion Todo List
Quiero poder arrastrar y soltar las tareas para reordenarlas
Para que pueda priorizar mis tareas segun mis necesidades y mantener el orden entre sesiones

## Planteamiento del Problema
Actualmente las tareas se muestran en el orden en que son devueltas por el backend (sin orden explicito), lo que no permite al usuario organizar sus tareas por prioridad. No existe un campo de posicion ni mecanismo de reordenacion. El usuario necesita una forma intuitiva de reorganizar la lista arrastrando los elementos.

## Propuesta de Solucion
1. **Backend**: Anadir un campo `position` (integer) a la tabla `tasks` para persistir el orden. Crear un endpoint dedicado `PATCH /api/tasks/reorder` que reciba un array de IDs en el nuevo orden y actualice las posiciones en una sola transaccion. Ordenar las tareas por `position` en el endpoint `index`.
2. **Frontend**: Instalar la libreria `@dnd-kit` (moderna, mantenida, accesible) para implementar el drag and drop. Modificar `TaskList` para envolver los items en un contexto DnD sortable. Anadir un handle de arrastre visual a cada `TaskItem`. Llamar al endpoint de reorder al soltar un elemento.

## Archivos Relevantes
Usa estos ficheros para implementar la funcionalidad:

- [task.rb](backend/app/models/task.rb) - Modelo Task: anadir validacion y default scope por position
- [tasks_controller.rb](backend/app/controllers/api/tasks_controller.rb) - Controlador: anadir accion `reorder`, actualizar `task_params` para incluir `position`
- [routes.rb](backend/config/routes.rb) - Rutas: anadir ruta para el endpoint `reorder`
- [schema.rb](backend/db/schema.rb) - Se actualizara automaticamente tras la migracion
- [tasks.yml](backend/test/fixtures/tasks.yml) - Fixtures: anadir campo `position` a cada fixture
- [tasks_controller_test.rb](backend/test/controllers/api/tasks_controller_test.rb) - Tests del controlador: anadir tests para reorder
- [task_test.rb](backend/test/models/task_test.rb) - Tests del modelo: anadir tests para position
- [TaskList.jsx](frontend/src/components/TaskList.jsx) - Componente lista: implementar DnD sortable container
- [TaskItem.jsx](frontend/src/components/TaskItem.jsx) - Componente item: hacerlo draggable con handle
- [api.js](frontend/src/services/api.js) - Servicio API: anadir funcion `reorderTasks`
- [App.jsx](frontend/src/App.jsx) - Componente raiz: anadir handler de reorder y ordenar tareas por position
- [index.css](frontend/src/index.css) - Estilos: anadir estilos para drag handle, estado dragging y overlay
- [TaskList.test.jsx](frontend/src/__tests__/TaskList.test.jsx) - Tests: actualizar para DnD context
- [TaskItem.test.jsx](frontend/src/__tests__/TaskItem.test.jsx) - Tests: actualizar para drag handle
- [App.test.jsx](frontend/src/__tests__/App.test.jsx) - Tests: anadir test para reorder

### Ficheros Nuevos
- `backend/db/migrate/XXXXXX_add_position_to_tasks.rb` - Migracion para anadir columna `position`

## Plan de Implementacion
### Fase 1: Fundamentos
Anadir el campo `position` al modelo Task en el backend. Crear la migracion, actualizar el modelo con default scope para ordenar por position, y asignar posiciones automaticamente al crear una tarea. Actualizar fixtures y tests existentes para incluir el campo position.

### Fase 2: Implementacion Principal
Crear el endpoint `reorder` en el controlador de tasks que reciba un array de IDs y actualice las posiciones en una transaccion. En el frontend, instalar `@dnd-kit/core` y `@dnd-kit/sortable` e implementar el drag and drop en TaskList y TaskItem. Anadir la funcion de API `reorderTasks`.

### Fase 3: Integracion
Conectar el frontend con el backend: al soltar un elemento, llamar al endpoint de reorder. Aplicar feedback visual optimista (actualizar el estado local inmediatamente). Anadir estilos para el estado de arrastre y el drag handle. Asegurar que nuevas tareas se anaden con la posicion correcta.

## Tareas Paso a Paso
IMPORTANTE: Ejecuta cada paso en orden, de arriba a abajo.

### Paso 1: Crear migracion para anadir campo position
- Ejecutar `cd backend && bin/rails generate migration AddPositionToTasks position:integer`
- Editar la migracion generada para:
  - Anadir `null: false, default: 0` a la columna `position`
  - Anadir un indice sobre `position` para optimizar el ordenamiento
- Ejecutar `cd backend && bin/rails db:migrate`

### Paso 2: Actualizar el modelo Task
- En `backend/app/models/task.rb`:
  - Anadir `default_scope { order(:position) }` para que las tareas se devuelvan ordenadas por posicion
  - Anadir callback `before_create :set_default_position` que asigne `self.position = (Task.unscoped.maximum(:position) || -1) + 1` para que las nuevas tareas se anadan al final
- Actualizar la anotacion del modelo ejecutando `cd backend && bin/rails annotaterb:models`

### Paso 3: Actualizar fixtures y tests del modelo
- En `backend/test/fixtures/tasks.yml`: anadir `position: 0`, `position: 1`, `position: 2` a las fixtures one, two, three respectivamente
- En `backend/test/models/task_test.rb`:
  - Anadir test `"position defaults to next available"`: crear una tarea y verificar que su position es `Task.count - 1` (o el maximo + 1)
  - Anadir test `"tasks are ordered by position"`: verificar que `Task.all` devuelve las tareas en orden de position
- Ejecutar `cd backend && bin/rails test test/models/task_test.rb` para verificar que pasan

### Paso 4: Crear endpoint reorder en el controlador
- En `backend/config/routes.rb`: dentro del bloque `resources :tasks`, anadir `collection do; patch :reorder; end`
- En `backend/app/controllers/api/tasks_controller.rb`:
  - Anadir accion `reorder` que:
    - Reciba `params[:task_ids]` (array de IDs en el nuevo orden)
    - Valide que se recibio un array no vacio
    - En una transaccion `ActiveRecord::Base.transaction`, itere sobre los IDs y actualice la position de cada uno con su indice
    - Devuelva las tareas reordenadas con status `:ok`
  - Actualizar `task_params` para permitir `:position`

### Paso 5: Anadir tests del controlador para reorder
- En `backend/test/controllers/api/tasks_controller_test.rb`:
  - Anadir test `"should reorder tasks"`: enviar PATCH a reorder con task_ids en nuevo orden, verificar response :ok y que las posiciones se actualizaron correctamente en la BD
  - Anadir test `"should return error when task_ids is empty"`: enviar PATCH sin task_ids, verificar response :unprocessable_entity
  - Anadir test `"index returns tasks ordered by position"`: crear tareas con posiciones especificas, verificar que el index las devuelve en orden
  - Actualizar el test existente `"should get index with all tasks"` si es necesario para verificar el orden por position
- Ejecutar `cd backend && bin/rails test` para verificar que todos los tests pasan

### Paso 6: Instalar dependencias de DnD en el frontend
- Ejecutar `cd frontend && npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

### Paso 7: Anadir funcion reorderTasks al servicio API
- En `frontend/src/services/api.js`:
  - Anadir funcion `reorderTasks(taskIds)` que haga PATCH a `/api/tasks/reorder` con body `{ task_ids: taskIds }`
  - Devolver `response.json()`

### Paso 8: Implementar drag and drop en TaskList
- En `frontend/src/components/TaskList.jsx`:
  - Importar `DndContext`, `closestCenter`, `KeyboardSensor`, `PointerSensor`, `useSensor`, `useSensors` de `@dnd-kit/core`
  - Importar `SortableContext`, `verticalListSortingStrategy` de `@dnd-kit/sortable`
  - Importar `restrictToVerticalAxis` de `@dnd-kit/modifiers` (si se usa)
  - Recibir nueva prop `onReorder` del componente padre
  - Configurar sensors: PointerSensor con `activationConstraint: { distance: 5 }` (para evitar drag accidental al hacer click) y KeyboardSensor
  - Envolver la lista en `DndContext` con `onDragEnd` handler y `SortableContext` con los IDs de las tareas y `verticalListSortingStrategy`
  - En el handler `onDragEnd`: calcular nuevo orden de IDs y llamar a `onReorder(newIds)`

### Paso 9: Hacer TaskItem draggable
- En `frontend/src/components/TaskItem.jsx`:
  - Importar `useSortable` de `@dnd-kit/sortable`
  - Importar `CSS` de `@dnd-kit/utilities`
  - Usar el hook `useSortable({ id: task.id })` para obtener `attributes`, `listeners`, `setNodeRef`, `transform`, `transition`, `isDragging`
  - Aplicar `ref={setNodeRef}`, `style` con transform y transition, y `{...attributes}` al div contenedor
  - Anadir un elemento de drag handle (icono de 6 puntos / grip) al inicio del item que reciba `{...listeners}` para que solo el handle active el drag
  - Anadir clase CSS `dragging` cuando `isDragging` sea true para feedback visual

### Paso 10: Integrar reorder en App.jsx
- En `frontend/src/App.jsx`:
  - Importar `reorderTasks` del servicio API
  - Anadir handler `handleReorderTasks(taskIds)` que:
    - Actualice el estado local inmediatamente (optimista) reordenando el array de tasks segun taskIds
    - Llame a `reorderTasks(taskIds)` para persistir en el backend
  - Pasar `onReorder={handleReorderTasks}` como prop a `TaskList`
  - Al crear una nueva tarea, el backend le asignara la posicion correcta automaticamente

### Paso 11: Anadir estilos para drag and drop
- En `frontend/src/index.css`:
  - Anadir estilos para `.drag-handle`: cursor grab, color gris, padding, hover color mas oscuro
  - Anadir estilos para `.task-item.dragging`: opacidad reducida, sombra elevada, background ligeramente diferente
  - Anadir estilos para `.task-item` en transicion: transition suave

### Paso 12: Actualizar tests del frontend
- En `frontend/src/__tests__/TaskList.test.jsx`:
  - Los tests existentes pueden necesitar envolver el render en un DndContext mock o simplemente pasar la prop `onReorder`
  - Anadir prop `onReorder={() => {}}` a los renders existentes
- En `frontend/src/__tests__/TaskItem.test.jsx`:
  - Si `useSortable` causa problemas en tests, crear un mock de `@dnd-kit/sortable`
  - Verificar que el drag handle se renderiza
- En `frontend/src/__tests__/App.test.jsx`:
  - Anadir mock de `reorderTasks` en el mock del servicio API
- Ejecutar `cd frontend && npm test -- --run` para verificar que todos los tests pasan

### Paso 13: Validacion final
- Ejecutar los `Comandos de Validacion` para validar que la funcionalidad funciona correctamente sin regresiones

## Estrategia de Testing
### Tests Unitarios
- **Modelo Task**: verificar que `position` se asigna automaticamente al crear, que el default scope ordena por position
- **TaskItem component**: verificar que el drag handle se renderiza, que el componente acepta las props de DnD
- **TaskList component**: verificar que los items se renderizan dentro del contexto DnD
- **API service**: verificar que `reorderTasks` envia la peticion correcta

### Tests de Integracion
- **Controlador reorder**: verificar que el endpoint actualiza las posiciones correctamente en la BD
- **Controlador index**: verificar que devuelve las tareas ordenadas por position
- **App component**: verificar que el flujo completo de reorder funciona (mock API)

### Casos Limite
- Reordenar con un solo elemento (no deberia cambiar nada)
- Reordenar cuando solo hay una tarea en la lista
- Crear tarea nueva despues de reordenar (debe ir al final)
- Arrastrar un elemento a la misma posicion (no-op)
- Enviar array vacio o invalido al endpoint reorder
- Drag cancelado (soltar fuera de la zona de drop)

## Criterios de Aceptacion
- [ ] Al arrastrar una tarea y soltarla en otra posicion, la lista se reordena visualmente de inmediato
- [ ] El nuevo orden se persiste en el backend y se mantiene al recargar la pagina
- [ ] Existe un drag handle visible en cada tarea que indica que es arrastrable
- [ ] Durante el arrastre, el elemento tiene feedback visual (opacidad, sombra)
- [ ] Las nuevas tareas creadas aparecen al final de la lista
- [ ] Todos los tests del backend pasan sin regresiones (`bin/rails test`)
- [ ] Todos los tests del frontend pasan sin regresiones (`npm test`)
- [ ] La funcionalidad de toggle y delete sigue funcionando correctamente tras los cambios
- [ ] El drag and drop es accesible via teclado (soporte KeyboardSensor de dnd-kit)

## Comandos de Validacion
Ejecuta cada comando para validar que la funcionalidad funciona correctamente sin regresiones.

- `cd backend && bin/rails test` - Ejecuta los tests del backend para validar que la funcionalidad funciona sin regresiones
- `cd frontend && npm test -- --run` - Ejecuta los tests del frontend para validar que la funcionalidad funciona sin regresiones

## Notas
- **Libreria elegida**: `@dnd-kit` (paquetes `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`) es la alternativa moderna y mantenida a `react-beautiful-dnd` (archivado por Atlassian). Ofrece buen soporte de accesibilidad, es ligera y tiene API declarativa.
- **Nuevo paquete npm**: Se necesita instalar `@dnd-kit/core`, `@dnd-kit/sortable` y `@dnd-kit/utilities` en el directorio frontend.
- **Actualizacion optimista**: El frontend actualiza el orden local inmediatamente al soltar, sin esperar la respuesta del servidor, para una experiencia fluida.
- **Transaccion en reorder**: El endpoint de reorder usa una transaccion de base de datos para garantizar la consistencia del orden.
