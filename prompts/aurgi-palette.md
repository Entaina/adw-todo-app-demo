# Aplica Paleta de Colores Corporativa Aurgi

## Purpose

Aplica la identidad visual de Aurgi a la aplicación React. Crea un fichero dedicado de paleta con los colores corporativos y sus variantes, y reemplaza los colores genéricos del CSS por variables semánticas referenciando la paleta. Esto establece dos capas desacopladas: la paleta (qué colores tiene Aurgi) y la semántica (qué color cumple cada rol en la UI).

## Instructions

- Usa extended thinking (Think) antes de realizar cambios para razonar sobre el mapping de colores
- Crea un fichero `frontend/src/palette.css` dedicado exclusivamente a definir la paleta de colores Aurgi con variantes. No incluyas estilos de componentes en este fichero
- En `index.css`, importa `palette.css` y define variables semánticas en `:root` que referencien la paleta con `var()`. Ningún valor hex/rgb debe aparecer fuera de `palette.css`
- Usa nombres semánticos en `index.css` (`--color-primary`, `--color-text`) y nombres de paleta en `palette.css` (`--aurgi-green-300`, `--aurgi-navy-700`)
- No añadas variables semánticas en `index.css` que no se usen actualmente (YAGNI). La paleta sí puede tener variantes de reserva para futuros usos
- No modifiques layout, spacing, tipografía ni estructura del CSS. Solo cambia valores de color
- El texto sobre fondo verde Aurgi (`#AED13B`) debe usar color oscuro (`#002A5F`), no blanco, para garantizar contraste WCAG AA
- Preserva el comportamiento hover existente: cada estado hover debe usar una variante más oscura de su color base

## Paleta de Colores Aurgi

Colores extraídos de aurgi.com (febrero 2026) mediante análisis CSS del DOM:

### Verde Aurgi (color dominante de marca)
| Token | Hex | Origen |
|-------|-----|--------|
| `--aurgi-green-100` | `#D5E895` | Fondos de botones en web |
| `--aurgi-green-300` | `#AED13B` | Color primario de marca (1357 usos en web) |
| `--aurgi-green-400` | `#A2BF40` | Bordes y acentos en web |
| `--aurgi-green-500` | `#7D9D0F` | Variante oscura en enlaces |

### Azul Aurgi (navegación y headings)
| Token | Hex | Origen |
|-------|-----|--------|
| `--aurgi-navy-300` | `#8B9AAF` | Texto secundario claro en web |
| `--aurgi-navy-500` | `#1B4F89` | Elementos interactivos (101 usos) |
| `--aurgi-navy-700` | `#002A5F` | Logo, headings, nav (768 usos) |

### Amarillo Aurgi (acentos)
| Token | Hex | Origen |
|-------|-----|--------|
| `--aurgi-yellow-400` | `#F7D02F` | Banner superior en web |

### Rojo (estados de error)
| Token | Hex | Origen |
|-------|-----|--------|
| `--aurgi-red-500` | `#E93A3A` | Notificaciones en web |
| `--aurgi-red-700` | `#C0392B` | Variante oscura |

### Neutros
| Token | Hex | Origen |
|-------|-----|--------|
| `--aurgi-gray-50` | `#F5F5F5` | Fondos de página en web |
| `--aurgi-gray-100` | `#EEEEEE` | Bordes sutiles |
| `--aurgi-gray-200` | `#DEDEDE` | Bordes de inputs |
| `--aurgi-gray-400` | `#ADB5BD` | Texto terciario |
| `--aurgi-gray-500` | `#6C757D` | Texto secundario |
| `--aurgi-gray-600` | `#63676C` | Texto principal |
| `--aurgi-gray-white` | `#FFFFFF` | Fondos de superficie |

## Mapping Semántico

Variables semánticas en `index.css` → tokens de paleta:

| Variable Semántica | Token de Paleta | Reemplaza |
|--------------------|----------------|-----------|
| `--color-primary` | `--aurgi-green-300` | `#3498db` |
| `--color-primary-hover` | `--aurgi-green-500` | `#2980b9` |
| `--color-brand-dark` | `--aurgi-navy-700` | `#2c3e50`, `white` (en btn) |
| `--color-accent` | `--aurgi-navy-500` | `#3498db` (en focus) |
| `--color-danger` | `--aurgi-red-500` | `#e74c3c` |
| `--color-danger-hover` | `--aurgi-red-700` | `#c0392b` |
| `--color-text` | `--aurgi-gray-600` | `#333` |
| `--color-text-secondary` | `--aurgi-gray-500` | `#666` |
| `--color-text-muted` | `--aurgi-gray-400` | `#999` |
| `--color-bg-page` | `--aurgi-gray-50` | `#f5f5f5` |
| `--color-bg-surface` | `--aurgi-gray-white` | `white` |
| `--color-bg-surface-alt` | `--aurgi-green-100` | `#f9f9f9` |
| `--color-border` | `--aurgi-gray-200` | `#ddd` |
| `--color-border-light` | `--aurgi-gray-100` | `#eee` |

## Workflow

1. Lee `frontend/src/index.css` para entender los colores actuales y su uso semántico
2. Crea el fichero `frontend/src/palette.css` con un bloque `:root` que defina todos los tokens de la tabla "Paleta de Colores Aurgi" (18 tokens organizados por familia)
3. Añade `@import './palette.css';` al inicio de `frontend/src/index.css` (antes de cualquier regla)
4. Añade un bloque `:root` en `index.css` (después del import) con las 14 variables semánticas de la tabla "Mapping Semántico", cada una referenciando su token de paleta con `var()`
5. Reemplaza cada valor de color hardcodeado en las reglas CSS existentes por su variable semántica `var(--color-xxx)`:
   - `body { color: #333 }` → `var(--color-text)`
   - `body { background-color: #f5f5f5 }` → `var(--color-bg-page)`
   - `.app { background-color: white }` → `var(--color-bg-surface)`
   - `h1 { color: #2c3e50 }` → `var(--color-brand-dark)`
   - `p { color: #666 }` → `var(--color-text-secondary)`
   - `.task-input { border: 1px solid #ddd }` → `var(--color-border)`
   - `.task-input:focus { border-color: #3498db }` → `var(--color-accent)`
   - `.btn-primary { background-color: #3498db }` → `var(--color-primary)`
   - `.btn-primary { color: white }` → `var(--color-brand-dark)`
   - `.btn-primary:hover { background-color: #2980b9 }` → `var(--color-primary-hover)`
   - `.btn-delete { background-color: #e74c3c }` → `var(--color-danger)`
   - `.btn-delete:hover { background-color: #c0392b }` → `var(--color-danger-hover)`
   - `.empty-message { color: #999 }` → `var(--color-text-muted)`
   - `.task-item { background-color: #f9f9f9 }` → `var(--color-bg-surface-alt)`
   - `.task-item { border: 1px solid #eee }` → `var(--color-border-light)`
   - `.task-title { color: #333 }` → `var(--color-text)`
   - `.task-title.completed { color: #999 }` → `var(--color-text-muted)`
6. Verifica que no quede ningún valor de color hardcodeado fuera de `palette.css` (excepto `rgba(0, 0, 0, 0.1)` en box-shadow)
7. Abre `http://localhost:5173` en el navegador y verifica visualmente que los colores de marca Aurgi se aplican correctamente

## Relevant Files

### Archivo a Crear
- `frontend/src/palette.css` - Paleta Aurgi con tokens de color por familia y variantes. Fuente de verdad para todos los colores de la marca

### Archivo a Modificar
- `frontend/src/index.css` - Importa palette.css, define variables semánticas en `:root`, y reemplaza los 17 colores hardcodeados por `var()` semánticos
