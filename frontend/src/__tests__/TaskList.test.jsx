import { render, screen } from '@testing-library/react'
import TaskList from '../components/TaskList'

const mockTasks = [
  { id: 1, title: 'Task 1', completed: false },
  { id: 2, title: 'Task 2', completed: true }
]

test('renders all tasks', () => {
  render(<TaskList tasks={mockTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)
  expect(screen.getByText('Task 1')).toBeInTheDocument()
  expect(screen.getByText('Task 2')).toBeInTheDocument()
})

test('shows empty message when no tasks', () => {
  render(<TaskList tasks={[]} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)
  expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument()
})

test('renders correct number of task items', () => {
  render(<TaskList tasks={mockTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)
  const checkboxes = screen.getAllByRole('checkbox')
  expect(checkboxes).toHaveLength(2)
})

test('pending tasks appear before completed tasks', () => {
  const mixedTasks = [
    { id: 1, title: 'Completed Task', completed: true },
    { id: 2, title: 'Pending Task', completed: false }
  ]
  render(<TaskList tasks={mixedTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)

  const taskTitles = screen.getAllByText(/Task/)
  expect(taskTitles[0]).toHaveTextContent('Pending Task')
  expect(taskTitles[1]).toHaveTextContent('Completed Task')
})

test('shows separator when there are completed tasks', () => {
  const mixedTasks = [
    { id: 1, title: 'Pending Task', completed: false },
    { id: 2, title: 'Completed Task', completed: true }
  ]
  render(<TaskList tasks={mixedTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)

  expect(screen.getByText('Completadas')).toBeInTheDocument()
})

test('does not show separator when all tasks are pending', () => {
  const pendingTasks = [
    { id: 1, title: 'Pending Task 1', completed: false },
    { id: 2, title: 'Pending Task 2', completed: false }
  ]
  render(<TaskList tasks={pendingTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)

  expect(screen.queryByText('Completadas')).not.toBeInTheDocument()
})

test('does not show separator when all tasks are completed', () => {
  const completedTasks = [
    { id: 1, title: 'Completed Task 1', completed: true },
    { id: 2, title: 'Completed Task 2', completed: true }
  ]
  render(<TaskList tasks={completedTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)

  expect(screen.queryByText('Completadas')).not.toBeInTheDocument()
})
