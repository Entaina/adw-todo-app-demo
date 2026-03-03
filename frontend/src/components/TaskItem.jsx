import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function TaskItem({ task, onToggle, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  // Determinar el estado de vencimiento
  const getDueStatus = () => {
    if (!task.due_at || task.completed) return null

    const now = new Date()
    const dueDate = new Date(task.due_at)
    const timeDiff = dueDate - now
    const hoursDiff = timeDiff / (1000 * 60 * 60)

    if (timeDiff < 0) return 'overdue'
    if (hoursDiff <= 24) return 'due-soon'
    return null
  }

  const dueStatus = getDueStatus()

  // Formatear la fecha de vencimiento para mostrarla
  const formatDueDate = (dueAt) => {
    if (!dueAt) return null
    const date = new Date(dueAt)
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const taskItemClass = `task-item${isDragging ? ' dragging' : ''}${dueStatus ? ` task-${dueStatus}` : ''}`

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={taskItemClass}
      {...attributes}
    >
      <span className="drag-handle" {...listeners}>⠿</span>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="task-checkbox"
      />
      <span className={task.completed ? 'task-title completed' : 'task-title'}>
        {task.title}
      </span>
      {task.due_at && (
        <span className="task-due-date">
          {formatDueDate(task.due_at)}
        </span>
      )}
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
