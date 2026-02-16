# Feature: Drag and Drop para reordenar la lista de tareas

## Descripcion de la Funcionalidad
Permite a los usuarios reordenar las tareas de la lista arrastrando y soltando (drag and drop). El nuevo orden se persiste en base de datos mediante un campo `position` en el modelo Task, de forma que al recargar la pagina las tareas mantienen el orden definido por el usuario. La interfaz ofrece feedback visual durante el arrastre para indicar donde se colocara la tarea.

## Historia de Usuario
Como usuario de la aplicacion Todo List
Quiero poder arrastrar y soltar tareas para cambiar su orden en la lista
Para que pueda priorizar y organizar mis tareas segun mis necesidades

## Planteamiento del Problema
Actualmente las tareas se muestran en el orden en que se devuelven de la base de datos (por ID), sin posibilidad de que el usuario personalice el orden. Esto dificulta la priorizacion visual de tareas, ya que no hay forma de mover una tarea importante al inicio de la lista.

## Propuesta de Solucion
1. **Backend**: Anadir un campo `position` (integer) al modelo Task que almacene el orden. Crear un endpoint dedicado `PATCH /api/tasks/reorder` que reciba un array de IDs en el nuevo orden y actualice las posiciones en una sola operacion. Modificar el `index` para ordenar por `position ASC`.
2. **Frontend**: Integrar la libreria `@dnd-kit/core` y `@dnd-kit/sortable` para implementar drag and drop en la lista de tareas. Al soltar una tarea en su nueva posicion, se envia la peticion al endpoint de reorder para persistir el cambio. Se aplica actualizacion optimista del estado local.

## Archivos Relevantes
Usa estos ficheros para implementar la funcionalidad:

- `backend/app/models/task.rb` - Modelo Task: anadir validacion y default scope para ordenar por position
- `backend/app/controllers/api/tasks_controller.rb` - Controlador: anadir accion `reorder` y modificar `index` para ordenar por position
- `backend/config/routes.rb` - Rutas: anadir ruta para el endpoint de reorder
- `backend/db/seeds.rb` - Seeds: asignar posiciones a las tareas de ejemplo
- `backend/test/models/task_test.rb` - Tests del modelo Task
- `backend/test/controllers/api/tasks_controller_test.rb` - Tests del controlador
- `frontend/src/services/api.js` - Servicio API: anadir funcion `reorderTasks`
- `frontend/src/App.jsx` - Componente raiz: integrar handler de reordenacion
- `frontend/src/components/TaskList.jsx` - Componente lista: implementar DnD con @dnd-kit
- `frontend/src/components/TaskItem.jsx` - Componente item: hacer draggable y anadir handle visual
- `frontend/src/index.css` - Estilos: anadir estilos para drag handle, item en arrastre y placeholder
- `frontend/src/__tests__/TaskList.test.jsx` - Tests del componente TaskList
- `frontend/src/__tests__/TaskItem.test.jsx` - Tests del componente TaskItem
- `frontend/package.json` - Dependencias: anadir @dnd-kit/core y @dnd-kit/sortable

### Ficheros Nuevos
- `backend/db/migrate/XXXXXX_add_position_to_tasks.rb` - Migracion para anadir columna `position` a la tabla tasks

## Plan de Implementacion
### Fase 1: Fundamentos
Anadir el campo `position` al modelo Task en el backend. Crear la migracion que anade la columna con un valor por defecto y que asigna posiciones a los registros existentes. Actualizar el modelo para que ordene por `position` por defecto. Actualizar las seeds para incluir posiciones.

### Fase 2: Implementacion Principal
Crear el endpoint `reorder` en el controlador de tareas que acepta un array de IDs y actualiza las posiciones en una transaccion. En el frontend, instalar `@dnd-kit/core` y `@dnd-kit/sortable`, integrar el contexto de DnD en TaskList, hacer cada TaskItem sortable, y anadir un handle de arrastre visual. Implementar la logica de reordenacion optimista en App.jsx.

### Fase 3: Integracion
Conectar el evento `onDragEnd` del frontend con el endpoint de reorder del backend. Asegurar que las tareas nuevas se crean con la posicion correcta (al final de la lista). Anadir estilos CSS para el feedback visual durante el arrastre. Actualizar tests existentes y anadir nuevos tests.

## Tareas Paso a Paso
IMPORTANTE: Ejecuta cada paso en orden, de arriba a abajo.

### 1. Crear migracion para anadir `position` a tasks
- Generar migracion: `cd backend && bin/rails generate migration AddPositionToTasks position:integer`
- Editar la migracion para:
  - Anadir `position` como integer, `null: false`, `default: 0`
  - Incluir un bloque `reversible` que en `up` asigne posiciones incrementales a los registros existentes: `Task.order(:id).each_with_index { |task, index| task.update_column(:position, index) }`
- Ejecutar la migracion: `cd backend && bin/rails db:migrate`

### 2. Actualizar el modelo Task
- En `backend/app/models/task.rb`:
  - Anadir `default_scope { order(position: :asc) }` para que las tareas siempre vengan ordenadas por posicion
  - Anadir validacion `validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }`

### 3. Actualizar el controlador de tareas
- En `backend/app/controllers/api/tasks_controller.rb`:
  - Anadir `position` a los `task_params` permitidos
  - En la accion `create`, asignar automaticamente la siguiente posicion: `task.position = Task.maximum(:position).to_i + 1` antes de guardar
  - Anadir accion `reorder` que:
    - Reciba parametro `task_ids` (array de IDs en el orden deseado)
    - Valide que todos los IDs existen
    - Actualice las posiciones en una transaccion con `update_all` o `update_column` para cada tarea
    - Devuelva las tareas en el nuevo orden

### 4. Anadir ruta de reorder
- En `backend/config/routes.rb`:
  - Anadir dentro del bloque `resources :tasks`: `collection do patch :reorder end`

### 5. Actualizar las seeds
- En `backend/db/seeds.rb`:
  - Anadir campo `position` a cada tarea de ejemplo (0, 1, 2, 3, 4)

### 6. Anadir tests del backend
- En `backend/test/models/task_test.rb`:
  - Test: position es valida con numeros enteros >= 0
  - Test: position no acepta valores negativos
  - Test: las tareas se ordenan por position por defecto
- En `backend/test/controllers/api/tasks_controller_test.rb`:
  - Test: reorder actualiza las posiciones correctamente
  - Test: reorder devuelve 422 si faltan IDs
  - Test: reorder devuelve 404 si un ID no existe
  - Test: create asigna la siguiente posicion automaticamente
  - Test: index devuelve tareas ordenadas por position

### 7. Instalar dependencias de @dnd-kit en el frontend
- Ejecutar: `cd frontend && npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

### 8. Anadir funcion `reorderTasks` al servicio API
- En `frontend/src/services/api.js`:
  - Anadir funcion `reorderTasks(taskIds)` que haga `PATCH /api/tasks/reorder` con `{ task_ids: taskIds }`

### 9. Implementar drag and drop en TaskList
- En `frontend/src/components/TaskList.jsx`:
  - Importar `DndContext`, `closestCenter` de `@dnd-kit/core`
  - Importar `SortableContext`, `verticalListSortingStrategy` de `@dnd-kit/sortable`
  - Importar `restrictToVerticalAxis` de `@dnd-kit/modifiers` (opcional, mejora UX)
  - Recibir prop `onReorder` ademas de las props existentes
  - Envolver la lista en `DndContext` con sensor de pointer y keyboard
  - Envolver los items en `SortableContext` pasando los IDs de las tareas
  - Implementar handler `handleDragEnd` que calcule el nuevo orden usando `arrayMove` de `@dnd-kit/sortable` y llame a `onReorder`

### 10. Hacer TaskItem sortable
- En `frontend/src/components/TaskItem.jsx`:
  - Importar `useSortable` de `@dnd-kit/sortable`
  - Importar `CSS` de `@dnd-kit/utilities`
  - Usar el hook `useSortable` con el `task.id`
  - Aplicar `attributes`, `listeners`, `setNodeRef`, `transform`, `transition` al elemento raiz
  - Anadir un icono/handle de arrastre (6 puntos o icono de grip) al inicio del item con `...listeners` para limitar el arrastre al handle
  - Aplicar estilo de opacidad reducida cuando `isDragging` es true

### 11. Integrar reorder en App.jsx
- En `frontend/src/App.jsx`:
  - Importar `reorderTasks` del servicio API
  - Anadir handler `handleReorderTasks(reorderedTasks)` que:
    - Actualice el estado local inmediatamente (optimista)
    - Llame a `reorderTasks` con el array de IDs en el nuevo orden
    - En caso de error, revierta al orden anterior
  - Pasar `onReorder={handleReorderTasks}` a `TaskList`

### 12. Anadir estilos CSS para drag and drop
- En `frontend/src/index.css`:
  - Anadir estilo `.drag-handle` con cursor grab, color gris, y padding
  - Anadir estilo `.task-item.dragging` con opacidad reducida y sombra elevada
  - Anadir estilo `.task-item` con `touch-action: none` para soporte movil

### 13. Actualizar tests del frontend
- En `frontend/src/__tests__/TaskList.test.jsx`:
  - Actualizar tests existentes para incluir la prop `onReorder`
  - Anadir test: renderiza la lista con funcionalidad de drag and drop (verificar que los items tienen los atributos de accesibilidad de @dnd-kit)
- En `frontend/src/__tests__/TaskItem.test.jsx`:
  - Anadir test: renderiza el handle de arrastre
  - Nota: los tests de TaskItem necesitaran ser envueltos en un SortableContext mock o testearse con los atributos de DnD

### 14. Ejecutar comandos de validacion
- Ejecutar `cd backend && bin/rails test` para validar que todos los tests del backend pasan
- Ejecutar `cd frontend && npm test` para validar que todos los tests del frontend pasan

## Estrategia de Testing
### Tests Unitarios
- **Modelo Task**: validacion de position (numericidad, >= 0), ordenacion por defecto
- **TaskItem component**: renderizado del handle de arrastre, atributos de accesibilidad
- **api.js**: funcion reorderTasks envia el request correcto (opcional, dado que ya se prueba indirectamente)

### Tests de Integracion
- **TasksController#reorder**: actualiza posiciones correctamente, maneja errores
- **TasksController#create**: asigna posicion automaticamente
- **TasksController#index**: devuelve tareas ordenadas por position
- **TaskList component**: renderiza items con contexto de DnD, atributos de accesibilidad presentes

### Casos Limite
- Reordenar con un solo elemento (no deberia cambiar nada)
- Reordenar con IDs que no existen (debe devolver error 404)
- Reordenar con array vacio o parametro ausente (debe devolver error 422)
- Crear tarea cuando no hay tareas previas (position debe ser 0)
- Crear tarea cuando hay tareas existentes (position debe ser max + 1)
- Eliminar tarea intermedia (las posiciones no necesitan ser consecutivas, el orden relativo se mantiene)

## Criterios de Aceptacion
- El usuario puede arrastrar una tarea y soltarla en otra posicion de la lista
- Al soltar la tarea, la lista se reordena visualmente de forma inmediata (optimista)
- El nuevo orden se persiste en el backend y se mantiene al recargar la pagina
- Hay feedback visual durante el arrastre (opacidad, cursor grab, handle visible)
- Las tareas nuevas se anaden al final de la lista con la posicion correcta
- Eliminar una tarea no rompe el orden de las demas
- Todos los tests existentes siguen pasando sin regresiones
- Los nuevos tests cubren la funcionalidad de reordenacion tanto en backend como en frontend

## Comandos de Validacion
Ejecuta cada comando para validar que la funcionalidad funciona correctamente sin regresiones.

- `cd backend && bin/rails db:migrate` - Ejecuta la migracion pendiente
- `cd backend && bin/rails test` - Ejecuta los tests del backend para validar que la funcionalidad funciona sin regresiones
- `cd frontend && npm test` - Ejecuta los tests del frontend para validar que la funcionalidad funciona sin regresiones

## Notas
- **Nuevo paquete npm**: Se necesita instalar `@dnd-kit/core`, `@dnd-kit/sortable` y `@dnd-kit/utilities` en el frontend con `cd frontend && npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`. Se elige @dnd-kit por ser la libreria moderna y bien mantenida para drag and drop en React (react-beautiful-dnd esta deprecada).
- **No se necesitan gemas nuevas** en el backend.
- **Posiciones no consecutivas**: Despues de eliminar tareas, las posiciones pueden tener huecos (ej: 0, 2, 4). Esto es aceptable porque lo que importa es el orden relativo, no que sean consecutivas. El endpoint de reorder siempre reasigna posiciones consecutivas (0, 1, 2...).
- **Rendimiento**: El endpoint de reorder usa una transaccion para actualizar todas las posiciones en una sola operacion de base de datos, evitando problemas de consistencia.
- **Accesibilidad**: @dnd-kit incluye soporte de teclado para reordenar (Tab para enfocar el handle, Space para iniciar arrastre, flechas para mover, Space para soltar), lo cual mejora la accesibilidad sin esfuerzo adicional.
