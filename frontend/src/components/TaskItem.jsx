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

  const getDeadlineStatus = () => {
    if (!task.deadline) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const deadline = new Date(task.deadline)
    deadline.setHours(0, 0, 0, 0)

    const diffTime = deadline - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'overdue'
    if (diffDays <= 7) return 'soon'
    return 'normal'
  }

  const formatDeadline = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const deadlineStatus = getDeadlineStatus()

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-item${isDragging ? ' dragging' : ''}`}
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
      {task.deadline && (
        <span className={`task-deadline ${deadlineStatus}`}>
          {formatDeadline(task.deadline)}
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
