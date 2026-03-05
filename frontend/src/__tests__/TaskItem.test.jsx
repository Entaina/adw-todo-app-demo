import { render, screen, fireEvent } from '@testing-library/react'
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

test('shows confirm dialog when delete button is clicked', async () => {
  const user = userEvent.setup()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)

  const deleteButton = screen.getByRole('button', { name: /eliminar/i })
  await user.click(deleteButton)

  expect(screen.getByText('Eliminar tarea')).toBeInTheDocument()
  expect(screen.getByText(/¿Estás seguro de que quieres eliminar "Test task"\?/)).toBeInTheDocument()
})

test('does not call onDelete when cancel button is clicked in dialog', async () => {
  const user = userEvent.setup()
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  const deleteButton = screen.getByRole('button', { name: /eliminar/i })
  await user.click(deleteButton)

  const cancelButton = screen.getByText('Cancelar')
  await user.click(cancelButton)

  expect(mockDelete).not.toHaveBeenCalled()
  expect(screen.queryByText('Eliminar tarea')).not.toBeInTheDocument()
})

test('calls onDelete when confirm button is clicked in dialog', async () => {
  const user = userEvent.setup()
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  const deleteButton = screen.getByRole('button', { name: /eliminar/i })
  await user.click(deleteButton)

  const confirmButton = screen.getAllByText(/eliminar/i).find(el => el.classList.contains('btn-delete') && el.closest('.modal'))
  await user.click(confirmButton)

  expect(mockDelete).toHaveBeenCalledWith(1)
})

test('renders drag handle', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  const handle = document.querySelector('.drag-handle')
  expect(handle).toBeInTheDocument()
})
