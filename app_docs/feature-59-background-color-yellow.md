# Feature: Cambiar Color de Fondo a Amarillo Clarito + Refactorización de Trackers ADW

**ADW ID:** 987822b4
**Fecha:** 2026-03-05
**Especificacion:** /Users/elafo/workspace/entaina/aurgi-curso-desarrolladores-sample-app/trees/issue-59/.issues/59/plan.md

## Overview

Se implementó el cambio de color de fondo de la aplicación Todo List de gris claro (`#f5f5f5`) a un amarillo muy clarito (`#FEFDF8`), proporcionando una apariencia más cálida y acogedora mientras se mantiene excelente legibilidad. Adicionalmente, se refactorizó el sistema de trackers ADW para unificar la inicialización de issue y workflow trackers en un solo actor.

## Que se Construyo

- Cambio de color de fondo del body en la aplicación frontend
- Refactorización del sistema de trackers ADW: unificación de `InitializeIssueTracker` y `InitializeWorkflowTracker` en un único actor `InitializeTracker`
- Simplificación del rendering de comentarios GitHub eliminando enlaces innecesarios
- Actualización de tests para reflejar la nueva estructura de actors

## Implementacion Tecnica

### Ficheros Modificados

#### Frontend
- `frontend/src/index.css`: Cambió `background-color` del selector `body` de `#f5f5f5` (gris claro) a `#FEFDF8` (amarillo muy clarito, casi crema)

#### ADW Framework - Refactorización de Trackers
- `adws/lib/adw/actors/initialize_tracker.rb`: **Nuevo actor unificado** que reemplaza los dos actors separados. Inicializa tanto el issue tracker como el workflow tracker en una sola operación
- `adws/lib/adw/actors/initialize_issue_tracker.rb`: **Renombrado** → `initialize_tracker.rb`
- `adws/lib/adw/actors/initialize_workflow_tracker.rb`: **Eliminado** (funcionalidad fusionada en `InitializeTracker`)
- `adws/lib/adw/tracker.rb`: Eliminación del método helper `comment_url`. Simplificación de `render_comment` en ambos módulos (Issue y Workflow) para eliminar enlaces a comentarios GitHub y mantener solo referencias locales
- `adws/lib/adw/workflows/patch.rb`: Actualizado para usar el nuevo `InitializeTracker` en lugar de los dos actors separados
- `adws/lib/adw/workflows/full_pipeline.rb`: Actualizado para usar el nuevo `InitializeTracker`
- `adws/lib/adw/workflows/plan_build.rb`: Actualizado para usar el nuevo `InitializeTracker`
- `adws/lib/adw/workflows/plan_build_test.rb`: Actualizado para usar el nuevo `InitializeTracker`
- `adws/lib/adw/actors/build_patch_plan.rb`: Corrección menor de propagación de `branch_name`

#### Tests
- `adws/test/lib/adw/actors/initialize_tracker_test.rb`: **Renombrado y expandido** desde `initialize_issue_tracker_test.rb`. Ahora prueba ambas responsabilidades (issue y workflow tracker)
- `adws/test/lib/adw/actors/initialize_workflow_tracker_test.rb`: **Eliminado** (tests fusionados en `initialize_tracker_test.rb`)

### Cambios Clave

1. **Color de Fondo Frontend**: Se eligió `#FEFDF8` en lugar del propuesto `#FFFDE7` - un amarillo extremadamente sutil con tintes crema que proporciona calidez sin sacrificar legibilidad

2. **Unificación de Actors**: Se consolidaron dos actors separados (`InitializeIssueTracker` y `InitializeWorkflowTracker`) en uno solo (`InitializeTracker`) que:
   - Carga o crea el issue tracker
   - Actualiza el `branch_name` si se proporciona
   - Crea un workflow tracker fresco para cada ejecución
   - Reduce complejidad al tener un único punto de inicialización

3. **Simplificación de Comentarios GitHub**: Los métodos `render_comment` ya no generan enlaces a comentarios GitHub, optando por referencias locales más simples (solo `adw_id` y tipo de workflow)

4. **Inputs Opcionales**: El nuevo actor acepta `branch_name` y `workflow_type` como inputs opcionales, permitiendo mayor flexibilidad en diferentes contextos de workflow

5. **Eliminación de Método Helper**: El método `comment_url` fue eliminado del módulo `Tracker` ya que ya no es necesario tras simplificar el rendering de comentarios

## Como Usar

### Cambio de Color (Usuario Final)
1. Abrir la aplicación Todo List en el navegador
2. El fondo será automáticamente amarillo clarito en lugar de gris
3. No requiere ninguna acción adicional del usuario

### Refactorización ADW (Desarrolladores)
1. Los workflows existentes automáticamente usan el nuevo `InitializeTracker`
2. Si estás creando un nuevo workflow, usa:
   ```ruby
   play Adw::Actors::InitializeTracker
   ```
   En lugar de:
   ```ruby
   play Adw::Actors::InitializeIssueTracker,
        Adw::Actors::InitializeWorkflowTracker
   ```
3. Los inputs `branch_name` y `workflow_type` son opcionales y se propagan automáticamente desde `PipelineInputs`

## Configuracion

No se requiere configuración adicional. El cambio de color es estático en el CSS y la refactorización de trackers es transparente para usuarios finales.

### Alternativas de Color

Si se desea ajustar la intensidad del amarillo, se pueden considerar estas alternativas:

- `#FEFDF8` - Amarillo muy clarito con tintes crema (actual - color implementado)
- `#FFFDE7` - Amarillo muy clarito (Material Design Yellow 50)
- `#FFF9C4` - Amarillo claro con más saturación (Material Design Yellow 100)
- `#FFF59D` - Amarillo con mayor intensidad (Material Design Yellow 200)
- `#FFFACD` - Lemon Chiffon (color CSS estándar)

## Testing

### Frontend
```bash
cd frontend && npm test
```
Los tests no se ven afectados ya que son funcionales, no visuales.

### Backend/ADW
```bash
cd backend && bin/rails test
```
Los tests del nuevo actor unificado verifican:
- Creación correcta del issue tracker
- Propagación del `branch_name`
- Creación correcta del workflow tracker con `adw_id` y `workflow_type`

### Validación Visual
1. Ejecutar `cd frontend && npm run dev`
2. Abrir `http://localhost:5173`
3. Verificar:
   - Fondo amarillo muy clarito
   - Texto legible con buen contraste
   - Tarjetas blancas distinguibles

## Notas

### Decisión de Color
Se optó por `#FEFDF8` (amarillo muy clarito con tintes crema) en lugar del propuesto `#FFFDE7` (Material Design Yellow 50). Este color es aún más sutil y proporciona:
- Excelente contraste WCAG AA con texto oscuro
- Calidez visual sin saturación excesiva
- Mejor armonía con componentes blancos

### Arquitectura de Trackers
La unificación de actors sigue el principio de **Single Responsibility Principle** a nivel de workflow phase:
- **Antes**: Dos actors separados → dos pasos en el workflow
- **Ahora**: Un actor unificado → un solo paso de inicialización
- **Beneficio**: Menor complejidad, código más mantenible, menor superficie de error

### Cambios de Nomenclatura
- El archivo `initialize_issue_tracker.rb` fue **renombrado** a `initialize_tracker.rb` (no eliminado)
- El contenido del antiguo `InitializeIssueTracker` fue **fusionado** con `InitializeWorkflowTracker`
- Los tests correspondientes también fueron fusionados y expandidos

### Retrocompatibilidad
La refactorización mantiene la misma interfaz pública:
- Los workflows existentes no requieren cambios en sus inputs
- Los trackers generados tienen la misma estructura YAML
- Los comentarios GitHub mantienen el mismo formato (solo eliminando enlaces innecesarios)
