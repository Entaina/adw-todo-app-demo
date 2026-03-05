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

  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))

  // Dialog should be shown
  expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument()
  expect(screen.queryByText(/¿Estás seguro de que quieres eliminar la tarea/i)).toBeInTheDocument()

  // onDelete should not be called yet
  expect(mockDelete).not.toHaveBeenCalled()
})

test('calls onDelete when user confirms deletion', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click delete button
  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))

  // Confirm deletion
  const confirmButtons = screen.getAllByRole('button', { name: /eliminar/i })
  const confirmButton = confirmButtons.find(btn => btn.classList.contains('btn-confirm-danger'))
  fireEvent.click(confirmButton)

  expect(mockDelete).toHaveBeenCalledWith(1)
})

test('does not call onDelete when user cancels deletion', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Click delete button
  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))

  // Cancel deletion
  fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))

  expect(mockDelete).not.toHaveBeenCalled()
  expect(screen.queryByText('Confirmar eliminación')).not.toBeInTheDocument()
})

test('dialog shows task title in the message', () => {
  const taskWithTitle = { ...mockTask, title: 'Comprar leche' }
  render(<TaskItem task={taskWithTitle} onToggle={() => {}} onDelete={() => {}} />)

  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))

  expect(screen.getByText(/¿Estás seguro de que quieres eliminar la tarea "Comprar leche"\?/)).toBeInTheDocument()
})

test('renders drag handle', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  const handle = document.querySelector('.drag-handle')
  expect(handle).toBeInTheDocument()
})
