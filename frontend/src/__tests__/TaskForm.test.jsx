import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TaskForm from '../components/TaskForm'

test('renders input and button', () => {
  render(<TaskForm onTaskCreated={() => {}} />)
  expect(screen.getByPlaceholderText(/nueva tarea/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /añadir/i })).toBeInTheDocument()
})

test('calls onTaskCreated when form is submitted', async () => {
  const mockCreate = vi.fn().mockResolvedValue()
  render(<TaskForm onTaskCreated={mockCreate} />)

  const input = screen.getByPlaceholderText(/nueva tarea/i)
  fireEvent.change(input, { target: { value: 'Test task' } })
  fireEvent.submit(screen.getByRole('button'))

  await waitFor(() => {
    expect(mockCreate).toHaveBeenCalledWith('Test task')
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
