import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import { fetchTasks, updateTask } from '../services/api'

// Mock del servicio API
vi.mock('../services/api', () => ({
  fetchTasks: vi.fn().mockResolvedValue([]),
  createTask: vi.fn(),
  updateTask: vi.fn().mockResolvedValue({}),
  deleteTask: vi.fn(),
  reorderTasks: vi.fn().mockResolvedValue([])
}))

test('renders Todo List heading', async () => {
  render(<App />)
  const heading = screen.getByRole('heading', { name: /todo list/i })
  expect(heading).toBeInTheDocument()
  // Wait for theme initialization to complete
  await waitFor(() => {
    expect(heading).toBeInTheDocument()
  })
})

test('renders task form', async () => {
  render(<App />)
  const input = screen.getByPlaceholderText(/nueva tarea/i)
  expect(input).toBeInTheDocument()
  // Wait for theme initialization to complete
  await waitFor(() => {
    expect(input).toBeInTheDocument()
  })
})

test('renders task list', async () => {
  render(<App />)
  const text = screen.getByText(/no hay tareas/i)
  expect(text).toBeInTheDocument()
  // Wait for theme initialization to complete
  await waitFor(() => {
    expect(text).toBeInTheDocument()
  })
})

test('toggle calls updateTask with completed: true when task is not completed', async () => {
  fetchTasks.mockResolvedValue([{ id: 1, title: 'Test task', completed: false }])

  render(<App />)
  const checkbox = await screen.findByRole('checkbox')
  fireEvent.click(checkbox)

  await waitFor(() => {
    expect(updateTask).toHaveBeenCalledWith(1, { completed: true })
  })
})

test('toggle calls updateTask with completed: false when task is completed', async () => {
  fetchTasks.mockResolvedValue([{ id: 1, title: 'Test task', completed: true }])

  render(<App />)
  const checkbox = await screen.findByRole('checkbox')
  fireEvent.click(checkbox)

  await waitFor(() => {
    expect(updateTask).toHaveBeenCalledWith(1, { completed: false })
  })
})
