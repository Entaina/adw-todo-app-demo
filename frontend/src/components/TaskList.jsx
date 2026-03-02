import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { arrayMove } from '@dnd-kit/sortable'
import TaskItem from './TaskItem'

function TaskList({ tasks, onToggle, onDelete, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    }),
    useSensor(KeyboardSensor)
  )

  if (tasks.length === 0) {
    return <p className="empty-message">No hay tareas. ¡Crea una nueva!</p>
  }

  // Separar tareas en pendientes y completadas
  const pendingTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = tasks.findIndex(t => t.id === active.id)
    const newIndex = tasks.findIndex(t => t.id === over.id)
    const newTasks = arrayMove(tasks, oldIndex, newIndex)
    onReorder(newTasks.map(t => t.id))
  }

  return (
    <div>
      {/* Sección de tareas pendientes con drag-and-drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={pendingTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="task-list">
            {pendingTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Separador y sección de tareas completadas */}
      {completedTasks.length > 0 && (
        <>
          <div className="completed-section-separator">Completadas</div>
          <div className="completed-tasks-section task-list">
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                isInCompletedSection={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default TaskList
