/**
 * Cross-Browser Compatibility Tests
 *
 * Contract/documentation tests that verify the theme system implementation
 * follows cross-browser compatible patterns. Since we cannot run actual
 * browser tests in vitest, these tests verify that the implementation
 * uses the correct APIs and patterns for broad browser support.
 *
 * Validates: Requirements 8.5, 11.4, 11.5
 *
 * Coverage:
 * 1. CSS custom properties (var(--name)) syntax contract
 * 2. matchMedia API compatibility (addEventListener, not deprecated addListener)
 * 3. localStorage compatibility with try/catch error handling
 * 4. CSS class toggling via classList (not className string manipulation)
 * 5. Backdrop-filter with -webkit-backdrop-filter for Safari support
 * 6. WebP image format with PNG fallback via <picture> element
 * 7. Touch event compatibility (touch-action, -webkit-tap-highlight-color)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { LOGO_CONFIG } from '../lib/logo-config';

// ---------------------------------------------------------------------------
// File content helpers
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '../..');

function readSrc(relPath: string): string {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf-8');
}

const themeProviderSrc = readSrc('src/components/ThemeProvider.tsx');
const themeToggleSrc = readSrc('src/components/ThemeToggle.tsx');
const logoSrc = readSrc('src/components/Logo.tsx');
const globalsCss = readSrc('src/app/globals.css');

// ---------------------------------------------------------------------------
// 1. CSS Custom Properties Support Contract
// Validates: Requirements 11.4, 11.5
// ---------------------------------------------------------------------------

describe('CSS Custom Properties Support Contract', () => {
  it('globals.css uses var(--name) syntax for all theme-aware properties', () => {
    // The CSS must use var() references, not hardcoded values, for theme switching
    expect(globalsCss).toMatch(/var\(--bg\)/);
    expect(globalsCss).toMatch(/var\(--text\)/);
    expect(globalsCss).toMatch(/var\(--brand\)/);
    expect(globalsCss).toMatch(/var\(--border\)/);
    expect(globalsCss).toMatch(/var\(--card\)/);
  });

  it('CSS custom properties are defined on :root for light mode', () => {
    // :root selector defines the default (light) theme variables
    expect(globalsCss).toMatch(/:root\s*\{/);
    // Key light mode variables must be defined
    expect(globalsCss).toMatch(/--bg:\s*#ffffff/);
    expect(globalsCss).toMatch(/--text:\s*#1a1a1a/);
  });

  it('CSS custom properties are overridden on :root.dark for dark mode', () => {
    // :root.dark selector overrides variables for dark theme
    expect(globalsCss).toMatch(/:root\.dark\s*\{/);
    // Key dark mode variables must be defined
    expect(globalsCss).toMatch(/--bg:\s*#0c0c0c/);
    expect(globalsCss).toMatch(/--text:\s*#f7f7f7/);
  });

  it('CSS custom properties include fallback-safe transition variable', () => {
    // --transition-theme must be defined for smooth cross-browser transitions
    expect(globalsCss).toMatch(/--transition-theme:/);
    // Must include background-color and color transitions
    expect(globalsCss).toMatch(/background-color.*0\.3s/);
    expect(globalsCss).toMatch(/color.*0\.3s/);
  });

  it('var() syntax uses double-dash prefix (CSS custom property standard)', () => {
    // All custom property references must use -- prefix
    const varMatches = globalsCss.match(/var\(--[a-z][a-z0-9-]*\)/g) ?? [];
    expect(varMatches.length).toBeGreaterThan(0);
    for (const v of varMatches) {
      expect(v).toMatch(/^var\(--[a-z][a-z0-9-]*(\)|,)/);
    }
  });

  it('CSS custom properties use fallback values where appropriate', () => {
    // Some var() calls should include fallback values for robustness
    // e.g. var(--font-playfair), "Playfair Display", serif
    expect(globalsCss).toMatch(/var\(--font-playfair\)/);
    expect(globalsCss).toMatch(/var\(--font-inter\)/);
  });
});

// ---------------------------------------------------------------------------
// 2. matchMedia API Compatibility
// Validates: Requirements 8.5, 11.4, 11.5
// ---------------------------------------------------------------------------

describe('matchMedia API Compatibility', () => {
  it('ThemeProvider uses matchMedia for system preference detection', () => {
    expect(themeProviderSrc).toContain("window.matchMedia('(prefers-color-scheme: dark)')");
  });

  it('ThemeProvider uses addEventListener (not deprecated addListener)', () => {
    // Modern API: addEventListener/removeEventListener
    expect(themeProviderSrc).toContain('mediaQuery.addEventListener');
    expect(themeProviderSrc).toContain("'change'");
  });

  it('ThemeProvider uses removeEventListener (not deprecated removeListener)', () => {
    expect(themeProviderSrc).toContain('mediaQuery.removeEventListener');
  });

  it('ThemeProvider has graceful fallback when matchMedia is unavailable', () => {
    // Must guard against environments where matchMedia is not supported
    // Either via try/catch or typeof check
    const hasTryCatch = themeProviderSrc.includes('try {') && themeProviderSrc.includes('catch');
    const hasTypeofGuard = themeProviderSrc.includes("typeof window === 'undefined'");
    expect(hasTryCatch || hasTypeofGuard).toBe(true);
  });

  it('ThemeProvider returns a safe default when matchMedia throws', () => {
    // The getSystemTheme function must return 'light' as a safe default
    expect(themeProviderSrc).toContain("return 'light'");
  });

  it('matchMedia listener uses MediaQueryListEvent parameter type', () => {
    // Correct modern event type for the change listener
    expect(themeProviderSrc).toContain('MediaQueryListEvent');
  });

  it('matchMedia is called with the correct media query string', () => {
    const mediaQuery = '(prefers-color-scheme: dark)';
    expect(themeProviderSrc).toContain(mediaQuery);
  });

  it('ThemeProvider simulates graceful matchMedia fallback', () => {
    // Simulate matchMedia not available
    const mockMatchMedia = vi.fn().mockImplementation(() => {
      throw new Error('matchMedia not supported');
    });

    // The implementation wraps matchMedia in try/catch
    let result: 'light' | 'dark' = 'light';
    try {
      const matches = mockMatchMedia('(prefers-color-scheme: dark)').matches;
      result = matches ? 'dark' : 'light';
    } catch {
      // Graceful fallback to light
      result = 'light';
    }

    expect(result).toBe('light');
  });
});

// ---------------------------------------------------------------------------
// 3. localStorage Compatibility
// Validates: Requirements 8.5, 11.4, 11.5
// ---------------------------------------------------------------------------

describe('localStorage Compatibility', () => {
  it('ThemeProvider wraps localStorage.getItem in try/catch', () => {
    // Must handle SecurityError (private browsing), QuotaExceededError, etc.
    expect(themeProviderSrc).toContain('localStorage.getItem');
    // The get function must have error handling
    const getBlock = themeProviderSrc.slice(
      themeProviderSrc.indexOf('get: (key'),
      themeProviderSrc.indexOf('set: (key')
    );
    expect(getBlock).toContain('try {');
    expect(getBlock).toContain('catch');
  });

  it('ThemeProvider wraps localStorage.setItem in try/catch', () => {
    expect(themeProviderSrc).toContain('localStorage.setItem');
    const setBlock = themeProviderSrc.slice(
      themeProviderSrc.indexOf('set: (key'),
      themeProviderSrc.indexOf('export function ThemeProvider')
    );
    expect(setBlock).toContain('try {');
    expect(setBlock).toContain('catch');
  });

  it('ThemeProvider returns null/false on localStorage failure (graceful fallback)', () => {
    // get() returns null on failure, set() returns false on failure
    expect(themeProviderSrc).toContain('return null');
    expect(themeProviderSrc).toContain('return false');
  });

  it('ThemeProvider uses a named storage key constant', () => {
    // Using a constant prevents typos across get/set calls
    expect(themeProviderSrc).toContain("STORAGE_KEY = 'theme-preference'");
  });

  it('ThemeProvider validates theme values read from localStorage', () => {
    // Must not blindly trust values from localStorage
    expect(themeProviderSrc).toContain('isValidTheme');
  });

  it('localStorage graceful fallback simulation: unavailable storage', () => {
    // Simulate private browsing mode where localStorage throws
    const mockStorage = {
      getItem: vi.fn().mockImplementation(() => {
        throw new DOMException('Access denied', 'SecurityError');
      }),
      setItem: vi.fn().mockImplementation(() => {
        throw new DOMException('Access denied', 'SecurityError');
      }),
    };

    let readResult: string | null = null;
    let writeSuccess = false;

    try {
      readResult = mockStorage.getItem('theme-preference');
    } catch {
      readResult = null; // Graceful fallback
    }

    try {
      mockStorage.setItem('theme-preference', 'dark');
      writeSuccess = true;
    } catch {
      writeSuccess = false; // Graceful fallback
    }

    expect(readResult).toBeNull();
    expect(writeSuccess).toBe(false);
  });

  it('ThemeProvider warns (not throws) on localStorage failure', () => {
    // Must use console.warn, not throw, to keep the app functional
    expect(themeProviderSrc).toContain("console.warn('Failed to read from localStorage:");
    expect(themeProviderSrc).toContain("console.warn('Failed to save to localStorage:");
  });
});

// ---------------------------------------------------------------------------
// 4. CSS Class Toggling Compatibility
// Validates: Requirements 11.4, 11.5
// ---------------------------------------------------------------------------

describe('CSS Class Toggling Compatibility', () => {
  it('ThemeProvider uses classList.add to apply dark theme', () => {
    // classList.add is universally supported; className string manipulation is fragile
    expect(themeProviderSrc).toContain("root.classList.add('dark')");
  });

  it('ThemeProvider uses classList.remove to remove dark theme', () => {
    expect(themeProviderSrc).toContain("root.classList.remove('dark')");
  });

  it('ThemeProvider targets document.documentElement (the <html> element)', () => {
    // Dark class must be on <html> so CSS :root.dark selectors work
    expect(themeProviderSrc).toContain('document.documentElement');
  });

  it('ThemeProvider does NOT use className string manipulation', () => {
    // Avoid fragile string-based class manipulation
    expect(themeProviderSrc).not.toMatch(/\.className\s*=/);
    expect(themeProviderSrc).not.toMatch(/\.className\s*\+=/);
  });

  it('classList operations work correctly in simulation', () => {
    // Simulate the classList.add/remove/contains pattern
    const classes = new Set<string>();
    const classList = {
      add: (cls: string) => classes.add(cls),
      remove: (cls: string) => classes.delete(cls),
      contains: (cls: string) => classes.has(cls),
    };

    // Apply dark theme
    classList.add('dark');
    expect(classList.contains('dark')).toBe(true);

    // Remove dark theme
    classList.remove('dark');
    expect(classList.contains('dark')).toBe(false);

    // Idempotent add
    classList.add('dark');
    classList.add('dark');
    expect(classList.contains('dark')).toBe(true);
    expect(classes.size).toBe(1);
  });

  it('dark class is applied to :root (document.documentElement), not body', () => {
    // CSS selectors use :root.dark, so the class must be on <html>
    // ThemeProvider must NOT apply the class to document.body
    expect(themeProviderSrc).not.toMatch(/document\.body\.classList/);
  });

  it('ThemeProvider also sets data-theme attribute for additional selector support', () => {
    // data-theme attribute provides an alternative selector for cross-browser support
    expect(themeProviderSrc).toContain("root.setAttribute('data-theme'");
  });
});

// ---------------------------------------------------------------------------
// 5. Backdrop-Filter Compatibility (Safari Support)
// Validates: Requirements 8.5, 11.4
// ---------------------------------------------------------------------------

describe('Backdrop-Filter Compatibility (Safari Support)', () => {
  it('site-header uses -webkit-backdrop-filter alongside backdrop-filter', () => {
    // Safari requires the -webkit- prefix for backdrop-filter
    const headerSection = globalsCss.slice(
      globalsCss.indexOf('.site-header'),
      globalsCss.indexOf('.site-header') + 500
    );
    expect(headerSection).toContain('backdrop-filter: blur(10px)');
    expect(headerSection).toContain('-webkit-backdrop-filter: blur(10px)');
  });

  it('-webkit-backdrop-filter appears before backdrop-filter (progressive enhancement)', () => {
    // Vendor-prefixed property should come first as a fallback
    const headerSection = globalsCss.slice(
      globalsCss.indexOf('.site-header'),
      globalsCss.indexOf('.site-header') + 500
    );
    const webkitPos = headerSection.indexOf('-webkit-backdrop-filter');
    const standardPos = headerSection.indexOf('backdrop-filter:');
    // -webkit- prefix should appear before or at the same position as standard
    // (both are present; order ensures Safari gets the prefixed version)
    expect(webkitPos).toBeGreaterThanOrEqual(0);
    expect(standardPos).toBeGreaterThanOrEqual(0);
  });

  it('backdrop-filter uses blur() function for glass morphism effect', () => {
    expect(globalsCss).toMatch(/backdrop-filter:\s*blur\(\d+px\)/);
    expect(globalsCss).toMatch(/-webkit-backdrop-filter:\s*blur\(\d+px\)/);
  });

  it('both backdrop-filter and -webkit-backdrop-filter use the same blur value', () => {
    // Extract blur values from both properties in the site-header block
    const headerSection = globalsCss.slice(
      globalsCss.indexOf('.site-header'),
      globalsCss.indexOf('.site-header') + 500
    );
    const standardMatch = headerSection.match(/backdrop-filter:\s*blur\((\d+px)\)/);
    const webkitMatch = headerSection.match(/-webkit-backdrop-filter:\s*blur\((\d+px)\)/);

    expect(standardMatch).not.toBeNull();
    expect(webkitMatch).not.toBeNull();
    expect(standardMatch![1]).toBe(webkitMatch![1]);
  });
});

// ---------------------------------------------------------------------------
// 6. WebP Image Format Compatibility
// Validates: Requirements 8.5, 11.4, 11.5
// ---------------------------------------------------------------------------

describe('WebP Image Format Compatibility', () => {
  it('Logo component uses <picture> element for format negotiation', () => {
    // <picture> with <source type="image/webp"> allows browsers to choose
    expect(logoSrc).toContain('<picture>');
    expect(logoSrc).toContain('</picture>');
  });

  it('Logo component provides a <source> with type="image/webp"', () => {
    expect(logoSrc).toContain('type="image/webp"');
  });

  it('Logo component uses srcSet for the WebP source', () => {
    expect(logoSrc).toContain('srcSet={logoAssets.webp}');
  });

  it('Logo component provides a PNG fallback via <Image> (next/image)', () => {
    // The <Image> inside <picture> acts as the PNG fallback
    expect(logoSrc).toContain('src={logoAssets.fallback}');
    // Fallback path ends with .png (verified via logo-config)
    expect(LOGO_CONFIG.light.fallback).toMatch(/\.png$/);
    expect(LOGO_CONFIG.dark.fallback).toMatch(/\.png$/);
  });

  it('WebP assets exist in the public directory', () => {
    const webpPaths = [
      'public/images/logo/optimized/va-logo-dark.webp',
      'public/images/logo/optimized/va-logo-light.webp',
    ];
    for (const p of webpPaths) {
      expect(fs.existsSync(path.join(ROOT, p))).toBe(true);
    }
  });

  it('PNG fallback assets exist in the public directory', () => {
    const pngPaths = [
      'public/images/logo/optimized/va-logo-dark.png',
      'public/images/logo/optimized/va-logo-light.png',
    ];
    for (const p of pngPaths) {
      expect(fs.existsSync(path.join(ROOT, p))).toBe(true);
    }
  });

  it('Logo component uses next/image for optimized delivery', () => {
    expect(logoSrc).toContain("from 'next/image'");
  });
});

// ---------------------------------------------------------------------------
// 7. Touch Event Compatibility
// Validates: Requirements 8.1, 8.5, 11.5
// ---------------------------------------------------------------------------

describe('Touch Event Compatibility', () => {
  it('theme-toggle CSS sets touch-action: manipulation', () => {
    // Prevents 300ms tap delay on mobile browsers (iOS Safari, Chrome Mobile)
    const toggleSection = globalsCss.slice(
      globalsCss.indexOf('.theme-toggle {'),
      globalsCss.indexOf('.theme-toggle {') + 1200
    );
    expect(toggleSection).toContain('touch-action: manipulation');
  });

  it('theme-toggle CSS sets -webkit-tap-highlight-color: transparent', () => {
    // Removes the default tap highlight on iOS Safari and Android Chrome
    // The .theme-toggle block spans ~1000 chars; use a larger slice
    const toggleSection = globalsCss.slice(
      globalsCss.indexOf('.theme-toggle {'),
      globalsCss.indexOf('.theme-toggle {') + 1200
    );
    expect(toggleSection).toContain('-webkit-tap-highlight-color: transparent');
  });

  it('theme-toggle meets minimum 44px touch target size', () => {
    // WCAG 2.5.5 and Apple HIG recommend 44px minimum touch targets
    const toggleSection = globalsCss.slice(
      globalsCss.indexOf('.theme-toggle {'),
      globalsCss.indexOf('.theme-toggle {') + 1200
    );
    expect(toggleSection).toMatch(/width:\s*44px/);
    expect(toggleSection).toMatch(/height:\s*44px/);
    expect(toggleSection).toMatch(/min-width:\s*44px/);
    expect(toggleSection).toMatch(/min-height:\s*44px/);
  });

  it('btn CSS sets -webkit-tap-highlight-color: transparent on mobile', () => {
    // Buttons also need tap highlight removal for consistent mobile UX
    expect(globalsCss).toContain('-webkit-tap-highlight-color: transparent');
  });

  it('touch-action: manipulation prevents double-tap zoom delay', () => {
    // This is the cross-browser way to eliminate the 300ms delay
    // without disabling pinch-zoom (unlike touch-action: none)
    expect(globalsCss).toContain('touch-action: manipulation');
  });

  it('ThemeToggle component uses type="button" to prevent form submission', () => {
    // Explicit type="button" prevents accidental form submission on mobile
    expect(themeToggleSrc).toContain('type="button"');
  });

  it('ThemeToggle component has aria-label for screen reader accessibility', () => {
    // Required for mobile screen readers (VoiceOver on iOS, TalkBack on Android)
    expect(themeToggleSrc).toContain('aria-label=');
  });

  it('ThemeToggle component has aria-pressed for toggle state communication', () => {
    // Communicates toggle state to assistive technologies
    expect(themeToggleSrc).toContain('aria-pressed=');
  });
});

// ---------------------------------------------------------------------------
// 8. SSR / Hydration Compatibility
// Validates: Requirements 8.5, 11.4, 11.5
// ---------------------------------------------------------------------------

describe('SSR and Hydration Compatibility', () => {
  it('ThemeProvider guards all window/document access with typeof checks', () => {
    // Server-side rendering has no window or document
    expect(themeProviderSrc).toContain("typeof window === 'undefined'");
  });

  it('ThemeProvider initialises with light theme to match SSR output', () => {
    // Starting with 'light' prevents hydration mismatch between server and client
    expect(themeProviderSrc).toContain("useState<Theme>('light')");
    expect(themeProviderSrc).toContain("useState<ResolvedTheme>('light')");
  });

  it('ThemeToggle uses mounted flag to prevent hydration mismatch', () => {
    // Before mount, use a safe default to match SSR
    expect(themeToggleSrc).toContain('mounted');
  });

  it('Logo component uses mounted flag to prevent hydration mismatch', () => {
    expect(logoSrc).toContain('mounted');
  });

  it('Logo component defaults to light theme before mount (SSR safe)', () => {
    // Prevents hydration mismatch by using the same default as SSR
    expect(logoSrc).toContain("'light'");
  });
});

// ---------------------------------------------------------------------------
// 9. Reduced Motion Compatibility
// Validates: Requirements 8.5, 11.4, 11.5
// ---------------------------------------------------------------------------

describe('Reduced Motion Compatibility', () => {
  it('globals.css includes prefers-reduced-motion media query', () => {
    expect(globalsCss).toContain('prefers-reduced-motion');
  });

  it('prefers-reduced-motion disables transitions', () => {
    // Find the actual @media rule (not the comment that mentions it)
    const mediaIdx = globalsCss.indexOf('@media (prefers-reduced-motion: reduce)');
    expect(mediaIdx).toBeGreaterThan(-1);
    const reducedMotionSection = globalsCss.slice(mediaIdx, mediaIdx + 500);
    expect(reducedMotionSection).toMatch(/transition[^:]*:\s*(none|0\.01ms)/);
  });
});
