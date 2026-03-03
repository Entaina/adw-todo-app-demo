import React from 'react';

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <h2 className="confirm-dialog-title">{title}</h2>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button className="btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn-confirm-delete" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
