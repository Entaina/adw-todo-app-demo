# Patch: Tarea desmarcada va al final de pendientes

## Metadata
adw_id: `a7fedf75`
review_change_request: `Cuando una tarea se marca como no completada, debería ir al final de la lista`

## Issue Summary
**Plan original:** .issues/8/plan.md
**Problema:** Cuando una tarea completada se desmarca (toggle de completada a pendiente), mantiene su posición original en el array en lugar de moverse al final de las tareas pendientes.
**Solución:** Modificar `handleToggleTask` en `App.jsx` para reordenar el array cuando una tarea pasa de `completed: true` a `completed: false`, colocándola al final de las tareas pendientes.

## Files to Modify
Usa estos ficheros para implementar el patch:

- `frontend/src/App.jsx` - Modificar `handleToggleTask` para reordenar tareas al desmarcar

## Implementation Steps
IMPORTANTE: Ejecutar cada paso en orden, de arriba a abajo.

### Step 1: Modificar handleToggleTask en App.jsx
- Detectar cuando una tarea pasa de `completed: true` a `completed: false`
- En ese caso, mover la tarea al final de las tareas pendientes (justo antes de las completadas)
- Mantener el comportamiento actual para cuando una tarea se marca como completada
- Implementación:
  ```javascript
  const handleToggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    const newCompleted = !task.completed

    if (task.completed && !newCompleted) {
      // Tarea se desmarca: moverla al final de las pendientes
      const otherTasks = tasks.filter(t => t.id !== id)
      const pendingTasks = otherTasks.filter(t => !t.completed)
      const completedTasks = otherTasks.filter(t => t.completed)
      const updatedTask = { ...task, completed: newCompleted }
      setTasks([...pendingTasks, updatedTask, ...completedTasks])
    } else {
      // Comportamiento normal para marcar como completada
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: newCompleted } : t))
    }

    await updateTask(id, { completed: newCompleted })
  }
  ```

### Step 2: Verificar que el comportamiento de marcar como completada no cambia
- Cuando una tarea pendiente se marca como completada, debe mantener el comportamiento actual
- La tarea simplemente cambia su estado `completed` a `true` y el componente `TaskList` la renderiza en la sección de completadas

## Validation
Ejecutar cada comando para validar que el patch esta completo sin regresiones.

- `cd frontend && npm test` - Ejecuta los tests del frontend para validar que no hay regresiones
- `cd backend && bin/rails test` - Ejecuta los tests del backend para validar integridad general

## Patch Scope
**Lineas de codigo a cambiar:** ~10-15
**Nivel de riesgo:** low
**Testing requerido:** Verificar manualmente que al desmarcar una tarea completada, esta aparece al final de la lista de pendientes
