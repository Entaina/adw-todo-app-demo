# Separar Tareas Completadas en Lista Independiente

**ADW ID:** 0996e753
**Fecha:** 2026-03-04
**Especificacion:** .issues/26/plan.md

## Overview

Se ha implementado una mejora en la visualización de tareas separando las tareas pendientes de las completadas en dos listas independientes con encabezados descriptivos. Esta separación mejora la organización visual y permite a los usuarios enfocarse en las tareas pendientes sin la distracción de las ya completadas.

## Que se Construyo

- Separación de tareas en dos secciones: pendientes y completadas
- Encabezados descriptivos para cada sección ("Tareas pendientes" y "Tareas completadas")
- Drag-and-drop habilitado solo para tareas pendientes
- Estilo visual diferenciado para la sección de tareas completadas
- Ocultamiento automático de la sección de completadas cuando está vacía
- Suite de tests para verificar el comportamiento de las secciones

## Implementacion Tecnica

### Ficheros Modificados

- `frontend/src/components/TaskList.jsx`: Refactorizado para filtrar y renderizar tareas en dos secciones separadas. El drag-and-drop ahora solo opera sobre tareas pendientes. Se añadió lógica para ocultar la sección de completadas cuando está vacía.
- `frontend/src/index.css`: Añadidos estilos para las nuevas secciones, incluyendo clases `.task-section`, `.completed-section` y `.section-header` con estilos visuales diferenciados.
- `frontend/src/__tests__/TaskList.test.jsx`: Añadidos 3 nuevos tests para verificar la renderización de encabezados, ocultamiento de sección vacía y orden correcto de las secciones.

### Cambios Clave

1. **Filtrado de tareas**: Se introducen dos arrays derivados `pendingTasks` y `completedTasks` que filtran el array original de tareas según su estado `completed`.

2. **Drag-and-drop limitado**: El contexto de DnD (`DndContext` y `SortableContext`) ahora envuelve únicamente las tareas pendientes, manteniendo la funcionalidad de reordenamiento solo donde tiene sentido.

3. **Reordenamiento inteligente**: Al reordenar tareas pendientes, se reconstruye el array completo manteniendo las tareas completadas al final para preservar el orden correcto en el backend.

4. **Renderizado condicional**: La sección de tareas completadas solo se renderiza si `completedTasks.length > 0`, evitando secciones vacías innecesarias.

5. **Estilos diferenciados**: La sección de completadas tiene un fondo sutil (`#fafafa`) y padding adicional para diferenciarla visualmente de las tareas pendientes.

## Como Usar

La funcionalidad es completamente transparente para el usuario y no requiere acciones especiales:

1. **Ver tareas pendientes**: Aparecen en la primera sección bajo el encabezado "Tareas pendientes"
2. **Ver tareas completadas**: Aparecen en la segunda sección bajo el encabezado "Tareas completadas" (solo si existen tareas completadas)
3. **Completar una tarea**: Al marcar una tarea como completada, se moverá automáticamente a la sección de completadas
4. **Reactivar una tarea**: Al desmarcar una tarea completada, volverá a la sección de pendientes
5. **Reordenar tareas**: Solo las tareas pendientes pueden reordenarse mediante drag-and-drop

## Configuracion

No se requiere ninguna configuración adicional. Los cambios son puramente frontend y funcionan automáticamente al cargar la aplicación.

## Testing

Los tests cubren los siguientes escenarios:

- **Renderización de encabezados**: Verifica que ambos encabezados aparecen cuando hay tareas de ambos tipos
- **Ocultamiento de sección vacía**: Verifica que la sección de completadas no se muestra si no hay tareas completadas
- **Orden correcto**: Verifica que las tareas pendientes aparecen antes que las completadas mediante la comprobación del orden de los encabezados

Para ejecutar los tests:
```bash
cd frontend && npm test -- --run
```

## Notas

- El comportamiento de drag-and-drop se mantiene solo para tareas pendientes para evitar confusión al reordenar tareas completadas
- La transición visual al completar/descompletar una tarea es automática gracias al re-render de React
- No se requieren cambios en el backend ya que la separación es puramente visual en el frontend
- La implementación mantiene compatibilidad total con la API existente y no introduce cambios en el modelo de datos
