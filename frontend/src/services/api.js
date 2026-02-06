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
