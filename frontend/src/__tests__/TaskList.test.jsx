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

test('renders separator when there are completed tasks', () => {
  const tasksWithCompleted = [
    { id: 1, title: 'Pending Task', completed: false },
    { id: 2, title: 'Completed Task', completed: true }
  ]
  render(<TaskList tasks={tasksWithCompleted} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)
  expect(screen.getByText('Completadas')).toBeInTheDocument()
})

test('does not render separator when no completed tasks', () => {
  const pendingTasksOnly = [
    { id: 1, title: 'Pending Task 1', completed: false },
    { id: 2, title: 'Pending Task 2', completed: false }
  ]
  render(<TaskList tasks={pendingTasksOnly} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)
  expect(screen.queryByText('Completadas')).not.toBeInTheDocument()
})

test('renders pending tasks before completed tasks', () => {
  const mixedTasks = [
    { id: 1, title: 'Completed Task', completed: true },
    { id: 2, title: 'Pending Task', completed: false },
    { id: 3, title: 'Another Completed', completed: true }
  ]
  render(<TaskList tasks={mixedTasks} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)

  const allTaskText = screen.getAllByText(/Task|Completed/)
  const pendingIndex = allTaskText.findIndex(el => el.textContent.includes('Pending Task'))
  const completedIndex = allTaskText.findIndex(el => el.textContent.includes('Completed Task'))

  expect(pendingIndex).toBeLessThan(completedIndex)
})

test('completed section has correct styling class', () => {
  const tasksWithCompleted = [
    { id: 1, title: 'Pending Task', completed: false },
    { id: 2, title: 'Completed Task', completed: true }
  ]
  const { container } = render(<TaskList tasks={tasksWithCompleted} onToggle={() => {}} onDelete={() => {}} onReorder={() => {}} />)

  const completedSection = container.querySelector('.completed-tasks-section')
  expect(completedSection).toBeInTheDocument()
  expect(completedSection).toHaveClass('task-list')
})
