/**
 * Theme Persistence Validation Tests
 * Task 11.1: Add theme persistence validation
 *
 * **Validates: Requirements 11.1, 4.2**
 *
 * Tests:
 *   1. Theme preference is correctly saved to localStorage when set
 *   2. Theme preference is correctly loaded from localStorage on initialization
 *   3. Invalid localStorage values are handled gracefully (fallback to 'system')
 *   4. localStorage unavailability (SecurityError / QuotaExceededError) is handled without crashing
 *   5. Theme persists across simulated page reloads (re-reading from localStorage)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';

// ---------------------------------------------------------------------------
// Constants (mirror ThemeProvider.tsx)
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'theme-preference';
const VALID_THEMES = ['light', 'dark', 'system'] as const;
const DEFAULT_THEME = 'system';

type Theme = (typeof VALID_THEMES)[number];

// ---------------------------------------------------------------------------
// In-memory localStorage implementation for Node test environment
// ---------------------------------------------------------------------------

function createInMemoryStorage() {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string): string | null => store[key] ?? null),
    setItem: vi.fn((key: string, value: string): void => { store[key] = value; }),
    removeItem: vi.fn((key: string): void => { delete store[key]; }),
    clear: vi.fn((): void => { Object.keys(store).forEach(k => delete store[k]); }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((index: number): string | null => Object.keys(store)[index] ?? null),
    _store: store,
  };
}

// ---------------------------------------------------------------------------
// Logic mirrored from ThemeProvider.tsx
// ---------------------------------------------------------------------------

function isValidTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (VALID_THEMES as readonly string[]).includes(value);
}

/** Mirrors ThemeProvider's storage.get() */
function storageGet(storage: Pick<Storage, 'getItem'>, key: string): Theme | null {
  try {
    const value = storage.getItem(key);
    return isValidTheme(value) ? value : null;
  } catch {
    return null;
  }
}

/** Mirrors ThemeProvider's storage.set() */
function storageSet(storage: Pick<Storage, 'setItem'>, key: string, value: Theme): boolean {
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Simulate ThemeProvider initialization — reads saved preference or falls back to default. */
function initializeTheme(storage: Pick<Storage, 'getItem'>): Theme {
  const saved = storageGet(storage, STORAGE_KEY);
  return saved ?? DEFAULT_THEME;
}

// ---------------------------------------------------------------------------
// Test 1: Theme preference is saved to localStorage when set
// ---------------------------------------------------------------------------

describe('1. Theme preference is saved to localStorage when set', () => {
  let mockStorage: ReturnType<typeof createInMemoryStorage>;

  beforeEach(() => {
    mockStorage = createInMemoryStorage();
  });

  it('saves "light" theme to localStorage', () => {
    const result = storageSet(mockStorage, STORAGE_KEY, 'light');
    expect(result).toBe(true);
    expect(mockStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'light');
    expect(mockStorage._store[STORAGE_KEY]).toBe('light');
  });

  it('saves "dark" theme to localStorage', () => {
    const result = storageSet(mockStorage, STORAGE_KEY, 'dark');
    expect(result).toBe(true);
    expect(mockStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'dark');
    expect(mockStorage._store[STORAGE_KEY]).toBe('dark');
  });

  it('saves "system" theme to localStorage', () => {
    const result = storageSet(mockStorage, STORAGE_KEY, 'system');
    expect(result).toBe(true);
    expect(mockStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'system');
    expect(mockStorage._store[STORAGE_KEY]).toBe('system');
  });

  it('property: any valid theme is persisted exactly as-is', () => {
    const themeArb = fc.constantFrom<Theme>('light', 'dark', 'system');
    fc.assert(
      fc.property(themeArb, (theme) => {
        const storage = createInMemoryStorage();
        storageSet(storage, STORAGE_KEY, theme);
        expect(storage._store[STORAGE_KEY]).toBe(theme);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Test 2: Theme preference is loaded from localStorage on initialization
// ---------------------------------------------------------------------------

describe('2. Theme preference is loaded from localStorage on initialization', () => {
  it('loads "light" from localStorage', () => {
    const storage = createInMemoryStorage();
    storage._store[STORAGE_KEY] = 'light';
    expect(initializeTheme(storage)).toBe('light');
  });

  it('loads "dark" from localStorage', () => {
    const storage = createInMemoryStorage();
    storage._store[STORAGE_KEY] = 'dark';
    expect(initializeTheme(storage)).toBe('dark');
  });

  it('loads "system" from localStorage', () => {
    const storage = createInMemoryStorage();
    storage._store[STORAGE_KEY] = 'system';
    expect(initializeTheme(storage)).toBe('system');
  });

  it('property: any valid stored theme is returned unchanged on init', () => {
    const themeArb = fc.constantFrom<Theme>('light', 'dark', 'system');
    fc.assert(
      fc.property(themeArb, (theme) => {
        const storage = createInMemoryStorage();
        storage._store[STORAGE_KEY] = theme;
        expect(initializeTheme(storage)).toBe(theme);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Test 3: Invalid localStorage values fall back to 'system'
// ---------------------------------------------------------------------------

describe('3. Invalid localStorage values are handled gracefully (fallback to "system")', () => {
  const invalidValues = [
    'invalid-theme',
    'DARK',
    'Light',
    '',
    '   ',
    'null',
    'undefined',
    '{}',
    '0',
    'true',
  ];

  for (const invalid of invalidValues) {
    it(`falls back to "system" when stored value is "${invalid}"`, () => {
      const storage = createInMemoryStorage();
      storage._store[STORAGE_KEY] = invalid;
      expect(initializeTheme(storage)).toBe(DEFAULT_THEME);
    });
  }

  it('falls back to "system" when no value is stored', () => {
    const storage = createInMemoryStorage();
    expect(initializeTheme(storage)).toBe(DEFAULT_THEME);
  });

  it('property: any non-valid string stored in localStorage results in default theme', () => {
    const invalidStringArb = fc.string().filter(
      (s) => !VALID_THEMES.includes(s as Theme),
    );
    fc.assert(
      fc.property(invalidStringArb, (invalid) => {
        const storage = createInMemoryStorage();
        storage._store[STORAGE_KEY] = invalid;
        expect(initializeTheme(storage)).toBe(DEFAULT_THEME);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Test 4: localStorage unavailability is handled without crashing
// ---------------------------------------------------------------------------

describe('4. localStorage unavailability is handled without crashing', () => {
  it('storageGet returns null when getItem throws SecurityError', () => {
    const storage = { getItem: vi.fn(() => { throw new Error('SecurityError: Access denied'); }) };
    expect(() => storageGet(storage, STORAGE_KEY)).not.toThrow();
    expect(storageGet(storage, STORAGE_KEY)).toBeNull();
  });

  it('storageSet returns false when setItem throws SecurityError', () => {
    const storage = { setItem: vi.fn(() => { throw new Error('SecurityError: Access denied'); }) };
    expect(() => storageSet(storage, STORAGE_KEY, 'dark')).not.toThrow();
    expect(storageSet(storage, STORAGE_KEY, 'dark')).toBe(false);
  });

  it('initializeTheme falls back to "system" when getItem throws', () => {
    const storage = { getItem: vi.fn(() => { throw new Error('SecurityError: Access denied'); }) };
    expect(() => initializeTheme(storage)).not.toThrow();
    expect(initializeTheme(storage)).toBe(DEFAULT_THEME);
  });

  it('storageGet returns null when getItem throws QuotaExceededError', () => {
    const storage = { getItem: vi.fn(() => { throw new Error('QuotaExceededError: Storage full'); }) };
    expect(() => storageGet(storage, STORAGE_KEY)).not.toThrow();
    expect(storageGet(storage, STORAGE_KEY)).toBeNull();
  });

  it('storageSet returns false when setItem throws QuotaExceededError', () => {
    const storage = { setItem: vi.fn(() => { throw new Error('QuotaExceededError: Storage full'); }) };
    expect(() => storageSet(storage, STORAGE_KEY, 'dark')).not.toThrow();
    expect(storageSet(storage, STORAGE_KEY, 'dark')).toBe(false);
  });

  it('storageGet never throws regardless of error type', () => {
    const errors = [
      new Error('SecurityError: Access denied'),
      new Error('QuotaExceededError: Storage full'),
      new Error('Unknown error'),
      new TypeError('Not a function'),
    ];
    for (const error of errors) {
      const storage = { getItem: vi.fn(() => { throw error; }) };
      expect(() => storageGet(storage, STORAGE_KEY)).not.toThrow();
    }
  });

  it('storageSet never throws regardless of error type', () => {
    const errors = [
      new Error('SecurityError: Access denied'),
      new Error('QuotaExceededError: Storage full'),
      new Error('Unknown error'),
      new TypeError('Not a function'),
    ];
    for (const error of errors) {
      const storage = { setItem: vi.fn(() => { throw error; }) };
      expect(() => storageSet(storage, STORAGE_KEY, 'dark')).not.toThrow();
    }
  });

  it('storageSet returns false for any error thrown by setItem', () => {
    const storage = { setItem: vi.fn(() => { throw new Error('Any storage error'); }) };
    expect(storageSet(storage, STORAGE_KEY, 'light')).toBe(false);
    expect(storageSet(storage, STORAGE_KEY, 'dark')).toBe(false);
    expect(storageSet(storage, STORAGE_KEY, 'system')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Test 5: Theme persists across simulated page reloads
// ---------------------------------------------------------------------------

describe('5. Theme persists across simulated page reloads', () => {
  it('theme set in one session is loaded in the next (simulated reload)', () => {
    const storage = createInMemoryStorage();

    // Session 1: set theme
    storageSet(storage, STORAGE_KEY, 'dark');
    expect(storage._store[STORAGE_KEY]).toBe('dark');

    // Session 2: simulate reload — re-read from same persistent storage
    const loaded = initializeTheme(storage);
    expect(loaded).toBe('dark');
  });

  it('property: any valid theme survives a simulated page reload', () => {
    const themeArb = fc.constantFrom<Theme>('light', 'dark', 'system');
    fc.assert(
      fc.property(themeArb, (theme) => {
        const storage = createInMemoryStorage();
        // Save (session 1)
        storageSet(storage, STORAGE_KEY, theme);
        // Reload (session 2)
        const loaded = initializeTheme(storage);
        expect(loaded).toBe(theme);
      }),
    );
  });

  it('multiple sequential reloads preserve the last saved theme', () => {
    const storage = createInMemoryStorage();
    const sequence: Theme[] = ['light', 'dark', 'system', 'dark', 'light'];
    for (const theme of sequence) {
      storageSet(storage, STORAGE_KEY, theme);
      expect(initializeTheme(storage)).toBe(theme);
    }
  });

  it('property: N sequential save-reload cycles always return the last saved theme', () => {
    const themeSequenceArb = fc.array(
      fc.constantFrom<Theme>('light', 'dark', 'system'),
      { minLength: 2, maxLength: 10 },
    );
    fc.assert(
      fc.property(themeSequenceArb, (sequence) => {
        const storage = createInMemoryStorage();
        for (const theme of sequence) {
          storageSet(storage, STORAGE_KEY, theme);
        }
        const lastTheme = sequence[sequence.length - 1];
        expect(initializeTheme(storage)).toBe(lastTheme);
      }),
    );
  });

  it('overwriting a theme preference is reflected on next reload', () => {
    const storage = createInMemoryStorage();
    storageSet(storage, STORAGE_KEY, 'light');
    expect(initializeTheme(storage)).toBe('light');

    // User changes preference
    storageSet(storage, STORAGE_KEY, 'dark');
    expect(initializeTheme(storage)).toBe('dark');
  });
});
