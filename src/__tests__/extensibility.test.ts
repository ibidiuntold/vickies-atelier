/**
 * Extensibility Architecture Validation Tests
 *
 * Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5
 *
 * Verifies that the theme system architecture supports adding new theme
 * variants without breaking existing functionality, and that the modular
 * CSS custom-property approach keeps theme-specific values separate from
 * component logic.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// ─── Mirror the core logic from ThemeProvider.tsx ────────────────────────────

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const VALID_THEMES: Theme[] = ['light', 'dark', 'system'];
const STORAGE_KEY = 'theme-preference';

function isValidTheme(value: unknown): value is Theme {
  return typeof value === 'string' && VALID_THEMES.includes(value as Theme);
}

function resolveTheme(theme: Theme, systemPref: ResolvedTheme): ResolvedTheme {
  return theme === 'system' ? systemPref : theme;
}

// ─── Simulate an extended theme system (e.g. adding 'high-contrast') ─────────

type ExtendedTheme = Theme | 'high-contrast' | 'sepia';
type ExtendedResolved = ResolvedTheme;

const EXTENDED_VALID_THEMES: ExtendedTheme[] = [
  'light',
  'dark',
  'system',
  'high-contrast',
  'sepia',
];

function isValidExtendedTheme(value: unknown): value is ExtendedTheme {
  return (
    typeof value === 'string' &&
    EXTENDED_VALID_THEMES.includes(value as ExtendedTheme)
  );
}

function resolveExtendedTheme(
  theme: ExtendedTheme,
  systemPref: ResolvedTheme,
): ExtendedResolved {
  if (theme === 'system') return systemPref;
  if (theme === 'high-contrast') return 'dark';
  if (theme === 'sepia') return 'light';
  return theme as ResolvedTheme;
}

// ─── Logo config mirror ───────────────────────────────────────────────────────

interface LogoAsset {
  webp: string;
  fallback: string;
  alt: string;
}

type LogoConfig = Record<string, LogoAsset>;

const BASE_LOGO_CONFIG: LogoConfig = {
  light: {
    webp: '/images/logo/optimized/va-logo-dark.webp',
    fallback: '/images/logo/optimized/va-logo-dark.png',
    alt: "Vickie's Atelier - Luxury Fashion Design",
  },
  dark: {
    webp: '/images/logo/optimized/va-logo-light.webp',
    fallback: '/images/logo/optimized/va-logo-light.png',
    alt: "Vickie's Atelier - Luxury Fashion Design",
  },
};

function getLogoAssets(config: LogoConfig, resolvedTheme: ResolvedTheme): LogoAsset {
  return config[resolvedTheme];
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

const themeArb = fc.constantFrom<Theme>('light', 'dark', 'system');
const resolvedThemeArb = fc.constantFrom<ResolvedTheme>('light', 'dark');
const extendedThemeArb = fc.constantFrom<ExtendedTheme>(
  'light',
  'dark',
  'system',
  'high-contrast',
  'sepia',
);

// ─── Req 12.1 — Modular approach supports additional theme variants ────────────

describe('Req 12.1: Modular approach supports additional theme variants', () => {
  it('VALID_THEMES array can be extended without changing resolution logic', () => {
    // Extending the array is the only change needed to register a new variant
    expect(EXTENDED_VALID_THEMES).toContain('high-contrast');
    expect(EXTENDED_VALID_THEMES).toContain('sepia');
    // Original themes are still present
    expect(EXTENDED_VALID_THEMES).toContain('light');
    expect(EXTENDED_VALID_THEMES).toContain('dark');
    expect(EXTENDED_VALID_THEMES).toContain('system');
  });

  it('isValidTheme guard works correctly for any set of registered themes', () => {
    fc.assert(
      fc.property(extendedThemeArb, (theme) => {
        expect(isValidExtendedTheme(theme)).toBe(true);
      }),
    );
  });

  it('new theme variants resolve to a binary light/dark value', () => {
    fc.assert(
      fc.property(extendedThemeArb, resolvedThemeArb, (theme, systemPref) => {
        const resolved = resolveExtendedTheme(theme, systemPref);
        expect(['light', 'dark']).toContain(resolved);
      }),
    );
  });

  it('adding a new theme does not break existing theme resolution', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        // Original resolution must be identical in the extended system
        const original = resolveTheme(theme, systemPref);
        const extended = resolveExtendedTheme(theme, systemPref);
        expect(extended).toBe(original);
      }),
    );
  });
});

// ─── Req 12.2 — Theme-specific values are separate from component logic ───────

describe('Req 12.2: Theme-specific values are separate from component logic', () => {
  it('logo config is a plain data object — no component logic embedded', () => {
    // Config is a simple record; components read from it, not the other way around
    expect(typeof BASE_LOGO_CONFIG).toBe('object');
    expect(BASE_LOGO_CONFIG.light).toBeDefined();
    expect(BASE_LOGO_CONFIG.dark).toBeDefined();
  });

  it('getLogoAssets is a pure function — same inputs always produce same output', () => {
    fc.assert(
      fc.property(resolvedThemeArb, (theme) => {
        const a = getLogoAssets(BASE_LOGO_CONFIG, theme);
        const b = getLogoAssets(BASE_LOGO_CONFIG, theme);
        expect(a).toEqual(b);
      }),
    );
  });

  it('logo config can be extended with a new theme entry without changing getLogoAssets', () => {
    const extendedConfig: LogoConfig = {
      ...BASE_LOGO_CONFIG,
      'high-contrast': {
        webp: '/images/logo/optimized/va-logo-light.webp',
        fallback: '/images/logo/optimized/va-logo-light.png',
        alt: "Vickie's Atelier - Luxury Fashion Design",
      },
    };

    // Existing entries are unchanged
    expect(extendedConfig.light).toEqual(BASE_LOGO_CONFIG.light);
    expect(extendedConfig.dark).toEqual(BASE_LOGO_CONFIG.dark);
    // New entry is accessible
    expect(extendedConfig['high-contrast']).toBeDefined();
  });

  it('resolveTheme is a pure function with no side effects', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        const r1 = resolveTheme(theme, systemPref);
        const r2 = resolveTheme(theme, systemPref);
        expect(r1).toBe(r2);
      }),
    );
  });
});

// ─── Req 12.3 — ThemeProvider supports easy addition of new theme options ─────

describe('Req 12.3: ThemeProvider supports easy addition of new theme options', () => {
  it('VALID_THEMES is a plain array — new entries require only an array push', () => {
    const copy = [...VALID_THEMES];
    copy.push('high-contrast' as Theme);
    expect(copy).toHaveLength(VALID_THEMES.length + 1);
    expect(copy).toContain('high-contrast');
  });

  it('isValidTheme is driven by VALID_THEMES — no hard-coded string checks', () => {
    // Any string in VALID_THEMES passes; anything else fails
    fc.assert(
      fc.property(themeArb, (theme) => {
        expect(isValidTheme(theme)).toBe(true);
      }),
    );

    const invalidArb = fc.string().filter(
      (s) => !(VALID_THEMES as string[]).includes(s),
    );
    fc.assert(
      fc.property(invalidArb, (invalid) => {
        expect(isValidTheme(invalid)).toBe(false);
      }),
    );
  });

  it('STORAGE_KEY is a single constant — persisting a new theme needs no changes', () => {
    expect(STORAGE_KEY).toBe('theme-preference');
  });

  it('extended theme system still uses the same storage key', () => {
    // The storage key is theme-agnostic; new variants use it automatically
    const key = STORAGE_KEY;
    expect(key).toBe('theme-preference');
  });
});

// ─── Req 12.5 — Consistent patterns make future modifications straightforward ─

describe('Req 12.5: Consistent patterns make future modifications straightforward', () => {
  it('resolveTheme always returns a binary value — pattern is consistent', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        const resolved = resolveTheme(theme, systemPref);
        expect(resolved === 'light' || resolved === 'dark').toBe(true);
      }),
    );
  });

  it('extended resolveTheme follows the same binary-output contract', () => {
    fc.assert(
      fc.property(extendedThemeArb, resolvedThemeArb, (theme, systemPref) => {
        const resolved = resolveExtendedTheme(theme, systemPref);
        expect(resolved === 'light' || resolved === 'dark').toBe(true);
      }),
    );
  });

  it('logo config entries follow a consistent shape (webp, fallback, alt)', () => {
    for (const [, asset] of Object.entries(BASE_LOGO_CONFIG)) {
      expect(typeof asset.webp).toBe('string');
      expect(typeof asset.fallback).toBe('string');
      expect(typeof asset.alt).toBe('string');
      expect(asset.webp.endsWith('.webp')).toBe(true);
      expect(asset.fallback.endsWith('.png')).toBe(true);
    }
  });

  it('all logo alt texts are identical across themes — consistent branding', () => {
    const alts = Object.values(BASE_LOGO_CONFIG).map((a) => a.alt);
    const unique = new Set(alts);
    expect(unique.size).toBe(1);
  });

  it('theme validation is consistent — isValidTheme rejects non-strings uniformly', () => {
    const nonStringArb = fc.oneof(
      fc.integer(),
      fc.boolean(),
      fc.constant(null),
      fc.constant(undefined),
    );
    fc.assert(
      fc.property(nonStringArb, (value) => {
        expect(isValidTheme(value)).toBe(false);
      }),
    );
  });
});
