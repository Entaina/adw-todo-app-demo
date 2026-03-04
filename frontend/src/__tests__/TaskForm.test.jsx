import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TaskForm from '../components/TaskForm'

test('renders input and button', () => {
  render(<TaskForm onTaskCreated={() => {}} />)
  expect(screen.getByPlaceholderText(/nueva tarea/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /añadir/i })).toBeInTheDocument()
})

test('renders date input', () => {
  render(<TaskForm onTaskCreated={() => {}} />)
  const dateInput = screen.getByLabelText(/fecha límite/i)
  expect(dateInput).toBeInTheDocument()
  expect(dateInput).toHaveAttribute('type', 'date')
})

test('calls onTaskCreated with title and deadline when form is submitted', async () => {
  const mockCreate = vi.fn().mockResolvedValue()
  render(<TaskForm onTaskCreated={mockCreate} />)

  const input = screen.getByPlaceholderText(/nueva tarea/i)
  const dateInput = screen.getByLabelText(/fecha límite/i)

  fireEvent.change(input, { target: { value: 'Test task' } })
  fireEvent.change(dateInput, { target: { value: '2026-12-31' } })
  fireEvent.submit(screen.getByRole('button'))

  await waitFor(() => {
    expect(mockCreate).toHaveBeenCalledWith({ title: 'Test task', deadline: '2026-12-31' })
  })
})

test('calls onTaskCreated with null deadline when not provided', async () => {
  const mockCreate = vi.fn().mockResolvedValue()
  render(<TaskForm onTaskCreated={mockCreate} />)

  const input = screen.getByPlaceholderText(/nueva tarea/i)
  fireEvent.change(input, { target: { value: 'Test task' } })
  fireEvent.submit(screen.getByRole('button'))

  await waitFor(() => {
    expect(mockCreate).toHaveBeenCalledWith({ title: 'Test task', deadline: null })
  })
})

test('clears input after submission', async () => {
  const mockCreate = vi.fn().mockResolvedValue()
  render(<TaskForm onTaskCreated={mockCreate} />)

  const input = screen.getByPlaceholderText(/nueva tarea/i)
  const dateInput = screen.getByLabelText(/fecha límite/i)

  fireEvent.change(input, { target: { value: 'Test task' } })
  fireEvent.change(dateInput, { target: { value: '2026-12-31' } })
  fireEvent.submit(screen.getByRole('button'))

  await waitFor(() => {
    expect(input.value).toBe('')
    expect(dateInput.value).toBe('')
  })
})
