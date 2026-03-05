import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ConfirmDialog from './ConfirmDialog'

function TaskItem({ task, onToggle, onDelete }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
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

  const handleDeleteClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmDelete = () => {
    onDelete(task.id)
    setShowConfirmDialog(false)
  }

  const handleCancelDelete = () => {
    setShowConfirmDialog(false)
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
        onClick={handleDeleteClick}
        className="btn btn-delete"
      >
        Eliminar
      </button>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que quieres eliminar la tarea "${task.title}"?`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}

export default TaskItem
