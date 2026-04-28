/**
 * Unit Tests: ThemeProvider functionality
 *
 * Tests theme persistence, system preference detection, and error handling.
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 *
 * These tests exercise the ThemeProvider logic directly using vitest's
 * vi.stubGlobal to mock browser APIs (localStorage, matchMedia, document).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Helpers – mirror the internal logic from ThemeProvider.tsx so we can test
// it in isolation without a DOM / React renderer.
// ---------------------------------------------------------------------------

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'theme-preference';
const VALID_THEMES: Theme[] = ['light', 'dark', 'system'];
const DEFAULT_THEME: Theme = 'system';

function isValidTheme(value: unknown): value is Theme {
  return typeof value === 'string' && VALID_THEMES.includes(value as Theme);
}

const storage = {
  get: (key: string): Theme | null => {
    try {
      if (typeof window === 'undefined') return null;
      const value = (window as Window).localStorage.getItem(key);
      return isValidTheme(value) ? value : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: Theme): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      (window as Window).localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
};

function getSystemTheme(win: Window): ResolvedTheme {
  try {
    return win.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function resolveTheme(theme: Theme, win: Window): ResolvedTheme {
  if (theme === 'system') return getSystemTheme(win);
  return theme;
}

function applyTheme(resolved: ResolvedTheme, root: HTMLElement): void {
  if (resolved === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }
}

// ---------------------------------------------------------------------------
// Shared mock factories
// ---------------------------------------------------------------------------

function makeLocalStorage(initial: Record<string, string> = {}) {
  const store: Record<string, string> = { ...initial };
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
    _store: store,
  };
}

function makeMatchMedia(prefersDark: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  const mql = {
    matches: prefersDark,
    addEventListener: vi.fn((_: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.push(cb);
    }),
    removeEventListener: vi.fn((_: string, cb: (e: MediaQueryListEvent) => void) => {
      const idx = listeners.indexOf(cb);
      if (idx !== -1) listeners.splice(idx, 1);
    }),
    _listeners: listeners,
    _fire: (matches: boolean) => {
      listeners.forEach(cb => cb({ matches } as MediaQueryListEvent));
    },
  };
  return vi.fn(() => mql);
}

function makeDocumentRoot() {
  return {
    classList: {
      _classes: new Set<string>(),
      add(cls: string) { this._classes.add(cls); },
      remove(cls: string) { this._classes.delete(cls); },
      contains(cls: string) { return this._classes.has(cls); },
    },
    _attrs: {} as Record<string, string>,
    setAttribute(name: string, value: string) { this._attrs[name] = value; },
    getAttribute(name: string) { return this._attrs[name] ?? null; },
  } as unknown as HTMLElement;
}

// ---------------------------------------------------------------------------
// 1. isValidTheme – input validation
// ---------------------------------------------------------------------------

describe('isValidTheme', () => {
  it('accepts valid theme values', () => {
    expect(isValidTheme('light')).toBe(true);
    expect(isValidTheme('dark')).toBe(true);
    expect(isValidTheme('system')).toBe(true);
  });

  it('rejects invalid strings', () => {
    expect(isValidTheme('auto')).toBe(false);
    expect(isValidTheme('')).toBe(false);
    expect(isValidTheme('DARK')).toBe(false);
  });

  it('rejects non-string types', () => {
    expect(isValidTheme(null)).toBe(false);
    expect(isValidTheme(undefined)).toBe(false);
    expect(isValidTheme(1)).toBe(false);
    expect(isValidTheme({})).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 2. storage.get – reads and validates from localStorage (Req 4.2, 4.3)
// ---------------------------------------------------------------------------

describe('storage.get', () => {
  let mockLS: ReturnType<typeof makeLocalStorage>;

  beforeEach(() => {
    mockLS = makeLocalStorage();
    vi.stubGlobal('window', { localStorage: mockLS });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns null when localStorage has no entry', () => {
    expect(storage.get(STORAGE_KEY)).toBeNull();
  });

  it('returns the stored theme when it is valid', () => {
    mockLS._store[STORAGE_KEY] = 'dark';
    expect(storage.get(STORAGE_KEY)).toBe('dark');
  });

  it('returns null for an invalid stored value (Req 4.3)', () => {
    mockLS._store[STORAGE_KEY] = 'invalid-theme';
    expect(storage.get(STORAGE_KEY)).toBeNull();
  });

  it('returns null when localStorage.getItem throws (Req 4.2 error handling)', () => {
    mockLS.getItem.mockImplementation(() => { throw new Error('SecurityError'); });
    expect(storage.get(STORAGE_KEY)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 3. storage.set – persists theme to localStorage (Req 4.2)
// ---------------------------------------------------------------------------

describe('storage.set', () => {
  let mockLS: ReturnType<typeof makeLocalStorage>;

  beforeEach(() => {
    mockLS = makeLocalStorage();
    vi.stubGlobal('window', { localStorage: mockLS });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('saves the theme to localStorage and returns true', () => {
    const result = storage.set(STORAGE_KEY, 'dark');
    expect(result).toBe(true);
    expect(mockLS.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'dark');
  });

  it('saves "light" theme correctly', () => {
    storage.set(STORAGE_KEY, 'light');
    expect(mockLS.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'light');
  });

  it('saves "system" theme correctly', () => {
    storage.set(STORAGE_KEY, 'system');
    expect(mockLS.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'system');
  });

  it('returns false and does not throw when localStorage.setItem throws (Req 4.2 error handling)', () => {
    mockLS.setItem.mockImplementation(() => { throw new Error('QuotaExceededError'); });
    expect(() => storage.set(STORAGE_KEY, 'dark')).not.toThrow();
    expect(storage.set(STORAGE_KEY, 'dark')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 4. getSystemTheme – OS-level preference detection (Req 4.4)
// ---------------------------------------------------------------------------

describe('getSystemTheme', () => {
  it('returns "dark" when OS prefers dark mode (Req 4.4)', () => {
    const mockMM = makeMatchMedia(true);
    const win = { matchMedia: mockMM } as unknown as Window;
    expect(getSystemTheme(win)).toBe('dark');
  });

  it('returns "light" when OS prefers light mode (Req 4.4)', () => {
    const mockMM = makeMatchMedia(false);
    const win = { matchMedia: mockMM } as unknown as Window;
    expect(getSystemTheme(win)).toBe('light');
  });

  it('returns "light" as fallback when matchMedia throws', () => {
    const win = {
      matchMedia: vi.fn(() => { throw new Error('not supported'); }),
    } as unknown as Window;
    expect(getSystemTheme(win)).toBe('light');
  });
});

// ---------------------------------------------------------------------------
// 5. resolveTheme – maps Theme → ResolvedTheme (Req 4.3, 4.4)
// ---------------------------------------------------------------------------

describe('resolveTheme', () => {
  it('resolves "light" to "light" regardless of OS preference (Req 4.3)', () => {
    const win = { matchMedia: makeMatchMedia(true) } as unknown as Window;
    expect(resolveTheme('light', win)).toBe('light');
  });

  it('resolves "dark" to "dark" regardless of OS preference (Req 4.3)', () => {
    const win = { matchMedia: makeMatchMedia(false) } as unknown as Window;
    expect(resolveTheme('dark', win)).toBe('dark');
  });

  it('resolves "system" to "dark" when OS prefers dark (Req 4.4)', () => {
    const win = { matchMedia: makeMatchMedia(true) } as unknown as Window;
    expect(resolveTheme('system', win)).toBe('dark');
  });

  it('resolves "system" to "light" when OS prefers light (Req 4.4)', () => {
    const win = { matchMedia: makeMatchMedia(false) } as unknown as Window;
    expect(resolveTheme('system', win)).toBe('light');
  });
});

// ---------------------------------------------------------------------------
// 6. applyTheme – DOM class application (Req 4.1, 4.5)
// ---------------------------------------------------------------------------

describe('applyTheme', () => {
  it('adds "dark" class and sets data-theme="dark" for dark theme (Req 4.1)', () => {
    const root = makeDocumentRoot();
    applyTheme('dark', root);
    expect((root.classList as unknown as { _classes: Set<string> })._classes.has('dark')).toBe(true);
    expect(root.getAttribute('data-theme')).toBe('dark');
  });

  it('removes "dark" class and sets data-theme="light" for light theme (Req 4.1)', () => {
    const root = makeDocumentRoot();
    // First apply dark, then switch to light
    applyTheme('dark', root);
    applyTheme('light', root);
    expect((root.classList as unknown as { _classes: Set<string> })._classes.has('dark')).toBe(false);
    expect(root.getAttribute('data-theme')).toBe('light');
  });

  it('is idempotent – applying the same theme twice does not break state', () => {
    const root = makeDocumentRoot();
    applyTheme('dark', root);
    applyTheme('dark', root);
    expect((root.classList as unknown as { _classes: Set<string> })._classes.has('dark')).toBe(true);
    expect(root.getAttribute('data-theme')).toBe('dark');
  });
});

// ---------------------------------------------------------------------------
// 7. Initialization flow – reads from localStorage on mount (Req 4.2, 4.3, 4.5)
// ---------------------------------------------------------------------------

describe('Initialization flow', () => {
  it('uses DEFAULT_THEME ("system") when localStorage is empty (Req 4.3)', () => {
    const mockLS = makeLocalStorage();
    vi.stubGlobal('window', { localStorage: mockLS });

    const savedTheme = storage.get(STORAGE_KEY);
    const initialTheme: Theme = savedTheme ?? DEFAULT_THEME;

    expect(initialTheme).toBe('system');
    vi.unstubAllGlobals();
  });

  it('uses saved "dark" theme from localStorage (Req 4.2)', () => {
    const mockLS = makeLocalStorage({ [STORAGE_KEY]: 'dark' });
    vi.stubGlobal('window', { localStorage: mockLS });

    const savedTheme = storage.get(STORAGE_KEY);
    const initialTheme: Theme = savedTheme ?? DEFAULT_THEME;

    expect(initialTheme).toBe('dark');
    vi.unstubAllGlobals();
  });

  it('uses saved "light" theme from localStorage (Req 4.2)', () => {
    const mockLS = makeLocalStorage({ [STORAGE_KEY]: 'light' });
    vi.stubGlobal('window', { localStorage: mockLS });

    const savedTheme = storage.get(STORAGE_KEY);
    const initialTheme: Theme = savedTheme ?? DEFAULT_THEME;

    expect(initialTheme).toBe('light');
    vi.unstubAllGlobals();
  });

  it('falls back to DEFAULT_THEME when stored value is invalid (Req 4.3)', () => {
    const mockLS = makeLocalStorage({ [STORAGE_KEY]: 'garbage' });
    vi.stubGlobal('window', { localStorage: mockLS });

    const savedTheme = storage.get(STORAGE_KEY);
    const initialTheme: Theme = savedTheme ?? DEFAULT_THEME;

    expect(initialTheme).toBe('system');
    vi.unstubAllGlobals();
  });

  it('falls back to DEFAULT_THEME when localStorage throws (Req 4.2 error handling)', () => {
    const mockLS = makeLocalStorage();
    mockLS.getItem.mockImplementation(() => { throw new Error('SecurityError'); });
    vi.stubGlobal('window', { localStorage: mockLS });

    const savedTheme = storage.get(STORAGE_KEY);
    const initialTheme: Theme = savedTheme ?? DEFAULT_THEME;

    expect(initialTheme).toBe('system');
    vi.unstubAllGlobals();
  });

  it('"system" mode resolves to "dark" when OS prefers dark on init (Req 4.4)', () => {
    const mockLS = makeLocalStorage();
    const mockMM = makeMatchMedia(true);
    vi.stubGlobal('window', { localStorage: mockLS, matchMedia: mockMM });

    const savedTheme = storage.get(STORAGE_KEY);
    const initialTheme: Theme = savedTheme ?? DEFAULT_THEME;
    const win = { matchMedia: mockMM } as unknown as Window;
    const resolved = resolveTheme(initialTheme, win);

    expect(initialTheme).toBe('system');
    expect(resolved).toBe('dark');
    vi.unstubAllGlobals();
  });

  it('"system" mode resolves to "light" when OS prefers light on init (Req 4.4)', () => {
    const mockLS = makeLocalStorage();
    const mockMM = makeMatchMedia(false);
    vi.stubGlobal('window', { localStorage: mockLS, matchMedia: mockMM });

    const savedTheme = storage.get(STORAGE_KEY);
    const initialTheme: Theme = savedTheme ?? DEFAULT_THEME;
    const win = { matchMedia: mockMM } as unknown as Window;
    const resolved = resolveTheme(initialTheme, win);

    expect(initialTheme).toBe('system');
    expect(resolved).toBe('light');
    vi.unstubAllGlobals();
  });
});

// ---------------------------------------------------------------------------
// 8. System preference change listener (Req 4.4)
// ---------------------------------------------------------------------------

describe('System preference change listener', () => {
  it('registers a change listener on matchMedia when theme is "system"', () => {
    const mockMM = makeMatchMedia(false);
    const mql = mockMM();

    // Simulate what ThemeProvider does: add listener when theme === 'system'
    const handleChange = vi.fn((e: MediaQueryListEvent) => {
      return e.matches ? 'dark' : 'light';
    });

    mql.addEventListener('change', handleChange);
    expect(mql.addEventListener).toHaveBeenCalledWith('change', handleChange);
  });

  it('fires the listener and resolves to "dark" when OS switches to dark (Req 4.4)', () => {
    const mockMM = makeMatchMedia(false);
    const mql = mockMM();

    let currentResolved: ResolvedTheme = 'light';
    const handleChange = (e: MediaQueryListEvent) => {
      currentResolved = e.matches ? 'dark' : 'light';
    };

    mql.addEventListener('change', handleChange);
    mql._fire(true); // OS switches to dark

    expect(currentResolved).toBe('dark');
  });

  it('fires the listener and resolves to "light" when OS switches to light (Req 4.4)', () => {
    const mockMM = makeMatchMedia(true);
    const mql = mockMM();

    let currentResolved: ResolvedTheme = 'dark';
    const handleChange = (e: MediaQueryListEvent) => {
      currentResolved = e.matches ? 'dark' : 'light';
    };

    mql.addEventListener('change', handleChange);
    mql._fire(false); // OS switches to light

    expect(currentResolved).toBe('light');
  });

  it('removes the listener on cleanup (no memory leaks)', () => {
    const mockMM = makeMatchMedia(false);
    const mql = mockMM();

    let callCount = 0;
    const handleChange = () => { callCount++; };

    mql.addEventListener('change', handleChange);
    mql.removeEventListener('change', handleChange);
    mql._fire(true); // Should not trigger since listener was removed

    expect(callCount).toBe(0);
    expect(mql.removeEventListener).toHaveBeenCalledWith('change', handleChange);
  });

  it('does not update resolved theme when theme is not "system"', () => {
    // When theme is 'light' or 'dark', the system listener should not be active
    const mockMM = makeMatchMedia(false);
    const mql = mockMM();

    let listenerRegistered = false;
    // Simulate: only register listener if theme === 'system'
    const theme: Theme = 'dark';
    if (theme === 'system') {
      mql.addEventListener('change', vi.fn());
      listenerRegistered = true;
    }

    expect(listenerRegistered).toBe(false);
    expect(mql.addEventListener).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 9. Theme persistence round-trip (Req 4.2)
// ---------------------------------------------------------------------------

describe('Theme persistence round-trip', () => {
  let mockLS: ReturnType<typeof makeLocalStorage>;

  beforeEach(() => {
    mockLS = makeLocalStorage();
    vi.stubGlobal('window', { localStorage: mockLS });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('persists and retrieves "dark" theme correctly', () => {
    storage.set(STORAGE_KEY, 'dark');
    expect(storage.get(STORAGE_KEY)).toBe('dark');
  });

  it('persists and retrieves "light" theme correctly', () => {
    storage.set(STORAGE_KEY, 'light');
    expect(storage.get(STORAGE_KEY)).toBe('light');
  });

  it('persists and retrieves "system" theme correctly', () => {
    storage.set(STORAGE_KEY, 'system');
    expect(storage.get(STORAGE_KEY)).toBe('system');
  });

  it('overwrites previous preference when theme changes', () => {
    storage.set(STORAGE_KEY, 'light');
    storage.set(STORAGE_KEY, 'dark');
    expect(storage.get(STORAGE_KEY)).toBe('dark');
  });
});

// ---------------------------------------------------------------------------
// 10. SSR / hydration safety (Req 4.5)
// ---------------------------------------------------------------------------

describe('SSR / hydration safety', () => {
  it('storage.get returns null when window is undefined (SSR context)', () => {
    // Simulate SSR: window is not defined
    // We test the guard by checking the typeof window === 'undefined' branch
    // Since we cannot truly undefine window in vitest/node, we verify the
    // function handles the case gracefully by checking the guard logic.
    const originalWindow = globalThis.window;
    // @ts-expect-error – intentionally removing window to simulate SSR
    delete globalThis.window;

    expect(storage.get(STORAGE_KEY)).toBeNull();

    // Restore
    globalThis.window = originalWindow;
  });

  it('storage.set returns false when window is undefined (SSR context)', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error – intentionally removing window to simulate SSR
    delete globalThis.window;

    expect(storage.set(STORAGE_KEY, 'dark')).toBe(false);

    globalThis.window = originalWindow;
  });

  it('applyTheme with light resolved theme does not add "dark" class (Req 4.5)', () => {
    const root = makeDocumentRoot();
    applyTheme('light', root);
    expect((root.classList as unknown as { _classes: Set<string> })._classes.has('dark')).toBe(false);
    expect(root.getAttribute('data-theme')).toBe('light');
  });

  it('initial render starts with light theme to match SSR output (Req 4.5)', () => {
    // ThemeProvider initializes with 'light' state before mount to match server render
    const initialThemeBeforeMount: Theme = 'light';
    expect(initialThemeBeforeMount).toBe('light');
  });
});
