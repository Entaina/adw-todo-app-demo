# Todo List - Rails API + React

## Metadata
feature_id: `2026-02-06-073443-todo-list-rails-react`
created_at: `2026-02-06T08:45:00Z`
status: `prd_created`

## Análisis de PRDs Existentes

### PRDs Revisados
No se encontraron PRDs existentes en el proyecto. Este es el primer feature a desarrollar.

### Matriz de Solapamiento

| Aspecto | Este PRD | PRD Existente | Conflicto? |
|---------|----------|---------------|------------|
| N/A | N/A | N/A | N/A |

**Solapamientos Encontrados**: 0

### Resolución de Solapamientos
No aplica. No hay solapamientos con otros features.

## Resumen
Aplicación web funcional mínima de gestión de tareas (todo list) que servirá como base para practicar desarrollo agéntico. Incluye un backend Rails API con CRUD completo del modelo Task y un frontend React con Vite. La aplicación tiene suficiente estructura para trabajar y suficientes "huecos" intencionales para que los labs del curso tengan sentido.

## Problema
Los estudiantes necesitan una aplicación base funcional pero incompleta para practicar desarrollo agéntico en el curso. La aplicación debe:
- Ser suficientemente real para que las tareas tengan sentido
- Tener "huecos" intencionales (sin loading states, sin manejo de errores en UI, validación mínima) para que los labs agreguen valor
- Permitir evolucionar con features más complejos en niveles avanzados
- Servir como plantilla reutilizable para diferentes tipos de cambios

## Usuarios
**Estudiantes del curso de desarrollo agéntico** que necesitan:
- Una aplicación funcional para experimentar con prompts
- Código suficientemente simple para entender rápido
- Oportunidades claras de mejora para practicar
- Estructura profesional (tests, separación frontend/backend)

**Facilitadores del curso** que necesitan:
- Material consistente para todos los labs
- Flexibilidad para añadir features en diferentes niveles
- Seeds predefinidos para demos reproducibles

## Alcance

### Incluido
- Backend Rails 7.1+ en modo API con modelo Task (id, title, completed, timestamps)
- Endpoints CRUD completos (/api/tasks)
- Validaciones básicas (title obligatorio, máx 200 chars)
- Tests de modelo y controlador con Minitest
- Frontend React 18 con Vite
- Componentes: App, TaskList, TaskItem, TaskForm
- Servicios HTTP (fetch directo, sin React Query)
- Tests de componentes con Vitest + React Testing Library
- CORS configurado para desarrollo local
- SQLite para desarrollo
- Seeds con 5 tareas de ejemplo
- Scripts de desarrollo documentados
- Dos apps separadas (backend/ y frontend/) en el mismo repo

### Excluido (por ahora)
- Descripción de tareas (se añade en Nivel 1)
- Fechas límite (Nivel 2)
- Prioridades (Nivel 2)
- Etiquetas (Nivel 2)
- Listas/proyectos
- Usuarios/autenticación
- Subtareas (Nivel 3)
- Notificaciones (Nivel 2)
- Webhooks/integraciones externas (Nivel 3)
- Loading states (lo añadirán los estudiantes)
- Manejo de errores en UI (lo añadirán los estudiantes)
- Validación frontend (lo añadirán los estudiantes)
- Estado global (Context/Zustand se añade en Nivel 2)

## Requisitos

### Funcionales
- **RF-01**: El sistema debe permitir listar todas las tareas existentes
- **RF-02**: El sistema debe permitir crear una nueva tarea con título
- **RF-03**: El sistema debe permitir marcar/desmarcar una tarea como completada
- **RF-04**: El sistema debe permitir eliminar una tarea
- **RF-05**: El backend debe validar que el título es obligatorio
- **RF-06**: El backend debe validar que el título no excede 200 caracteres
- **RF-07**: Las tareas nuevas deben tener completed = false por defecto
- **RF-08**: El backend debe exponer API REST JSON en /api/tasks
- **RF-09**: El frontend debe comunicarse con el backend vía fetch
- **RF-10**: El frontend debe renderizar tareas en tiempo real al hacer cambios
- **RF-11**: Los seeds deben crear 5 tareas de ejemplo reproducibles

### No Funcionales
- **RNF-01 Simplicidad**: El código debe ser fácil de entender para estudiantes sin experiencia previa en Rails o React
- **RNF-02 Testeable**: Debe tener tests básicos que pasen en backend y frontend
- **RNF-03 Extensible**: La arquitectura debe permitir añadir features en niveles posteriores sin refactoring mayor
- **RNF-04 Profesional**: Debe seguir convenciones estándar de Rails y React (estructura de carpetas, naming)
- **RNF-05 Reproducible**: Los seeds y scripts deben funcionar consistentemente en diferentes máquinas
- **RNF-06 Sin Dependencias Complejas**: No usar librerías de estado global, no usar gemas pesadas, no usar Docker
- **RNF-07 Huecos Intencionales**: Debe tener limitaciones deliberadas para que los labs tengan material (sin loading states, sin error handling en UI, sin validación frontend)

## Flujo de Usuario
1. El usuario abre la aplicación en el navegador (http://localhost:5173)
2. El sistema carga y muestra la lista de tareas desde la API
3. El usuario escribe el título de una nueva tarea en el input
4. El usuario presiona Enter o hace click en el botón "Añadir"
5. El sistema envía POST /api/tasks al backend
6. El backend valida y crea la tarea
7. El sistema actualiza la lista en el frontend mostrando la nueva tarea
8. El usuario hace click en el checkbox de una tarea
9. El sistema envía PATCH /api/tasks/:id con completed=true
10. El sistema actualiza el estado visual del checkbox
11. El usuario hace click en el botón "Eliminar" de una tarea
12. El sistema envía DELETE /api/tasks/:id
13. El sistema remueve la tarea de la lista visual
14. Resultado: El usuario puede gestionar su lista de tareas con feedback visual inmediato

## Dependencias

### Con Otros Features
No hay dependencias con otros features. Este es el feature base del proyecto.

### Técnicas
- **Ruby 3.2+**: Lenguaje backend
- **Rails 7.1+ (modo API)**: Framework backend
- **SQLite**: Base de datos desarrollo
- **Minitest**: Framework de tests backend
- **Node.js 18+**: Runtime frontend
- **React 18**: Librería UI
- **Vite**: Build tool frontend
- **Vitest**: Framework de tests frontend
- **React Testing Library**: Librería de tests de componentes
- **rack-cors**: Gem para configurar CORS entre backend y frontend

## Estructura de Archivos

### Backend
```
backend/
├── app/
│   ├── controllers/
│   │   └── api/
│   │       └── tasks_controller.rb
│   └── models/
│       └── task.rb
├── db/
│   ├── migrate/
│   │   └── YYYYMMDDHHMMSS_create_tasks.rb
│   └── seeds.rb
├── test/
│   ├── models/
│   │   └── task_test.rb
│   └── controllers/
│       └── api/
│           └── tasks_controller_test.rb
└── config/
    └── initializers/
        └── cors.rb
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── App.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskItem.jsx
│   │   └── TaskForm.jsx
│   ├── services/
│   │   └── api.js
│   ├── __tests__/
│   │   ├── TaskItem.test.jsx
│   │   ├── TaskForm.test.jsx
│   │   └── TaskList.test.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

## Criterios de Aceptación
- [ ] El backend arranca en puerto 3000 con `rails s`
- [ ] El frontend arranca en puerto 5173 con `npm run dev`
- [ ] Los tests del backend pasan con `rails test`
- [ ] Los tests del frontend pasan con `npm run test`
- [ ] Los seeds cargan 5 tareas de ejemplo con `rails db:seed`
- [ ] Se pueden listar todas las tareas en el frontend
- [ ] Se puede crear una tarea nueva desde el frontend
- [ ] Se puede marcar/desmarcar una tarea como completada
- [ ] Se puede eliminar una tarea desde el frontend
- [ ] El backend devuelve error 422 si el título está vacío
- [ ] El backend devuelve error 422 si el título excede 200 caracteres
- [ ] CORS permite requests desde http://localhost:5173

## Notas
**Filosofía de Huecos Intencionales**: Esta v1 tiene limitaciones deliberadas que los estudiantes mejorarán en los labs:
1. No hay loading states (fetch sin spinner)
2. No hay manejo de errores en UI (si la API falla, no hay feedback visual)
3. No hay validación frontend (solo backend valida)
4. Tests básicos (faltan edge cases)

Esto es intencional para dar material práctico a los labs de Nivel 1.

**Evolución Futura**: La arquitectura está diseñada para soportar features más complejos en niveles posteriores sin necesidad de refactoring mayor:
- Nivel 1: description, filtros básicos
- Nivel 2: due_date, priority, tags, estado global, notificaciones
- Nivel 3: subtareas, webhooks, búsqueda avanzada

**Decisiones Técnicas**:
- Se usa fetch directo (no axios/React Query) para simplicidad
- Se usa useState local (no Context/Redux) para facilitar aprendizaje
- Se usa Minitest (no RSpec) por ser el default de Rails
- Se usa SQLite (no PostgreSQL) para evitar configuración compleja
- Dos apps separadas (no monolito) para claridad arquitectónica
