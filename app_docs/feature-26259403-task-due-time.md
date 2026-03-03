# Feature: Tiempo de Vencimiento para Tareas

**ADW ID:** 26259403
**Fecha:** 2026-03-03
**Especificacion:** .issues/10/plan.md

## Overview

Este feature añade un campo opcional de fecha y hora de vencimiento (`due_at`) a las tareas, permitiendo a los usuarios establecer fechas límite para completar sus tareas. El sistema proporciona indicadores visuales automáticos para tareas vencidas y próximas a vencer, mejorando la gestión del tiempo y priorización de tareas.

## Que se Construyo

- Campo de base de datos `due_at` (datetime, nullable) en la tabla tasks
- Selector de fecha/hora en el formulario de creación de tareas
- Visualización de fecha de vencimiento en cada tarea
- Indicadores visuales para tareas vencidas (rojo) y próximas a vencer (naranja)
- Tests completos de backend y frontend para el nuevo campo
- Lógica inteligente que no marca tareas completadas como vencidas

## Implementacion Tecnica

### Ficheros Modificados

- `backend/db/migrate/20260303114716_add_due_at_to_tasks.rb`: Nueva migración que añade la columna due_at a tasks
- `backend/app/models/task.rb`: Actualizada anotación del modelo para incluir due_at
- `backend/app/controllers/api/tasks_controller.rb`: Añadido `:due_at` a los parámetros permitidos
- `backend/db/schema.rb`: Schema actualizado con el nuevo campo
- `backend/test/models/task_test.rb`: Tests unitarios para verificar opcionalidad del campo
- `backend/test/controllers/api/tasks_controller_test.rb`: Tests de integración para crear/actualizar tareas con due_at
- `backend/test/fixtures/tasks.yml`: Fixtures actualizados con casos de prueba
- `frontend/src/components/TaskForm.jsx`: Input datetime-local añadido al formulario
- `frontend/src/components/TaskItem.jsx`: Lógica de visualización y estado de vencimiento
- `frontend/src/index.css`: Estilos para input de fecha e indicadores visuales
- `frontend/src/services/api.js`: Modificado para enviar due_at en createTask
- `frontend/src/__tests__/TaskForm.test.jsx`: Tests del formulario con campo de fecha
- `frontend/src/__tests__/TaskItem.test.jsx`: Tests de visualización y estados de vencimiento

### Cambios Clave

1. **Base de Datos**: Campo `due_at` tipo datetime, nullable, permitiendo tareas sin fecha de vencimiento

2. **Backend**: Controller actualizado para permitir el parámetro `due_at` en task_params, sin validaciones adicionales ya que el campo es opcional

3. **Frontend - TaskForm**:
   - Nuevo estado `dueAt` para manejar la fecha seleccionada
   - Input `datetime-local` para selección de fecha y hora
   - Submit modificado para enviar objeto `{ title, due_at }` en lugar de solo string

4. **Frontend - TaskItem**:
   - Función `getDueStatus()` que calcula si una tarea está vencida o próxima a vencer
   - Función `formatDueDate()` que formatea la fecha para mostrarla en español
   - Lógica que ignora tareas completadas al calcular estado de vencimiento
   - Clases CSS dinámicas aplicadas según el estado

5. **Indicadores Visuales**:
   - **Overdue** (vencida): Borde izquierdo rojo, fondo rosa claro, fecha en rojo
   - **Due Soon** (próxima a vencer en 24h): Borde izquierdo naranja, fondo amarillo claro, fecha en naranja
   - Solo aplican a tareas no completadas

## Como Usar

### Crear una Tarea con Fecha de Vencimiento

1. Escribe el título de la tarea en el campo "Nueva tarea..."
2. Selecciona fecha y hora en el selector de fecha/hora (opcional)
3. Haz clic en "Añadir"
4. La tarea se creará y mostrará la fecha de vencimiento si se estableció

### Ver Estado de Vencimiento

- **Sin indicador**: Tarea sin fecha de vencimiento o con fecha lejana (>24h)
- **Borde naranja + fondo amarillo**: Tarea vence en las próximas 24 horas
- **Borde rojo + fondo rosa**: Tarea vencida (fecha pasada)
- **Nota**: Tareas completadas nunca muestran indicadores de vencimiento

### Editar o Eliminar Fecha de Vencimiento

Actualmente la aplicación permite:
- Crear tareas sin fecha (dejar el campo vacío)
- Crear tareas con fecha
- Las tareas existentes continúan funcionando sin cambios

## Configuracion

No se requiere configuración adicional. El campo es completamente opcional y:
- Las tareas antiguas (sin due_at) siguen funcionando normalmente
- No se requieren datos iniciales ni migraciones de datos existentes
- El campo se serializa automáticamente en JSON como ISO 8601 datetime
- Las fechas se almacenan en UTC en la base de datos

## Testing

### Ejecutar Tests

```bash
# Backend
cd backend && bin/rails test

# Frontend
cd frontend && npm test
```

### Casos Cubiertos

**Backend**:
- Crear tarea sin due_at (campo opcional)
- Crear tarea con due_at válido
- Actualizar tarea para añadir due_at
- Formato correcto de serialización JSON
- Validación de parámetros permitidos

**Frontend**:
- Renderizado del input datetime-local
- Envío de formulario con fecha
- Envío de formulario sin fecha
- Visualización de fecha en TaskItem
- Cálculo correcto de estado overdue
- Cálculo correcto de estado due-soon
- Tareas completadas no muestran indicadores
- Formato correcto de fecha en español

## Notas

### Decisiones de Diseño

- **Campo Nullable**: Permite flexibilidad total - tareas pueden existir con o sin fecha de vencimiento
- **Umbral de 24 horas**: Define "próximo a vencer" - podría hacerse configurable en el futuro
- **Formato datetime-local**: Compatible con todos los navegadores modernos, proporciona UI nativa
- **UTC en Base de Datos**: Las fechas se almacenan en UTC y se convierten a hora local en frontend automáticamente
- **Ignorar Completadas**: Las tareas completadas nunca muestran indicadores de vencimiento, reduciendo ruido visual

### Convenciones

- Nombre del campo: `due_at` siguiendo convención Rails para timestamps
- Formato de fecha visual: `toLocaleString('es-ES')` para mostrar en español
- Clases CSS: `task-overdue` y `task-due-soon` para estados de vencimiento

### Limitaciones Actuales

- No hay funcionalidad de edición de fecha en tarea existente (solo al crear)
- No hay ordenamiento automático por fecha de vencimiento
- No hay notificaciones o recordatorios de fechas próximas
- El umbral de 24 horas está hardcodeado

### Extensiones Futuras Posibles

- Edición de fecha de vencimiento en tareas existentes
- Ordenamiento y filtrado por fecha de vencimiento
- Notificaciones push o email para fechas próximas
- Configuración de umbral personalizable (6h, 12h, 24h, 48h)
- Vista de calendario para visualizar tareas por fecha
- Tareas recurrentes con fechas de vencimiento automáticas
