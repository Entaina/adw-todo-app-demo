# Tarea 005: Frontend Base Setup - React + Vite

## Metadata
task_id: `005`
feature_id: `2026-02-06-073443-todo-list-rails-react`
requisito: `RNF-04, RNF-06`
created_at: `2026-02-06T09:00:00Z`
status: `defined`
priority: `1`

## Análisis de Conflictos

### Tareas Relacionadas
No hay tareas existentes en otros features.

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| frontend/ | Creación | Ninguna | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 001 (para poder probar integración con backend)
- **Bloquea a**: 006

## Historia de Usuario
**Como** desarrollador frontend
**Quiero** una aplicación React con Vite configurada
**Para** tener la base donde construir los componentes de la interfaz

## Criterios de Aceptación
- [ ] Existe carpeta `frontend/` con aplicación React 18 + Vite
- [ ] La aplicación arranca exitosamente con `npm run dev` en puerto 5173
- [ ] El archivo `vite.config.js` incluye configuración de tests con Vitest
- [ ] El `package.json` incluye dependencias: react, react-dom, vite, vitest, @testing-library/react
- [ ] Existe componente básico `App.jsx` que renderiza "Todo List"

## Escenarios

### Escenario 1: Arrancar servidor de desarrollo
- **Dado** que tengo Node.js 18+ instalado
- **Cuando** ejecuto `cd frontend && npm install && npm run dev`
- **Entonces** el servidor arranca en http://localhost:5173

### Escenario 2: Ejecutar tests
- **Dado** que el proyecto está instalado
- **Cuando** ejecuto `npm run test`
- **Entonces** Vitest ejecuta los tests sin errores

### Escenario 3: Build de producción
- **Dado** que la aplicación está funcionando
- **Cuando** ejecuto `npm run build`
- **Entonces** se genera carpeta `dist/` con assets optimizados

## Notas
Esta tarea solo configura la base del frontend. No incluye componentes funcionales todavía, solo la estructura y configuración de Vite + React + Vitest. El componente App.jsx inicial puede ser un placeholder simple.
