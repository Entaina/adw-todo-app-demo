import { useState } from 'react'

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (title.trim()) {
      await onTaskCreated({ title, deadline: deadline || null })
      setTitle('')
      setDeadline('')
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
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="task-date-input"
        aria-label="Fecha límite (opcional)"
      />
      <button type="submit" className="btn btn-primary">
        Añadir
      </button>
    </form>
  )
}

export default TaskForm
