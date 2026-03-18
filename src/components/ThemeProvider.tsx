'use client';

import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Constants for better maintainability
const STORAGE_KEY = 'theme-preference';
const VALID_THEMES: Theme[] = ['light', 'dark', 'system'];
const DEFAULT_THEME: Theme = 'system';

interface ThemeProviderProps {
  children: ReactNode;
}

// Type guard to validate theme values
function isValidTheme(value: unknown): value is Theme {
  return typeof value === 'string' && VALID_THEMES.includes(value as Theme);
}

// Enhanced localStorage operations with better error handling
const storage = {
  get: (key: string): Theme | null => {
    try {
      if (typeof window === 'undefined') return null;
      const value = localStorage.getItem(key);
      return isValidTheme(value) ? value : null;
    } catch (error) {
      // Handle various localStorage errors:
      // - SecurityError: localStorage disabled
      // - QuotaExceededError: storage full
      // - InvalidStateError: storage corrupted
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  },

  set: (key: string, value: Theme): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
      return false;
    }
  }
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Always start with light theme to match server rendering
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);
  
  // Use ref to track if we're in the middle of a theme change to prevent race conditions
  const isChangingTheme = useRef(false);
  
  // Track system preference changes for better debugging
  const systemPreferenceRef = useRef<ResolvedTheme>('light');

  // Get system preference with enhanced error handling
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    
    try {
      const matches = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = matches ? 'dark' : 'light';
      systemPreferenceRef.current = systemTheme;
      return systemTheme;
    } catch (error) {
      // Handle cases where matchMedia is not supported
      console.warn('Failed to detect system theme preference:', error);
      return 'light';
    }
  }, []);

  // Resolve theme based on current setting
  const resolveTheme = useCallback((currentTheme: Theme): ResolvedTheme => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  }, [getSystemTheme]);

  // Apply theme to document root with performance optimization
  const applyTheme = useCallback((resolved: ResolvedTheme) => {
    if (typeof window === 'undefined' || isChangingTheme.current) return;
    
    try {
      const root = document.documentElement;
      
      // Use requestAnimationFrame for smooth DOM updates
      requestAnimationFrame(() => {
        if (resolved === 'dark') {
          root.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
        } else {
          root.classList.remove('dark');
          root.setAttribute('data-theme', 'light');
        }
      });
    } catch (error) {
      console.warn('Failed to apply theme to DOM:', error);
    }
  }, []);

  // Set theme and persist to localStorage with enhanced error handling
  const setTheme = useCallback((newTheme: Theme) => {
    // Validate input
    if (!isValidTheme(newTheme)) {
      console.warn('Invalid theme value:', newTheme);
      return;
    }

    isChangingTheme.current = true;
    
    try {
      setThemeState(newTheme);
      const resolved = resolveTheme(newTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);
      
      // Persist to localStorage with success feedback
      const saved = storage.set(STORAGE_KEY, newTheme);
      if (!saved) {
        console.warn('Theme preference could not be saved - changes will not persist across sessions');
      }
    } catch (error) {
      console.error('Failed to set theme:', error);
    } finally {
      isChangingTheme.current = false;
    }
  }, [resolveTheme, applyTheme]);

  // Initialize theme on mount (client-side only) with enhanced error handling
  useEffect(() => {
    let initialTheme: Theme = DEFAULT_THEME;
    
    try {
      // Try to read from localStorage with enhanced validation
      const savedTheme = storage.get(STORAGE_KEY);
      if (savedTheme) {
        initialTheme = savedTheme;
      }
    } catch (error) {
      console.warn('Failed to initialize theme from storage, using default:', error);
    }
    
    try {
      setThemeState(initialTheme);
      const resolved = resolveTheme(initialTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);
      setMounted(true);
    } catch (error) {
      console.error('Failed to initialize theme system:', error);
      // Fallback to safe defaults
      setThemeState('light');
      setResolvedTheme('light');
      setMounted(true);
    }
  }, [resolveTheme, applyTheme]);

  // Listen for system theme changes with debouncing and enhanced error handling
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    let timeoutId: NodeJS.Timeout;
    let mediaQuery: MediaQueryList;

    try {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        // Debounce rapid changes to prevent excessive re-renders
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          try {
            const newResolvedTheme = e.matches ? 'dark' : 'light';
            systemPreferenceRef.current = newResolvedTheme;
            
            // Only update if we're still in system mode
            if (theme === 'system') {
              setResolvedTheme(newResolvedTheme);
              applyTheme(newResolvedTheme);
            }
          } catch (error) {
            console.warn('Failed to handle system theme change:', error);
          }
        }, 100); // 100ms debounce
      };

      // Use the modern addEventListener if available, fallback to addListener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }

      return () => {
        clearTimeout(timeoutId);
        try {
          if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', handleChange);
          } else {
            // Fallback for older browsers
            mediaQuery.removeListener(handleChange);
          }
        } catch (error) {
          console.warn('Failed to cleanup system theme listener:', error);
        }
      };
    } catch (error) {
      console.warn('Failed to setup system theme listener:', error);
      return;
    }
  }, [theme, mounted, applyTheme]);

  // Additional effect to handle system preference changes when switching to system mode
  useEffect(() => {
    if (!mounted || theme !== 'system') return;
    
    // Immediately sync with current system preference when switching to system mode
    const currentSystemTheme = getSystemTheme();
    if (currentSystemTheme !== resolvedTheme) {
      setResolvedTheme(currentSystemTheme);
      applyTheme(currentSystemTheme);
    }
  }, [theme, mounted, getSystemTheme, resolvedTheme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}
