# Diálogo de Confirmación para Eliminar Tareas

**ADW ID:** daaedbe6
**Fecha:** 2026-03-05
**Especificación:** /Users/elafo/workspace/entaina/aurgi-curso-desarrolladores-sample-app/trees/issue-70/.issues/70/plan.md

## Overview

Se implementó un diálogo de confirmación modal que aparece cuando el usuario intenta eliminar una tarea. Este feature previene eliminaciones accidentales al requerir que el usuario confirme explícitamente la acción de borrado antes de que la tarea se elimine permanentemente de la aplicación.

## Que se Construyó

- Componente reutilizable `ConfirmDialog` para mostrar diálogos de confirmación
- Integración del diálogo en el componente `TaskItem` para confirmar eliminaciones
- Estilos CSS para modal con overlay semitransparente y diseño centrado
- Tests unitarios completos para el nuevo componente y actualización de tests existentes
- Soporte de accesibilidad con tecla Escape y click fuera del modal

## Implementación Técnica

### Ficheros Modificados

- `frontend/src/components/ConfirmDialog.jsx`: Nuevo componente modal reutilizable con props para personalización de título, mensaje y textos de botones. Incluye manejo de eventos para tecla Escape y click en overlay.
- `frontend/src/components/TaskItem.jsx`: Añadido estado local `showConfirmDialog` para controlar visibilidad del modal. El botón "Eliminar" ahora abre el diálogo en lugar de eliminar directamente.
- `frontend/src/index.css`: Añadidos estilos para `.modal-overlay`, `.modal-dialog`, `.modal-title`, `.modal-message`, `.modal-actions` y `.btn-secondary`.
- `frontend/src/__tests__/ConfirmDialog.test.jsx`: Suite completa de tests para el componente ConfirmDialog (162 líneas).
- `frontend/src/__tests__/TaskItem.test.jsx`: Actualizados tests existentes para verificar el flujo de confirmación.

### Cambios Clave

1. **Componente ConfirmDialog Reutilizable**: Diseñado para ser utilizado en cualquier parte de la aplicación que requiera confirmación del usuario. Acepta props para personalizar título, mensaje y textos de botones.

2. **Gestión de Estado en TaskItem**: Se utiliza `useState` para controlar cuándo mostrar el diálogo. El estado se actualiza al hacer click en "Eliminar" y se resetea al confirmar o cancelar.

3. **Accesibilidad**: El componente implementa dos métodos de cierre: presionando Escape (usando `useEffect` con event listener) y haciendo click fuera del diálogo (verificando la clase del target del evento).

4. **Renderizado Condicional**: El diálogo solo se renderiza cuando `isOpen` es `true`, retornando `null` en caso contrario para optimizar performance.

5. **Estilos Modernos**: Modal centrado con overlay oscuro semitransparente (rgba 0.5), sombras para profundidad, y diseño responsivo con max-width de 400px.

## Como Usar

1. **Para el Usuario Final**:
   - Haz click en el botón "Eliminar" de cualquier tarea
   - Aparecerá un diálogo de confirmación preguntando "¿Estás seguro de que quieres eliminar esta tarea?"
   - Click en "Cancelar" para cerrar el diálogo sin eliminar la tarea
   - Click en "Eliminar" para confirmar y eliminar la tarea
   - Alternativamente, presiona la tecla Escape o haz click fuera del diálogo para cancelar

2. **Para Desarrolladores que Quieran Reutilizar el Componente**:
   ```jsx
   import ConfirmDialog from './components/ConfirmDialog'

   const [showDialog, setShowDialog] = useState(false)

   <ConfirmDialog
     isOpen={showDialog}
     title="Tu Título"
     message="Tu mensaje de confirmación"
     onConfirm={() => {
       // Lógica cuando se confirma
       setShowDialog(false)
     }}
     onCancel={() => setShowDialog(false)}
     confirmText="Sí" // Opcional, default "Confirmar"
     cancelText="No" // Opcional, default "Cancelar"
   />
   ```

## Configuración

No se requiere configuración adicional. El componente funciona out-of-the-box con las props proporcionadas.

**Props disponibles para ConfirmDialog**:
- `isOpen` (required): Boolean para controlar visibilidad
- `title` (required): String para el título del diálogo
- `message` (required): String para el mensaje de confirmación
- `onConfirm` (required): Callback cuando el usuario confirma
- `onCancel` (required): Callback cuando el usuario cancela
- `confirmText` (optional): Texto del botón de confirmar (default: "Confirmar")
- `cancelText` (optional): Texto del botón de cancelar (default: "Cancelar")

## Testing

**Tests para ConfirmDialog**:
- Renderiza título y mensaje correctamente
- No renderiza cuando `isOpen` es false
- Llama a `onConfirm` cuando se hace click en botón confirmar
- Llama a `onCancel` cuando se hace click en botón cancelar
- Llama a `onCancel` cuando se presiona tecla Escape
- Llama a `onCancel` cuando se hace click en overlay

**Tests actualizados para TaskItem**:
- Muestra el diálogo de confirmación al hacer click en "Eliminar"
- Llama a `onDelete` cuando se confirma en el diálogo
- No llama a `onDelete` cuando se cancela el diálogo
- Cierra el diálogo cuando se cancela

**Ejecutar tests**:
```bash
cd frontend && npm test
```

## Notas

- El componente `ConfirmDialog` está diseñado para ser completamente reutilizable. Puede usarse para confirmar cualquier acción destructiva en la aplicación (por ejemplo, cerrar sesión, descartar cambios, etc.)
- No se añadieron dependencias externas; el modal se implementa con React hooks y CSS puro para mantener el bundle ligero
- Se reutilizan clases CSS existentes (`.btn`, `.btn-delete`) para mantener consistencia visual con el resto de la aplicación
- El z-index del modal está configurado en 1000 para asegurar que aparezca por encima de otros elementos
- Los event listeners se limpian correctamente en el cleanup de `useEffect` para prevenir memory leaks
