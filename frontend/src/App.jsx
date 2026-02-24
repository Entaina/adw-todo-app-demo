import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import ConfirmDialog from './components/ConfirmDialog'
import { fetchTasks, createTask, updateTask, deleteTask, reorderTasks } from './services/api'

function App() {
  const [tasks, setTasks] = useState([])
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

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
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    await updateTask(id, { completed: !task.completed })
  }

  const handleDeleteTask = (id) => {
    setTaskToDelete(id)
    setConfirmDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (taskToDelete !== null) {
      await deleteTask(taskToDelete)
      setTasks(tasks.filter(t => t.id !== taskToDelete))
    }
    setConfirmDialogOpen(false)
    setTaskToDelete(null)
  }

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false)
    setTaskToDelete(null)
  }

  const handleReorderTasks = async (taskIds) => {
    const reordered = taskIds.map(id => tasks.find(t => t.id === id))
    setTasks(reordered)
    await reorderTasks(taskIds)
  }

  const taskToDeleteTitle = taskToDelete ? tasks.find(t => t.id === taskToDelete)?.title : ''

  return (
    <div className="app">
      <h1>Todo List</h1>
      <TaskForm onTaskCreated={handleCreateTask} />
      <TaskList
        tasks={tasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        onReorder={handleReorderTasks}
      />
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que quieres eliminar la tarea "${taskToDeleteTitle}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  )
}

export default App
