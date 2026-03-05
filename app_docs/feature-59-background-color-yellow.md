# Background Color Change to Light Yellow

**ADW ID:** 59
**Fecha:** 2026-03-05
**Especificacion:** /Users/elafo/workspace/entaina/aurgi-curso-desarrolladores-sample-app/trees/issue-59/.issues/59/plan.md

## Overview

Cambio del color de fondo de la aplicación Todo List de gris claro (`#f5f5f5`) a amarillo clarito (`#FFFDE7`) para aportar un aspecto más cálido y acogedor, manteniendo la legibilidad y el contraste visual de todos los elementos de la interfaz.

## Que se Construyo

- Modificación del color de fondo principal de la aplicación
- Actualización de la propiedad `background-color` del selector `body` en los estilos globales
- Implementación de color Material Design Yellow 50 (`#FFFDE7`)

## Implementacion Tecnica

### Ficheros Modificados

- `frontend/src/index.css`: Se cambió el valor de `background-color` en el selector `body` de `#f5f5f5` (gris claro) a `#FFFDE7` (amarillo muy clarito de Material Design Yellow 50)

### Cambios Clave

- Se reemplazó una única línea de CSS en el archivo de estilos globales del frontend
- El color seleccionado (`#FFFDE7`) es un amarillo muy sutil que mantiene excelente legibilidad y contraste
- No se requirieron cambios en otros componentes ya que el nuevo color mantiene el contraste adecuado con texto oscuro (#333) y elementos blancos
- El cambio es puramente visual y no afecta la lógica de la aplicación ni los tests funcionales

## Como Usar

Esta funcionalidad no requiere acción del usuario. El cambio de color de fondo se aplica automáticamente al cargar la aplicación:

1. Iniciar el servidor de desarrollo: `cd frontend && npm run dev`
2. Abrir la aplicación en el navegador: `http://localhost:5173`
3. El fondo amarillo clarito se mostrará automáticamente en toda la página

## Configuracion

No se requiere configuración adicional. El color está definido directamente en `frontend/src/index.css`.

### Alternativas de Color

Si se desea ajustar la intensidad del amarillo, se pueden considerar estas alternativas:

- `#FFFDE7` - Amarillo muy clarito (actual - Material Design Yellow 50)
- `#FFF9C4` - Amarillo claro con más saturación (Material Design Yellow 100)
- `#FFF59D` - Amarillo con mayor intensidad (Material Design Yellow 200)
- `#FFFACD` - Lemon Chiffon (color CSS estándar)

## Testing

### Tests Automatizados

Los tests existentes (unitarios y de integración) no se ven afectados por este cambio visual:

```bash
# Tests del backend
cd backend && bin/rails test

# Tests del frontend
cd frontend && npm test
```

### Validación Visual Manual

Verificar los siguientes aspectos en el navegador:

- El fondo de la página es amarillo clarito
- El texto principal (#333) mantiene buena legibilidad sobre el fondo amarillo
- Las tarjetas blancas (`.app`) contrastan correctamente con el fondo
- Los botones y elementos interactivos mantienen su visibilidad
- El contraste cumple con los estándares WCAG AA de accesibilidad

## Notas

- **Reversibilidad**: Este cambio es completamente reversible modificando una única línea en `frontend/src/index.css`
- **Accesibilidad**: El color `#FFFDE7` mantiene un contraste adecuado con el texto oscuro (#333), cumpliendo con los estándares WCAG AA
- **Compatibilidad**: No hay impacto en la funcionalidad de la aplicación, solo es un cambio estético
- **Material Design**: Se utilizó la paleta Material Design Yellow 50 para consistencia con estándares de diseño modernos
