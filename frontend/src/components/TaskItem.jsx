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
