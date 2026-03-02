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

test('calls onConfirm when delete button is clicked', () => {
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

  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))
  expect(mockConfirm).toHaveBeenCalledTimes(1)
})

test('calls onCancel when clicking on overlay', () => {
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

  const overlay = document.querySelector('.confirm-dialog-overlay')
  fireEvent.click(overlay)
  expect(mockCancel).toHaveBeenCalledTimes(1)
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
