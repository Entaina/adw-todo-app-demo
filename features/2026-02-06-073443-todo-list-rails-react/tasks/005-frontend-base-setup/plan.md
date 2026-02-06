# Plan: Frontend Base Setup - React + Vite

## Metadata
task_path: `features/2026-02-06-073443-todo-list-rails-react/tasks/005-frontend-base-setup`
feature_id: `2026-02-06-073443-todo-list-rails-react`
created_at: `2026-02-06T12:00:00Z`
status: `planned`

## Análisis de Código Existente

### Búsqueda Realizada
Se exploró el proyecto para identificar:
- ✅ Backend Rails API ya configurado en `backend/`
- ✅ CORS configurado en `backend/config/initializers/cors.rb` para puerto 5173
- ✅ API REST disponible en `/api/tasks` (index, create, update, destroy)
- ✅ Modelo Task con campos: id, title, completed, timestamps
- ✅ Validaciones: title obligatorio, máx 200 chars
- ❌ No existe carpeta `frontend/` - debe crearse completamente
- ❌ No existen componentes React - deben crearse
- ❌ No existe configuración de Vite - debe crearse

### Matriz de Impacto (OBLIGATORIO)

| Componente | Archivo Existente | Líneas | Impacto |
|------------|-------------------|--------|---------|
| Frontend Directory | N/A | N/A | CREAR |
| Vite Config | N/A | N/A | CREAR |
| Package.json | N/A | N/A | CREAR |
| App.jsx | N/A | N/A | CREAR |
| main.jsx | N/A | N/A | CREAR |
| index.css | N/A | N/A | CREAR |
| index.html | N/A | N/A | CREAR |
| Test Setup | N/A | N/A | CREAR |

**Archivos Nuevos Requeridos**: 8+
**Archivos a Modificar**: 0

### Evaluación de Patrones

**Patrones del Backend a Seguir**:
- Estructura modular con carpetas por responsabilidad (`app/controllers`, `app/models`)
- Tests con naming claro (`task_test.rb`)
- Configuración separada en `config/`
- API REST JSON con convenciones estándar

**Patrones a Aplicar en Frontend**:
- Estructura de carpetas por tipo: `components/`, `services/`, `__tests__/`
- Componentes React funcionales con hooks
- Tests con React Testing Library siguiendo el patrón del backend (tests simples y claros)
- Configuración en archivos raíz (`vite.config.js`, `package.json`)
- Naming consistente: PascalCase para componentes, camelCase para servicios

### Matriz de Conflictos

| Tipo | Recurso | Otra Tarea | Resolución |
|------|---------|------------|------------|
| N/A | N/A | N/A | N/A |

**Conflictos Encontrados**: 0

La tarea 001 (Backend Base Setup) ya está completa, por lo que no hay conflictos. La tarea 006 (React Components) depende de esta tarea, pero se ejecutará después.

## Resumen
Crear la estructura completa del frontend React con Vite desde cero. Incluye la configuración de Vite, instalación de dependencias (React 18, Vite, Vitest, Testing Library), un componente App.jsx básico que muestre "Todo List", y la configuración de tests con Vitest. El frontend estará preparado para conectarse al backend Rails API que ya existe en el puerto 3000.

## Historia de Usuario
**Como** desarrollador frontend
**Quiero** una aplicación React con Vite configurada
**Para** tener la base donde construir los componentes de la interfaz

## Archivos a Modificar
Ninguno - esta tarea solo crea archivos nuevos.

## Archivos a Crear
- `frontend/package.json` - Dependencias y scripts npm
- `frontend/vite.config.js` - Configuración de Vite y Vitest
- `frontend/index.html` - Punto de entrada HTML
- `frontend/src/main.jsx` - Punto de entrada JavaScript
- `frontend/src/App.jsx` - Componente raíz básico
- `frontend/src/index.css` - Estilos básicos
- `frontend/src/__tests__/App.test.jsx` - Test básico del componente App
- `frontend/.gitignore` - Archivos a ignorar en git
- `frontend/README.md` - Documentación del frontend

## Plan de Implementación

### Fase 1: Fundamentos
Crear la estructura básica de carpetas y archivos de configuración del proyecto Vite + React. Esto incluye el `package.json` con todas las dependencias necesarias, la configuración de Vite para desarrollo y tests, y el HTML raíz.

### Fase 2: Implementación Principal
Implementar el componente React básico (`App.jsx`) que renderice "Todo List" como placeholder, el punto de entrada de la aplicación (`main.jsx`), y los estilos mínimos necesarios.

### Fase 3: Integración
Configurar Vitest para ejecutar tests, crear un test básico que valide que el componente App renderiza correctamente, y documentar los scripts de desarrollo en el README.

## Pasos de Implementación

IMPORTANTE: Ejecutar cada paso en orden.

### 0. Refactorización Previa (SI SE ENCONTRARON VIOLACIONES)

**No aplica** - No se encontraron violaciones de diseño. El frontend no existe aún.

### 1. Crear estructura de carpetas del frontend
- Crear carpeta `frontend/` en la raíz del proyecto
- Crear carpeta `frontend/src/`
- Crear carpeta `frontend/src/components/`
- Crear carpeta `frontend/src/services/`
- Crear carpeta `frontend/src/__tests__/`

```bash
mkdir -p frontend/src/components frontend/src/services frontend/src/__tests__
```

### 2. Crear package.json con dependencias
- Crear `frontend/package.json` con:
  - Nombre del proyecto: "todo-list-frontend"
  - Versión: "0.1.0"
  - Type: "module"
  - Scripts: dev, build, test, preview
  - Dependencies: react@^18.3.1, react-dom@^18.3.1
  - DevDependencies:
    - vite@^6.0.0
    - @vitejs/plugin-react@^4.3.0
    - vitest@^2.0.0
    - @testing-library/react@^16.0.0
    - @testing-library/jest-dom@^6.5.0
    - jsdom@^25.0.0

### 3. Crear vite.config.js
- Configurar plugin de React
- Configurar Vitest con:
  - environment: 'jsdom'
  - globals: true
  - setupFiles: apuntando a setup de testing-library

### 4. Crear index.html
- HTML5 básico con:
  - Meta charset UTF-8
  - Meta viewport para responsive
  - Título: "Todo List"
  - Div con id="root"
  - Script que importa /src/main.jsx

### 5. Crear punto de entrada main.jsx
- Importar React, ReactDOM y App
- Importar index.css
- Renderizar App en el elemento #root usando ReactDOM.createRoot

### 6. Crear componente App.jsx básico
- Componente funcional que retorna:
  - Un div contenedor con className="app"
  - Un h1 con el texto "Todo List"
  - Un párrafo placeholder: "Frontend configurado correctamente"

### 7. Crear index.css con estilos básicos
- Reset básico (box-sizing, margin, padding)
- Estilos para body:
  - font-family: system-ui, sans-serif
  - padding: 2rem
  - color: #333
- Estilos para .app:
  - max-width: 600px
  - margin: 0 auto
- Estilos básicos para h1 y párrafos

### 8. Crear .gitignore para frontend
- Ignorar:
  - node_modules/
  - dist/
  - .DS_Store
  - *.local
  - coverage/

### 9. Crear test básico App.test.jsx
- Importar React, render, screen de testing-library
- Importar App
- Test: "renders Todo List heading"
  - Renderizar App
  - Buscar texto "Todo List" en un heading
  - Verificar que existe en el documento

### 10. Crear vitest setup file
- Crear `frontend/src/__tests__/setup.js`
- Importar '@testing-library/jest-dom'
- Configurar matchers personalizados

### 11. Crear README.md del frontend
- Documentar:
  - Nombre del proyecto
  - Tecnologías: React 18, Vite, Vitest
  - Comandos disponibles:
    - `npm install` - Instalar dependencias
    - `npm run dev` - Servidor de desarrollo (puerto 5173)
    - `npm run build` - Build de producción
    - `npm run test` - Ejecutar tests
    - `npm run preview` - Preview del build
  - URL del backend: http://localhost:3000
  - Estructura de carpetas

### 12. Instalar dependencias
```bash
cd frontend && npm install
```

### 13. Validar que el servidor de desarrollo arranca
```bash
cd frontend && timeout 10 npm run dev || true
```
Verificar que muestra el mensaje de servidor corriendo en puerto 5173

### 14. Ejecutar tests
```bash
cd frontend && npm run test -- --run
```
Verificar que el test de App.jsx pasa

### 15. Validación Final
- Verificar que todos los archivos fueron creados
- Verificar que `npm run dev` arranca sin errores
- Verificar que `npm run test` pasa
- Verificar que `npm run build` genera la carpeta dist/

## Criterios de Aceptación
- [x] Existe carpeta `frontend/` con aplicación React 18 + Vite
- [x] La aplicación arranca exitosamente con `npm run dev` en puerto 5173
- [x] El archivo `vite.config.js` incluye configuración de tests con Vitest
- [x] El `package.json` incluye dependencias: react, react-dom, vite, vitest, @testing-library/react
- [x] Existe componente básico `App.jsx` que renderiza "Todo List"

## Comandos de Validación

```bash
# Verificar que el plan tiene todas las secciones requeridas
test -f features/2026-02-06-073443-todo-list-rails-react/tasks/005-frontend-base-setup/plan.md && echo "✓ Plan existe"

# Verificar estructura de carpetas
test -d frontend/src/components && echo "✓ Carpeta components existe"
test -d frontend/src/services && echo "✓ Carpeta services existe"
test -d frontend/src/__tests__ && echo "✓ Carpeta __tests__ existe"

# Verificar archivos principales
test -f frontend/package.json && echo "✓ package.json existe"
test -f frontend/vite.config.js && echo "✓ vite.config.js existe"
test -f frontend/index.html && echo "✓ index.html existe"
test -f frontend/src/main.jsx && echo "✓ main.jsx existe"
test -f frontend/src/App.jsx && echo "✓ App.jsx existe"
test -f frontend/src/index.css && echo "✓ index.css existe"

# Instalar y ejecutar tests
cd frontend && npm install && npm run test -- --run

# Verificar que el build funciona
cd frontend && npm run build && test -d dist && echo "✓ Build exitoso"

# Verificar que el servidor puede arrancar (timeout a 5 segundos)
cd frontend && timeout 5 npm run dev > /dev/null 2>&1 &
sleep 3
curl -s http://localhost:5173 | grep -q "Todo List" && echo "✓ Servidor funciona"
pkill -f "vite"
```

### Comandos de Verificación de Archivos
```bash
# Verificar que todos los archivos referenciados existen
for file in package.json vite.config.js index.html src/main.jsx src/App.jsx src/index.css src/__tests__/App.test.jsx; do
  test -f "frontend/$file" && echo "✓ frontend/$file" || echo "✗ frontend/$file NO ENCONTRADO"
done
```

## Notas

**Decisiones de Diseño**:
- Se usa Vite en lugar de Create React App por ser más rápido y moderno
- Se usa Vitest en lugar de Jest porque es nativo de Vite y más eficiente
- Se mantiene la estructura simple sin state management (useState se agregará en tarea 006)
- El componente App.jsx es solo un placeholder - la funcionalidad real se implementará en la tarea 006

**Compatibilidad con Backend**:
- El backend ya tiene CORS configurado para puerto 5173
- Las rutas de API están disponibles en `/api/tasks`
- No se requiere autenticación ni headers especiales

**Próximos Pasos**:
- Tarea 006 implementará los componentes funcionales (TaskList, TaskItem, TaskForm)
- Tarea 006 agregará el servicio API para comunicarse con el backend
- Esta tarea solo establece la fundación técnica

**Huecos Intencionales** (por diseño del curso):
- No hay loading states
- No hay manejo de errores visual
- No hay validación frontend
- Estos se agregarán en labs posteriores como ejercicios para estudiantes
