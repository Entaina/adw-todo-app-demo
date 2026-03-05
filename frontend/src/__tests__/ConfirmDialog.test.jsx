import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmDialog from '../components/ConfirmDialog'

test('does not render when isOpen is false', () => {
  render(
    <ConfirmDialog
      isOpen={false}
      title="Test Title"
      message="Test Message"
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  )

  expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  expect(screen.queryByText('Test Message')).not.toBeInTheDocument()
})

test('renders title and message when isOpen is true', () => {
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

test('calls onCancel when cancel button is clicked', () => {
  const mockCancel = vi.fn()

  render(
    <ConfirmDialog
      isOpen={true}
      title="Test Title"
      message="Test Message"
      onConfirm={() => {}}
      onCancel={mockCancel}
    />
  )

  fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))
  expect(mockCancel).toHaveBeenCalledTimes(1)
})

test('calls onConfirm when confirm button is clicked', () => {
  const mockConfirm = vi.fn()

  render(
    <ConfirmDialog
      isOpen={true}
      title="Test Title"
      message="Test Message"
      onConfirm={mockConfirm}
      onCancel={() => {}}
    />
  )

  fireEvent.click(screen.getByRole('button', { name: /confirmar/i }))
  expect(mockConfirm).toHaveBeenCalledTimes(1)
})

test('calls onCancel when overlay is clicked', () => {
  const mockCancel = vi.fn()

  render(
    <ConfirmDialog
      isOpen={true}
      title="Test Title"
      message="Test Message"
      onConfirm={() => {}}
      onCancel={mockCancel}
    />
  )

  const overlay = document.querySelector('.dialog-overlay')
  fireEvent.click(overlay)
  expect(mockCancel).toHaveBeenCalledTimes(1)
})

test('does not call onCancel when dialog content is clicked', () => {
  const mockCancel = vi.fn()

  render(
    <ConfirmDialog
      isOpen={true}
      title="Test Title"
      message="Test Message"
      onConfirm={() => {}}
      onCancel={mockCancel}
    />
  )

  const content = document.querySelector('.dialog-content')
  fireEvent.click(content)
  expect(mockCancel).not.toHaveBeenCalled()
})

test('calls onCancel when Escape key is pressed', () => {
  const mockCancel = vi.fn()

  render(
    <ConfirmDialog
      isOpen={true}
      title="Test Title"
      message="Test Message"
      onConfirm={() => {}}
      onCancel={mockCancel}
    />
  )

  fireEvent.keyDown(document, { key: 'Escape' })
  expect(mockCancel).toHaveBeenCalledTimes(1)
})

test('uses custom button labels when provided', () => {
  render(
    <ConfirmDialog
      isOpen={true}
      title="Test Title"
      message="Test Message"
      confirmLabel="Sí, eliminar"
      cancelLabel="No, mantener"
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  )

  expect(screen.getByRole('button', { name: 'Sí, eliminar' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'No, mantener' })).toBeInTheDocument()
})
