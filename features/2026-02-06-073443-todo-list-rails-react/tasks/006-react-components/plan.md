# Plan: Componentes React y Servicio API

## Metadata
task_path: `features/2026-02-06-073443-todo-list-rails-react/tasks/006-react-components`
feature_id: `2026-02-06-073443-todo-list-rails-react`
created_at: `2026-02-06T15:00:00Z`
status: `planned`

## Análisis de Código Existente

### Búsqueda Realizada
Se exploró el proyecto para identificar:
- ✅ Backend Rails API completo en `backend/app/controllers/api/tasks_controller.rb`
- ✅ Modelo Task con validaciones en `backend/app/models/task.rb`
- ✅ Frontend React + Vite configurado en `frontend/`
- ✅ Componente placeholder `App.jsx` (líneas 1-10)
- ✅ Punto de entrada `main.jsx` configurado
- ✅ Tests configurados con Vitest en `vite.config.js`
- ✅ Estilos básicos en `index.css`
- ❌ No existen componentes TaskList, TaskItem, TaskForm - deben crearse
- ❌ No existe servicio API `services/api.js` - debe crearse
- ❌ No existen tests de componentes nuevos - deben crearse

### Matriz de Impacto (OBLIGATORIO)

| Componente | Archivo Existente | Líneas | Impacto |
|------------|-------------------|--------|---------|
| App Component | frontend/src/App.jsx | 1-10 | MODIFICAR |
| API Service | N/A | N/A | CREAR |
| TaskList Component | N/A | N/A | CREAR |
| TaskItem Component | N/A | N/A | CREAR |
| TaskForm Component | N/A | N/A | CREAR |
| TaskList Test | N/A | N/A | CREAR |
| TaskItem Test | N/A | N/A | CREAR |
| TaskForm Test | N/A | N/A | CREAR |
| Styles | frontend/src/index.css | 1-38 | EXTENDER |

**Archivos Nuevos Requeridos**: 7
**Archivos a Modificar**: 2

### Evaluación de Patrones

**Patrones del Backend a Seguir**:
- API REST JSON con rutas `/api/tasks`
- Respuestas con status HTTP apropiados (200, 201, 422, 404, 204)
- Validaciones en el modelo (title obligatorio, max 200 chars)
- Estructura de respuesta para errores: `{ errors: [...] }`

**Patrones del Frontend Existente**:
- Componentes funcionales con export default
- Estructura de carpetas: `components/`, `services/`, `__tests__/`
- Naming: PascalCase para componentes (.jsx), camelCase para servicios (.js)
- Tests con React Testing Library y Vitest
- Import de CSS en main.jsx

**Patrones a Aplicar**:
- Fetch directo (sin axios/React Query) para simplicidad
- useState local (sin Context/Redux) para facilitar aprendizaje
- Componentes pequeños con responsabilidad única
- Tests simples que validen comportamiento básico

**Huecos Intencionales del PRD** (NO implementar):
- ❌ Loading states (sin spinners durante fetch)
- ❌ Manejo de errores en UI (sin feedback visual de errores)
- ❌ Validación frontend (solo backend valida)
- ❌ Optimistic updates refinados
- ❌ Estado global (Context/Redux)

### Matriz de Conflictos

| Tipo | Recurso | Otra Tarea | Resolución |
|------|---------|------------|------------|
| N/A | N/A | N/A | N/A |

**Conflictos Encontrados**: 0

Las tareas 003 (Tasks Controller) y 005 (Frontend Base Setup) están completas, por lo que no hay conflictos. Esta es la última tarea del feature.

## Resumen
Implementar los componentes React (App, TaskList, TaskItem, TaskForm) y el servicio API para comunicarse con el backend Rails. El servicio `api.js` manejará todas las peticiones HTTP (GET, POST, PATCH, DELETE). Los componentes usarán useState local para manejar el estado. La aplicación permitirá listar, crear, completar y eliminar tareas con feedback visual inmediato. Deliberadamente NO incluye loading states ni manejo de errores en UI (huecos intencionales para labs).

## Historia de Usuario
**Como** usuario final
**Quiero** una interfaz web para gestionar mi lista de tareas
**Para** poder crear, ver, completar y eliminar tareas desde el navegador

## Archivos a Modificar
- `frontend/src/App.jsx` - Integrar TaskList y TaskForm, manejar estado de tareas
- `frontend/src/index.css` - Agregar estilos para los nuevos componentes

## Archivos a Crear
- `frontend/src/services/api.js` - Servicio para comunicación con backend
- `frontend/src/components/TaskList.jsx` - Renderiza lista de TaskItems
- `frontend/src/components/TaskItem.jsx` - Renderiza una tarea individual con checkbox y botón eliminar
- `frontend/src/components/TaskForm.jsx` - Formulario para crear nuevas tareas
- `frontend/src/__tests__/TaskList.test.jsx` - Tests de TaskList
- `frontend/src/__tests__/TaskItem.test.jsx` - Tests de TaskItem
- `frontend/src/__tests__/TaskForm.test.jsx` - Tests de TaskForm

## Plan de Implementación

### Fase 1: Fundamentos
Crear el servicio API que encapsula todas las llamadas HTTP al backend. Este servicio será usado por los componentes para realizar operaciones CRUD. Incluye funciones: fetchTasks(), createTask(), updateTask(), deleteTask().

### Fase 2: Implementación Principal
Implementar los tres componentes React (TaskForm, TaskItem, TaskList) siguiendo el principio de responsabilidad única. Cada componente maneja una parte específica de la UI: creación, visualización individual, y lista.

### Fase 3: Integración
Actualizar el componente App para orquestar todos los componentes. App manejará el estado global de las tareas y pasará props/callbacks a los componentes hijos. Agregar estilos CSS para completar la UI.

## Pasos de Implementación

IMPORTANTE: Ejecutar cada paso en orden.

### 0. Refactorización Previa (SI SE ENCONTRARON VIOLACIONES)

**No aplica** - No se encontraron violaciones de diseño. El código existente es mínimo (placeholder) y no hay duplicación ni conflictos de responsabilidad.

### 1. Crear servicio API (api.js)

Crear `frontend/src/services/api.js` con:

```javascript
const API_BASE_URL = 'http://localhost:3000/api'

// GET /api/tasks - Obtener todas las tareas
export async function fetchTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks`)
  if (!response.ok) throw new Error('Failed to fetch tasks')
  return response.json()
}

// POST /api/tasks - Crear nueva tarea
export async function createTask(title) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: { title } })
  })
  if (!response.ok) throw new Error('Failed to create task')
  return response.json()
}

// PATCH /api/tasks/:id - Actualizar tarea
export async function updateTask(id, updates) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: updates })
  })
  if (!response.ok) throw new Error('Failed to update task')
  return response.json()
}

// DELETE /api/tasks/:id - Eliminar tarea
export async function deleteTask(id) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete task')
}
```

**Hueco Intencional**: No hay manejo de errores detallado, solo throw genérico.

### 2. Crear componente TaskForm

Crear `frontend/src/components/TaskForm.jsx`:

```javascript
import { useState } from 'react'

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (title.trim()) {
      await onTaskCreated(title)
      setTitle('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nueva tarea..."
        className="task-input"
      />
      <button type="submit" className="btn btn-primary">
        Añadir
      </button>
    </form>
  )
}

export default TaskForm
```

**Características**:
- Estado local para el input
- Props: `onTaskCreated` callback
- Limpia el input después de submit
- **Hueco Intencional**: No valida longitud máxima (solo backend valida)

### 3. Crear componente TaskItem

Crear `frontend/src/components/TaskItem.jsx`:

```javascript
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="task-checkbox"
      />
      <span className={task.completed ? 'task-title completed' : 'task-title'}>
        {task.title}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="btn btn-delete"
      >
        Eliminar
      </button>
    </div>
  )
}

export default TaskItem
```

**Características**:
- Props: `task` objeto, `onToggle` callback, `onDelete` callback
- Renderiza checkbox, título y botón eliminar
- Estilo condicional para tareas completadas
- Sin estado local (stateless component)

### 4. Crear componente TaskList

Crear `frontend/src/components/TaskList.jsx`:

```javascript
import TaskItem from './TaskItem'

function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty-message">No hay tareas. ¡Crea una nueva!</p>
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default TaskList
```

**Características**:
- Props: `tasks` array, `onToggle` callback, `onDelete` callback
- Renderiza lista de TaskItems
- Muestra mensaje cuando no hay tareas
- Sin estado local (stateless component)

### 5. Actualizar componente App

Modificar `frontend/src/App.jsx` completamente:

```javascript
import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import { fetchTasks, createTask, updateTask, deleteTask } from './services/api'

function App() {
  const [tasks, setTasks] = useState([])

  // Cargar tareas al montar el componente
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    const data = await fetchTasks()
    setTasks(data)
  }

  const handleCreateTask = async (title) => {
    const newTask = await createTask(title)
    setTasks([...tasks, newTask])
  }

  const handleToggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    const updated = await updateTask(id, { completed: !task.completed })
    setTasks(tasks.map(t => t.id === id ? updated : t))
  }

  const handleDeleteTask = async (id) => {
    await deleteTask(id)
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <div className="app">
      <h1>Todo List</h1>
      <TaskForm onTaskCreated={handleCreateTask} />
      <TaskList
        tasks={tasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
      />
    </div>
  )
}

export default App
```

**Características**:
- Estado: array de tareas
- useEffect para cargar tareas al iniciar
- Handlers para CRUD que actualizan estado local
- **Hueco Intencional**: No hay loading state durante las peticiones

### 6. Agregar estilos CSS

Extender `frontend/src/index.css` agregando al final:

```css
/* Task Form */
.task-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.task-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.task-input:focus {
  outline: none;
  border-color: #3498db;
}

/* Buttons */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-delete:hover {
  background-color: #c0392b;
}

/* Task List */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.empty-message {
  text-align: center;
  color: #999;
  font-style: italic;
  margin-top: 2rem;
}

/* Task Item */
.task-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #eee;
}

.task-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.task-title {
  flex: 1;
  font-size: 1rem;
  color: #333;
}

.task-title.completed {
  text-decoration: line-through;
  color: #999;
}
```

### 7. Crear test de TaskForm

Crear `frontend/src/__tests__/TaskForm.test.jsx`:

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import TaskForm from '../components/TaskForm'

test('renders input and button', () => {
  render(<TaskForm onTaskCreated={() => {}} />)
  expect(screen.getByPlaceholderText(/nueva tarea/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /añadir/i })).toBeInTheDocument()
})

test('calls onTaskCreated when form is submitted', async () => {
  const mockCreate = vi.fn()
  render(<TaskForm onTaskCreated={mockCreate} />)

  const input = screen.getByPlaceholderText(/nueva tarea/i)
  fireEvent.change(input, { target: { value: 'Test task' } })
  fireEvent.submit(screen.getByRole('button'))

  expect(mockCreate).toHaveBeenCalledWith('Test task')
})

test('clears input after submission', async () => {
  const mockCreate = vi.fn()
  render(<TaskForm onTaskCreated={mockCreate} />)

  const input = screen.getByPlaceholderText(/nueva tarea/i)
  fireEvent.change(input, { target: { value: 'Test task' } })
  fireEvent.submit(screen.getByRole('button'))

  expect(input.value).toBe('')
})
```

### 8. Crear test de TaskItem

Crear `frontend/src/__tests__/TaskItem.test.jsx`:

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import TaskItem from '../components/TaskItem'

const mockTask = {
  id: 1,
  title: 'Test task',
  completed: false
}

test('renders task with title', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  expect(screen.getByText('Test task')).toBeInTheDocument()
})

test('shows checked checkbox when task is completed', () => {
  const completedTask = { ...mockTask, completed: true }
  render(<TaskItem task={completedTask} onToggle={() => {}} onDelete={() => {}} />)

  const checkbox = screen.getByRole('checkbox')
  expect(checkbox).toBeChecked()
})

test('calls onToggle when checkbox is clicked', () => {
  const mockToggle = vi.fn()
  render(<TaskItem task={mockTask} onToggle={mockToggle} onDelete={() => {}} />)

  fireEvent.click(screen.getByRole('checkbox'))
  expect(mockToggle).toHaveBeenCalledWith(1)
})

test('calls onDelete when delete button is clicked', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))
  expect(mockDelete).toHaveBeenCalledWith(1)
})
```

### 9. Crear test de TaskList

Crear `frontend/src/__tests__/TaskList.test.jsx`:

```javascript
import { render, screen } from '@testing-library/react'
import TaskList from '../components/TaskList'

const mockTasks = [
  { id: 1, title: 'Task 1', completed: false },
  { id: 2, title: 'Task 2', completed: true }
]

test('renders all tasks', () => {
  render(<TaskList tasks={mockTasks} onToggle={() => {}} onDelete={() => {}} />)
  expect(screen.getByText('Task 1')).toBeInTheDocument()
  expect(screen.getByText('Task 2')).toBeInTheDocument()
})

test('shows empty message when no tasks', () => {
  render(<TaskList tasks={[]} onToggle={() => {}} onDelete={() => {}} />)
  expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument()
})

test('renders correct number of task items', () => {
  render(<TaskList tasks={mockTasks} onToggle={() => {}} onDelete={() => {}} />)
  const checkboxes = screen.getAllByRole('checkbox')
  expect(checkboxes).toHaveLength(2)
})
```

### 10. Actualizar test de App

Modificar `frontend/src/__tests__/App.test.jsx` para verificar integración:

```javascript
import { render, screen } from '@testing-library/react'
import App from '../App'

// Mock del servicio API
vi.mock('../services/api', () => ({
  fetchTasks: vi.fn().mockResolvedValue([]),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn()
}))

test('renders Todo List heading', () => {
  render(<App />)
  const heading = screen.getByRole('heading', { name: /todo list/i })
  expect(heading).toBeInTheDocument()
})

test('renders task form', () => {
  render(<App />)
  expect(screen.getByPlaceholderText(/nueva tarea/i)).toBeInTheDocument()
})

test('renders task list', () => {
  render(<App />)
  expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument()
})
```

### 11. Ejecutar tests

```bash
cd frontend && npm run test -- --run
```

Verificar que todos los tests pasan:
- App.test.jsx (3 tests)
- TaskForm.test.jsx (3 tests)
- TaskItem.test.jsx (4 tests)
- TaskList.test.jsx (3 tests)

**Total esperado: 13 tests passing**

### 12. Validación manual (opcional pero recomendado)

```bash
# Terminal 1: Iniciar backend
cd backend && rails s

# Terminal 2: Iniciar frontend
cd frontend && npm run dev
```

Abrir http://localhost:5173 y verificar:
- ✓ Se cargan las tareas del backend
- ✓ Se puede crear una nueva tarea
- ✓ Se puede marcar/desmarcar como completada
- ✓ Se puede eliminar una tarea
- ✓ Los cambios se reflejan inmediatamente en la UI

### 13. Validación Final

Ejecutar todos los comandos de validación:

```bash
# Verificar que todos los archivos existen
test -f frontend/src/services/api.js && echo "✓ api.js"
test -f frontend/src/components/TaskForm.jsx && echo "✓ TaskForm.jsx"
test -f frontend/src/components/TaskItem.jsx && echo "✓ TaskItem.jsx"
test -f frontend/src/components/TaskList.jsx && echo "✓ TaskList.jsx"
test -f frontend/src/__tests__/TaskForm.test.jsx && echo "✓ TaskForm.test.jsx"
test -f frontend/src/__tests__/TaskItem.test.jsx && echo "✓ TaskItem.test.jsx"
test -f frontend/src/__tests__/TaskList.test.jsx && echo "✓ TaskList.test.jsx"

# Ejecutar tests
cd frontend && npm run test -- --run

# Verificar que el build funciona
cd frontend && npm run build
```

## Criterios de Aceptación
- [ ] Existe servicio `src/services/api.js` con funciones fetch para GET, POST, PATCH, DELETE a /api/tasks
- [ ] Existen componentes `TaskList.jsx`, `TaskItem.jsx`, `TaskForm.jsx` con funcionalidad CRUD completa
- [ ] El componente TaskItem muestra checkbox para completar y botón eliminar
- [ ] El componente TaskForm tiene input y botón para crear tareas
- [ ] Todos los tests en `src/__tests__/` pasan con `npm run test`

## Comandos de Validación

```bash
# Verificar que el plan tiene todas las secciones requeridas
test -f features/2026-02-06-073443-todo-list-rails-react/tasks/006-react-components/plan.md && echo "✓ Plan existe"

# Verificar secciones obligatorias
grep -q "## Metadata" features/2026-02-06-073443-todo-list-rails-react/tasks/006-react-components/plan.md
grep -q "## Matriz de Impacto" features/2026-02-06-073443-todo-list-rails-react/tasks/006-react-components/plan.md
grep -q "## Pasos de Implementación" features/2026-02-06-073443-todo-list-rails-react/tasks/006-react-components/plan.md
grep -q "## Criterios de Aceptación" features/2026-02-06-073443-todo-list-rails-react/tasks/006-react-components/plan.md

# Verificar que los archivos referenciados son válidos
for file in frontend/src/App.jsx frontend/src/index.css frontend/src/services/api.js frontend/src/components/TaskForm.jsx frontend/src/components/TaskItem.jsx frontend/src/components/TaskList.jsx; do
  test -f "$file" && echo "✓ $file existe después de implementación" || echo "⏳ $file se creará"
done

# Ejecutar tests del frontend
cd frontend && npm run test -- --run

# Verificar build
cd frontend && npm run build && test -d dist && echo "✓ Build exitoso"
```

### Comandos de Verificación de Archivos
```bash
# Verificar que todos los archivos referenciados existen
for file in $(grep -oP '`frontend/[^`]+\.(jsx|js|css)`' features/2026-02-06-073443-todo-list-rails-react/tasks/006-react-components/plan.md | tr -d '`'); do
  test -f "$file" && echo "✓ $file" || echo "✗ $file NO ENCONTRADO"
done
```

## Notas

**Decisiones de Diseño**:
- Componentes pequeños con responsabilidad única (SRP)
- Estado en el componente padre (App) que fluye hacia abajo vía props
- Callbacks para comunicación de hijos a padre
- Sin estado global (Context/Redux) para simplicidad
- Fetch directo sin librerías adicionales (axios, React Query)

**Huecos Intencionales para Labs** (por diseño del PRD):
1. **No hay loading states**: Las operaciones fetch no muestran spinners o indicadores de carga
2. **No hay manejo de errores en UI**: Si la API falla, no hay feedback visual al usuario
3. **No hay validación frontend**: Solo el backend valida (title obligatorio, max 200 chars)
4. **No hay optimistic updates refinados**: Se actualiza el estado local después de la respuesta

Estos huecos son deliberados para dar material a los labs de Nivel 1 del curso.

**API Contract del Backend**:
```
GET    /api/tasks          → Array de tasks
POST   /api/tasks          → { task: { title } } → Task creado
PATCH  /api/tasks/:id      → { task: { completed } } → Task actualizado
DELETE /api/tasks/:id      → 204 No Content
```

**Compatibilidad**:
- Backend: Rails 7.1+ con CORS configurado para localhost:5173
- Frontend: React 18 con Vite 6
- Tests: Vitest 2.0 + React Testing Library 16

**Próximos Pasos** (fuera del scope de este feature):
- Nivel 1 Labs: Agregar loading states, manejo de errores, validación frontend
- Nivel 2: Agregar campos description, due_date, priority
- Nivel 2: Implementar estado global con Context o Zustand
- Nivel 3: Agregar subtareas, webhooks, búsqueda
