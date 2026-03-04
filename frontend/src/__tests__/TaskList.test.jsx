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
  const tasks = [
    { id: 1, title: 'Completed Task', completed: true },
    { id: 2, title: 'Pending Task', completed: false }
  ]
  render(<TaskList tasks={tasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)

  const taskTitles = screen.getAllByRole('checkbox').map(checkbox =>
    checkbox.parentElement.querySelector('.task-title').textContent
  )

  // La primera tarea debe ser la pendiente
  expect(taskTitles[0]).toBe('Pending Task')
  // La segunda debe ser la completada
  expect(taskTitles[1]).toBe('Completed Task')
})

test('shows "Completadas" header when there are completed tasks', () => {
  const tasks = [
    { id: 1, title: 'Pending Task', completed: false },
    { id: 2, title: 'Completed Task', completed: true }
  ]
  render(<TaskList tasks={tasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)

  expect(screen.getByText('Completadas')).toBeInTheDocument()
})

test('does not show "Completadas" header when there are no completed tasks', () => {
  const tasks = [
    { id: 1, title: 'Pending Task 1', completed: false },
    { id: 2, title: 'Pending Task 2', completed: false }
  ]
  render(<TaskList tasks={tasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)

  expect(screen.queryByText('Completadas')).not.toBeInTheDocument()
})
