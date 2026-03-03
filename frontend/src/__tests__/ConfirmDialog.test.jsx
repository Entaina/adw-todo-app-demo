import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmDialog from '../components/ConfirmDialog'

test('does not render when isOpen is false', () => {
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

test('renders title and message when isOpen is true', () => {
  render(
    <ConfirmDialog
      isOpen={true}
      title="Delete Task"
      message="Are you sure you want to delete this task?"
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  )

  expect(screen.getByText('Delete Task')).toBeInTheDocument()
  expect(screen.getByText('Are you sure you want to delete this task?')).toBeInTheDocument()
})

test('displays custom button text', () => {
  render(
    <ConfirmDialog
      isOpen={true}
      title="Test"
      message="Test message"
      confirmText="Yes"
      cancelText="No"
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  )

  expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument()
})

test('calls onConfirm when confirm button is clicked', () => {
  const mockConfirm = vi.fn()
  render(
    <ConfirmDialog
      isOpen={true}
      title="Test"
      message="Test message"
      onConfirm={mockConfirm}
      onCancel={() => {}}
    />
  )

  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))
  expect(mockConfirm).toHaveBeenCalledTimes(1)
})

test('calls onCancel when cancel button is clicked', () => {
  const mockCancel = vi.fn()
  render(
    <ConfirmDialog
      isOpen={true}
      title="Test"
      message="Test message"
      onConfirm={() => {}}
      onCancel={mockCancel}
    />
  )

  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
  expect(mockCancel).toHaveBeenCalledTimes(1)
})

test('calls onCancel when overlay is clicked', () => {
  const mockCancel = vi.fn()
  const { container } = render(
    <ConfirmDialog
      isOpen={true}
      title="Test"
      message="Test message"
      onConfirm={() => {}}
      onCancel={mockCancel}
    />
  )

  const overlay = container.querySelector('.modal-overlay')
  fireEvent.click(overlay)
  expect(mockCancel).toHaveBeenCalledTimes(1)
})
