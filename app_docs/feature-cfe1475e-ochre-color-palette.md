# Paleta de Colores Ocres - Todo List

**ADW ID:** cfe1475e
**Fecha:** 2026-03-05
**Especificación:** /Users/elafo/workspace/entaina/aurgi-curso-desarrolladores-sample-app/trees/issue-57/.issues/57/plan.md

## Overview

Se implementó una paleta de colores en tonos ocres para transformar la interfaz de la aplicación Todo List, reemplazando los colores azules genéricos por una estética más cálida y acogedora. La implementación sigue un patrón de dos capas (paleta + semántica) que facilita el mantenimiento y la consistencia visual.

## Qué se Construyó

- **Sistema de tokens de color ocre**: Paleta completa con 9 variantes principales, 7 neutrales y 2 colores de estado
- **Capa semántica de variables CSS**: 14 variables semánticas que mapean intenciones de diseño a tokens específicos
- **Migración completa de colores**: Todos los colores hardcodeados en `index.css` fueron reemplazados por variables semánticas
- **Arquitectura de dos capas**: Separación clara entre definición de paleta (`palette.css`) y uso semántico (`index.css`)

## Implementación Técnica

### Ficheros Modificados

- `frontend/src/index.css`: Migrado a variables semánticas, importa `palette.css`, reemplazados todos los colores hardcodeados (52 líneas añadidas, 20 modificadas)
- `frontend/src/palette.css`: **Nuevo fichero** - Define todos los tokens de la paleta ocre

### Cambios Clave

1. **Creación de `palette.css`**: Nueva fuente única de verdad para valores de color hex, organizada en tres familias:
   - Primarios ocres: `--ochre-100` (#FDF5E6) hasta `--ochre-900` (#3D2512)
   - Neutrales: `--ochre-neutral-50` hasta `--ochre-neutral-white` (#FFFDF9)
   - Estados: `--ochre-red-500` (#C45C4A) y `--ochre-red-700` (#A04535) para botones de peligro

2. **Variables semánticas en `index.css`**: Bloque `:root` con 14 variables que abstraen la intención de diseño:
   - Marca: `--color-primary`, `--color-primary-hover`, `--color-brand-dark`, `--color-accent`
   - Estado: `--color-danger`, `--color-danger-hover`
   - Texto: `--color-text`, `--color-text-secondary`, `--color-text-muted`
   - Fondo: `--color-bg-page`, `--color-bg-surface`, `--color-bg-surface-alt`
   - Borde: `--color-border`, `--color-border-light`

3. **Migración sistemática**: 16 reemplazos de colores hardcodeados por variables semánticas en:
   - Body y página (`#333` → `var(--color-text)`, `#f5f5f5` → `var(--color-bg-page)`)
   - Títulos (`#2c3e50` → `var(--color-brand-dark)`)
   - Inputs (`#ddd` → `var(--color-border)`, `#3498db` → `var(--color-accent)`)
   - Botones primarios (`#3498db` → `var(--color-primary)`, `#2980b9` → `var(--color-primary-hover)`)
   - Botones delete (`#e74c3c` → `var(--color-danger)`, `#c0392b` → `var(--color-danger-hover)`)
   - Task items (`#f9f9f9` → `var(--color-bg-surface-alt)`, `#eee` → `var(--color-border-light)`)

4. **Preservación de sombras**: Los valores `rgba(0, 0, 0, 0.1)` y `rgba(0, 0, 0, 0.15)` en `box-shadow` se mantienen sin cambiar ya que representan sombras neutras independientes del tema de color.

## Cómo Usar

### Para Desarrolladores

1. **Usar variables semánticas**: Siempre referencia variables de `--color-*` en lugar de tokens de `--ochre-*`:
   ```css
   /* ✅ Correcto */
   .my-component {
     color: var(--color-text);
     background-color: var(--color-primary);
   }

   /* ❌ Incorrecto */
   .my-component {
     color: var(--ochre-neutral-600);
     background-color: var(--ochre-500);
   }
   ```

2. **Añadir nuevos colores semánticos**: Si necesitas un nuevo concepto de color, añádelo al bloque `:root` de `index.css` mapeándolo a un token de `palette.css`.

3. **Modificar la paleta**: Si necesitas ajustar tonos, edita únicamente `palette.css`. Los cambios se propagarán automáticamente a toda la aplicación.

### Para Diseñadores

La paleta ocre está organizada en tres familias:
- **Primarios (ochre-100 a ochre-900)**: Para elementos de marca, botones y acentos
- **Neutrales (ochre-neutral-50 a ochre-neutral-white)**: Para fondos, texto y bordes
- **Estados (ochre-red-500, ochre-red-700)**: Para acciones destructivas

Consulta `frontend/src/palette.css` para ver todos los valores hex disponibles.

## Configuración

No se requiere configuración adicional. El archivo `palette.css` se importa automáticamente en `index.css` y está disponible globalmente en toda la aplicación.

## Testing

### Validación Visual
1. Ejecuta la aplicación: `cd frontend && npm run dev`
2. Verifica:
   - Título y texto muestran tonos ocres cálidos
   - Botón "Add Task" tiene fondo ocre (`--ochre-500`)
   - Hover del botón oscurece a `--ochre-600`
   - Botón "Delete" usa rojo cálido (`--ochre-red-500`)
   - Tasks completadas se ven en gris muted (`--ochre-neutral-400`)
   - Drag handle cambia de color en hover

### Tests Automatizados
```bash
cd frontend && npm test
cd frontend && npm run build  # Verifica que el build compila sin errores
```

## Notas

- **Accesibilidad**: Los colores mantienen contraste WCAG AA. El texto primario (`--ochre-neutral-600`) sobre fondos claros supera el ratio 4.5:1 requerido.
- **Compatibilidad**: No se requieren cambios en componentes React. Los cambios son puramente CSS.
- **Extensibilidad**: La arquitectura de dos capas permite fácil theming futuro. Para añadir un tema oscuro, basta con sobrescribir las variables semánticas en un bloque `@media (prefers-color-scheme: dark)`.
- **Patrón de referencia**: Implementación basada en `prompts/aurgi-palette.md`, siguiendo las mejores prácticas de diseño de sistemas de color.
- **Armonía cromática**: El color rojo de delete (`#C45C4A`) fue ajustado desde el `#e74c3c` original para armonizar con la calidez de la paleta ocre.
