import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import { fetchTasks, updateTask } from '../services/api'

// Mock del servicio API
vi.mock('../services/api', () => ({
  fetchTasks: vi.fn().mockResolvedValue([]),
  createTask: vi.fn(),
  updateTask: vi.fn().mockResolvedValue({}),
  deleteTask: vi.fn(),
  reorderTasks: vi.fn()
}))

test('renders Todo List heading', () => {
  render(<App />)
  const heading = screen.getByRole('heading', { name: /todo list/i })
  expect(heading).toBeInTheDocument()
})

test('renders task form', () => {
  render(<App />)
  expect(screen.getByPlaceholderText(/nueva tarea/i)).toBeInTheDocument()
})

test('renders task list', () => {
  render(<App />)
  expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument()
})

test('toggle task calls updateTask with negated completed value', async () => {
  fetchTasks.mockResolvedValue([
    { id: 1, title: 'Test task', completed: false, position: 0 }
  ])

  render(<App />)

  await waitFor(() => {
    expect(screen.getByText('Test task')).toBeInTheDocument()
  })

  const checkbox = screen.getByRole('checkbox')
  fireEvent.click(checkbox)

  expect(updateTask).toHaveBeenCalledWith(1, { completed: true })
})
