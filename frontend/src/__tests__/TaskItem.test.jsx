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

test('shows confirmation dialog when delete button is clicked', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click the delete button
  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))

  // Check that the confirmation dialog appears
  expect(screen.getByText('Eliminar tarea')).toBeInTheDocument()
  expect(screen.getByText(/¿Estás seguro de que deseas eliminar la tarea "Test task"\?/)).toBeInTheDocument()
})

test('calls onDelete when deletion is confirmed', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click the delete button to open dialog
  const deleteButton = screen.getByRole('button', { name: /eliminar/i })
  fireEvent.click(deleteButton)

  // Click the confirm button in the dialog
  const confirmButton = screen.getAllByText('Eliminar').find(el => el.className === 'btn-confirm-delete')
  fireEvent.click(confirmButton)

  expect(mockDelete).toHaveBeenCalledWith(1)
})

test('does not call onDelete when deletion is cancelled', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click the delete button to open dialog
  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))

  // Click the cancel button in the dialog
  fireEvent.click(screen.getByText('Cancelar'))

  expect(mockDelete).not.toHaveBeenCalled()
})

test('closes dialog when cancelled', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click the delete button to open dialog
  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))
  expect(screen.getByText('Eliminar tarea')).toBeInTheDocument()

  // Click the cancel button
  fireEvent.click(screen.getByText('Cancelar'))

  // Dialog should be closed
  expect(screen.queryByText('Eliminar tarea')).not.toBeInTheDocument()
})

test('renders drag handle', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  const handle = document.querySelector('.drag-handle')
  expect(handle).toBeInTheDocument()
})
