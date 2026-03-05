import { useState, useEffect } from 'react';

const THEME_KEY = 'theme';

export const useTheme = () => {
  const [theme, setTheme] = useState('light');

  // Read theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);

    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // Detect system preference if no stored value
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist theme to localStorage
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};
