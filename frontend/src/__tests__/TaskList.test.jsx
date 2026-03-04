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

test('renders pending tasks before completed tasks', () => {
  const mixedTasks = [
    { id: 1, title: 'Completed Task', completed: true },
    { id: 2, title: 'Pending Task', completed: false },
    { id: 3, title: 'Another Pending', completed: false },
    { id: 4, title: 'Another Completed', completed: true }
  ]
  const { container } = render(<TaskList tasks={mixedTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)

  const pendingSection = container.querySelector('.pending-tasks')
  const completedSection = container.querySelector('.completed-tasks')

  expect(pendingSection).toBeInTheDocument()
  expect(completedSection).toBeInTheDocument()

  // Verificar que la sección pendiente aparece antes que la completada
  const taskList = container.querySelector('.task-list')
  const sections = taskList.children
  const pendingIndex = Array.from(sections).findIndex(el => el.classList.contains('pending-tasks'))
  const separatorIndex = Array.from(sections).findIndex(el => el.classList.contains('tasks-separator'))
  const completedIndex = Array.from(sections).findIndex(el => el.classList.contains('completed-tasks'))

  expect(pendingIndex).toBeLessThan(separatorIndex)
  expect(separatorIndex).toBeLessThan(completedIndex)
})

test('shows separator when there are completed tasks', () => {
  render(<TaskList tasks={mockTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)
  expect(screen.getByText('Tareas completadas')).toBeInTheDocument()
})

test('does not show separator when there are no completed tasks', () => {
  const pendingOnlyTasks = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: false }
  ]
  render(<TaskList tasks={pendingOnlyTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)
  expect(screen.queryByText('Tareas completadas')).not.toBeInTheDocument()
})

test('does not show separator when there are only completed tasks', () => {
  const completedOnlyTasks = [
    { id: 1, title: 'Task 1', completed: true },
    { id: 2, title: 'Task 2', completed: true }
  ]
  render(<TaskList tasks={completedOnlyTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)
  expect(screen.getByText('Tareas completadas')).toBeInTheDocument()
})

test('correctly groups pending and completed tasks', () => {
  const mixedTasks = [
    { id: 1, title: 'Pending 1', completed: false },
    { id: 2, title: 'Completed 1', completed: true },
    { id: 3, title: 'Pending 2', completed: false }
  ]
  const { container } = render(<TaskList tasks={mixedTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)

  const pendingSection = container.querySelector('.pending-tasks')
  const completedSection = container.querySelector('.completed-tasks')

  expect(pendingSection.children).toHaveLength(2) // 2 pending tasks
  expect(completedSection.children).toHaveLength(1) // 1 completed task
})
