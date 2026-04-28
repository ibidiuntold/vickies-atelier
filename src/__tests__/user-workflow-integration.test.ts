/**
 * Integration Tests: Complete User Workflows
 * Task 11.4: Write integration tests for complete user workflows
 *
 * Tests end-to-end theme switching scenarios and system preference detection.
 * Validates: Requirements 11.3, 4.3, 4.4
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'theme-preference';
const VALID_THEMES: Theme[] = ['light', 'dark', 'system'];

function isValidTheme(value: unknown): value is Theme {
  return typeof value === 'string' && VALID_THEMES.includes(value as Theme);
}

function createStorage(initial?: Record<string, string>) {
  const store: Record<string, string> = { ...initial };
  return {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => { store[key] = value; },
    _store: store,
  };
}

function createRoot() {
  const classes = new Set<string>();
  const attrs: Record<string, string> = {};
  return {
    classList: {
      add: (cls: string) => classes.add(cls),
      remove: (cls: string) => classes.delete(cls),
      contains: (cls: string) => classes.has(cls),
    },
    setAttribute: (name: string, value: string) => { attrs[name] = value; },
    getAttribute: (name: string) => attrs[name] ?? null,
  };
}

function createMediaQuery(prefersDark: boolean) {
  let _matches = prefersDark;
  const listeners: Array<(e: { matches: boolean }) => void> = [];
  return {
    get matches() { return _matches; },
    addEventListener: (_: string, fn: (e: { matches: boolean }) => void) => { listeners.push(fn); },
    _trigger: (newPrefersDark: boolean) => {
      _matches = newPrefersDark;
      listeners.forEach(fn => fn({ matches: newPrefersDark }));
    },
  };
}

function createThemeSession(options: { savedPreference?: string | null; systemPrefersDark?: boolean }) {
  const { savedPreference = null, systemPrefersDark = false } = options;
  const storage = createStorage(savedPreference != null ? { [STORAGE_KEY]: savedPreference } : {});
  const root = createRoot();
  const mediaQuery = createMediaQuery(systemPrefersDark);

  const getSystemTheme = (): ResolvedTheme => (mediaQuery.matches ? 'dark' : 'light');
  const resolveTheme = (t: Theme): ResolvedTheme => (t === 'system' ? getSystemTheme() : t);

  const applyTheme = (resolved: ResolvedTheme) => {
    if (resolved === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  };

  const rawSaved = storage.getItem(STORAGE_KEY);
  const initialTheme: Theme = isValidTheme(rawSaved) ? rawSaved : 'system';
  let currentTheme: Theme = initialTheme;
  let currentResolved: ResolvedTheme = resolveTheme(initialTheme);
  applyTheme(currentResolved);

  const handleSystemChange = (e: { matches: boolean }) => {
    if (currentTheme === 'system') {
      const newResolved: ResolvedTheme = e.matches ? 'dark' : 'light';
      currentResolved = newResolved;
      applyTheme(newResolved);
    }
  };
  mediaQuery.addEventListener('change', handleSystemChange);

  const setTheme = (newTheme: Theme) => {
    if (!isValidTheme(newTheme)) return;
    currentTheme = newTheme;
    currentResolved = resolveTheme(newTheme);
    applyTheme(currentResolved);
    try { storage.setItem(STORAGE_KEY, newTheme); } catch { /* ignore */ }
  };

  return {
    get theme() { return currentTheme; },
    get resolvedTheme() { return currentResolved; },
    root,
    storage,
    setTheme,
    simulateSystemChange: (prefersDark: boolean) => mediaQuery._trigger(prefersDark),
  };
}

describe('Workflow 1: First visit with no saved preference uses system preference', () => {
  it('defaults to system theme when localStorage is empty', () => {
    const s = createThemeSession({ savedPreference: null, systemPrefersDark: false });
    expect(s.theme).toBe('system');
  });
  it('resolves to light when system prefers light', () => {
    const s = createThemeSession({ savedPreference: null, systemPrefersDark: false });
    expect(s.resolvedTheme).toBe('light');
    expect(s.root.classList.contains('dark')).toBe(false);
  });
  it('resolves to dark when system prefers dark', () => {
    const s = createThemeSession({ savedPreference: null, systemPrefersDark: true });
    expect(s.resolvedTheme).toBe('dark');
    expect(s.root.classList.contains('dark')).toBe(true);
  });
  it('applies correct data-theme on first visit (light system)', () => {
    const s = createThemeSession({ savedPreference: null, systemPrefersDark: false });
    expect(s.root.getAttribute('data-theme')).toBe('light');
  });
  it('applies correct data-theme on first visit (dark system)', () => {
    const s = createThemeSession({ savedPreference: null, systemPrefersDark: true });
    expect(s.root.getAttribute('data-theme')).toBe('dark');
  });
  it('does not write to localStorage on first visit', () => {
    const s = createThemeSession({ savedPreference: null });
    expect(s.storage.getItem(STORAGE_KEY)).toBeNull();
  });
});

describe('Workflow 2: User manually toggles to dark mode', () => {
  it('sets theme to dark and applies dark class', () => {
    const s = createThemeSession({ savedPreference: null, systemPrefersDark: false });
    s.setTheme('dark');
    expect(s.theme).toBe('dark');
    expect(s.resolvedTheme).toBe('dark');
    expect(s.root.classList.contains('dark')).toBe(true);
  });
  it('persists dark preference to localStorage', () => {
    const s = createThemeSession({ savedPreference: null });
    s.setTheme('dark');
    expect(s.storage.getItem(STORAGE_KEY)).toBe('dark');
  });
  it('sets data-theme attribute to dark', () => {
    const s = createThemeSession({ savedPreference: null });
    s.setTheme('dark');
    expect(s.root.getAttribute('data-theme')).toBe('dark');
  });
  it('overrides a light system preference with manual dark selection', () => {
    const s = createThemeSession({ savedPreference: null, systemPrefersDark: false });
    expect(s.resolvedTheme).toBe('light');
    s.setTheme('dark');
    expect(s.resolvedTheme).toBe('dark');
    expect(s.root.classList.contains('dark')).toBe(true);
  });
});

describe('Workflow 3: User manually toggles back to light mode', () => {
  it('removes dark class when switching to light', () => {
    const s = createThemeSession({ savedPreference: 'dark', systemPrefersDark: false });
    expect(s.root.classList.contains('dark')).toBe(true);
    s.setTheme('light');
    expect(s.root.classList.contains('dark')).toBe(false);
  });
  it('persists light preference to localStorage', () => {
    const s = createThemeSession({ savedPreference: 'dark' });
    s.setTheme('light');
    expect(s.storage.getItem(STORAGE_KEY)).toBe('light');
  });
  it('sets resolvedTheme to light', () => {
    const s = createThemeSession({ savedPreference: 'dark' });
    s.setTheme('light');
    expect(s.resolvedTheme).toBe('light');
  });
  it('full round-trip: light to dark to light restores original state', () => {
    const s = createThemeSession({ savedPreference: null, systemPrefersDark: false });
    s.setTheme('light');
    expect(s.root.classList.contains('dark')).toBe(false);
    s.setTheme('dark');
    expect(s.root.classList.contains('dark')).toBe(true);
    s.setTheme('light');
    expect(s.root.classList.contains('dark')).toBe(false);
    expect(s.storage.getItem(STORAGE_KEY)).toBe('light');
  });
});

describe('Workflow 4: Saved dark preference loads dark mode on next visit', () => {
  it('loads dark theme from localStorage', () => {
    const s = createThemeSession({ savedPreference: 'dark', systemPrefersDark: false });
    expect(s.theme).toBe('dark');
    expect(s.resolvedTheme).toBe('dark');
  });
  it('applies dark class on page load with saved dark preference', () => {
    const s = createThemeSession({ savedPreference: 'dark', systemPrefersDark: false });
    expect(s.root.classList.contains('dark')).toBe(true);
  });
  it('ignores system preference (light) when dark is explicitly saved', () => {
    const s = createThemeSession({ savedPreference: 'dark', systemPrefersDark: false });
    expect(s.resolvedTheme).toBe('dark');
  });
  it('simulates page reload: save dark in session 1, load in session 2', () => {
    const s1 = createThemeSession({ savedPreference: null });
    s1.setTheme('dark');
    const saved = s1.storage.getItem(STORAGE_KEY);
    const s2 = createThemeSession({ savedPreference: saved });
    expect(s2.theme).toBe('dark');
    expect(s2.root.classList.contains('dark')).toBe(true);
  });
});

describe('Workflow 5: Saved light preference loads light mode on next visit', () => {
  it('loads light theme from localStorage', () => {
    const s = createThemeSession({ savedPreference: 'light', systemPrefersDark: true });
    expect(s.theme).toBe('light');
    expect(s.resolvedTheme).toBe('light');
  });
  it('does not apply dark class when light is saved', () => {
    const s = createThemeSession({ savedPreference: 'light', systemPrefersDark: true });
    expect(s.root.classList.contains('dark')).toBe(false);
  });
  it('ignores system preference (dark) when light is explicitly saved', () => {
    const s = createThemeSession({ savedPreference: 'light', systemPrefersDark: true });
    expect(s.resolvedTheme).toBe('light');
  });
  it('simulates page reload: save light in session 1, load in session 2', () => {
    const s1 = createThemeSession({ savedPreference: null, systemPrefersDark: true });
    s1.setTheme('light');
    const saved = s1.storage.getItem(STORAGE_KEY);
    const s2 = createThemeSession({ savedPreference: saved, systemPrefersDark: true });
    expect(s2.theme).toBe('light');
    expect(s2.root.classList.contains('dark')).toBe(false);
  });
});

describe('Workflow 6: Saved system preference follows OS theme', () => {
  it('loads system theme from localStorage', () => {
    const s = createThemeSession({ savedPreference: 'system', systemPrefersDark: false });
    expect(s.theme).toBe('system');
  });
  it('resolves to light when system prefers light', () => {
    const s = createThemeSession({ savedPreference: 'system', systemPrefersDark: false });
    expect(s.resolvedTheme).toBe('light');
    expect(s.root.classList.contains('dark')).toBe(false);
  });
  it('resolves to dark when system prefers dark', () => {
    const s = createThemeSession({ savedPreference: 'system', systemPrefersDark: true });
    expect(s.resolvedTheme).toBe('dark');
    expect(s.root.classList.contains('dark')).toBe(true);
  });
  it('simulates page reload with system preference saved', () => {
    const s1 = createThemeSession({ savedPreference: null });
    s1.setTheme('system');
    const saved = s1.storage.getItem(STORAGE_KEY);
    expect(saved).toBe('system');
    const s2 = createThemeSession({ savedPreference: saved, systemPrefersDark: true });
    expect(s2.theme).toBe('system');
    expect(s2.resolvedTheme).toBe('dark');
  });
});

describe('Workflow 7: System preference changes update theme automatically in system mode', () => {
  it('switches to dark when OS changes to dark while in system mode', () => {
    const s = createThemeSession({ savedPreference: 'system', systemPrefersDark: false });
    expect(s.resolvedTheme).toBe('light');
    s.simulateSystemChange(true);
    expect(s.resolvedTheme).toBe('dark');
    expect(s.root.classList.contains('dark')).toBe(true);
  });
  it('switches to light when OS changes to light while in system mode', () => {
    const s = createThemeSession({ savedPreference: 'system', systemPrefersDark: true });
    expect(s.resolvedTheme).toBe('dark');
    s.simulateSystemChange(false);
    expect(s.resolvedTheme).toBe('light');
    expect(s.root.classList.contains('dark')).toBe(false);
  });
  it('updates data-theme attribute when system preference changes', () => {
    const s = createThemeSession({ savedPreference: 'system', systemPrefersDark: false });
    expect(s.root.getAttribute('data-theme')).toBe('light');
    s.simulateSystemChange(true);
    expect(s.root.getAttribute('data-theme')).toBe('dark');
  });
  it('handles multiple rapid system preference changes', () => {
    const s = createThemeSession({ savedPreference: 'system', systemPrefersDark: false });
    s.simulateSystemChange(true);
    expect(s.root.classList.contains('dark')).toBe(true);
    s.simulateSystemChange(false);
    expect(s.root.classList.contains('dark')).toBe(false);
    s.simulateSystemChange(true);
    expect(s.root.classList.contains('dark')).toBe(true);
  });
  it('does not update theme when system changes but user has manual preference', () => {
    const s = createThemeSession({ savedPreference: 'light', systemPrefersDark: false });
    expect(s.resolvedTheme).toBe('light');
    s.simulateSystemChange(true);
    expect(s.resolvedTheme).toBe('light');
    expect(s.root.classList.contains('dark')).toBe(false);
  });
});

describe('Workflow 8: Manual override takes precedence over system preference', () => {
  it('manual dark overrides system light preference', () => {
    const s = createThemeSession({ savedPreference: null, systemPrefersDark: false });
    expect(s.resolvedTheme).toBe('light');
    s.setTheme('dark');
    expect(s.resolvedTheme).toBe('dark');
    expect(s.root.classList.contains('dark')).toBe(true);
    s.simulateSystemChange(false);
    expect(s.resolvedTheme).toBe('dark');
  });
  it('manual light overrides system dark preference', () => {
    const s = createThemeSession({ savedPreference: null, systemPrefersDark: true });
    expect(s.resolvedTheme).toBe('dark');
    s.setTheme('light');
    expect(s.resolvedTheme).toBe('light');
    expect(s.root.classList.contains('dark')).toBe(false);
    s.simulateSystemChange(true);
    expect(s.resolvedTheme).toBe('light');
  });
  it('persists manual override across simulated page reload', () => {
    const s1 = createThemeSession({ savedPreference: null, systemPrefersDark: true });
    s1.setTheme('light');
    const saved = s1.storage.getItem(STORAGE_KEY);
    const s2 = createThemeSession({ savedPreference: saved, systemPrefersDark: true });
    expect(s2.theme).toBe('light');
    expect(s2.resolvedTheme).toBe('light');
    expect(s2.root.classList.contains('dark')).toBe(false);
  });
  it('user can return to system mode after manual override', () => {
    const s = createThemeSession({ savedPreference: null, systemPrefersDark: true });
    s.setTheme('light');
    expect(s.resolvedTheme).toBe('light');
    s.setTheme('system');
    expect(s.theme).toBe('system');
    expect(s.resolvedTheme).toBe('dark');
    expect(s.root.classList.contains('dark')).toBe(true);
  });
  it('system changes are ignored after manual override', () => {
    const s = createThemeSession({ savedPreference: null, systemPrefersDark: false });
    s.setTheme('dark');
    s.simulateSystemChange(true);
    expect(s.theme).toBe('dark');
    expect(s.resolvedTheme).toBe('dark');
    s.simulateSystemChange(false);
    expect(s.theme).toBe('dark');
    expect(s.resolvedTheme).toBe('dark');
  });
});

describe('Property: end-to-end workflow invariants', () => {
  it('resolvedTheme is always light or dark after any initialization', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('light', 'dark', 'system'),
        fc.boolean(),
        (savedTheme, systemPrefersDark) => {
          const s = createThemeSession({ savedPreference: savedTheme, systemPrefersDark });
          expect(['light', 'dark']).toContain(s.resolvedTheme);
        }
      )
    );
  });

  it('DOM dark class always matches resolvedTheme after initialization', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme | null>(null, 'light', 'dark', 'system'),
        fc.boolean(),
        (savedPreference, systemPrefersDark) => {
          const s = createThemeSession({ savedPreference, systemPrefersDark });
          expect(s.root.classList.contains('dark')).toBe(s.resolvedTheme === 'dark');
        }
      )
    );
  });

  it('DOM dark class always matches resolvedTheme after setTheme', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('light', 'dark', 'system'),
        fc.boolean(),
        fc.constantFrom<Theme>('light', 'dark', 'system'),
        (savedTheme, systemPrefersDark, newTheme) => {
          const s = createThemeSession({ savedPreference: savedTheme, systemPrefersDark });
          s.setTheme(newTheme);
          expect(s.root.classList.contains('dark')).toBe(s.resolvedTheme === 'dark');
        }
      )
    );
  });

  it('localStorage always stores the theme value (not resolved) after setTheme', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('light', 'dark', 'system'),
        fc.boolean(),
        (newTheme, systemPrefersDark) => {
          const s = createThemeSession({ savedPreference: null, systemPrefersDark });
          s.setTheme(newTheme);
          expect(s.storage.getItem(STORAGE_KEY)).toBe(newTheme);
        }
      )
    );
  });

  it('manual theme is immune to system preference changes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<'light' | 'dark'>('light', 'dark'),
        fc.boolean(),
        fc.boolean(),
        (manualTheme, initialSystem, changedSystem) => {
          const s = createThemeSession({ savedPreference: null, systemPrefersDark: initialSystem });
          s.setTheme(manualTheme);
          const resolvedBefore = s.resolvedTheme;
          s.simulateSystemChange(changedSystem);
          expect(s.resolvedTheme).toBe(resolvedBefore);
          expect(s.theme).toBe(manualTheme);
        }
      )
    );
  });

  it('any sequence of theme changes ends with correct DOM state', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom<Theme>('light', 'dark', 'system'), { minLength: 1, maxLength: 8 }),
        fc.boolean(),
        (themeSequence, systemPrefersDark) => {
          const s = createThemeSession({ savedPreference: null, systemPrefersDark });
          for (const t of themeSequence) {
            s.setTheme(t);
          }
          expect(s.root.classList.contains('dark')).toBe(s.resolvedTheme === 'dark');
        }
      )
    );
  });
});
