# Bug: El toggle de tarea completada no persiste al recargar la página

## Descripción del Bug
Al marcar una tarea como completada (o desmarcarla), el cambio se refleja visualmente en la interfaz de forma inmediata, pero al recargar la página la tarea vuelve a su estado anterior. El cambio no se persiste en la base de datos.

**Comportamiento esperado:** Al hacer toggle en el checkbox de una tarea, el estado `completed` se actualiza tanto en la UI como en el backend, y persiste al recargar la página.

**Comportamiento actual:** La UI se actualiza correctamente (optimistic update), pero la llamada a la API envía el valor original de `completed` en lugar del valor invertido, por lo que el backend no recibe el cambio real.

## Planteamiento del Problema
La función `handleToggleTask` en `App.jsx` envía el valor incorrecto al API. Envía `task.completed` (el valor original antes del toggle) en lugar de `!task.completed` (el valor invertido).

## Propuesta de Solución
Corregir la línea 27 de `App.jsx` para enviar `!task.completed` en la llamada a `updateTask`, de modo que el valor enviado al backend sea el valor invertido (el mismo que se muestra en la UI).

## Pasos para Reproducir
1. Abrir la aplicación en el navegador (http://localhost:5173)
2. Crear una tarea nueva o usar una existente
3. Hacer clic en el checkbox para marcar la tarea como completada
4. Verificar que visualmente aparece como completada
5. Recargar la página (F5)
6. Observar que la tarea vuelve a aparecer como no completada

## Análisis de Causa Raíz
En `frontend/src/App.jsx`, línea 24-28, la función `handleToggleTask`:

```javascript
const handleToggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    await updateTask(id, { completed: task.completed })  // BUG: envía el valor original
}
```

- Línea 25: Obtiene la referencia a la tarea con su estado actual (ej: `completed: false`)
- Línea 26: Actualiza la UI correctamente con `!t.completed` (cambia a `true` en la UI)
- Línea 27: **BUG** - Envía `task.completed` (el valor original `false`) al backend en vez de `!task.completed` (`true`)

El resultado es que el backend recibe `completed: false` cuando debería recibir `completed: true`, por lo que no se produce ningún cambio real en la base de datos.

## Archivos Relevantes
Usa estos ficheros para corregir el bug:

- **`frontend/src/App.jsx`** - Contiene la función `handleToggleTask` con el bug en la línea 27. Es el único fichero que necesita modificación.
- **`frontend/src/__tests__/App.test.jsx`** - Tests existentes del componente App. Necesita un nuevo test que valide que `updateTask` se llama con el valor invertido de `completed`.
- **`frontend/src/services/api.js`** - Servicio API con la función `updateTask`. No requiere cambios, pero es relevante para entender la interfaz.
- **`frontend/src/components/TaskItem.jsx`** - Componente que renderiza el checkbox. No requiere cambios.

## Tareas Paso a Paso
IMPORTANTE: Ejecuta cada paso en orden, de arriba a abajo.

### 1. Corregir el valor enviado en handleToggleTask
- En `frontend/src/App.jsx`, línea 27, cambiar `{ completed: task.completed }` por `{ completed: !task.completed }`
- El código corregido debe quedar:
  ```javascript
  const handleToggleTask = async (id) => {
      const task = tasks.find(t => t.id === id)
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
      await updateTask(id, { completed: !task.completed })
  }
  ```

### 2. Añadir test que valide el toggle en App.test.jsx
- En `frontend/src/__tests__/App.test.jsx`, añadir un test que:
  - Mockee `fetchTasks` para devolver una tarea con `completed: false`
  - Renderice `App` y espere a que carguen las tareas
  - Haga clic en el checkbox de la tarea
  - Verifique que `updateTask` fue llamado con el `id` correcto y `{ completed: true }`
- Añadir otro test análogo para el caso inverso (tarea `completed: true` → envía `{ completed: false }`)

### 3. Ejecutar los Comandos de Validación
- Ejecutar los tests del frontend para confirmar que el bug está corregido y no hay regresiones
- Ejecutar los tests del backend para confirmar que no hay regresiones

## Comandos de Validación
Ejecuta cada comando para validar que el bug está corregido sin regresiones.

- `cd frontend && npm test` - Ejecuta los tests del frontend para validar que el bug está corregido sin regresiones
- `cd backend && bin/rails test` - Ejecuta los tests del backend para validar que el bug está corregido sin regresiones

## Notas
- El bug es un error lógico clásico de "off-by-one" en el valor enviado al API. La UI usa `!t.completed` pero la llamada al API usa `task.completed` (sin negar).
- El backend (`Api::TasksController#update`) funciona correctamente — el problema es exclusivamente en el frontend.
- No se necesitan nuevas dependencias (ni gemas ni paquetes npm).
