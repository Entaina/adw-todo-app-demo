import { useEffect } from 'react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="confirm-dialog-overlay" onClick={handleOverlayClick}>
      <div className="confirm-dialog">
        <h3 className="confirm-dialog-title">{title}</h3>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-delete" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
