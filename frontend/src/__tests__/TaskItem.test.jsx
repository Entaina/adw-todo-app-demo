import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))

  expect(screen.getByText(/¿Estás seguro de que quieres eliminar la tarea/i)).toBeInTheDocument()
  expect(mockDelete).not.toHaveBeenCalled()
})

test('calls onDelete only after confirmation', async () => {
  const user = userEvent.setup()
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click delete button
  await user.click(screen.getByRole('button', { name: /eliminar/i }))

  // Confirm deletion
  const confirmButton = screen.getAllByRole('button', { name: /eliminar/i })[1]
  await user.click(confirmButton)

  await waitFor(() => {
    expect(mockDelete).toHaveBeenCalledWith(1)
  })
})

test('closes dialog and does not delete when cancelled', async () => {
  const user = userEvent.setup()
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click delete button
  await user.click(screen.getByRole('button', { name: /eliminar/i }))

  // Cancel deletion
  await user.click(screen.getByRole('button', { name: /cancelar/i }))

  expect(mockDelete).not.toHaveBeenCalled()
  expect(screen.queryByText(/¿Estás seguro de que quieres eliminar la tarea/i)).not.toBeInTheDocument()
})

test('renders drag handle', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  const handle = document.querySelector('.drag-handle')
  expect(handle).toBeInTheDocument()
})
