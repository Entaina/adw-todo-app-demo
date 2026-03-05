# Diálogo de Confirmación al Borrar Tarea

**ADW ID:** 65fabbc3
**Fecha:** 2026-03-05
**Especificación:** /Users/elafo/workspace/entaina/aurgi-curso-desarrolladores-sample-app/trees/issue-52/.issues/52/plan.md

## Overview

Se implementó un modal de confirmación reutilizable que aparece antes de eliminar una tarea en la aplicación Todo List. Esto evita borrados accidentales al requerir una confirmación explícita del usuario antes de eliminar permanentemente una tarea.

## Qué se Construyó

- Componente reutilizable `ConfirmDialog` con diseño modal centrado
- Integración del diálogo de confirmación en el componente `TaskItem`
- Estilos CSS para el overlay y modal con diseño consistente
- Tests unitarios completos para el nuevo componente y el flujo de confirmación
- Gestión de estado local con React hooks para controlar la visibilidad del modal

## Implementación Técnica

### Ficheros Modificados

- `frontend/src/components/ConfirmDialog.jsx`: Nuevo componente modal reutilizable que renderiza condicionalmente un overlay con mensaje de confirmación, título personalizable y botones de acción (Cancelar/Eliminar).
- `frontend/src/components/TaskItem.jsx`: Integrado el estado local `showConfirmDialog` con `useState`, modificado el botón "Eliminar" para abrir el diálogo en lugar de eliminar directamente, y añadido el componente `ConfirmDialog` con las props necesarias.
- `frontend/src/index.css`: Añadidos 57 líneas de estilos CSS para el overlay modal (`.modal-overlay`), el contenedor del modal (`.modal`), título y mensaje (`.modal-title`, `.modal-message`), contenedor de botones (`.modal-actions`) y botón de cancelar (`.btn-cancel`).
- `frontend/src/__tests__/ConfirmDialog.test.jsx`: Nueva suite de tests con 5 casos de prueba cubriendo renderizado condicional, callbacks de botones y clic en overlay.
- `frontend/src/__tests__/TaskItem.test.jsx`: Actualizados tests existentes y añadidos 3 nuevos tests para verificar el flujo completo de confirmación (abrir diálogo, cancelar, confirmar eliminación).
- `frontend/package.json`: Añadida dependencia `@testing-library/user-event` (v14.6.1) para mejorar la interacción en los tests.

### Cambios Clave

1. **Componente Modal Genérico**: `ConfirmDialog` está diseñado como un componente reutilizable que puede ser usado en cualquier parte de la aplicación que requiera confirmación del usuario. Recibe props para personalizar título, mensaje y callbacks.

2. **Gestión de Estado Local**: Se usa `useState` en `TaskItem` para controlar la visibilidad del modal, manteniendo la lógica encapsulada dentro del componente que la necesita sin elevar innecesariamente el estado al padre.

3. **Patrón de Overlay con Portal Implícito**: El modal usa un overlay de posición fija con `z-index: 1000` que cubre toda la pantalla. El clic en el overlay cierra el modal (llama a `onCancel`), mientras que `e.stopPropagation()` en el modal interno evita que los clics dentro del modal cierren el diálogo.

4. **Flujo de Confirmación de Dos Pasos**: El botón "Eliminar" ahora solo abre el modal (`setShowConfirmDialog(true)`). El botón "Eliminar" dentro del modal ejecuta `onDelete(task.id)` y luego cierra el modal.

5. **Diseño Consistente**: Los estilos del modal siguen la paleta de colores y diseño del resto de la aplicación (border-radius, shadows, transiciones, colores de botones).

## Cómo Usar

### Para Usuarios Finales

1. Navega a la lista de tareas en la aplicación
2. Haz clic en el botón "Eliminar" de cualquier tarea
3. Aparecerá un modal de confirmación mostrando: "¿Estás seguro de que quieres eliminar '[título de la tarea]'?"
4. Opciones disponibles:
   - **Cancelar**: Cierra el modal sin eliminar la tarea
   - **Eliminar**: Confirma la eliminación y borra la tarea permanentemente
   - **Clic en el fondo oscuro**: Cierra el modal sin eliminar (equivalente a Cancelar)

### Para Desarrolladores

Reutilizar el componente `ConfirmDialog` en otros lugares:

```jsx
import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

function MyComponent() {
  const [showDialog, setShowDialog] = useState(false)

  const handleAction = () => {
    // Tu lógica aquí
    setShowDialog(false)
  }

  return (
    <>
      <button onClick={() => setShowDialog(true)}>Acción Peligrosa</button>
      <ConfirmDialog
        isOpen={showDialog}
        title="Confirmar acción"
        message="¿Estás seguro de que quieres realizar esta acción?"
        onConfirm={handleAction}
        onCancel={() => setShowDialog(false)}
      />
    </>
  )
}
```

## Configuración

No se requiere configuración adicional. El componente funciona out-of-the-box después de:

```bash
cd frontend
npm install  # Instala @testing-library/user-event si es necesario
```

## Testing

### Ejecutar Tests

```bash
cd frontend
npm test
```

### Cobertura de Tests

**ConfirmDialog.test.jsx** (5 tests):
- No renderiza cuando `isOpen` es `false`
- Renderiza título y mensaje cuando `isOpen` es `true`
- Llama a `onCancel` al hacer clic en "Cancelar"
- Llama a `onConfirm` al hacer clic en "Eliminar"
- Llama a `onCancel` al hacer clic en el overlay

**TaskItem.test.jsx** (tests actualizados):
- Muestra el diálogo de confirmación al hacer clic en "Eliminar"
- No llama a `onDelete` si se cancela el diálogo
- Llama a `onDelete` si se confirma la eliminación en el diálogo
- Tests existentes de drag-and-drop y toggle siguen pasando

## Notas

- **Accesibilidad**: Futura mejora podría incluir soporte de teclado (cerrar con ESC, focus trap dentro del modal, atributos ARIA).
- **Animaciones**: Se podría añadir transiciones de entrada/salida del modal usando CSS transitions o librerías como Framer Motion.
- **Reutilización**: El componente `ConfirmDialog` está preparado para ser usado en otras partes de la aplicación (ej: confirmar logout, borrar múltiples items, descartar cambios no guardados).
- **Sin Dependencias Externas**: La implementación usa React puro sin librerías de modal adicionales, manteniendo el bundle pequeño.
- **Criterios de Aceptación**: Todos los criterios definidos en el plan se cumplieron exitosamente, incluyendo tests completos y regresiones prevenidas.
