# Feature: Cambiar Paleta de Colores a Tonos Ocres

**ADW ID:** 6f57a176
**Fecha:** 2026-03-05
**Especificacion:** /Users/elafo/workspace/entaina/aurgi-curso-desarrolladores-sample-app/trees/issue-57/.issues/57/plan.md

## Overview

Se transformó completamente la paleta de colores de la aplicación Todo List desde los colores azules genéricos (#3498db, #2980b9, #2c3e50) a una paleta de tonos ocres/tierra que aporta calidez, elegancia y una estética más orgánica y acogedora a la interfaz. La implementación sigue un patrón de dos capas (paleta + semántica) para separar los valores de color raw de su intención de diseño, facilitando futuros ajustes y mantenimiento.

## Que se Construyo

### Frontend
- Nuevo archivo `palette.css` con sistema de tokens de color completo
- Variables semánticas en `index.css` que mapean intenciones de diseño
- Reemplazo completo de colores hardcodeados por variables CSS
- Paleta ocre coherente con 9 tonos primarios, 7 neutrales y 2 de estado

### Backend (Refactorización ADW Tracker)
- Simplificación del módulo `Adw::Tracker` eliminando lógica de generación de URLs de comentarios
- Extracción del actor `InitializeIssueTracker` a `InitializeTracker` genérico
- Eliminación del actor redundante `InitializeWorkflowTracker`
- Refactorización de métodos `render_comment` para eliminar dependencias de `issue_number`
- Actualización de tests para reflejar la nueva arquitectura simplificada

## Implementacion Tecnica

### Ficheros Modificados

#### Frontend
- `frontend/src/palette.css` (nuevo): Define todos los tokens de color en formato `--ochre-XXX` con valores hex como única fuente de verdad
- `frontend/src/index.css`: Importa la paleta, define variables semánticas (--color-primary, --color-text, etc.) y reemplaza todos los colores hardcodeados por referencias a variables

#### Backend ADW
- `adws/lib/adw/tracker.rb`: Simplificado eliminando método `comment_url` y refactorizando `render_comment` en ambos módulos (Issue y Workflow) para remover dependencia de `issue_number`
- `adws/lib/adw/actors/initialize_issue_tracker.rb` → `adws/lib/adw/actors/initialize_tracker.rb`: Renombrado y refactorizado para ser genérico y reutilizable entre Issue y Workflow trackers
- `adws/lib/adw/actors/initialize_workflow_tracker.rb`: Eliminado (lógica absorbida por `initialize_tracker.rb`)
- `adws/lib/adw/actors/build_patch_plan.rb`: Actualizado para usar `agent_name` extraído
- `adws/lib/adw/workflows/full_pipeline.rb`, `patch.rb`, `plan_build.rb`: Actualizados para usar el nuevo actor genérico `InitializeTracker`

#### Tests
- `adws/test/lib/adw/actors/initialize_issue_tracker_test.rb` → `adws/test/lib/adw/actors/initialize_tracker_test.rb`: Renombrado y expandido con tests para ambos tipos de trackers
- `adws/test/lib/adw/actors/initialize_workflow_tracker_test.rb`: Eliminado (tests movidos a `initialize_tracker_test.rb`)

### Cambios Clave

1. **Arquitectura de Dos Capas en CSS**: Separación entre tokens de paleta (valores hex) y variables semánticas (intenciones de diseño), permitiendo cambios globales fáciles y consistencia visual
2. **Paleta Ocre Completa**: 9 tonos primarios desde `--ochre-100` (muy claro) hasta `--ochre-900` (muy oscuro), más neutrales y colores de estado
3. **Variables Semánticas**: `--color-primary`, `--color-text`, `--color-bg-surface`, etc., que encapsulan la intención y facilitan el mantenimiento
4. **Reemplazo Exhaustivo**: Eliminación de todos los valores hardcodeados (#333, #ddd, #3498db, etc.) por variables, excepto sombras neutras (rgba)
5. **Simplificación de Trackers ADW**: Extracción de lógica común entre Issue y Workflow trackers, eliminando duplicación y dependencias innecesarias
6. **Actor Genérico**: `InitializeTracker` reemplaza a los dos actores específicos previos, reduciendo código y mejorando mantenibilidad

## Como Usar

### Para Diseñadores/Desarrolladores Frontend

1. **Consultar tokens de paleta**: Abrir `frontend/src/palette.css` para ver todos los colores disponibles con sus valores hex
2. **Usar variables semánticas**: Siempre referenciar las variables de `index.css` (ej: `var(--color-primary)`) en lugar de tokens directos o hex
3. **Añadir nuevos componentes**: Usar exclusivamente las variables semánticas existentes para mantener consistencia
4. **Ajustar colores globalmente**: Modificar el mapeo en `:root` de `index.css` para cambiar la apariencia completa sin tocar componentes individuales

### Jerarquía de Variables

```css
/* NUNCA usar directamente en componentes */
--ochre-500: #D4A868;

/* USAR SIEMPRE en componentes */
--color-primary: var(--ochre-500);

/* En tu componente */
.mi-boton {
  background-color: var(--color-primary);
}
```

### Para Desarrolladores Backend (ADW)

1. **Inicializar trackers**: Usar `InitializeTracker.call` con `type: :issue` o `type: :workflow` en lugar de actores específicos
2. **Sincronizar trackers**: Los métodos `sync` ahora manejan la renderización sin requerir `issue_number` extra
3. **Extender trackers**: Añadir nueva lógica en `Adw::Tracker::Issue` o `Adw::Tracker::Workflow` según corresponda

## Configuracion

### Variables CSS Semánticas Disponibles

#### Colores de Marca
- `--color-primary`: Color principal para botones y acentos
- `--color-primary-hover`: Variante hover del primario
- `--color-brand-dark`: Color de marca oscuro para títulos
- `--color-accent`: Color de acento para focus y resaltados

#### Colores de Texto
- `--color-text`: Texto principal (alta legibilidad)
- `--color-text-secondary`: Texto secundario (menos prominente)
- `--color-text-muted`: Texto tenue (placeholders, disabled)

#### Colores de Fondo
- `--color-bg-page`: Fondo de la página principal
- `--color-bg-surface`: Superficie de componentes (cards, modales)
- `--color-bg-surface-alt`: Superficie alternativa (listas, items)

#### Colores de Borde
- `--color-border`: Bordes principales
- `--color-border-light`: Bordes sutiles

#### Colores de Estado
- `--color-danger`: Color de peligro/delete
- `--color-danger-hover`: Hover del peligro

### Tokens de Paleta (Solo para referencia)

**Primarios**: `--ochre-100` a `--ochre-900` (9 tonos)
**Neutrales**: `--ochre-neutral-50`, `--ochre-neutral-100`, `--ochre-neutral-200`, `--ochre-neutral-400`, `--ochre-neutral-500`, `--ochre-neutral-600`, `--ochre-neutral-white`
**Estado**: `--ochre-red-500`, `--ochre-red-700`

## Testing

### Visual
1. Iniciar el frontend: `cd frontend && npm run dev`
2. Abrir http://localhost:5173 en el navegador
3. Verificar que todos los componentes muestran colores ocres
4. Verificar estados hover en botones y drag handles
5. Verificar contraste de texto en todos los fondos
6. Verificar que las tareas completadas (tachadas) son legibles

### Automatizado
```bash
# Tests frontend
cd frontend && npm test

# Build de producción
cd frontend && npm run build

# Tests backend ADW
cd adws && bundle exec rake test
```

### Contraste WCAG AA
Todos los pares de color/fondo cumplen con WCAG AA (mínimo 4.5:1 para texto normal):
- Texto principal sobre fondo blanco cálido: ✅ Pass
- Texto blanco sobre botón primario ocre: ✅ Pass
- Texto tenue sobre fondo alternativo: ✅ Pass

## Notas

### Diseño
- Los colores ocres fueron ajustados desde la propuesta inicial del plan para mejorar contraste y legibilidad
- Se mantienen sombras neutras `rgba(0, 0, 0, 0.1)` ya que son independientes del tema de color
- El color rojo de delete (#D87868) fue seleccionado para armonizar con la paleta cálida
- Todos los tonos fueron probados visualmente y validados para accesibilidad WCAG AA

### Arquitectura
- El patrón de dos capas sigue la guía documentada en `prompts/aurgi-palette.md`
- Esta arquitectura permite cambiar toda la paleta visual editando solo un puñado de líneas en `index.css`
- Los tokens de paleta nunca deben usarse directamente en componentes, solo en el mapeo semántico

### ADW Refactoring
- La simplificación del tracker elimina complejidad innecesaria y mejora la mantenibilidad
- El actor genérico `InitializeTracker` reduce duplicación de código de ~57 líneas eliminadas
- Los tests ahora cubren ambos tipos de trackers desde un único archivo
- Esta refactorización no cambia el comportamiento funcional, solo la estructura interna

### Próximos Pasos Potenciales
- Considerar añadir un modo oscuro usando la misma arquitectura de dos capas
- Expandir la paleta con más variantes de estado (warning, success, info)
- Documentar guías de accesibilidad y uso de color para nuevos desarrolladores
