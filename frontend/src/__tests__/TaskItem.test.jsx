import { render, screen, fireEvent } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import TaskItem from '../components/TaskItem'

const mockTask = {
  id: 1,
  title: 'Test task',
  completed: false
}

function renderWithDndContext(ui) {
  return render(
    <DndContext>
      <SortableContext items={[mockTask.id]}>
        {ui}
      </SortableContext>
    </DndContext>
  )
}

test('renders task with title', () => {
  renderWithDndContext(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  expect(screen.getByText('Test task')).toBeInTheDocument()
})

test('shows checked checkbox when task is completed', () => {
  const completedTask = { ...mockTask, completed: true }
  renderWithDndContext(<TaskItem task={completedTask} onToggle={() => {}} onDelete={() => {}} />)

  const checkbox = screen.getByRole('checkbox')
  expect(checkbox).toBeChecked()
})

test('calls onToggle when checkbox is clicked', () => {
  const mockToggle = vi.fn()
  renderWithDndContext(<TaskItem task={mockTask} onToggle={mockToggle} onDelete={() => {}} />)

  fireEvent.click(screen.getByRole('checkbox'))
  expect(mockToggle).toHaveBeenCalledWith(1)
})

test('calls onDelete when delete button is clicked', () => {
  const mockDelete = vi.fn()
  const { container } = renderWithDndContext(<TaskItem task={mockTask} onToggle={() => {}} onDelete={mockDelete} />)

  fireEvent.click(container.querySelector('.btn-delete'))
  expect(mockDelete).toHaveBeenCalledWith(1)
})

test('renders the drag handle', () => {
  renderWithDndContext(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />)
  expect(screen.getByText('☰')).toBeInTheDocument()
})
