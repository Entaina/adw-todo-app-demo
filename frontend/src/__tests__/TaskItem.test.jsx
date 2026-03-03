import { render, screen, fireEvent } from '@testing-library/react'
import TaskItem from '../components/TaskItem'

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false
  })
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: () => undefined
    }
  }
}))

const mockTask = {
  id: 1,
  title: 'Test task',
  completed: false
}

test('renders task with title', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  expect(screen.getByText('Test task')).toBeInTheDocument()
})

test('shows checked checkbox when task is completed', () => {
  const completedTask = { ...mockTask, completed: true }
  render(<TaskItem task={completedTask} onToggle={() => {}} onDelete={() => {}} />)

  const checkbox = screen.getByRole('checkbox')
  expect(checkbox).toBeChecked()
})

test('calls onToggle when checkbox is clicked', () => {
  const mockToggle = vi.fn()
  render(<TaskItem task={mockTask} onToggle={mockToggle} onDelete={() => {}} />)

  fireEvent.click(screen.getByRole('checkbox'))
  expect(mockToggle).toHaveBeenCalledWith(1)
})

test('shows confirm dialog when delete button is clicked', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))

  // Dialog should be visible
  expect(screen.getByText('Eliminar tarea')).toBeInTheDocument()
  expect(screen.getByText('¿Estás seguro de que quieres eliminar esta tarea?')).toBeInTheDocument()

  // onDelete should not be called yet
  expect(mockDelete).not.toHaveBeenCalled()
})

test('calls onDelete when confirm button is clicked in dialog', () => {
  const mockDelete = vi.fn()
  const { container } = render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click delete button to show dialog
  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))

  // Click confirm button in dialog (inside modal-actions)
  const modalActions = container.querySelector('.modal-actions')
  const confirmButton = modalActions.querySelector('.btn-delete')
  fireEvent.click(confirmButton)

  // onDelete should be called
  expect(mockDelete).toHaveBeenCalledWith(1)
})

test('does not call onDelete when cancel button is clicked in dialog', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click delete button to show dialog
  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))

  // Click cancel button in dialog
  fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))

  // onDelete should not be called
  expect(mockDelete).not.toHaveBeenCalled()

  // Dialog should be closed
  expect(screen.queryByText('Eliminar tarea')).not.toBeInTheDocument()
})

test('renders drag handle', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  const handle = document.querySelector('.drag-handle')
  expect(handle).toBeInTheDocument()
})
