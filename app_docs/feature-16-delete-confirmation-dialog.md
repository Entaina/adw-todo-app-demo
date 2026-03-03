# Diálogo de Confirmación al Borrar Tarea

**ADW ID:** 16
**Fecha:** 2026-03-03
**Especificación:** .issues/16/plan.md

## Overview

Se implementó un diálogo de confirmación modal que aparece antes de eliminar una tarea. Esto previene eliminaciones accidentales y mejora la experiencia de usuario al ofrecer la opción de cancelar la acción antes de que sea irreversible.

## Qué se Construyó

- Componente reutilizable `ConfirmDialog` para mostrar diálogos de confirmación modales
- Integración del diálogo en el componente `TaskItem` para confirmar eliminaciones
- Estilos CSS para el overlay y el diálogo modal
- Tests unitarios completos para el nuevo componente y el flujo actualizado

## Implementación Técnica

### Ficheros Modificados

- `frontend/src/components/ConfirmDialog.jsx`: Nuevo componente modal reutilizable con soporte para título, mensaje y callbacks de confirmación/cancelación
- `frontend/src/components/TaskItem.jsx`: Añadida gestión de estado local para controlar visibilidad del diálogo y flujo de confirmación antes de eliminar
- `frontend/src/index.css`: Añadidos estilos CSS para `.confirm-overlay`, `.confirm-dialog`, `.confirm-title`, `.confirm-message`, `.confirm-actions` y `.btn-cancel`
- `frontend/src/__tests__/ConfirmDialog.test.jsx`: Suite completa de tests para el componente `ConfirmDialog`
- `frontend/src/__tests__/TaskItem.test.jsx`: Actualizados tests existentes y añadidos nuevos tests para verificar el flujo de confirmación

### Cambios Clave

1. **Componente ConfirmDialog**: Componente modal reutilizable que renderiza condicionalmente basado en prop `isOpen`. Incluye overlay semitransparente, caja de diálogo centrada, título, mensaje y botones de acción. Soporta cierre al hacer clic en el overlay.

2. **Integración en TaskItem**: Se añadió estado local `showConfirm` usando `useState` para controlar la visibilidad del diálogo. El botón "Eliminar" ahora abre el diálogo en lugar de llamar directamente a `onDelete`. La eliminación solo ocurre cuando el usuario confirma en el diálogo.

3. **Estilos CSS**: Modal con overlay `position: fixed` y `z-index: 1000`, diseño responsive con `max-width: 400px`, estilos flexbox para los botones de acción, y estilos hover para mejor feedback visual.

4. **Tests Completos**: Tests para renderizado condicional del diálogo, verificación de callbacks, tests para ambos botones (Cancelar/Eliminar), y tests para cierre al hacer clic en el overlay. Tests actualizados en TaskItem verifican el flujo completo: abrir diálogo → confirmar → eliminar.

## Cómo Usar

1. Al hacer clic en el botón "Eliminar" de una tarea, aparece un diálogo de confirmación modal
2. El diálogo muestra el título de la tarea que se va a eliminar: "¿Estás seguro de que quieres eliminar "[título de la tarea]"?"
3. El usuario tiene tres opciones:
   - Hacer clic en "Cancelar" para cerrar el diálogo sin eliminar la tarea
   - Hacer clic en "Eliminar" para confirmar y eliminar la tarea
   - Hacer clic fuera del diálogo (en el overlay oscuro) para cerrar sin eliminar

## Configuración

No requiere configuración adicional. El componente funciona out-of-the-box sin dependencias externas.

## Testing

### Ejecutar Tests

```bash
cd frontend && npm test
```

### Cobertura de Tests

- **ConfirmDialog**: 5 tests que verifican renderizado condicional, renderizado de título y mensaje, callbacks de botones, y cierre al hacer clic en overlay
- **TaskItem**: 3 tests que verifican el flujo completo de confirmación, cancelación sin eliminar, y visualización del título de la tarea en el diálogo

## Notas

- El componente `ConfirmDialog` está diseñado como reutilizable y puede usarse en otras partes de la aplicación para confirmaciones futuras
- No se añadieron dependencias externas; el modal está implementado con CSS puro y React hooks nativos
- El componente usa `position: fixed` con `z-index: 1000` para garantizar que siempre aparezca sobre otros elementos
- Se podría considerar en el futuro añadir soporte para la tecla Escape para cerrar el diálogo, pero no es parte de esta implementación inicial
- La funcionalidad de arrastrar y soltar (drag-and-drop) no se ve afectada por esta implementación
