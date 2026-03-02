import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function TaskItem({ task, onToggle, onDelete, isInCompletedSection = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, disabled: isInCompletedSection })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const classNames = [
    'task-item',
    isDragging && 'dragging',
    isInCompletedSection && 'in-completed-section'
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classNames}
      {...attributes}
    >
      <span
        className="drag-handle"
        {...(!isInCompletedSection ? listeners : {})}
      >
        ⠿
      </span>
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
