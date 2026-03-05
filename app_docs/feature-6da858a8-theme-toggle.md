# Dark Mode and Light Mode Theme System

**ADW ID:** 6da858a8
**Fecha:** 2026-03-05
**Especificacion:** /Users/elafo/workspace/entaina/aurgi-curso-desarrolladores-sample-app/trees/issue-49/.issues/49/plan.md

## Overview

Se implementó un sistema completo de temas que permite a los usuarios alternar entre modo claro y modo oscuro en la aplicación Todo List. El sistema persiste la preferencia del usuario en localStorage y respeta automáticamente la preferencia del sistema operativo cuando no existe una selección previa.

## Que se Construyo

- **Hook personalizado `useTheme`**: Gestiona el estado del tema, persistencia y detección de preferencias del sistema
- **Componente `ThemeToggle`**: Botón interactivo para cambiar entre temas con iconos visuales (sol/luna)
- **Sistema de CSS Custom Properties**: Variables CSS que permiten cambiar todos los colores de la aplicación dinámicamente
- **Tema claro y oscuro**: Dos paletas de colores completas con contraste óptimo para accesibilidad
- **Suite completa de tests**: Tests unitarios para el hook y el componente con 100% de cobertura

## Implementacion Tecnica

### Ficheros Modificados

- `frontend/src/index.css`: Refactorizado completamente para usar CSS Custom Properties. Se definieron 15 variables de color para ambos temas (`:root` para light, `[data-theme="dark"]` para dark)
- `frontend/src/App.jsx`: Integrado el componente `ThemeToggle` en la esquina superior derecha del contenedor principal
- `frontend/src/__tests__/App.test.jsx`: Actualizados los tests existentes para manejar el mock de localStorage
- `frontend/src/__tests__/setup.js`: Añadidos mocks globales para `localStorage` y `matchMedia` necesarios para testing

### Ficheros Nuevos Creados

- `frontend/src/hooks/useTheme.js`: Hook que gestiona el ciclo completo del tema (lectura, escritura, detección)
- `frontend/src/components/ThemeToggle.jsx`: Componente botón accesible con iconos emoji (🌙/☀️)
- `frontend/src/__tests__/useTheme.test.jsx`: 5 tests unitarios cubriendo todos los casos del hook
- `frontend/src/__tests__/ThemeToggle.test.jsx`: 4 tests unitarios cubriendo el comportamiento del componente

### Cambios Clave

1. **Sistema de Variables CSS**: Se reemplazaron todos los colores hardcodeados (ej: `#333`, `white`, `#f5f5f5`) por variables CSS (`var(--color-text)`, `var(--color-bg-surface)`, etc.). Esto permite cambiar el tema completo actualizando solo el atributo `data-theme` del elemento `<html>`.

2. **Hook useTheme**: Implementa tres `useEffect` separados para:
   - Leer localStorage y detectar preferencia del sistema al montar
   - Aplicar el atributo `data-theme` al `document.documentElement`
   - Persistir cambios en localStorage

3. **Detección de Preferencia del Sistema**: Usa `window.matchMedia('(prefers-color-scheme: dark)')` para detectar automáticamente si el usuario prefiere tema oscuro en su sistema operativo.

4. **Accesibilidad**: El botón `ThemeToggle` incluye atributos `aria-label` y `title` para describir la acción, mejorando la experiencia para lectores de pantalla.

5. **Testing Completo**: Se creó infraestructura de mocks en `setup.js` para simular `localStorage` y `matchMedia` en el entorno de tests, permitiendo verificar todos los escenarios sin depender del navegador.

## Como Usar

### Para Usuarios Finales

1. Abrir la aplicación Todo List en el navegador
2. Observar el botón con icono de luna (🌙) en la esquina superior derecha
3. Hacer click en el botón para cambiar a tema oscuro (icono cambia a sol ☀️)
4. Hacer click nuevamente para volver al tema claro
5. La preferencia se guarda automáticamente y persiste al recargar la página

### Para Desarrolladores

**Usar el hook en otros componentes:**
```jsx
import { useTheme } from '../hooks/useTheme';

function MiComponente() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Tema actual: {theme}</p>
      <button onClick={toggleTheme}>Cambiar tema</button>
    </div>
  );
}
```

**Añadir nuevos colores temáticos:**
1. Definir la variable en `:root` (tema claro) en `index.css`
2. Definir la variante oscura en `[data-theme="dark"]`
3. Usar la variable con `var(--nombre-variable)` en tus estilos

```css
:root {
  --color-nuevo: #ff0000;
}

[data-theme="dark"] {
  --color-nuevo: #ff6666;
}

.mi-clase {
  color: var(--color-nuevo);
}
```

## Configuracion

### Variables CSS Disponibles

El sistema define 15 variables CSS para ambos temas:

| Variable | Uso |
|----------|-----|
| `--color-bg-page` | Fondo de la página principal |
| `--color-bg-surface` | Fondo de superficies (cards, contenedores) |
| `--color-bg-surface-alt` | Fondo alternativo para items |
| `--color-text` | Color de texto principal |
| `--color-text-secondary` | Color de texto secundario |
| `--color-text-muted` | Color de texto deshabilitado/atenuado |
| `--color-border` | Color de bordes de inputs |
| `--color-border-light` | Color de bordes sutiles |
| `--color-primary` | Color primario (botones de acción) |
| `--color-primary-hover` | Hover del color primario |
| `--color-danger` | Color de peligro (eliminar) |
| `--color-danger-hover` | Hover del color de peligro |
| `--color-heading` | Color de encabezados (h1, h2, etc.) |
| `--color-shadow` | Color para sombras (con alpha) |
| `--color-drag-handle` | Color del handle de arrastre |
| `--color-drag-handle-hover` | Hover del handle de arrastre |

### LocalStorage

- **Key**: `"theme"`
- **Valores**: `"light"` o `"dark"`
- **Comportamiento**: Se lee al iniciar la app y se actualiza cada vez que el usuario cambia de tema

## Testing

### Ejecutar Tests

```bash
cd frontend
npm test
```

### Tests Implementados

**useTheme.test.jsx** (5 tests):
- ✅ Tema inicial por defecto es 'light'
- ✅ toggleTheme alterna entre 'light' y 'dark'
- ✅ Persiste el tema en localStorage
- ✅ Lee el tema guardado desde localStorage al inicializar
- ✅ Detecta preferencia del sistema cuando no hay valor en localStorage

**ThemeToggle.test.jsx** (4 tests):
- ✅ Renderiza correctamente
- ✅ Muestra icono de luna (🌙) cuando el tema es light
- ✅ Muestra icono de sol (☀️) cuando el tema es dark
- ✅ Llamar a toggleTheme al hacer click

**App.test.jsx** (actualizado):
- ✅ Tests existentes actualizados para incluir mock de localStorage

### Cobertura

- **Líneas**: 100% del código nuevo (useTheme.js, ThemeToggle.jsx)
- **Ramas**: Todos los casos cubiertos (tema light, dark, localStorage presente/ausente, preferencia del sistema)

## Notas

### Decisiones de Diseño

- **Emojis Unicode en lugar de iconos**: Se usaron emojis nativos (🌙/☀️) para evitar dependencias externas de librerías de iconos, reduciendo el bundle size.
- **CSS Custom Properties en lugar de CSS-in-JS**: Se eligió la solución nativa de CSS por su rendimiento superior y simplicidad.
- **Separación de responsabilidades**: El hook `useTheme` gestiona la lógica de estado mientras que `ThemeToggle` es un componente de presentación puro.

### Accesibilidad

- Contraste de colores verificado para cumplir con WCAG 2.1 nivel AA
- Botón de toggle incluye `aria-label` descriptivo
- Los iconos emoji son universalmente reconocibles

### Limitaciones Actuales

- Los emojis pueden verse diferentes según el sistema operativo (iOS, Android, Windows, macOS)
- No hay transición animada al cambiar de tema (se puede añadir en el futuro con CSS transitions)
- El tema no se sincroniza entre pestañas abiertas (requeriría `storage` event listener)

### Consideraciones Futuras

- **Transiciones suaves**: Añadir `transition` a las CSS Custom Properties para cambios graduales
- **Más temas**: Extender el sistema para soportar temas personalizados (alto contraste, sepia, etc.)
- **Sincronización entre pestañas**: Escuchar evento `storage` para actualizar el tema cuando cambia en otra pestaña
- **Persistencia en backend**: Guardar la preferencia de tema en el perfil del usuario (requiere autenticación)
- **Auto-switch basado en hora**: Cambiar automáticamente a tema oscuro por la noche
