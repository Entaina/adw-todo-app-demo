import { useEffect } from 'react'
import { createPortal } from 'react-dom'

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel
}) {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const dialog = (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="dialog-title">{title}</h2>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button
            onClick={onCancel}
            className="btn btn-cancel"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-confirm-danger"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(dialog, document.body)
}

export default ConfirmDialog
