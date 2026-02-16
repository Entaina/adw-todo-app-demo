# Bug: El toggle de completado no persiste al recargar

## Descripcion del Bug
Al marcar o desmarcar una tarea como completada, el cambio se refleja visualmente en la UI de forma inmediata (optimistic update), pero al recargar la pagina el estado vuelve al valor anterior. El cambio no se persiste en la base de datos.

**Comportamiento esperado:** Al hacer click en el checkbox de una tarea, el estado `completed` se actualiza tanto en la UI como en el backend, y al recargar la pagina el cambio se mantiene.

**Comportamiento actual:** El checkbox cambia visualmente, pero la API recibe el valor original (sin negar), por lo que la base de datos no se actualiza correctamente. Al recargar, se muestra el valor original de la BD.

## Planteamiento del Problema
La funcion `handleToggleTask` en `App.jsx` envia el valor **actual** de `task.completed` al backend en lugar del valor **negado** (`!task.completed`). Esto significa que si una tarea tiene `completed: false`, la UI muestra `true` (optimistic update) pero la API recibe `{ completed: false }`, dejando la BD sin cambios.

## Propuesta de Solucion
Corregir la linea 27 de `App.jsx` para enviar `!task.completed` en la llamada a `updateTask`, de modo que el valor enviado al backend coincida con el valor mostrado en la UI.

## Pasos para Reproducir
1. Abrir la aplicacion en `http://localhost:5173`
2. Observar una tarea no completada (checkbox desmarcado)
3. Hacer click en el checkbox para marcarla como completada
4. Verificar que visualmente el checkbox aparece marcado
5. Recargar la pagina (F5 o Ctrl+R)
6. Observar que el checkbox vuelve a estar desmarcado (el cambio no persistio)

## Analisis de Causa Raiz
En `frontend/src/App.jsx`, linea 24-28:

```javascript
const handleToggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    await updateTask(id, { completed: task.completed })  // BUG: envia el valor original
}
```

- Linea 25: `task` se obtiene del array `tasks`, con su valor **actual** de `completed` (ej: `false`)
- Linea 26: La UI se actualiza optimisticamente con `!t.completed` (ej: `true`) - CORRECTO
- Linea 27: La API recibe `task.completed` que es el valor **original** (`false`) en vez de `!task.completed` (`true`) - BUG

El error es que falta negar el valor en la llamada a la API: `task.completed` deberia ser `!task.completed`.

## Archivos Relevantes
Usa estos ficheros para corregir el bug:

- `frontend/src/App.jsx` - Contiene `handleToggleTask` con el bug en la linea 27. Es el unico fichero que necesita correccion.
- `frontend/src/__tests__/App.test.jsx` - Tests del componente App. Se anadira un test que valide que `updateTask` se llama con el valor negado.
- `frontend/src/services/api.js` - Servicio de API (no necesita cambios, solo referencia para entender la llamada `updateTask`).

## Tareas Paso a Paso
IMPORTANTE: Ejecuta cada paso en orden, de arriba a abajo.

### 1. Corregir el valor enviado a la API en handleToggleTask

- En `frontend/src/App.jsx`, linea 27, cambiar:
  ```javascript
  await updateTask(id, { completed: task.completed })
  ```
  por:
  ```javascript
  await updateTask(id, { completed: !task.completed })
  ```
- Este es el unico cambio necesario en el codigo de produccion.

### 2. Anadir test que valide el toggle de completado

- En `frontend/src/__tests__/App.test.jsx`, anadir un test que:
  1. Mockee `fetchTasks` para devolver una tarea con `completed: false`
  2. Renderice `<App />`
  3. Espere a que la tarea aparezca
  4. Haga click en el checkbox
  5. Verifique que `updateTask` fue llamado con el `id` correcto y `{ completed: true }`
- Este test asegura que la negacion se envia correctamente al backend y previene regresiones.

### 3. Ejecutar los comandos de validacion

- Ejecutar los tests del frontend para validar que el fix es correcto y no hay regresiones.
- Ejecutar los tests del backend para asegurar que no hay regresiones.

## Comandos de Validacion
Ejecuta cada comando para validar que el bug esta corregido sin regresiones.

- `cd backend && bin/rails test` - Ejecuta los tests del backend para validar que el bug esta corregido sin regresiones
- `cd frontend && npm test` - Ejecuta los tests del frontend para validar que el bug esta corregido sin regresiones

## Notas
- El bug es exclusivamente en el frontend. El backend (controller y modelo) funcionan correctamente: aceptan y persisten el valor `completed` que reciben.
- No se requieren gemas ni paquetes npm adicionales.
- La correccion es de una sola linea en produccion. El test adicional es para prevenir regresiones futuras.
