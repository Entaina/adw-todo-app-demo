import { render, screen } from '@testing-library/react'
import App from '../App'

// Mock del servicio API
vi.mock('../services/api', () => ({
  fetchTasks: vi.fn().mockResolvedValue([]),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn()
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
