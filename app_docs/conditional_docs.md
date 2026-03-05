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

- app_docs/feature-cfe1475e-ochre-color-palette.md
  - Condiciones:
    - Cuando trabajes con estilos CSS o variables de color
    - Cuando necesites añadir o modificar colores en la aplicacion
    - Cuando implementes nuevos componentes que requieran tematizacion
    - Cuando necesites entender el sistema de tokens de color (paleta vs semantica)
    - Cuando resuelvas problemas de accesibilidad o contraste de colores

- app_docs/feature-6f57a176-ochre-color-palette.md
  - Condiciones:
    - Cuando trabajes con el sistema de colores ocres de la aplicación
    - Cuando necesites entender la arquitectura de dos capas (paleta + semántica)
    - Cuando implementes nuevos componentes y necesites usar variables CSS consistentes
    - Cuando modifiques o extiendas la paleta de colores
    - Cuando trabajes con el módulo ADW Tracker o actores de inicialización
    - Cuando necesites entender la refactorización de Issue y Workflow trackers
    - Cuando resuelvas problemas relacionados con InitializeTracker genérico
