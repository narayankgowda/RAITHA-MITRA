
import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';

type ThemeMode = 'light' | 'dark';
export type ColorTheme = 'green' | 'blue' | 'orange' | 'purple' | 'red' | 'teal' | 'pink' | 'yellow' | 'glass' | 'mountains' | 'fields' | 'midnight';

interface ThemeContextProps {
  theme: ThemeMode;
  toggleTheme: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (color: ColorTheme) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
  colorTheme: 'green',
  setColorTheme: () => {},
});

const ALL_THEMES: ColorTheme[] = [
    'green', 'blue', 'orange', 'purple', 'red', 
    'teal', 'pink', 'yellow', 'glass', 
    'mountains', 'fields', 'midnight'
];

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme as ThemeMode;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
      const storedColor = localStorage.getItem('colorTheme');
      return (storedColor as ColorTheme) || 'green';
  });

  // Handle Light/Dark Mode
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle Color Theme
  useEffect(() => {
      const root = window.document.documentElement;
      
      // Cleanly remove all existing theme classes
      ALL_THEMES.forEach(t => {
          root.classList.remove(`theme-${t}`);
      });
      
      // Add the active theme class
      if (colorTheme !== 'green') {
          root.classList.add(`theme-${colorTheme}`);
      }
      localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const setColorTheme = useCallback((color: ColorTheme) => {
      setColorThemeState(color);
  }, []);
  
  const value = useMemo(() => ({ theme, toggleTheme, colorTheme, setColorTheme }), [theme, toggleTheme, colorTheme, setColorTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
