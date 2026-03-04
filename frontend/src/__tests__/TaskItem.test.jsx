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

  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))
  expect(mockDelete).toHaveBeenCalledWith(1)
})

test('renders drag handle', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  const handle = document.querySelector('.drag-handle')
  expect(handle).toBeInTheDocument()
})

test('shows deadline when present', () => {
  const taskWithDeadline = { ...mockTask, deadline: '2026-03-15' }
  render(<TaskItem task={taskWithDeadline} onToggle={() => {}} onDelete={() => {}} />)

  const deadline = screen.getByText(/15 mar 2026/i)
  expect(deadline).toBeInTheDocument()
  expect(deadline).toHaveClass('task-deadline')
})

test('does not show deadline when not present', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)

  const deadline = document.querySelector('.task-deadline')
  expect(deadline).not.toBeInTheDocument()
})

test('applies overdue class for past dates', () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const dateString = yesterday.toISOString().split('T')[0]

  const taskWithOverdueDeadline = { ...mockTask, deadline: dateString }
  render(<TaskItem task={taskWithOverdueDeadline} onToggle={() => {}} onDelete={() => {}} />)

  const deadline = document.querySelector('.task-deadline')
  expect(deadline).toHaveClass('overdue')
})
