# Feature: Fecha Límite para Tareas

**ADW ID:** 3d8fef2f
**Fecha:** 2026-03-04
**Especificacion:** .issues/28/plan.md

## Overview

Se implementó un campo opcional de fecha límite (deadline) para las tareas, permitiendo a los usuarios organizar mejor su trabajo y priorizar tareas urgentes. La funcionalidad incluye entrada de fecha en el formulario, visualización con formato legible y destacado visual para fechas próximas o vencidas.

## Que se Construyo

- Campo de base de datos `deadline` (tipo date, nullable) en el modelo Task
- Input de tipo date en el formulario de creación de tareas
- Visualización de fecha límite en cada tarea con formato en español
- Sistema de destacado visual: verde (normal), naranja (próxima), rojo (vencida)
- Suite completa de tests para backend y frontend
- Migración de base de datos y actualización de anotaciones del modelo

## Implementacion Tecnica

### Ficheros Modificados

- `backend/db/migrate/20260304142309_add_deadline_to_tasks.rb`: Migración para añadir columna deadline a la tabla tasks
- `backend/app/models/task.rb`: Actualización de anotaciones del modelo para incluir el campo deadline
- `backend/app/controllers/api/tasks_controller.rb`: Añadido `:deadline` a los parámetros permitidos
- `backend/test/fixtures/tasks.yml`: Fixtures actualizadas con ejemplos de tareas con y sin deadline
- `backend/test/models/task_test.rb`: Tests unitarios para validar que deadline es opcional y acepta fechas válidas
- `backend/test/controllers/api/tasks_controller_test.rb`: Tests de integración para crear y actualizar tareas con deadline
- `frontend/src/services/api.js`: Servicio API actualizado para enviar deadline en formato de objeto `{ title, deadline }`
- `frontend/src/components/TaskForm.jsx`: Añadido estado y input de tipo date para capturar la fecha límite
- `frontend/src/components/TaskItem.jsx`: Lógica para mostrar fecha con formato español y determinar estado visual (overdue/soon/normal)
- `frontend/src/index.css`: Estilos para el input de fecha y para los tres estados de deadline (normal, soon, overdue)
- `frontend/src/__tests__/TaskForm.test.jsx`: Tests para verificar renderizado y envío del campo deadline
- `frontend/src/__tests__/TaskItem.test.jsx`: Tests para verificar visualización y estilos condicionales de deadline

### Cambios Clave

1. **Base de datos**: Se añadió columna `deadline` de tipo `date` (nullable) que permite almacenar fechas sin componente de hora
2. **API Backend**: El controller permite recibir y devolver el campo `deadline` en todas las operaciones CRUD
3. **Formulario Frontend**: Input de tipo date con estado React que envía la fecha al backend (o `null` si está vacío)
4. **Visualización**: Sistema de determinación de estado basado en diferencia de días entre hoy y la fecha límite:
   - `overdue` (rojo): fecha en el pasado
   - `soon` (naranja): fecha dentro de 7 días o menos
   - `normal` (verde): fecha a más de 7 días
5. **Testing**: 202 líneas añadidas distribuidas entre tests de backend (modelo y controller) y frontend (componentes)

## Como Usar

1. **Crear tarea con fecha límite**:
   - Escribe el título de la tarea en el campo de texto
   - Haz clic en el input de fecha y selecciona una fecha límite (opcional)
   - Haz clic en "Añadir" para crear la tarea

2. **Crear tarea sin fecha límite**:
   - Escribe solo el título y haz clic en "Añadir"
   - La tarea se creará sin fecha límite (campo opcional)

3. **Interpretar el estado visual**:
   - **Verde**: La tarea tiene una fecha límite a más de 7 días
   - **Naranja**: La tarea vence en 7 días o menos (urgente)
   - **Rojo**: La tarea está vencida (fecha en el pasado)
   - Sin badge: La tarea no tiene fecha límite asignada

## Configuracion

No se requiere configuración adicional. La funcionalidad está disponible inmediatamente después de ejecutar las migraciones de base de datos:

```bash
cd backend && bin/rails db:migrate
```

## Testing

### Tests Backend
```bash
cd backend && bin/rails test
```

Tests incluidos:
- Validación de que deadline puede ser nil
- Validación de que deadline acepta fechas válidas
- Controller acepta deadline en create y update
- API devuelve deadline en las respuestas JSON

### Tests Frontend
```bash
cd frontend && npm test -- --run
```

Tests incluidos:
- Renderizado del input de fecha en TaskForm
- Envío de formulario con y sin deadline
- Visualización de deadline en TaskItem
- Aplicación correcta de clases CSS según estado (overdue/soon/normal)

## Notas

- El campo `deadline` es de tipo `date` (no `datetime`) porque solo interesa el día, no la hora específica
- La lógica de "fecha próxima" considera 7 días o menos desde hoy
- El formato de fecha usa `toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })` para mostrar fechas como "15 mar 2026"
- La comparación de fechas elimina el componente de hora (`setHours(0, 0, 0, 0)`) para evitar errores de zona horaria
- Las tareas pueden tener fechas en el pasado (validación intencional, ya que las tareas pueden estar vencidas)
- Si el usuario completa una tarea vencida, seguirá mostrando el badge rojo hasta que se elimine o actualice la fecha
