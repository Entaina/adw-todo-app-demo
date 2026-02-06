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
