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

test('opens confirm dialog when delete button is clicked', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))
  expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument()
  expect(screen.getByText('¿Estás seguro de que deseas eliminar "Test task"?')).toBeInTheDocument()
})

test('does not call onDelete when cancel is clicked in dialog', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Open the dialog
  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))

  // Click cancel in the dialog
  const cancelButton = screen.getAllByRole('button', { name: /cancelar/i })[0]
  fireEvent.click(cancelButton)

  expect(mockDelete).not.toHaveBeenCalled()
})

test('calls onDelete when confirm is clicked in dialog', () => {
  const mockDelete = vi.fn()
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  // Open the dialog
  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))

  // Click confirm in the dialog (the second "Eliminar" button)
  const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i })
  fireEvent.click(deleteButtons[1])

  expect(mockDelete).toHaveBeenCalledWith(1)
})

test('renders drag handle', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  const handle = document.querySelector('.drag-handle')
  expect(handle).toBeInTheDocument()
})
