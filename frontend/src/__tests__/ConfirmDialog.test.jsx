import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from '../components/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('no renderiza nada cuando isOpen es false', () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={false}
        title="Test Title"
        message="Test Message"
        onCancel={() => {}}
        onConfirm={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza título y mensaje cuando isOpen es true', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirmar eliminación"
        message="¿Estás seguro de que quieres eliminar esta tarea?"
        onCancel={() => {}}
        onConfirm={() => {}}
      />
    );

    expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument();
    expect(screen.getByText('¿Estás seguro de que quieres eliminar esta tarea?')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
  });

  it('llama a onCancel cuando se hace clic en Cancelar', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onCancel={onCancel}
        onConfirm={() => {}}
      />
    );

    await user.click(screen.getByText('Cancelar'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('llama a onConfirm cuando se hace clic en Confirmar', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onCancel={() => {}}
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByText('Confirmar'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('llama a onCancel cuando se hace clic en el overlay', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onCancel={onCancel}
        onConfirm={() => {}}
      />
    );

    const overlay = screen.getByText('Test Title').parentElement.parentElement;
    await user.click(overlay);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
