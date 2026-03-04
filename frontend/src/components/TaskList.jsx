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

  // Separar tareas pendientes y completadas
  const pendingTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    // Solo permitir reordenar entre tareas pendientes
    const oldIndex = pendingTasks.findIndex(t => t.id === active.id)
    const newIndex = pendingTasks.findIndex(t => t.id === over.id)
    const newPendingTasks = arrayMove(pendingTasks, oldIndex, newIndex)

    // Combinar el nuevo orden de pendientes con las completadas
    const allTaskIds = [...newPendingTasks.map(t => t.id), ...completedTasks.map(t => t.id)]
    onReorder(allTaskIds)
  }

  return (
    <div>
      {/* Seccion de tareas pendientes */}
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

      {/* Seccion de tareas completadas */}
      {completedTasks.length > 0 && (
        <div className="completed-section">
          <h3 className="section-header">Completadas</h3>
          <div className="task-list">
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList
