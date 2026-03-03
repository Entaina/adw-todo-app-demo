import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TaskForm from '../components/TaskForm'

test('renders input and button', () => {
  render(<TaskForm onTaskCreated={() => {}} />)
  expect(screen.getByPlaceholderText(/nueva tarea/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /añadir/i })).toBeInTheDocument()
})

test('renders due date input', () => {
  render(<TaskForm onTaskCreated={() => {}} />)
  const dateInput = document.querySelector('input[type="datetime-local"]')
  expect(dateInput).toBeInTheDocument()
})

test('calls onTaskCreated when form is submitted', async () => {
  const mockCreate = vi.fn().mockResolvedValue()
  render(<TaskForm onTaskCreated={mockCreate} />)

  const input = screen.getByPlaceholderText(/nueva tarea/i)
  fireEvent.change(input, { target: { value: 'Test task' } })
  fireEvent.submit(screen.getByRole('button'))

  await waitFor(() => {
    expect(mockCreate).toHaveBeenCalledWith({ title: 'Test task' })
  })
})

test('clears input after submission', async () => {
  const mockCreate = vi.fn().mockResolvedValue()
  render(<TaskForm onTaskCreated={mockCreate} />)

  const input = screen.getByPlaceholderText(/nueva tarea/i)
  fireEvent.change(input, { target: { value: 'Test task' } })
  fireEvent.submit(screen.getByRole('button'))

  await waitFor(() => {
    expect(input.value).toBe('')
  })
})

test('calls onTaskCreated with due_at when date is provided', async () => {
  const mockCreate = vi.fn().mockResolvedValue()
  render(<TaskForm onTaskCreated={mockCreate} />)

  const input = screen.getByPlaceholderText(/nueva tarea/i)
  const dateInput = document.querySelector('input[type="datetime-local"]')

  fireEvent.change(input, { target: { value: 'Task with deadline' } })
  fireEvent.change(dateInput, { target: { value: '2026-12-31T23:59' } })
  fireEvent.submit(screen.getByRole('button'))

  await waitFor(() => {
    expect(mockCreate).toHaveBeenCalledWith({
      title: 'Task with deadline',
      due_at: '2026-12-31T23:59'
    })
  })
})

test('clears date input after submission', async () => {
  const mockCreate = vi.fn().mockResolvedValue()
  render(<TaskForm onTaskCreated={mockCreate} />)

  const input = screen.getByPlaceholderText(/nueva tarea/i)
  const dateInput = document.querySelector('input[type="datetime-local"]')

  fireEvent.change(input, { target: { value: 'Test task' } })
  fireEvent.change(dateInput, { target: { value: '2026-12-31T23:59' } })
  fireEvent.submit(screen.getByRole('button'))

  await waitFor(() => {
    expect(dateInput.value).toBe('')
  })
})
