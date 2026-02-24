import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import { fetchTasks, updateTask, deleteTask } from '../services/api'

// Mock del servicio API
vi.mock('../services/api', () => ({
  fetchTasks: vi.fn().mockResolvedValue([]),
  createTask: vi.fn(),
  updateTask: vi.fn().mockResolvedValue({}),
  deleteTask: vi.fn(),
  reorderTasks: vi.fn().mockResolvedValue([])
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

test('shows confirmation dialog when delete button is clicked', async () => {
  fetchTasks.mockResolvedValue([{ id: 1, title: 'Test task', completed: false }])

  render(<App />)
  const deleteButton = await screen.findByText(/eliminar/i)
  fireEvent.click(deleteButton)

  expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument()
  expect(screen.getByText(/¿Estás seguro de que quieres eliminar la tarea "Test task"?/i)).toBeInTheDocument()
})

test('does not delete task when confirmation is cancelled', async () => {
  fetchTasks.mockResolvedValue([{ id: 1, title: 'Test task', completed: false }])

  render(<App />)
  const deleteButton = await screen.findByText(/eliminar/i)
  fireEvent.click(deleteButton)

  const cancelButton = screen.getByText('Cancelar')
  fireEvent.click(cancelButton)

  expect(deleteTask).not.toHaveBeenCalled()
  expect(await screen.findByText('Test task')).toBeInTheDocument()
})

test('deletes task when confirmation is confirmed', async () => {
  fetchTasks.mockResolvedValue([{ id: 1, title: 'Test task', completed: false }])
  deleteTask.mockResolvedValue({})

  render(<App />)
  const deleteButton = await screen.findByText(/eliminar/i)
  fireEvent.click(deleteButton)

  const confirmButton = document.querySelector('.btn-confirm')
  fireEvent.click(confirmButton)

  await waitFor(() => {
    expect(deleteTask).toHaveBeenCalledWith(1)
  })

  await waitFor(() => {
    expect(screen.queryByText('Test task')).not.toBeInTheDocument()
  })
})
