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

test('displays due date when present', () => {
  const taskWithDue = { ...mockTask, due_at: '2026-12-31T23:59:00Z' }
  render(<TaskItem task={taskWithDue} onToggle={() => {}} onDelete={() => {}} />)
  const dueDate = document.querySelector('.task-due-date')
  expect(dueDate).toBeInTheDocument()
})

test('does not display due date when absent', () => {
  render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  const dueDate = document.querySelector('.task-due-date')
  expect(dueDate).not.toBeInTheDocument()
})

test('applies overdue class when task is overdue and not completed', () => {
  const overdueTask = {
    ...mockTask,
    due_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    completed: false
  }
  render(<TaskItem task={overdueTask} onToggle={() => {}} onDelete={() => {}} />)
  const taskItem = document.querySelector('.task-item')
  expect(taskItem).toHaveClass('task-overdue')
})

test('applies due-soon class when task is due within 24 hours', () => {
  const dueSoonTask = {
    ...mockTask,
    due_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    completed: false
  }
  render(<TaskItem task={dueSoonTask} onToggle={() => {}} onDelete={() => {}} />)
  const taskItem = document.querySelector('.task-item')
  expect(taskItem).toHaveClass('task-due-soon')
})

test('does not apply due status classes to completed tasks', () => {
  const completedOverdueTask = {
    ...mockTask,
    due_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    completed: true
  }
  render(<TaskItem task={completedOverdueTask} onToggle={() => {}} onDelete={() => {}} />)
  const taskItem = document.querySelector('.task-item')
  expect(taskItem).not.toHaveClass('task-overdue')
  expect(taskItem).not.toHaveClass('task-due-soon')
})
