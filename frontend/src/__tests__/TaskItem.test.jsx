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

test('calls onDelete when delete button is clicked', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click delete button to open confirm dialog
  const deleteButton = screen.getByRole('button', { name: /eliminar/i })
  fireEvent.click(deleteButton)

  // Verify confirm dialog appears with task title
  expect(screen.getByText('Eliminar tarea')).toBeInTheDocument()
  expect(screen.getByText(/¿Estás seguro de que quieres eliminar "Test task"\?/i)).toBeInTheDocument()

  // Click confirm button in dialog
  const confirmButton = screen.getAllByRole('button', { name: /eliminar/i })[1]
  fireEvent.click(confirmButton)

  // Verify onDelete was called with correct id
  expect(mockDelete).toHaveBeenCalledWith(1)
})

test('does not call onDelete when cancel button is clicked', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click delete button to open confirm dialog
  const deleteButton = screen.getByRole('button', { name: /eliminar/i })
  fireEvent.click(deleteButton)

  // Click cancel button in dialog
  const cancelButton = screen.getByRole('button', { name: /cancelar/i })
  fireEvent.click(cancelButton)

  // Verify onDelete was not called
  expect(mockDelete).not.toHaveBeenCalled()

  // Verify dialog is closed
  expect(screen.queryByText('Eliminar tarea')).not.toBeInTheDocument()
})

test('shows task title in confirm dialog message', () => {
  const taskWithLongTitle = { ...mockTask, title: 'This is a very long task title' }
  render(<TaskItem task={taskWithLongTitle} onToggle={() => {}} onDelete={() => {}} />)

  // Click delete button to open confirm dialog
  const deleteButton = screen.getByRole('button', { name: /eliminar/i })
  fireEvent.click(deleteButton)

  // Verify the dialog shows the task title
  expect(screen.getByText(/¿Estás seguro de que quieres eliminar "This is a very long task title"\?/i)).toBeInTheDocument()
})

test('renders drag handle', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  const handle = document.querySelector('.drag-handle')
  expect(handle).toBeInTheDocument()
})
