import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

// Mock de @dnd-kit
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }) => <div>{children}</div>,
  closestCenter: vi.fn(),
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }) => <div>{children}</div>,
  verticalListSortingStrategy: vi.fn(),
  arrayMove: vi.fn(),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
  }),
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: () => undefined,
    },
  },
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

test('muestra el dialog al hacer clic en Eliminar', async () => {
  const user = userEvent.setup()
  fetchTasks.mockResolvedValue([{ id: 1, title: 'Task 1', completed: false }])

  render(<App />)

  await waitFor(() => {
    expect(screen.getByText('Task 1')).toBeInTheDocument()
  })

  const deleteButton = screen.getByRole('button', { name: /eliminar/i })
  await user.click(deleteButton)

  expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument()
  expect(screen.getByText('¿Estás seguro de que quieres eliminar la tarea "Task 1"?')).toBeInTheDocument()
})

test('no elimina la tarea si se cancela el dialog', async () => {
  const user = userEvent.setup()
  fetchTasks.mockResolvedValue([{ id: 1, title: 'Task 1', completed: false }])
  deleteTask.mockResolvedValue({})

  render(<App />)

  await waitFor(() => {
    expect(screen.getByText('Task 1')).toBeInTheDocument()
  })

  const deleteButton = screen.getByRole('button', { name: /eliminar/i })
  await user.click(deleteButton)

  const cancelButton = screen.getByRole('button', { name: /cancelar/i })
  await user.click(cancelButton)

  expect(deleteTask).not.toHaveBeenCalled()
  expect(screen.getByText('Task 1')).toBeInTheDocument()
  expect(screen.queryByText('Confirmar eliminación')).not.toBeInTheDocument()
})

test('elimina la tarea si se confirma el dialog', async () => {
  const user = userEvent.setup()
  fetchTasks.mockResolvedValue([{ id: 1, title: 'Task 1', completed: false }])
  deleteTask.mockResolvedValue({})

  render(<App />)

  await waitFor(() => {
    expect(screen.getByText('Task 1')).toBeInTheDocument()
  })

  const deleteButton = screen.getByRole('button', { name: /eliminar/i })
  await user.click(deleteButton)

  const confirmButton = screen.getByRole('button', { name: /confirmar/i })
  await user.click(confirmButton)

  expect(deleteTask).toHaveBeenCalledWith(1)
  await waitFor(() => {
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
  })
  expect(screen.queryByText('Confirmar eliminación')).not.toBeInTheDocument()
})
