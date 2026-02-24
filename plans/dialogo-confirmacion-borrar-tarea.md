# Feature: Diálogo de Confirmación al Borrar Tarea

## Descripción de la Funcionalidad
Implementar un diálogo de confirmación que se muestre cuando el usuario intente eliminar una tarea. Este diálogo pedirá confirmación explícita antes de ejecutar la eliminación, previniendo borrados accidentales de tareas importantes. El diálogo mostrará el título de la tarea a eliminar y ofrecerá opciones para confirmar o cancelar la acción.

## Historia de Usuario
Como usuario de la aplicación Todo List
Quiero recibir una confirmación antes de borrar una tarea
Para que evite eliminar tareas por error y pueda cancelar si cambio de opinión

## Planteamiento del Problema
Actualmente, cuando un usuario hace clic en el botón "Eliminar" de una tarea, esta se borra inmediatamente sin ninguna confirmación. Esto puede resultar en pérdida accidental de datos cuando:
- El usuario hace clic en el botón por error
- El usuario quiere eliminar una tarea diferente
- El usuario cambia de opinión justo después de hacer clic

Esta falta de confirmación es especialmente problemática en aplicaciones de productividad donde las tareas pueden contener información importante o representar trabajo significativo.

## Propuesta de Solución
Crear un componente modal de confirmación (`ConfirmDialog.jsx`) reutilizable que:
1. Se muestre cuando el usuario intente eliminar una tarea
2. Muestre el título de la tarea que se va a eliminar
3. Ofrezca botones de "Confirmar" y "Cancelar"
4. Prevenga interacciones con el resto de la aplicación mientras esté abierto (modal backdrop)
5. Se cierre al confirmar o cancelar la acción

El componente será genérico y reutilizable para futuras confirmaciones en la aplicación.

## Archivos Relevantes
Usa estos ficheros para implementar la funcionalidad:

- **frontend/src/App.jsx** - Componente principal que gestiona el estado de las tareas y maneja la lógica de eliminación. Aquí añadiremos el estado del diálogo de confirmación y la lógica para mostrar/ocultar el modal antes de ejecutar `handleDeleteTask`.

- **frontend/src/components/TaskItem.jsx** - Componente que renderiza cada tarea individual con el botón "Eliminar". Actualmente llama directamente a `onDelete(task.id)` cuando se hace clic en el botón.

- **frontend/src/components/TaskList.jsx** - Componente que renderiza la lista de tareas y pasa las props `onDelete`, `onToggle` y `onReorder` a cada `TaskItem`.

- **frontend/src/index.css** - Estilos globales de la aplicación. Aquí añadiremos los estilos para el modal de confirmación (backdrop, contenedor del diálogo, botones).

- **frontend/src/__tests__/App.test.jsx** - Tests del componente App. Añadiremos tests para verificar que el diálogo de confirmación se muestra correctamente y que la eliminación requiere confirmación.

- **frontend/src/__tests__/TaskItem.test.jsx** - Tests del componente TaskItem. Actualizaremos los tests existentes si es necesario para reflejar el nuevo comportamiento.

### Ficheros Nuevos

- **frontend/src/components/ConfirmDialog.jsx** - Nuevo componente modal reutilizable que muestra el diálogo de confirmación. Recibe props como `isOpen`, `title`, `message`, `onConfirm`, `onCancel`, `confirmText`, `cancelText`.

- **frontend/src/__tests__/ConfirmDialog.test.jsx** - Tests unitarios para el componente ConfirmDialog, verificando renderizado condicional, callbacks, accesibilidad y estilos del modal.

## Plan de Implementación
### Fase 1: Fundamentos
Crear el componente modal `ConfirmDialog` reutilizable con su estructura básica, props, y estilos. Este componente servirá como base para cualquier confirmación futura en la aplicación. Incluir tests unitarios que verifiquen renderizado condicional, callbacks y accesibilidad.

### Fase 2: Implementación Principal
Integrar el `ConfirmDialog` en el componente `App.jsx` para gestionar el flujo de confirmación de eliminación. Añadir estado para controlar la visibilidad del diálogo y la tarea pendiente de eliminación. Modificar `handleDeleteTask` para mostrar el diálogo primero y ejecutar la eliminación solo tras confirmación.

### Fase 3: Integración
Actualizar los tests de integración en `App.test.jsx` y `TaskItem.test.jsx` para verificar que el flujo completo de eliminación con confirmación funciona correctamente. Verificar que la cancelación del diálogo no elimina la tarea y que la confirmación sí ejecuta la eliminación.

## Tareas Paso a Paso
IMPORTANTE: Ejecuta cada paso en orden, de arriba a abajo.

### 1. Crear el componente ConfirmDialog
- Crear `frontend/src/components/ConfirmDialog.jsx` con estructura modal básica
- El componente debe aceptar props: `isOpen`, `title`, `message`, `onConfirm`, `onCancel`, `confirmText`, `cancelText`
- Implementar renderizado condicional basado en `isOpen`
- Incluir backdrop oscuro que cubre toda la pantalla cuando está abierto
- Incluir contenedor centrado del diálogo con título, mensaje y botones
- Usar `confirmText` y `cancelText` con valores por defecto ("Confirmar", "Cancelar")
- Llamar a `onConfirm` cuando se hace clic en el botón de confirmar
- Llamar a `onCancel` cuando se hace clic en el botón de cancelar o en el backdrop

### 2. Añadir estilos CSS para el modal de confirmación
- Abrir `frontend/src/index.css`
- Añadir estilos para `.confirm-dialog-backdrop` (fondo semitransparente oscuro, z-index alto, posición fija cubriendo toda la ventana)
- Añadir estilos para `.confirm-dialog` (contenedor centrado, fondo blanco, padding, border-radius, sombra)
- Añadir estilos para `.confirm-dialog-title` (encabezado del diálogo, margen inferior)
- Añadir estilos para `.confirm-dialog-message` (texto del mensaje, margen inferior)
- Añadir estilos para `.confirm-dialog-actions` (contenedor de botones con flexbox, justificados a la derecha, gap entre botones)
- Añadir estilos para `.btn-confirm` (botón de confirmación con color de advertencia, ej: rojo)
- Añadir estilos para `.btn-cancel` (botón de cancelar con color neutral, ej: gris)

### 3. Crear tests unitarios para ConfirmDialog
- Crear `frontend/src/__tests__/ConfirmDialog.test.jsx`
- Test: no renderiza nada cuando `isOpen` es `false`
- Test: renderiza el diálogo cuando `isOpen` es `true`
- Test: muestra el título y mensaje correctos
- Test: llama a `onConfirm` cuando se hace clic en el botón de confirmar
- Test: llama a `onCancel` cuando se hace clic en el botón de cancelar
- Test: llama a `onCancel` cuando se hace clic en el backdrop
- Test: muestra textos de botones personalizados cuando se pasan como props
- Test: usa textos por defecto cuando no se pasan `confirmText` y `cancelText`

### 4. Integrar ConfirmDialog en App.jsx
- Importar `ConfirmDialog` en `frontend/src/App.jsx`
- Añadir estado `confirmDialogOpen` (boolean) inicializado en `false`
- Añadir estado `taskToDelete` (number | null) inicializado en `null` para guardar el ID de la tarea pendiente de eliminación
- Modificar `handleDeleteTask` para que en lugar de eliminar directamente:
  - Guarde el ID de la tarea en `taskToDelete`
  - Establezca `confirmDialogOpen` a `true`
- Crear función `handleConfirmDelete` que:
  - Ejecute la eliminación usando el ID guardado en `taskToDelete`
  - Cierre el diálogo y limpie el estado
- Crear función `handleCancelDelete` que:
  - Cierre el diálogo y limpie el estado sin eliminar
- Renderizar `<ConfirmDialog>` en el JSX de `App` con las props apropiadas:
  - `isOpen={confirmDialogOpen}`
  - `title="Confirmar eliminación"`
  - `message={`¿Estás seguro de que quieres eliminar la tarea "${taskToDelete ? tasks.find(t => t.id === taskToDelete)?.title : ''}"?`}`
  - `onConfirm={handleConfirmDelete}`
  - `onCancel={handleCancelDelete}`
  - `confirmText="Eliminar"`
  - `cancelText="Cancelar"`

### 5. Actualizar tests de integración
- Actualizar `frontend/src/__tests__/App.test.jsx` para importar `deleteTask` del mock
- Añadir test: "muestra diálogo de confirmación al hacer clic en eliminar"
  - Renderizar App con una tarea
  - Hacer clic en el botón "Eliminar"
  - Verificar que aparece el diálogo de confirmación con el mensaje correcto
- Añadir test: "no elimina la tarea si se cancela la confirmación"
  - Renderizar App con una tarea
  - Hacer clic en el botón "Eliminar"
  - Hacer clic en "Cancelar" en el diálogo
  - Verificar que `deleteTask` NO fue llamado
  - Verificar que la tarea sigue visible en la lista
- Añadir test: "elimina la tarea si se confirma"
  - Renderizar App con una tarea
  - Hacer clic en el botón "Eliminar"
  - Hacer clic en "Eliminar" en el diálogo de confirmación
  - Verificar que `deleteTask` fue llamado con el ID correcto
  - Verificar que la tarea desaparece de la lista

### 6. Ejecutar Comandos de Validación
- Ejecutar todos los comandos listados en la sección "Comandos de Validación"
- Verificar que todos los tests pasan sin errores
- Verificar que no hay regresiones en funcionalidad existente

## Estrategia de Testing
### Tests Unitarios
**ConfirmDialog.test.jsx:**
- Renderizado condicional basado en `isOpen`
- Visualización correcta de título, mensaje y textos de botones
- Callbacks `onConfirm` y `onCancel` se ejecutan correctamente
- Click en backdrop llama a `onCancel`
- Valores por defecto para textos de botones

**TaskItem.test.jsx:**
- El test existente "calls onDelete when delete button is clicked" debe seguir pasando
- No se requieren cambios en TaskItem, solo verificar que los tests actuales siguen funcionando

### Tests de Integración
**App.test.jsx:**
- Flujo completo: click en eliminar → aparece diálogo → confirmar → tarea eliminada
- Flujo de cancelación: click en eliminar → aparece diálogo → cancelar → tarea NO eliminada
- Mensaje del diálogo muestra el título correcto de la tarea
- Estado del diálogo se limpia correctamente después de confirmar/cancelar

### Casos Límite
- Usuario hace clic en el backdrop (debe cancelar)
- Usuario intenta eliminar una tarea mientras el diálogo está abierto para otra tarea (el estado debe actualizarse correctamente)
- Tarea se elimina exitosamente y el diálogo se cierra
- Tarea NO se encuentra en la lista cuando se intenta confirmar eliminación (edge case poco probable pero debería manejarse con gracia)

## Criterios de Aceptación
1. Al hacer clic en el botón "Eliminar" de una tarea, se muestra un diálogo modal de confirmación
2. El diálogo muestra el título de la tarea que se va a eliminar en el mensaje de confirmación
3. El diálogo tiene dos botones: "Eliminar" (rojo/advertencia) y "Cancelar" (neutral)
4. Al hacer clic en "Cancelar" o en el backdrop, el diálogo se cierra sin eliminar la tarea
5. Al hacer clic en "Eliminar", la tarea se elimina y el diálogo se cierra
6. El backdrop previene interacciones con el resto de la aplicación mientras el diálogo está abierto
7. El componente ConfirmDialog es reutilizable y puede usarse para otras confirmaciones futuras
8. Todos los tests unitarios y de integración pasan sin errores
9. No hay regresiones en la funcionalidad existente (toggle, crear tareas, reordenar)
10. El diálogo es accesible (roles ARIA apropiados si es necesario para tests)

## Comandos de Validación
Ejecuta cada comando para validar que la funcionalidad funciona correctamente sin regresiones.

- `cd frontend && npm test` - Ejecuta los tests del frontend para validar que la funcionalidad funciona sin regresiones
- `cd backend && bin/rails test` - Ejecuta los tests del backend para validar que no hay regresiones (no debería haber cambios en backend)

## Notas
- Esta implementación es solo frontend, no requiere cambios en el backend
- El componente `ConfirmDialog` debe ser genérico y reutilizable para futuras confirmaciones (ej: confirmar marcar todas como completadas, confirmar limpiar tareas completadas, etc.)
- Considerar añadir animaciones CSS para la aparición/desaparición del modal en futuras mejoras
- Considerar añadir soporte para cerrar el diálogo con la tecla ESC en futuras mejoras
- La accesibilidad (keyboard navigation, focus management) puede mejorarse en iteraciones futuras si es necesario
