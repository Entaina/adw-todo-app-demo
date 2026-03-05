import { useState, useEffect } from 'react';

const THEME_KEY = 'theme';

export const useTheme = () => {
  const [theme, setTheme] = useState('light');

  // Read theme from localStorage on mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_KEY);

      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        // Detect system preference if no stored value
        try {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(prefersDark ? 'dark' : 'light');
        } catch {
          // matchMedia not available, use default
          setTheme('light');
        }
      }
    } catch {
      // localStorage not available, use default
      setTheme('light');
    }
  }, []);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // localStorage not available, silently fail
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};
