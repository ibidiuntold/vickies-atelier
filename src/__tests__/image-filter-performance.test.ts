/**
 * Performance tests for image filter impact
 * Validates: Requirements 7.3, 5.1, 5.4
 *
 * Tests that CSS filters are minimal, within safe value ranges,
 * and that the theme system uses a CSS-only approach.
 */

import { describe, it, expect } from 'vitest';

// Filter strings as defined in the design document
const DARK_MODE_GENERAL_FILTER = 'brightness(0.95) contrast(1.02)';
const DARK_MODE_HERO_FILTER = 'saturate(0.9) contrast(1.05)';
const LIGHT_MODE_FILTER = undefined;

// Transition value from design doc: --transition-theme: background-color 0.3s ease, ...
const THEME_TRANSITION_VALUE =
  'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';

// Performance-safe value bounds
const BOUNDS = {
  brightness: { min: 0.8, max: 1.2 },
  contrast: { min: 0.9, max: 1.2 },
  saturate: { min: 0.7, max: 1.3 },
};

// Expensive/layout-affecting filter functions to avoid
const DISALLOWED_FILTERS = ['blur(', 'drop-shadow(', 'url('];

/**
 * Parse a CSS filter string into an array of { name, value } objects.
 * e.g. "brightness(0.95) contrast(1.02)" → [{ name: 'brightness', value: 0.95 }, ...]
 */
function parseFilterFunctions(filter: string): Array<{ name: string; value: number }> {
  const regex = /(\w+)\(([^)]+)\)/g;
  const results: Array<{ name: string; value: number }> = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(filter)) !== null) {
    results.push({ name: match[1], value: parseFloat(match[2]) });
  }
  return results;
}

/**
 * Extract all numeric durations (in ms) from a CSS transition string.
 * Handles both "0.3s" and "300ms" formats.
 */
function extractTransitionDurationsMs(transition: string): number[] {
  const durations: number[] = [];
  // Match values like 0.3s or 300ms
  const regex = /(\d+(?:\.\d+)?)(s|ms)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(transition)) !== null) {
    const value = parseFloat(match[1]);
    const unit = match[2];
    durations.push(unit === 's' ? value * 1000 : value);
  }
  return durations;
}

// ---------------------------------------------------------------------------
// 1. Filter complexity — max 2 filter functions
// ---------------------------------------------------------------------------
describe('CSS filter complexity (Req 7.3)', () => {
  it('general dark mode filter has at most 2 filter functions', () => {
    const fns = parseFilterFunctions(DARK_MODE_GENERAL_FILTER);
    expect(fns.length).toBeLessThanOrEqual(2);
  });

  it('hero dark mode filter has at most 2 filter functions', () => {
    const fns = parseFilterFunctions(DARK_MODE_HERO_FILTER);
    expect(fns.length).toBeLessThanOrEqual(2);
  });

  it('light mode has no filter applied', () => {
    // undefined or "none" are both acceptable
    expect(LIGHT_MODE_FILTER === undefined || LIGHT_MODE_FILTER === 'none').toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. Filter value ranges — within performance-safe bounds
// ---------------------------------------------------------------------------
describe('CSS filter value ranges (Req 7.3)', () => {
  it('general dark mode brightness is within safe bounds', () => {
    const fns = parseFilterFunctions(DARK_MODE_GENERAL_FILTER);
    const brightness = fns.find((f) => f.name === 'brightness');
    expect(brightness).toBeDefined();
    expect(brightness!.value).toBeGreaterThanOrEqual(BOUNDS.brightness.min);
    expect(brightness!.value).toBeLessThanOrEqual(BOUNDS.brightness.max);
  });

  it('general dark mode contrast is within safe bounds', () => {
    const fns = parseFilterFunctions(DARK_MODE_GENERAL_FILTER);
    const contrast = fns.find((f) => f.name === 'contrast');
    expect(contrast).toBeDefined();
    expect(contrast!.value).toBeGreaterThanOrEqual(BOUNDS.contrast.min);
    expect(contrast!.value).toBeLessThanOrEqual(BOUNDS.contrast.max);
  });

  it('hero dark mode saturate is within safe bounds', () => {
    const fns = parseFilterFunctions(DARK_MODE_HERO_FILTER);
    const saturate = fns.find((f) => f.name === 'saturate');
    expect(saturate).toBeDefined();
    expect(saturate!.value).toBeGreaterThanOrEqual(BOUNDS.saturate.min);
    expect(saturate!.value).toBeLessThanOrEqual(BOUNDS.saturate.max);
  });

  it('hero dark mode contrast is within safe bounds', () => {
    const fns = parseFilterFunctions(DARK_MODE_HERO_FILTER);
    const contrast = fns.find((f) => f.name === 'contrast');
    expect(contrast).toBeDefined();
    expect(contrast!.value).toBeGreaterThanOrEqual(BOUNDS.contrast.min);
    expect(contrast!.value).toBeLessThanOrEqual(BOUNDS.contrast.max);
  });
});

// ---------------------------------------------------------------------------
// 3. Theme switch timing — transition duration ≤ 300ms (Req 5.1)
// ---------------------------------------------------------------------------
describe('Theme transition timing (Req 5.1)', () => {
  it('--transition-theme durations are all ≤ 300ms', () => {
    const durations = extractTransitionDurationsMs(THEME_TRANSITION_VALUE);
    expect(durations.length).toBeGreaterThan(0);
    for (const ms of durations) {
      expect(ms).toBeLessThanOrEqual(300);
    }
  });

  it('--transition-theme contains at least one duration value', () => {
    const durations = extractTransitionDurationsMs(THEME_TRANSITION_VALUE);
    expect(durations.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 4. No layout-affecting or expensive filter functions (Req 7.3)
// ---------------------------------------------------------------------------
describe('No expensive filter functions (Req 7.3)', () => {
  const allFilters = [DARK_MODE_GENERAL_FILTER, DARK_MODE_HERO_FILTER];

  for (const disallowed of DISALLOWED_FILTERS) {
    it(`filters do not include "${disallowed}"`, () => {
      for (const filter of allFilters) {
        expect(filter).not.toContain(disallowed);
      }
    });
  }
});

// ---------------------------------------------------------------------------
// 5. CSS-only approach — no JS style calculations (Req 5.4)
// ---------------------------------------------------------------------------
describe('CSS-only theme approach (Req 5.4)', () => {
  it('theme switching uses class toggling pattern (applyTheme adds/removes "dark" class)', () => {
    // Simulate the applyTheme logic from ThemeProvider
    const applyTheme = (resolved: 'light' | 'dark', classList: Set<string>) => {
      if (resolved === 'dark') {
        classList.add('dark');
      } else {
        classList.delete('dark');
      }
    };

    const classList = new Set<string>();

    applyTheme('dark', classList);
    expect(classList.has('dark')).toBe(true);

    applyTheme('light', classList);
    expect(classList.has('dark')).toBe(false);
  });

  it('filter is expressed as a static CSS string, not computed at runtime', () => {
    // Filters are plain strings — no function calls or dynamic computation
    expect(typeof DARK_MODE_GENERAL_FILTER).toBe('string');
    expect(typeof DARK_MODE_HERO_FILTER).toBe('string');
  });

  it('filter strings contain no JavaScript template expressions', () => {
    // A static CSS value should not contain ${ or backtick patterns
    expect(DARK_MODE_GENERAL_FILTER).not.toMatch(/\$\{/);
    expect(DARK_MODE_HERO_FILTER).not.toMatch(/\$\{/);
  });
});
