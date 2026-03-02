import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmDialog from '../components/ConfirmDialog'

describe('ConfirmDialog', () => {
  const mockOnConfirm = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    mockOnConfirm.mockClear()
    mockOnCancel.mockClear()
  })

  test('no renderiza nada cuando isOpen es false', () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={false}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  test('renderiza título y mensaje cuando está abierto', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirmar eliminación"
        message="¿Estás seguro de que quieres eliminar la tarea?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument()
    expect(screen.getByText('¿Estás seguro de que quieres eliminar la tarea?')).toBeInTheDocument()
  })

  test('llama onCancel al hacer clic en Cancelar', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  test('llama onConfirm al hacer clic en Confirmar', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const confirmButton = screen.getByText('Confirmar')
    fireEvent.click(confirmButton)

    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    expect(mockOnCancel).not.toHaveBeenCalled()
  })
})
