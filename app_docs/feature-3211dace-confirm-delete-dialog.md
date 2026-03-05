# Diálogo de Confirmación para Eliminar Tareas

**ADW ID:** 3211dace
**Fecha:** 2026-03-05
**Especificación:** /Users/elafo/workspace/entaina/aurgi-curso-desarrolladores-sample-app/trees/issue-56/.issues/56/plan.md

## Overview

Se implementó un diálogo modal de confirmación que aparece antes de eliminar una tarea en la aplicación Todo List. Esto previene eliminaciones accidentales al requerir que el usuario confirme explícitamente la acción destructiva antes de proceder.

## Qué se Construyó

- Componente modal reutilizable `ConfirmDialog` para diálogos de confirmación genéricos
- Integración del modal en el componente `TaskItem` para confirmar eliminaciones
- Estilos CSS completos para el modal con overlay semitransparente
- Suite de tests unitarios para el nuevo componente
- Tests actualizados para validar el flujo de confirmación

## Implementación Técnica

### Ficheros Modificados

- `frontend/src/components/ConfirmDialog.jsx`: Nuevo componente modal reutilizable que acepta props para título, mensaje y callbacks de confirmación/cancelación. Se cierra al hacer clic en el overlay o en el botón de cancelar.
- `frontend/src/components/TaskItem.jsx`: Añadido estado local `showConfirmDialog` para controlar visibilidad del modal. El botón "Eliminar" ahora abre el modal en lugar de eliminar directamente.
- `frontend/src/index.css`: Añadidos estilos completos para `.confirm-overlay`, `.confirm-dialog`, `.confirm-dialog-title`, `.confirm-dialog-message`, `.confirm-dialog-buttons`, `.btn-cancel` y `.btn-danger`.
- `frontend/src/__tests__/ConfirmDialog.test.jsx`: Nueva suite de tests con 87 líneas cubriendo renderizado condicional, callbacks de botones y cierre por overlay.
- `frontend/src/__tests__/TaskItem.test.jsx`: Tests actualizados para verificar que la eliminación ahora requiere confirmación a través del modal.

### Cambios Clave

1. **Componente Modal Genérico**: `ConfirmDialog` es completamente reutilizable y puede usarse en cualquier parte de la aplicación donde se necesite confirmación de acciones destructivas. Acepta props para personalizar título, mensaje y comportamiento.

2. **Gestión de Estado Local**: Se usa `useState` en `TaskItem` para controlar la apertura/cierre del modal sin afectar el estado global de la aplicación.

3. **Cierre Múltiple del Modal**: El modal puede cerrarse de tres formas: clic en "Cancelar", clic en el overlay (fondo semitransparente), o confirmando la eliminación. Esto proporciona flexibilidad al usuario.

4. **Flujo de Eliminación Seguro**: La eliminación solo ocurre después de dos interacciones: clic en "Eliminar" + clic en "Eliminar" en el modal. Esto reduce drásticamente las eliminaciones accidentales.

5. **Estilos Consistentes**: Los estilos del modal mantienen la paleta de colores existente de la aplicación y usan clases reutilizables (`.btn`, `.btn-cancel`, `.btn-danger`).

## Cómo Usar

1. **Desde la Perspectiva del Usuario**:
   - Ve a la lista de tareas
   - Haz clic en el botón "Eliminar" de cualquier tarea
   - Aparecerá un modal preguntando: "¿Estás seguro de que quieres eliminar "[nombre de la tarea]"?"
   - Haz clic en "Cancelar" para cerrar el modal sin hacer cambios
   - Haz clic en "Eliminar" para confirmar y eliminar la tarea

2. **Desde la Perspectiva del Desarrollador** (reutilizar `ConfirmDialog`):
   ```jsx
   import ConfirmDialog from './ConfirmDialog'
   import { useState } from 'react'

   function MyComponent() {
     const [showDialog, setShowDialog] = useState(false)

     return (
       <>
         <button onClick={() => setShowDialog(true)}>
           Acción Peligrosa
         </button>
         <ConfirmDialog
           isOpen={showDialog}
           title="Título del Diálogo"
           message="¿Estás seguro de que quieres hacer esto?"
           onConfirm={() => {
             // Ejecutar acción destructiva aquí
             setShowDialog(false)
           }}
           onCancel={() => setShowDialog(false)}
         />
       </>
     )
   }
   ```

## Configuración

No se requiere configuración adicional. El componente funciona out-of-the-box sin dependencias externas, usando solo React puro y CSS.

## Testing

### Ejecutar Tests

```bash
cd frontend && npm test
```

### Cobertura de Tests

- **ConfirmDialog.test.jsx**:
  - Renderizado condicional (no renderiza cuando `isOpen` es false)
  - Renderiza título y mensaje cuando está abierto
  - Callbacks de botones (`onConfirm`, `onCancel`)
  - Cierre al hacer clic en el overlay

- **TaskItem.test.jsx**:
  - Verificación de que el clic en "Eliminar" abre el modal
  - Verificación de que confirmar en el modal llama a `onDelete`
  - Verificación de que cancelar el modal NO llama a `onDelete`

## Notas

- El componente `ConfirmDialog` está diseñado para ser completamente reutilizable en otras partes de la aplicación donde se necesite confirmación de acciones destructivas (por ejemplo, eliminar proyectos, limpiar datos, etc.)
- El modal tiene un `z-index` de 1000 para asegurar que aparezca sobre todo el contenido existente
- El overlay usa `rgba(0, 0, 0, 0.5)` para crear un fondo semitransparente que no bloquea completamente la vista de la interfaz subyacente
- No se implementó el cierre con la tecla ESC en esta iteración (podría añadirse como mejora futura)
- Los estilos están en `index.css` global; podría refactorizarse a CSS modules si se necesita mayor encapsulación
