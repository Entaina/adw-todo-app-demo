import { useState } from 'react'

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('')
  const [dueAt, setDueAt] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (title.trim()) {
      const taskData = { title }
      if (dueAt) {
        taskData.due_at = dueAt
      }
      await onTaskCreated(taskData)
      setTitle('')
      setDueAt('')
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
      <input
        type="datetime-local"
        value={dueAt}
        onChange={(e) => setDueAt(e.target.value)}
        className="task-due-input"
      />
      <button type="submit" className="btn btn-primary">
        Añadir
      </button>
    </form>
  )
}

export default TaskForm
