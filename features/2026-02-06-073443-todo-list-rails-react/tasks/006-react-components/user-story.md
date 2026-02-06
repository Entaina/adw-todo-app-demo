# Tarea 006: Componentes React y Servicio API

## Metadata
task_id: `006`
feature_id: `2026-02-06-073443-todo-list-rails-react`
requisito: `RF-01, RF-02, RF-03, RF-04, RF-09, RF-10, RNF-02, RNF-07`
created_at: `2026-02-06T09:00:00Z`
status: `defined`
priority: `1`

## Análisis de Conflictos

### Tareas Relacionadas
No hay tareas existentes en otros features.

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| src/components/*.jsx | Creación | Ninguna | NO |
| src/services/api.js | Creación | Ninguna | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 003, 005
- **Bloquea a**: ninguna

## Historia de Usuario
**Como** usuario final
**Quiero** una interfaz web para gestionar mi lista de tareas
**Para** poder crear, ver, completar y eliminar tareas desde el navegador

## Criterios de Aceptación
- [ ] Existe servicio `src/services/api.js` con funciones fetch para GET, POST, PATCH, DELETE a /api/tasks
- [ ] Existen componentes `TaskList.jsx`, `TaskItem.jsx`, `TaskForm.jsx` con funcionalidad CRUD completa
- [ ] El componente TaskItem muestra checkbox para completar y botón eliminar
- [ ] El componente TaskForm tiene input y botón para crear tareas
- [ ] Todos los tests en `src/__tests__/` pasan con `npm run test`

## Escenarios

### Escenario 1: Visualizar lista de tareas
- **Dado** que el backend tiene 5 tareas
- **Cuando** cargo la aplicación en el navegador
- **Entonces** veo las 5 tareas renderizadas en la lista

### Escenario 2: Crear nueva tarea
- **Dado** que escribo "Comprar pan" en el input
- **Cuando** presiono Enter o click en "Añadir"
- **Entonces** la tarea se crea y aparece en la lista inmediatamente

### Escenario 3: Marcar tarea como completada
- **Dado** que tengo una tarea sin completar
- **Cuando** hago click en su checkbox
- **Entonces** la tarea se marca visualmente como completada (tachada o con estilo diferente)

### Escenario 4: Eliminar tarea
- **Dado** que tengo una tarea en la lista
- **Cuando** hago click en el botón "Eliminar"
- **Entonces** la tarea desaparece de la lista inmediatamente

### Escenario 5: Huecos intencionales
- **Dado** que la aplicación funciona básicamente
- **Cuando** reviso el código
- **Entonces** no hay loading states, no hay manejo de errores en UI, no hay validación frontend

## Notas
**Huecos Intencionales para Labs**: Esta implementación deliberadamente NO incluye:
- Loading states (sin spinners durante fetch)
- Manejo de errores en UI (si la API falla, no hay feedback visual)
- Validación frontend (solo backend valida)
- Optimistic updates refinados

Esto es intencional para dar material a los labs de Nivel 1. Los componentes deben usar useState local (sin Context/Redux). El servicio API debe usar fetch directo (sin axios/React Query).
