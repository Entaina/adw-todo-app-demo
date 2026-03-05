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

  // Click the delete button to open the modal
  const deleteButton = document.querySelector('.btn-delete')
  fireEvent.click(deleteButton)

  // Click the confirm button in the modal
  const confirmButton = document.querySelector('.btn-danger')
  fireEvent.click(confirmButton)

  expect(mockDelete).toHaveBeenCalledWith(1)
})

test('does not call onDelete when cancel is clicked in confirm dialog', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click the delete button to open the modal
  const deleteButton = document.querySelector('.btn-delete')
  fireEvent.click(deleteButton)

  // Click the cancel button in the modal
  const cancelButton = document.querySelector('.btn-cancel')
  fireEvent.click(cancelButton)

  expect(mockDelete).not.toHaveBeenCalled()
})

test('renders drag handle', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  const handle = document.querySelector('.drag-handle')
  expect(handle).toBeInTheDocument()
})
