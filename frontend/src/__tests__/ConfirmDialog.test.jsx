import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmDialog from '../components/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('does not render anything when isOpen is false', () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={false}
        title="Test Title"
        message="Test message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the title correctly', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the message correctly', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('calls onConfirm when the confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    );
    fireEvent.click(screen.getByText('Confirmar'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByText('Cancelar'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('uses custom button texts when provided', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={() => {}}
        onCancel={() => {}}
        confirmText="Eliminar"
        cancelText="No eliminar"
      />
    );
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
    expect(screen.getByText('No eliminar')).toBeInTheDocument();
  });
});
