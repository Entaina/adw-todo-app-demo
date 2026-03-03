import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ConfirmDialog from '../components/ConfirmDialog'

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
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders modal when isOpen is true', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Message')).toBeInTheDocument()
  })

  it('displays the title and message correctly', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Eliminar tarea"
        message="¿Estás seguro de que deseas eliminar esta tarea?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Eliminar tarea')).toBeInTheDocument()
    expect(screen.getByText('¿Estás seguro de que deseas eliminar esta tarea?')).toBeInTheDocument()
  })

  it('calls onConfirm when Eliminar button is clicked', () => {
    const onConfirm = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    )

    const deleteButton = screen.getByText('Eliminar')
    fireEvent.click(deleteButton)

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Cancelar button is clicked', () => {
    const onCancel = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )

    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)

    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
