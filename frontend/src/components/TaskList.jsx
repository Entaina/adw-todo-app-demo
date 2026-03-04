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

  // Separar tareas en pendientes y completadas
  const pendingTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  if (tasks.length === 0) {
    return <p className="empty-message">No hay tareas. ¡Crea una nueva!</p>
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    // Encontrar la tarea que se está moviendo
    const activeTask = tasks.find(t => t.id === active.id)
    const overTask = tasks.find(t => t.id === over.id)

    // Validar que ambas tareas existan
    if (!activeTask || !overTask) return

    // No permitir drag-and-drop entre grupos (pendientes y completadas)
    if (activeTask.completed !== overTask.completed) return

    const oldIndex = tasks.findIndex(t => t.id === active.id)
    const newIndex = tasks.findIndex(t => t.id === over.id)
    const newTasks = arrayMove(tasks, oldIndex, newIndex)
    onReorder(newTasks.map(t => t.id))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="task-list">
        {/* Sección de tareas pendientes */}
        {pendingTasks.length > 0 && (
          <SortableContext items={pendingTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="pending-tasks">
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
        )}

        {/* Separador visual cuando hay tareas completadas */}
        {completedTasks.length > 0 && (
          <div className="tasks-separator">
            <span>Tareas completadas</span>
          </div>
        )}

        {/* Sección de tareas completadas */}
        {completedTasks.length > 0 && (
          <SortableContext items={completedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="completed-tasks">
              {completedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </DndContext>
  )
}

export default TaskList
