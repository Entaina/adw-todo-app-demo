# Diálogo de Confirmación al Borrar Tarea

**ADW ID:** 2c14b714
**Fecha:** 2026-03-03
**Especificacion:** .issues/21/plan.md

## Overview

Se ha implementado un sistema de confirmación modal para prevenir el borrado accidental de tareas. Cuando un usuario intenta eliminar una tarea, aparece un diálogo de confirmación que muestra el título de la tarea y requiere confirmación explícita antes de proceder con la eliminación.

## Que se Construyo

- Componente `ConfirmDialog` reutilizable para diálogos de confirmación
- Integración del diálogo de confirmación en el componente `TaskItem`
- Estilos CSS para modal overlay y contenido del diálogo
- Suite completa de tests unitarios para el componente `ConfirmDialog`
- Tests de integración actualizados en `TaskItem` para validar el flujo de confirmación

## Implementacion Tecnica

### Ficheros Modificados

- `frontend/src/components/ConfirmDialog.jsx`: Nuevo componente modal reutilizable que acepta props `isOpen`, `title`, `message`, `onConfirm`, `onCancel`. Renderiza condicionalmente un overlay oscuro con contenido centrado.

- `frontend/src/components/TaskItem.jsx`: Añadido estado local `showConfirm` para controlar la visibilidad del diálogo. El botón "Eliminar" ahora abre el diálogo en lugar de eliminar directamente. Incluye el componente `ConfirmDialog` con handlers para confirmar y cancelar.

- `frontend/src/index.css`: Añadidos estilos para `.modal-overlay` (fondo semitransparente que cubre la pantalla), `.modal-content` (caja blanca centrada), `.modal-title`, `.modal-message`, `.modal-actions` (contenedor de botones), y `.btn-cancel` (botón de cancelar con estilo neutral).

- `frontend/src/__tests__/ConfirmDialog.test.jsx`: Nuevos tests unitarios que verifican renderizado condicional (no renderiza cuando `isOpen` es false), visualización correcta de título y mensaje, y callbacks de botones.

- `frontend/src/__tests__/TaskItem.test.jsx`: Actualizado el test "calls onDelete when delete button is clicked" para validar que: (1) al hacer clic en "Eliminar" se muestra el diálogo, (2) `onDelete` NO se llama inmediatamente, (3) el diálogo muestra el título y mensaje esperados, (4) `onDelete` se llama SOLO después de hacer clic en el botón de confirmar del diálogo.

- `package-lock.json`: Actualizaciones automáticas de dependencias transitivas.

### Cambios Clave

- **Patrón de Confirmación**: Se implementa un patrón de confirmación en dos pasos que requiere clic en "Eliminar" → visualización del diálogo → clic en "Eliminar" (confirmación) para completar la acción.

- **Componente Reutilizable**: El `ConfirmDialog` se diseñó genérico, aceptando cualquier título y mensaje, lo que permite reutilizarlo en otros contextos de confirmación en el futuro.

- **Estado Local**: Se usa `useState` en `TaskItem` para gestionar el estado del diálogo de forma independiente por cada tarea, evitando necesidad de elevar el estado a componentes padres.

- **UX Mejorada**: El overlay modal bloquea la interacción con elementos debajo (usando `z-index: 1000`) y permite cerrar el diálogo haciendo clic fuera del contenido del modal (en el overlay).

- **Tests Robustos**: Los tests verifican tanto el comportamiento del componente aislado (`ConfirmDialog`) como el flujo de integración completo en `TaskItem`, asegurando que no hay regresiones.

## Como Usar

1. **Eliminar una tarea**: Haz clic en el botón "Eliminar" de cualquier tarea en la lista.

2. **Revisar el diálogo**: Aparecerá un diálogo modal que muestra:
   - Título: "Eliminar tarea"
   - Mensaje: "¿Estás seguro de que deseas eliminar la tarea "{título de la tarea}"?"

3. **Confirmar eliminación**: Haz clic en el botón rojo "Eliminar" del diálogo para eliminar la tarea definitivamente.

4. **Cancelar eliminación**: Haz clic en el botón "Cancelar" o fuera del diálogo para cerrar el modal sin eliminar la tarea.

## Configuracion

No se requiere configuración adicional. El componente funciona automáticamente una vez implementado.

## Testing

### Ejecutar Tests

```bash
cd frontend && npm test
```

### Tests Incluidos

- **ConfirmDialog Tests**:
  - Verifica que no se renderiza cuando `isOpen` es false
  - Verifica que se renderiza correctamente cuando `isOpen` es true
  - Verifica que muestra título y mensaje correctos
  - Verifica que llama `onConfirm` al hacer clic en "Eliminar"
  - Verifica que llama `onCancel` al hacer clic en "Cancelar"

- **TaskItem Integration Tests**:
  - Verifica que el diálogo aparece al hacer clic en "Eliminar"
  - Verifica que `onDelete` NO se llama inmediatamente
  - Verifica que `onDelete` se llama SOLO tras confirmación
  - Verifica que el mensaje del diálogo incluye el título de la tarea

### Flujos de Usuario Testeados

- **Flujo de Confirmación**: Clic eliminar → diálogo visible → clic confirmar → tarea eliminada
- **Flujo de Cancelación**: Clic eliminar → diálogo visible → clic cancelar → tarea permanece

## Notas

- **Reutilizabilidad**: El componente `ConfirmDialog` está diseñado para ser reutilizado en otros contextos que requieran confirmación del usuario (ej: limpiar todas las tareas, restaurar valores por defecto, etc.).

- **Scope de Estado**: Se eligió usar estado local en `TaskItem` en lugar de estado global porque cada tarea gestiona su propio diálogo de confirmación de forma independiente, evitando complejidad innecesaria.

- **Sin Cambios Backend**: La funcionalidad es puramente frontend. El backend sigue recibiendo la misma llamada DELETE cuando el usuario confirma la eliminación.

- **Accesibilidad**: El diálogo usa semántica HTML estándar con botones apropiados. Para mejoras futuras se podría añadir manejo de tecla Escape y focus trap.

- **Estadísticas**: 145 líneas añadidas, 4 líneas eliminadas en 4 ficheros principales (excluyendo `package-lock.json`).
