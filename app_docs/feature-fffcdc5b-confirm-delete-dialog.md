# Dialog de Confirmación para Eliminar Tareas

**ADW ID:** fffcdc5b
**Fecha:** 2026-03-05
**Especificación:** /Users/elafo/workspace/entaina/aurgi-curso-desarrolladores-sample-app/trees/issue-48/.issues/48/plan.md

## Overview

Se implementó un dialog modal de confirmación que aparece antes de eliminar una tarea, previniendo borrados accidentales. El usuario debe confirmar explícitamente la eliminación, viendo el título de la tarea que está a punto de eliminar.

## Qué se Construyó

- **Componente ConfirmDialog reutilizable**: Modal genérico para confirmaciones con overlay, título, mensaje y botones Cancelar/Confirmar
- **Estado de gestión en App**: Lógica de estado para controlar qué tarea está pendiente de eliminación
- **Integración con TaskItem**: Flujo completo de confirmación al hacer clic en el botón Eliminar
- **Estilos CSS del modal**: Sistema de overlay y modal centrado con diseño consistente
- **Suite de tests completa**: Tests unitarios del ConfirmDialog y tests de integración del flujo de eliminación

## Implementación Técnica

### Ficheros Modificados

- `frontend/src/components/ConfirmDialog.jsx`: Nuevo componente modal reutilizable que recibe props para controlar visibilidad, contenido y callbacks
- `frontend/src/__tests__/ConfirmDialog.test.jsx`: Tests unitarios del componente con cobertura de renderizado condicional, callbacks y clic en overlay
- `frontend/src/App.jsx`: Añadido estado `taskToDelete` y funciones `handleRequestDelete`, `handleDeleteTask` modificada, y `handleCancelDelete`
- `frontend/src/__tests__/App.test.jsx`: Tests de integración del flujo completo de confirmación de eliminación
- `frontend/src/components/TaskItem.jsx`: Modificado `onDelete` para pasar el objeto task completo en lugar de solo el ID
- `frontend/src/__tests__/TaskItem.test.jsx`: Actualizado test de onDelete para esperar el objeto task completo
- `frontend/src/index.css`: Añadidos estilos para `.modal-overlay`, `.modal`, `.modal-title`, `.modal-message`, `.modal-actions`, y `.btn-cancel`
- `frontend/package.json`: Añadida dependencia de testing `@testing-library/user-event`

### Cambios Clave

1. **Arquitectura de confirmación**: En lugar de eliminar directamente, `TaskItem` llama a `handleRequestDelete` que guarda la tarea en estado y muestra el dialog
2. **Componente genérico**: `ConfirmDialog` es completamente reutilizable, aceptando título y mensaje personalizados vía props
3. **Gestión de estado centralizada**: Todo el estado del dialog se maneja en `App.jsx`, manteniendo el flujo unidireccional de datos
4. **Overlay interactivo**: El clic en el overlay (fuera del modal) cancela la operación sin eliminar
5. **Prevención de propagación**: El modal usa `stopPropagation` para evitar que clics en el contenido cierren el dialog

## Cómo Usar

### Para Usuarios Finales

1. Navega a la lista de tareas
2. Haz clic en el botón rojo "Eliminar" de cualquier tarea
3. Aparecerá un dialog mostrando: "¿Estás seguro de que quieres eliminar la tarea '[título de la tarea]'?"
4. Opciones:
   - Haz clic en "Cancelar" para cerrar el dialog sin eliminar
   - Haz clic en "Confirmar" para eliminar la tarea definitivamente
   - Haz clic fuera del modal (en el overlay oscuro) para cancelar

### Para Desarrolladores

Reutilizar el componente `ConfirmDialog` para otras confirmaciones:

```jsx
import ConfirmDialog from './components/ConfirmDialog'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Título del dialog"
      message="Mensaje de confirmación"
      onCancel={() => setIsOpen(false)}
      onConfirm={() => {
        // Ejecutar acción
        setIsOpen(false)
      }}
    />
  )
}
```

## Configuración

No requiere configuración adicional. El componente usa los estilos globales definidos en `frontend/src/index.css`.

## Testing

### Ejecutar Tests

```bash
cd frontend
npm test -- --run
```

### Cobertura de Tests

- **Tests unitarios de ConfirmDialog**:
  - No renderiza cuando `isOpen` es false
  - Renderiza título y mensaje cuando `isOpen` es true
  - Llama a `onCancel` al hacer clic en Cancelar
  - Llama a `onConfirm` al hacer clic en Confirmar
  - Llama a `onCancel` al hacer clic en el overlay

- **Tests de integración en App**:
  - Muestra el dialog al hacer clic en Eliminar
  - No elimina la tarea si se cancela el dialog
  - Elimina la tarea si se confirma el dialog

- **Tests actualizados de TaskItem**:
  - Verifica que `onDelete` recibe el objeto task completo

## Notas

- **Reutilizable**: El componente `ConfirmDialog` está diseñado para ser genérico y puede usarse para cualquier tipo de confirmación en el futuro (ej: confirmar edición masiva, limpiar tareas completadas, etc.)
- **Sin dependencias nuevas**: Implementado con React puro, solo se añadió `@testing-library/user-event` para testing
- **Consistencia visual**: Los estilos siguen la paleta de colores existente en la aplicación
- **Accesibilidad**: El overlay tiene z-index alto (1000) para garantizar que esté sobre todos los demás elementos
- **UX defensiva**: Múltiples formas de cancelar (botón Cancelar, clic en overlay) para prevenir eliminaciones no deseadas
