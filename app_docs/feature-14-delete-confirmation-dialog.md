# Diálogo de Confirmación para Eliminar Tareas

**ADW ID:** d36562e1
**Fecha:** 2026-03-03
**Especificación:** .issues/14/plan.md

## Overview

Se implementó un diálogo de confirmación modal que previene eliminaciones accidentales de tareas. Cuando el usuario hace clic en "Eliminar", aparece un diálogo que solicita confirmación explícita antes de ejecutar la acción destructiva, mejorando la experiencia de usuario y previniendo pérdida de datos.

## Qué se Construyó

- **Componente ConfirmDialog reutilizable**: Modal genérico para diálogos de confirmación con props configurables
- **Integración en TaskItem**: Flujo de confirmación antes de eliminar tareas, mostrando el título de la tarea en el mensaje
- **Estilos CSS personalizados**: Overlay semitransparente, diálogo centrado con diseño consistente con la aplicación
- **Suite de tests completa**: Tests unitarios para ConfirmDialog y tests de integración para el flujo completo en TaskItem

## Implementación Técnica

### Ficheros Modificados

- `frontend/src/components/ConfirmDialog.jsx` (nuevo): Componente modal reutilizable con props para título, mensaje, callbacks y textos de botones personalizables
- `frontend/src/components/TaskItem.jsx`: Añadido estado `showConfirmDialog` y renderizado condicional del diálogo, cambiado comportamiento del botón eliminar
- `frontend/src/index.css`: Añadidos estilos para `.confirm-dialog-overlay`, `.confirm-dialog`, `.confirm-dialog-title`, `.confirm-dialog-message`, `.confirm-dialog-actions`, `.btn-cancel`, `.btn-confirm-delete`
- `frontend/src/__tests__/ConfirmDialog.test.jsx` (nuevo): Tests unitarios del componente ConfirmDialog verificando renderizado condicional, callbacks y props personalizadas
- `frontend/src/__tests__/TaskItem.test.jsx`: Actualizados tests existentes y añadidos 4 nuevos tests para cubrir el flujo de confirmación

### Cambios Clave

1. **Componente ConfirmDialog**: Diseñado como componente controlado que recibe `isOpen` como prop. Renderiza `null` cuando está cerrado. Usa un overlay de posición fija (`z-index: 1000`) con flexbox para centrar el diálogo.

2. **Estado en TaskItem**: Añadido `useState` para controlar la visibilidad del diálogo. El botón "Eliminar" ahora abre el diálogo en lugar de ejecutar la eliminación directamente.

3. **Flujo de confirmación**: Al confirmar, se ejecuta `onDelete(task.id)` y se cierra el diálogo. Al cancelar, solo se cierra el diálogo sin ejecutar ninguna acción.

4. **Estilos consistentes**: Los estilos del diálogo siguen el sistema de diseño existente (bordes redondeados de 8px, colores de la paleta, sombras sutiles). El botón de confirmación usa el mismo color rojo (`#e74c3c`) que otros botones destructivos.

5. **Cobertura de tests**: 135 líneas añadidas en tests (+135, -2 líneas de modificación). Tests cubren renderizado condicional, callbacks, textos personalizados, y flujo completo de confirmación/cancelación.

## Cómo Usar

### Para Usuarios Finales

1. Haz clic en el botón "Eliminar" junto a cualquier tarea
2. Aparecerá un diálogo modal mostrando "¿Estás seguro de que deseas eliminar la tarea '[título de la tarea]'?"
3. Opciones:
   - **Cancelar**: Cierra el diálogo sin eliminar la tarea
   - **Eliminar**: Elimina la tarea permanentemente y cierra el diálogo

### Para Desarrolladores

El componente `ConfirmDialog` es reutilizable para cualquier acción que requiera confirmación:

```jsx
import ConfirmDialog from './components/ConfirmDialog'

function MiComponente() {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <button onClick={() => setShowDialog(true)}>Acción Destructiva</button>

      <ConfirmDialog
        isOpen={showDialog}
        title="Título del diálogo"
        message="Mensaje de confirmación"
        onConfirm={() => {
          // Ejecutar acción
          setShowDialog(false)
        }}
        onCancel={() => setShowDialog(false)}
        confirmText="Confirmar"  // Opcional, default: "Confirmar"
        cancelText="Cancelar"    // Opcional, default: "Cancelar"
      />
    </>
  )
}
```

## Configuración

No requiere configuración adicional. El componente funciona con props y no tiene dependencias externas (solo React y CSS puro).

## Testing

Para ejecutar los tests:

```bash
cd frontend && npm test
```

Tests implementados:
- **ConfirmDialog unitarios** (6 tests): Renderizado condicional, título, mensaje, callbacks, textos personalizados
- **TaskItem integración** (4 tests adicionales): Mostrar diálogo, confirmar eliminación, cancelar, cerrar diálogo

Todos los tests validan el flujo completo y previenen regresiones.

## Notas

- **Reutilizable**: El componente `ConfirmDialog` está diseñado para ser utilizado en otras partes de la aplicación (logout, descartar cambios, eliminar elementos, etc.)
- **Sin dependencias externas**: Implementado con React puro y CSS, sin librerías de UI adicionales
- **Accesibilidad**: El diálogo usa elementos semánticos (`<h2>`, `<p>`, `<button>`) para mejor accesibilidad
- **z-index**: El overlay usa `z-index: 1000` para asegurar que aparece sobre otros elementos de la UI
- **Consideraciones futuras**: Podría mejorarse con:
  - Foco automático en el botón de cancelar al abrir (prevenir confirmación accidental)
  - Cierre con tecla ESC
  - Cierre al hacer clic en el overlay (fuera del diálogo)
  - Animaciones de entrada/salida
  - Trap de foco para accesibilidad de teclado
