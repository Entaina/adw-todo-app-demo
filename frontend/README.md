# Todo List Frontend

Aplicación React 18 con Vite para gestionar tareas.

## Tecnologías

- **React 18** - Framework UI
- **Vite 6** - Build tool y dev server
- **Vitest 2** - Testing framework
- **React Testing Library** - Testing utilities

## Comandos

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```
Servidor de desarrollo en http://localhost:5173

### Build
```bash
npm run build
```
Genera carpeta `dist/` con archivos optimizados para producción

### Tests
```bash
npm run test
```
Ejecuta tests con Vitest

### Preview
```bash
npm run preview
```
Previsualiza el build de producción

## Configuración

- **Backend API**: http://localhost:3000
- **Puerto Frontend**: 5173 (por defecto)

## Estructura

```
frontend/
├── src/
│   ├── components/      # Componentes React
│   ├── services/        # Servicios API
│   ├── __tests__/       # Tests
│   ├── App.jsx          # Componente raíz
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── index.html           # HTML raíz
├── vite.config.js       # Configuración Vite + Vitest
└── package.json         # Dependencias y scripts
```
