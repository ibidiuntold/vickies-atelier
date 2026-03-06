'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  // Get system preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Resolve theme based on current setting
  const resolveTheme = (currentTheme: Theme): ResolvedTheme => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Apply theme to document root
  const applyTheme = (resolved: ResolvedTheme) => {
    const root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    
    // Persist to localStorage
    try {
      localStorage.setItem('theme-preference', newTheme);
    } catch (error) {
      // Handle cases where localStorage is unavailable
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Initialize theme on mount
  useEffect(() => {
    let initialTheme: Theme = 'system';
    
    // Try to read from localStorage
    try {
      const savedTheme = localStorage.getItem('theme-preference');
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        initialTheme = savedTheme;
      }
    } catch (error) {
      // localStorage unavailable, use system preference
      console.warn('Failed to read theme preference:', error);
    }
    
    setThemeState(initialTheme);
    const resolved = resolveTheme(initialTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    setMounted(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newResolvedTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newResolvedTheme);
      applyTheme(newResolvedTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Render children immediately - theme is already applied by inline script in layout
  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
