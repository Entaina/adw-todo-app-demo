import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import { fetchTasks, createTask, updateTask, deleteTask, reorderTasks } from './services/api'

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
    const newCompleted = !task.completed

    if (task.completed && !newCompleted) {
      // Tarea se desmarca: moverla al final de las pendientes
      const otherTasks = tasks.filter(t => t.id !== id)
      const pendingTasks = otherTasks.filter(t => !t.completed)
      const completedTasks = otherTasks.filter(t => t.completed)
      const updatedTask = { ...task, completed: newCompleted }
      setTasks([...pendingTasks, updatedTask, ...completedTasks])
    } else {
      // Comportamiento normal para marcar como completada
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: newCompleted } : t))
    }

    await updateTask(id, { completed: newCompleted })
  }

  const handleDeleteTask = async (id) => {
    await deleteTask(id)
    setTasks(tasks.filter(t => t.id !== id))
  }

  const handleReorderTasks = async (taskIds) => {
    const reordered = taskIds.map(id => tasks.find(t => t.id === id))
    setTasks(reordered)
    await reorderTasks(taskIds)
  }

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
    </div>
  )
}

export default App
