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

  // Click the delete button
  const deleteButton = screen.getAllByText('Eliminar')[0]
  fireEvent.click(deleteButton)

  // Check that the dialog is shown
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument()
  expect(screen.getByText('¿Estás seguro de que quieres eliminar "Test task"?')).toBeInTheDocument()
})

test('calls onDelete when confirm button in dialog is clicked', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click the delete button to open dialog
  const deleteButton = screen.getAllByText('Eliminar')[0]
  fireEvent.click(deleteButton)

  // Click the confirm button in the dialog
  const confirmButton = screen.getAllByText('Eliminar')[1]
  fireEvent.click(confirmButton)

  // Check that onDelete was called
  expect(mockDelete).toHaveBeenCalledWith(1)
})

test('does not call onDelete when cancel button is clicked', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click the delete button to open dialog
  const deleteButton = screen.getAllByText('Eliminar')[0]
  fireEvent.click(deleteButton)

  // Click the cancel button
  const cancelButton = screen.getByText('Cancelar')
  fireEvent.click(cancelButton)

  // Check that onDelete was NOT called
  expect(mockDelete).not.toHaveBeenCalled()
  // Check that the dialog is closed
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('displays task title in confirmation dialog message', () => {
  const taskWithLongTitle = { ...mockTask, title: 'My important task with a long title' }
  render(<TaskItem task={taskWithLongTitle} onToggle={() => {}} onDelete={() => {}} />)

  // Click the delete button
  const deleteButton = screen.getAllByText('Eliminar')[0]
  fireEvent.click(deleteButton)

  // Check that the dialog shows the task title
  expect(screen.getByText('¿Estás seguro de que quieres eliminar "My important task with a long title"?')).toBeInTheDocument()
})

test('renders drag handle', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  const handle = document.querySelector('.drag-handle')
  expect(handle).toBeInTheDocument()
})
