/**
 * Property-Based Test: Theme State Consistency
 * Property 4: Theme State Persistence
 * Validates: Requirements 11.1, 4.2, 4.5
 *
 * **Validates: Requirements 11.1, 4.2, 4.5**
 *
 * Properties verified:
 *   1. resolvedTheme is always 'light' or 'dark' — never 'system' (Req 4.5)
 *   2. Setting theme to 'light' always resolves to 'light' (Req 4.5)
 *   3. Setting theme to 'dark' always resolves to 'dark' (Req 4.5)
 *   4. Theme persistence: saved value matches what was set (Req 4.2, 11.1)
 *   5. localStorage key is always 'theme-preference' (Req 4.2)
 *   6. Valid theme values are exactly: 'light', 'dark', 'system' (Req 4.3)
 *   7. Theme state transitions are deterministic (Req 4.5)
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
type ResolvedTheme = 'light' | 'dark';

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

function resolveTheme(theme: Theme, systemPreference: ResolvedTheme): ResolvedTheme {
  return theme === 'system' ? systemPreference : theme;
}

function storageGet(storage: Pick<Storage, 'getItem'>, key: string): Theme | null {
  try {
    const value = storage.getItem(key);
    return isValidTheme(value) ? value : null;
  } catch {
    return null;
  }
}

function storageSet(storage: Pick<Storage, 'setItem'>, key: string, value: Theme): boolean {
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Simulate a full setTheme() call: resolve + persist */
function setTheme(
  newTheme: Theme,
  systemPreference: ResolvedTheme,
  storage: Pick<Storage, 'setItem'>,
): { resolvedTheme: ResolvedTheme; persisted: boolean } {
  const resolved = resolveTheme(newTheme, systemPreference);
  const persisted = storageSet(storage, STORAGE_KEY, newTheme);
  return { resolvedTheme: resolved, persisted };
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const themeArb = fc.constantFrom<Theme>('light', 'dark', 'system');
const resolvedThemeArb = fc.constantFrom<ResolvedTheme>('light', 'dark');
const themeSequenceArb = fc.array(themeArb, { minLength: 2, maxLength: 15 });

// ---------------------------------------------------------------------------
// Property 4a — resolvedTheme is always 'light' or 'dark', never 'system'
// (Req 4.5)
// ---------------------------------------------------------------------------

describe('Property 4a: resolvedTheme is always light or dark — never system (Req 4.5)', () => {
  it('resolveTheme() never returns "system" for any theme/system-preference combination', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        const resolved = resolveTheme(theme, systemPref);
        expect(resolved).not.toBe('system');
        expect(['light', 'dark']).toContain(resolved);
      }),
    );
  });

  it('resolvedTheme is always a binary value — exactly "light" or "dark"', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        const resolved = resolveTheme(theme, systemPref);
        const isLightOrDark = resolved === 'light' || resolved === 'dark';
        expect(isLightOrDark).toBe(true);
      }),
    );
  });

  it('setTheme() always produces a resolvedTheme of "light" or "dark"', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        const storage = createInMemoryStorage();
        const { resolvedTheme } = setTheme(theme, systemPref, storage);
        expect(['light', 'dark']).toContain(resolvedTheme);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4b — Setting 'light' always resolves to 'light' (Req 4.5)
//              Setting 'dark' always resolves to 'dark' (Req 4.5)
// ---------------------------------------------------------------------------

describe('Property 4b: Explicit theme values resolve deterministically (Req 4.5)', () => {
  it('setting theme to "light" always resolves to "light" regardless of system preference', () => {
    fc.assert(
      fc.property(resolvedThemeArb, (systemPref) => {
        const resolved = resolveTheme('light', systemPref);
        expect(resolved).toBe('light');
      }),
    );
  });

  it('setting theme to "dark" always resolves to "dark" regardless of system preference', () => {
    fc.assert(
      fc.property(resolvedThemeArb, (systemPref) => {
        const resolved = resolveTheme('dark', systemPref);
        expect(resolved).toBe('dark');
      }),
    );
  });

  it('setting theme to "system" always delegates to system preference', () => {
    fc.assert(
      fc.property(resolvedThemeArb, (systemPref) => {
        const resolved = resolveTheme('system', systemPref);
        expect(resolved).toBe(systemPref);
      }),
    );
  });

  it('resolveTheme is a pure function — same inputs always produce same output', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        const result1 = resolveTheme(theme, systemPref);
        const result2 = resolveTheme(theme, systemPref);
        expect(result1).toBe(result2);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4c — Theme persistence: saved value matches what was set
// (Req 4.2, 11.1)
// ---------------------------------------------------------------------------

describe('Property 4c: Theme persistence — saved value matches what was set (Req 4.2, 11.1)', () => {
  let mockStorage: ReturnType<typeof createInMemoryStorage>;

  beforeEach(() => {
    mockStorage = createInMemoryStorage();
  });

  it('any valid theme is persisted exactly as-is to localStorage', () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        const storage = createInMemoryStorage();
        storageSet(storage, STORAGE_KEY, theme);
        expect(storage._store[STORAGE_KEY]).toBe(theme);
      }),
    );
  });

  it('setTheme() persists the theme value (not the resolved value) to localStorage', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        const storage = createInMemoryStorage();
        setTheme(theme, systemPref, storage);
        // The stored value must be the original theme, not the resolved one
        expect(storage._store[STORAGE_KEY]).toBe(theme);
      }),
    );
  });

  it('reading back from storage returns the same theme that was saved', () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        const storage = createInMemoryStorage();
        storageSet(storage, STORAGE_KEY, theme);
        const loaded = storageGet(storage, STORAGE_KEY);
        expect(loaded).toBe(theme);
      }),
    );
  });

  it('theme survives a simulated page reload (save → reload → read)', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        const storage = createInMemoryStorage();
        // Session 1: set theme
        setTheme(theme, systemPref, storage);
        // Session 2: reload — read from same persistent storage
        const loaded = storageGet(storage, STORAGE_KEY);
        expect(loaded).toBe(theme);
      }),
    );
  });

  it('last theme in a sequence is the one persisted after multiple changes', () => {
    fc.assert(
      fc.property(themeSequenceArb, resolvedThemeArb, (sequence, systemPref) => {
        const storage = createInMemoryStorage();
        for (const theme of sequence) {
          setTheme(theme, systemPref, storage);
        }
        const lastTheme = sequence[sequence.length - 1];
        expect(storage._store[STORAGE_KEY]).toBe(lastTheme);
        expect(storageGet(storage, STORAGE_KEY)).toBe(lastTheme);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4d — localStorage key is always 'theme-preference' (Req 4.2)
// ---------------------------------------------------------------------------

describe('Property 4d: localStorage key is always "theme-preference" (Req 4.2)', () => {
  it('STORAGE_KEY constant equals "theme-preference"', () => {
    expect(STORAGE_KEY).toBe('theme-preference');
  });

  it('storageSet always writes to the "theme-preference" key', () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        const storage = createInMemoryStorage();
        storageSet(storage, STORAGE_KEY, theme);
        expect(storage.setItem).toHaveBeenCalledWith('theme-preference', theme);
      }),
    );
  });

  it('storageGet always reads from the "theme-preference" key', () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        const storage = createInMemoryStorage();
        storage._store['theme-preference'] = theme;
        storageGet(storage, STORAGE_KEY);
        expect(storage.getItem).toHaveBeenCalledWith('theme-preference');
      }),
    );
  });

  it('no other key is written to storage during a theme change', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        const storage = createInMemoryStorage();
        setTheme(theme, systemPref, storage);
        const writtenKeys = storage.setItem.mock.calls.map(([key]) => key);
        for (const key of writtenKeys) {
          expect(key).toBe('theme-preference');
        }
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4e — Valid theme values are exactly: 'light', 'dark', 'system'
// (Req 4.3)
// ---------------------------------------------------------------------------

describe('Property 4e: Valid theme values are exactly light, dark, system (Req 4.3)', () => {
  it('VALID_THEMES contains exactly "light", "dark", and "system"', () => {
    expect(VALID_THEMES).toHaveLength(3);
    expect(VALID_THEMES).toContain('light');
    expect(VALID_THEMES).toContain('dark');
    expect(VALID_THEMES).toContain('system');
  });

  it('isValidTheme returns true for all three valid themes', () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        expect(isValidTheme(theme)).toBe(true);
      }),
    );
  });

  it('isValidTheme returns false for any string not in the valid set', () => {
    const invalidStringArb = fc.string().filter(
      (s) => !(VALID_THEMES as readonly string[]).includes(s),
    );
    fc.assert(
      fc.property(invalidStringArb, (invalid) => {
        expect(isValidTheme(invalid)).toBe(false);
      }),
    );
  });

  it('isValidTheme returns false for non-string values', () => {
    const nonStringArb = fc.oneof(
      fc.integer(),
      fc.boolean(),
      fc.constant(null),
      fc.constant(undefined),
      fc.record({ theme: fc.string() }),
    );
    fc.assert(
      fc.property(nonStringArb, (value) => {
        expect(isValidTheme(value)).toBe(false);
      }),
    );
  });

  it('storageGet rejects any value not in the valid theme set', () => {
    const invalidStringArb = fc.string().filter(
      (s) => !(VALID_THEMES as readonly string[]).includes(s),
    );
    fc.assert(
      fc.property(invalidStringArb, (invalid) => {
        const storage = createInMemoryStorage();
        storage._store[STORAGE_KEY] = invalid;
        expect(storageGet(storage, STORAGE_KEY)).toBeNull();
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4f — Theme state transitions are deterministic (Req 4.5)
// ---------------------------------------------------------------------------

describe('Property 4f: Theme state transitions are deterministic (Req 4.5)', () => {
  it('the same theme + system preference always produces the same resolved theme', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        const r1 = resolveTheme(theme, systemPref);
        const r2 = resolveTheme(theme, systemPref);
        const r3 = resolveTheme(theme, systemPref);
        expect(r1).toBe(r2);
        expect(r2).toBe(r3);
      }),
    );
  });

  it('applying the same theme twice is idempotent — state does not change on second call', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        const storage1 = createInMemoryStorage();
        const storage2 = createInMemoryStorage();

        const result1 = setTheme(theme, systemPref, storage1);
        setTheme(theme, systemPref, storage1); // second call — same theme
        const result2 = setTheme(theme, systemPref, storage2);

        expect(result1.resolvedTheme).toBe(result2.resolvedTheme);
        expect(storage1._store[STORAGE_KEY]).toBe(storage2._store[STORAGE_KEY]);
      }),
    );
  });

  it('switching from any theme to "light" always results in resolvedTheme "light"', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (initialTheme, systemPref) => {
        const storage = createInMemoryStorage();
        // First set any theme
        setTheme(initialTheme, systemPref, storage);
        // Then switch to light
        const { resolvedTheme } = setTheme('light', systemPref, storage);
        expect(resolvedTheme).toBe('light');
      }),
    );
  });

  it('switching from any theme to "dark" always results in resolvedTheme "dark"', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (initialTheme, systemPref) => {
        const storage = createInMemoryStorage();
        // First set any theme
        setTheme(initialTheme, systemPref, storage);
        // Then switch to dark
        const { resolvedTheme } = setTheme('dark', systemPref, storage);
        expect(resolvedTheme).toBe('dark');
      }),
    );
  });

  it('any sequence of theme changes ends with the correct resolved theme for the last value', () => {
    fc.assert(
      fc.property(themeSequenceArb, resolvedThemeArb, (sequence, systemPref) => {
        const storage = createInMemoryStorage();
        let lastResolved: ResolvedTheme = 'light';

        for (const theme of sequence) {
          const { resolvedTheme } = setTheme(theme, systemPref, storage);
          lastResolved = resolvedTheme;
        }

        const lastTheme = sequence[sequence.length - 1];
        const expectedResolved = resolveTheme(lastTheme, systemPref);
        expect(lastResolved).toBe(expectedResolved);
      }),
    );
  });

  it('resolvedTheme and persisted theme are always consistent after any transition', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        const storage = createInMemoryStorage();
        const { resolvedTheme } = setTheme(theme, systemPref, storage);

        // The persisted value is the original theme
        const persisted = storageGet(storage, STORAGE_KEY);
        expect(persisted).toBe(theme);

        // The resolved value is always binary
        expect(['light', 'dark']).toContain(resolvedTheme);

        // For explicit themes, resolved must match
        if (theme === 'light') expect(resolvedTheme).toBe('light');
        if (theme === 'dark') expect(resolvedTheme).toBe('dark');
        // For 'system', resolved follows system preference
        if (theme === 'system') expect(resolvedTheme).toBe(systemPref);
      }),
    );
  });
});
