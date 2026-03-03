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

  // Click delete button - should show confirmation dialog
  const deleteButton = screen.getAllByRole('button', { name: /eliminar/i })[0]
  fireEvent.click(deleteButton)

  // onDelete should NOT be called immediately
  expect(mockDelete).not.toHaveBeenCalled()

  // Dialog should be visible
  expect(screen.getByText('Eliminar tarea')).toBeInTheDocument()
  expect(screen.getByText(/¿Estás seguro de que deseas eliminar la tarea "Test task"\?/i)).toBeInTheDocument()

  // Click confirm button in dialog
  const confirmButton = screen.getAllByRole('button', { name: /eliminar/i })[1]
  fireEvent.click(confirmButton)

  // Now onDelete should be called
  expect(mockDelete).toHaveBeenCalledWith(1)
})

test('renders drag handle', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  const handle = document.querySelector('.drag-handle')
  expect(handle).toBeInTheDocument()
})
