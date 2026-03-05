# Guia de Documentacion Condicional

Este documento te ayuda a determinar que documentacion deberias leer en funcion de los cambios que necesitas hacer en el codebase. Revisa las condiciones de abajo y lee la documentacion relevante antes de proceder con tu tarea.

## Instrucciones
- Revisa la tarea que te han pedido realizar
- Comprueba cada ruta de documentacion en la seccion de Documentacion Condicional
- Para cada ruta, evalua si alguna de las condiciones aplica a tu tarea
  - IMPORTANTE: Solo lee la documentacion si alguna de las condiciones coincide con tu tarea
- IMPORTANTE: No quieres leer documentacion en exceso. Solo lee la documentacion si es relevante para tu tarea.

## Documentacion Condicional

- backend/README.md
  - Condiciones:
    - Cuando trabajes con cualquier cosa bajo backend/
    - Cuando necesites saber como arrancar o testear el servidor Rails
    - Cuando trabajes con la API o los endpoints del backend

- frontend/README.md
  - Condiciones:
    - Cuando trabajes con cualquier cosa bajo frontend/
    - Cuando necesites saber como arrancar o testear la aplicacion React
    - Cuando trabajes con componentes, servicios o estilos del frontend

- app_docs/feature-52-delete-confirmation-dialog.md
  - Condiciones:
    - Cuando trabajes con el componente ConfirmDialog o modales de confirmacion
    - Cuando implementes confirmaciones antes de acciones destructivas (borrar, eliminar)
    - Cuando necesites crear dialogos de confirmacion reutilizables
    - Cuando modifiques el flujo de eliminacion de tareas en TaskItem
    - Cuando resuelvas problemas relacionados con modales o overlays
    - Cuando trabajes con estilos de modales (.modal-overlay, .modal, .modal-actions)
