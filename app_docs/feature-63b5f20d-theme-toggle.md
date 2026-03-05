# Feature: Dark Mode and Light Mode Theme Toggle

**ADW ID:** 63b5f20d
**Date:** 2026-03-05
**Specification:** /Users/elafo/workspace/entaina/aurgi-curso-desarrolladores-sample-app/trees/issue-49/.issues/49/plan.md

## Overview

Implemented a complete theme system allowing users to toggle between light and dark modes in the Todo List application. The theme preference is persisted in localStorage and respects the operating system's color scheme preference (`prefers-color-scheme`) as the initial default if no explicit selection has been made.

## What Was Built

- **Custom React Hook (`useTheme`)**: Manages theme state, localStorage persistence, and system preference detection
- **Theme Toggle Component (`ThemeToggle`)**: Interactive button with sun/moon icons for theme switching
- **CSS Custom Properties System**: Comprehensive set of CSS variables for both light and dark themes
- **Complete Test Coverage**: Unit tests for both the hook and component including edge cases
- **Accessibility Features**: Proper ARIA labels and keyboard focus indicators

## Implementation Technical Details

### Files Modified

- `frontend/src/hooks/useTheme.js`: Created custom hook managing theme state, persistence, and system detection
- `frontend/src/components/ThemeToggle.jsx`: Created toggle button component with theme-appropriate icons
- `frontend/src/index.css`: Refactored all hardcoded colors to CSS Custom Properties with light/dark variants
- `frontend/src/App.jsx`: Integrated ThemeToggle component into application header
- `frontend/src/__tests__/useTheme.test.jsx`: Comprehensive tests for hook functionality
- `frontend/src/__tests__/ThemeToggle.test.jsx`: Component rendering and interaction tests
- `frontend/src/__tests__/setup.js`: Test environment setup for localStorage and matchMedia mocks

### Key Technical Changes

1. **CSS Custom Properties Architecture**: Defined 16 semantic color variables covering backgrounds, text, borders, primary/danger colors, and shadows. Each variable has both light and dark values, switched via `data-theme` attribute on the `<html>` element.

2. **useTheme Hook Implementation**:
   - Three separate `useEffect` hooks managing distinct concerns (initialization, DOM application, persistence)
   - Graceful fallbacks for environments without localStorage or matchMedia support
   - Try-catch blocks protecting against storage access errors (incognito mode)
   - System preference detection using `window.matchMedia('(prefers-color-scheme: dark)')`

3. **Component Integration**: ThemeToggle positioned absolutely in top-right corner of app container, using Unicode emoji characters (🌙/☀️) to avoid icon library dependencies

4. **Test Coverage**: Tests verify state management, persistence, system preference detection, localStorage edge cases, and component rendering with proper icon display

## How to Use

### For End Users

1. Open the Todo List application
2. Locate the theme toggle button in the top-right corner (displays moon icon 🌙 in light mode, sun icon ☀️ in dark mode)
3. Click the button to switch between themes
4. Your preference is automatically saved and will be remembered when you return

### For Developers

**Using the useTheme hook in other components:**

```jsx
import { useTheme } from '../hooks/useTheme';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

**Adding new themed colors:**

1. Add CSS variable to `:root` selector in `index.css` for light theme
2. Add corresponding variable to `[data-theme="dark"]` selector for dark theme
3. Use `var(--your-variable-name)` throughout your styles

**Example:**

```css
:root {
  --color-success: #27ae60;
}

[data-theme="dark"] {
  --color-success: #2ecc71;
}

.success-button {
  background-color: var(--color-success);
}
```

## Configuration

### Theme Persistence

Theme preference is stored in localStorage with the key `'theme'`. Values: `'light'` | `'dark'`.

### System Preference Detection

When no stored preference exists, the system uses `window.matchMedia('(prefers-color-scheme: dark)')` to detect OS-level theme preference. This query runs once on initial mount.

### Fallback Behavior

- If localStorage is unavailable (incognito mode): defaults to `'light'`, no persistence
- If matchMedia is unavailable: defaults to `'light'`
- Invalid values in localStorage: ignored, system preference or default used

## Testing

### Running Tests

```bash
cd frontend && npm test
```

### Test Coverage Includes

- **useTheme Hook**:
  - Default theme initialization
  - Theme toggle functionality
  - localStorage persistence
  - Reading stored theme on mount
  - System preference detection with matchMedia
  - Error handling for missing localStorage/matchMedia

- **ThemeToggle Component**:
  - Correct rendering
  - Icon display based on theme (🌙 for light, ☀️ for dark)
  - Click interaction triggers theme toggle
  - Accessibility attributes (aria-label, title)

### Manual Testing

1. Open application in browser
2. Click theme toggle - observe UI changes immediately
3. Refresh page - theme persists
4. Open DevTools > Application > Local Storage - verify `theme` key
5. Delete localStorage entry and refresh - observe system preference detection
6. Test in browser's incognito mode - theme works but doesn't persist across sessions

## Notes

### Design Decisions

- **Unicode Emojis for Icons**: Avoids external icon library dependencies, works universally
- **CSS Custom Properties**: Native browser support, excellent performance, simple maintenance
- **Separate useEffect Hooks**: Follows React best practices by separating concerns (initialization, application, persistence)
- **data-theme Attribute**: Standard pattern for theme switching, better than class-based approaches

### Accessibility Considerations

- Theme toggle includes `aria-label` describing the action
- Focus indicator with 2px outline using primary color
- Hover state provides visual feedback (scale transform)
- Sufficient color contrast in both themes for text readability

### Future Enhancements

- Smooth color transitions when switching themes (CSS transitions on color properties)
- Additional theme variants (high contrast, custom brand themes)
- User-customizable color picker for personal themes
- Backend sync for theme preference across devices
- Automatic theme switching based on time of day
- Respect system theme changes while app is running (matchMedia event listener)

### Known Limitations

- Theme preference not synchronized across browser tabs in real-time (requires page refresh)
- No animation/transition between theme switches (intentional for performance)
- System preference detection only runs on initial mount, doesn't react to OS changes during session
