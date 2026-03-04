import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmDialog from '../components/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={false}
        title="Test Title"
        message="Test Message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the dialog when isOpen is true', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('displays the correct title and message', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirmar eliminación"
        message="¿Estás seguro de que quieres eliminar esta tarea?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument();
    expect(screen.getByText('¿Estás seguro de que quieres eliminar esta tarea?')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const mockConfirm = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockConfirm}
        onCancel={() => {}}
      />
    );
    const confirmButton = screen.getByText('Confirmar');
    fireEvent.click(confirmButton);
    expect(mockConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    const mockCancel = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={() => {}}
        onCancel={mockCancel}
      />
    );
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('uses custom button texts when provided', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={() => {}}
        onCancel={() => {}}
        confirmText="Eliminar"
        cancelText="No"
      />
    );
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.queryByText('Confirmar')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
  });
});
