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

- app_docs/feature-6da858a8-theme-toggle.md
  - Condiciones:
    - Cuando trabajes con el sistema de temas (tema oscuro/claro)
    - Cuando necesites añadir nuevos colores o variables CSS temáticas
    - Cuando modifiques o extiendas el hook useTheme
    - Cuando trabajes con el componente ThemeToggle
    - Cuando resuelvas problemas de colores o contraste en la UI
    - Cuando implementes nuevos componentes que necesiten adaptarse a ambos temas
    - Cuando trabajes con CSS Custom Properties (variables CSS)
    - Cuando debuggees problemas de persistencia de preferencias de tema
