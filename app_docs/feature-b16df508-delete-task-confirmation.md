# Diálogo de Confirmación al Borrar Tarea

**ADW ID:** b16df508
**Fecha:** 2026-03-03
**Especificacion:** .issues/12/plan.md

## Overview

Se implementó un diálogo modal de confirmación que se muestra antes de eliminar una tarea en la aplicación Todo List. Esta funcionalidad previene eliminaciones accidentales al solicitar confirmación explícita del usuario antes de ejecutar la acción destructiva.

## Que se Construyo

- Componente `ConfirmDialog` reutilizable con overlay modal
- Integración del diálogo de confirmación en el flujo de eliminación de tareas
- Estilos CSS consistentes con el diseño existente de la aplicación
- Suite completa de tests unitarios para el nuevo componente
- Tests actualizados de `TaskItem` para cubrir el flujo de confirmación

## Implementacion Tecnica

### Ficheros Modificados

- `frontend/src/components/ConfirmDialog.jsx`: Nuevo componente modal reutilizable que muestra un mensaje de confirmación con botones Cancelar y Eliminar
- `frontend/src/__tests__/ConfirmDialog.test.jsx`: Suite de tests unitarios para validar el comportamiento del diálogo de confirmación
- `frontend/src/components/TaskItem.jsx`: Integrado estado local `showConfirm` y renderizado del `ConfirmDialog` interceptando el click del botón eliminar
- `frontend/src/__tests__/TaskItem.test.jsx`: Tests actualizados para verificar el flujo completo de confirmación antes de eliminar
- `frontend/src/index.css`: Añadidos estilos CSS para overlay, diálogo, botones secundarios y de peligro
- `frontend/package.json`: Añadida dependencia de desarrollo `@testing-library/user-event` para simular interacciones de usuario en tests

### Cambios Clave

1. **Componente ConfirmDialog**: Componente React controlado por prop `isOpen` que renderiza un overlay modal con mensaje personalizable y callbacks `onConfirm` y `onCancel`. Incluye event propagation stop para evitar cerrar al hacer click dentro del diálogo.

2. **Gestión de estado en TaskItem**: Se añadió `useState(false)` para controlar la visibilidad del diálogo. El botón "Eliminar" ahora abre el diálogo en lugar de ejecutar `onDelete` directamente.

3. **Sistema de estilos modular**: Nuevas clases CSS `.confirm-overlay`, `.confirm-dialog`, `.confirm-message`, `.confirm-actions`, `.btn-secondary` y `.btn-danger` siguiendo los patrones de diseño existentes (border-radius 8px, transiciones, colores consistentes).

4. **Cobertura de tests completa**: Tests unitarios para `ConfirmDialog` verificando renderizado condicional, callbacks y botones. Tests de integración en `TaskItem` verificando que el diálogo se muestra antes de eliminar y que cancelar no ejecuta la eliminación.

5. **Patrón de confirmación reutilizable**: El diseño del componente permite reutilizarlo en futuras funcionalidades que requieran confirmación del usuario sin modificar el código existente.

## Como Usar

1. **Para usuarios finales**: Al hacer click en el botón "Eliminar" de cualquier tarea, aparecerá un diálogo modal preguntando "¿Estás seguro de que quieres eliminar la tarea '[título de la tarea]'?"

2. **Confirmar eliminación**: Hacer click en el botón rojo "Eliminar" del diálogo para proceder con la eliminación

3. **Cancelar**: Hacer click en el botón gris "Cancelar" o fuera del diálogo para cerrar sin eliminar la tarea

4. **Para desarrolladores**: Importar y usar `ConfirmDialog` en cualquier componente:
```jsx
import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

const [showConfirm, setShowConfirm] = useState(false)

<ConfirmDialog
  isOpen={showConfirm}
  message="Tu mensaje de confirmación"
  onConfirm={() => {
    // Acción a ejecutar al confirmar
    setShowConfirm(false)
  }}
  onCancel={() => setShowConfirm(false)}
/>
```

## Configuracion

No se requiere configuración adicional. El componente funciona out-of-the-box con los estilos globales definidos en `index.css`.

## Testing

**Ejecutar tests del frontend:**
```bash
cd frontend && npm test
```

**Tests incluidos:**
- ConfirmDialog no renderiza cuando `isOpen` es false
- ConfirmDialog muestra el mensaje cuando está abierto
- Botones "Cancelar" y "Eliminar" están presentes
- Callback `onCancel` se ejecuta al hacer click en "Cancelar"
- Callback `onConfirm` se ejecuta al hacer click en "Eliminar"
- TaskItem muestra el diálogo al hacer click en eliminar
- TaskItem ejecuta `onDelete` solo después de confirmar
- TaskItem no elimina la tarea al cancelar

## Notas

- El componente `ConfirmDialog` es completamente reutilizable y puede adaptarse a cualquier caso de uso que requiera confirmación del usuario
- No se introdujeron nuevas dependencias de producción; solo se añadió `@testing-library/user-event` como dependencia de desarrollo para mejorar los tests de interacción
- El estado del diálogo se gestiona localmente en cada instancia de uso (como `TaskItem`), manteniendo la simplicidad y evitando overhead de contexto global
- El diseño del overlay permite cerrar el diálogo haciendo click fuera del contenido, mejorando la UX
- Los estilos están alineados con el sistema de diseño existente de la aplicación (colores, border-radius, sombras)
