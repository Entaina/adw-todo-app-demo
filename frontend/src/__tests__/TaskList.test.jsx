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

test('shows section headers for pending and completed tasks', () => {
  render(<TaskList tasks={mockTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)
  expect(screen.getByText('Tareas pendientes')).toBeInTheDocument()
  expect(screen.getByText('Tareas completadas')).toBeInTheDocument()
})

test('hides completed section when no completed tasks', () => {
  const pendingTasks = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: false }
  ]
  render(<TaskList tasks={pendingTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)
  expect(screen.getByText('Tareas pendientes')).toBeInTheDocument()
  expect(screen.queryByText('Tareas completadas')).not.toBeInTheDocument()
})

test('renders pending tasks before completed tasks', () => {
  const mixedTasks = [
    { id: 1, title: 'Completed 1', completed: true },
    { id: 2, title: 'Pending 1', completed: false },
    { id: 3, title: 'Pending 2', completed: false },
    { id: 4, title: 'Completed 2', completed: true }
  ]
  render(<TaskList tasks={mixedTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)

  const headers = screen.getAllByRole('heading', { level: 2 })
  expect(headers[0]).toHaveTextContent('Tareas pendientes')
  expect(headers[1]).toHaveTextContent('Tareas completadas')
})
