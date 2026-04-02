/**
 * Bug Condition Exploration Tests
 *
 * **Validates: Requirements 1.3, 1.4, 1.7, 1.10**
 *
 * CRITICAL: These tests MUST FAIL on unfixed code.
 * Failure confirms each bug exists. DO NOT fix the code or tests when they fail.
 * These tests encode expected behavior — they will pass after the fixes are applied.
 *
 * Property 1: Bug Condition — Four UI Bug Conditions
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const linearize = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const THEME_PROVIDER_PATH = path.resolve('src/components/ThemeProvider.tsx');
const LAYOUT_PATH = path.resolve('src/app/layout.tsx');
const GLOBALS_CSS_PATH = path.resolve('src/app/globals.css');

// ---------------------------------------------------------------------------
// Bug 1 — rAF Race: applyTheme defers DOM mutation to requestAnimationFrame
// ---------------------------------------------------------------------------

describe('Bug 1 — rAF Race: applyTheme defers class toggle to requestAnimationFrame', () => {
  it('ThemeProvider.tsx applyTheme should NOT use requestAnimationFrame (synchronous DOM mutation required)', () => {
    // Read the source of ThemeProvider to check for the rAF pattern
    const source = fs.readFileSync(THEME_PROVIDER_PATH, 'utf-8');

    // On UNFIXED code: requestAnimationFrame wraps the classList mutation.
    // This test asserts the rAF wrapper is ABSENT — it will FAIL on unfixed code.
    // Counterexample: source contains "requestAnimationFrame" wrapping classList.add/remove
    const hasRAF = source.includes('requestAnimationFrame');
    expect(hasRAF).toBe(false);
    // Expected failure message: "expected true to be false"
    // Counterexample: applyTheme wraps classList mutation in requestAnimationFrame,
    // so classList.contains('dark') is false immediately after applyTheme('dark') is called.
  });
});

// ---------------------------------------------------------------------------
// Bug 2 — Hydration: <html> missing suppressHydrationWarning
// ---------------------------------------------------------------------------

describe('Bug 2 — Hydration: <html> element missing suppressHydrationWarning', () => {
  it('<html> tag in layout.tsx should have suppressHydrationWarning attribute', () => {
    // Read the layout source and check for suppressHydrationWarning on the html element
    const source = fs.readFileSync(LAYOUT_PATH, 'utf-8');

    // On UNFIXED code: <html lang="en" className={...}> has no suppressHydrationWarning.
    // This test asserts the attribute IS present — it will FAIL on unfixed code.
    // Counterexample: layout.tsx renders <html lang="en" className={...}> without
    // suppressHydrationWarning, causing React hydration errors when themeInitScript
    // adds the 'dark' class before React hydrates.
    const hasSuppressHydrationWarning = source.includes('suppressHydrationWarning');
    expect(hasSuppressHydrationWarning).toBe(true);
    // Expected failure message: "expected false to be true"
  });
});

// ---------------------------------------------------------------------------
// Bug 3a — split-body child inflation: container font-size inflates all children
// ---------------------------------------------------------------------------

describe('Bug 3a — split-body child inflation: container font-size clamp(26px,3vw,40px) inflates children', () => {
  it('.split-body rule in globals.css should NOT contain a font-size declaration (children must inherit 16px from body)', () => {
    const css = fs.readFileSync(GLOBALS_CSS_PATH, 'utf-8');

    // Extract the .split-body rule block
    // Match from ".split-body {" to the closing "}"
    const splitBodyMatch = css.match(/\.split-body\s*\{([^}]*)\}/);
    expect(splitBodyMatch).not.toBeNull();

    const splitBodyBlock = splitBodyMatch![1];

    // On UNFIXED code: .split-body { ... font-size: clamp(26px, 3vw, 40px); ... }
    // This test asserts font-size is ABSENT from .split-body — it will FAIL on unfixed code.
    // Counterexample: .split-body has font-size: clamp(26px, 3vw, 40px), which all child
    // elements (p, li, .ticks li) inherit, rendering body copy at 26–40px instead of 16px.
    const hasFontSize = /font-size/.test(splitBodyBlock);
    expect(hasFontSize).toBe(false);
    // Expected failure message: "expected true to be false"
    // Counterexample: .split-body block contains "font-size: clamp(26px, 3vw, 40px)"
  });
});

// ---------------------------------------------------------------------------
// Bug 3b — subhead size: .subhead has no explicit font-size, inherits 16px
// ---------------------------------------------------------------------------

describe('Bug 3b — subhead size: .subhead missing explicit font-size (should be 18px)', () => {
  it('.subhead rule in globals.css should have an explicit font-size declaration', () => {
    const css = fs.readFileSync(GLOBALS_CSS_PATH, 'utf-8');

    // Extract the .subhead rule block (first occurrence — the base rule, not a nested one)
    const subheadMatch = css.match(/\.subhead\s*\{([^}]*)\}/);
    expect(subheadMatch).not.toBeNull();

    const subheadBlock = subheadMatch![1];

    // On UNFIXED code: .subhead { color: var(--muted); max-width: 740px; margin: ... }
    // No font-size is set, so .subhead inherits 16px from body (or worse, 26–40px inside .split-body).
    // This test asserts font-size IS present — it will FAIL on unfixed code.
    // Counterexample: .subhead block has no font-size property, so computed size is 16px
    // (body default) instead of the intended 18px (var(--font-size-lg)).
    const hasFontSize = /font-size/.test(subheadBlock);
    expect(hasFontSize).toBe(true);
    // Expected failure message: "expected false to be true"
  });
});

// ---------------------------------------------------------------------------
// Bug 4 — button contrast: dark mode .btn::before gradient end is near-black
// ---------------------------------------------------------------------------

describe('Bug 4 — button contrast: dark mode .btn::before gradient end color fails contrast', () => {
  it('dark mode .btn::before gradient should NOT end with var(--brand-light) (resolves to #2a2520, contrast ≈ 1.05:1 against #111)', () => {
    const css = fs.readFileSync(GLOBALS_CSS_PATH, 'utf-8');

    // Find the :root.dark .btn::before rule
    const darkBtnBeforeMatch = css.match(/:root\.dark\s+\.btn::before\s*\{([^}]*)\}/);
    expect(darkBtnBeforeMatch).not.toBeNull();

    const darkBtnBeforeBlock = darkBtnBeforeMatch![1];

    // On UNFIXED code: background: linear-gradient(135deg, var(--brand-hover), var(--brand-light))
    // In dark mode --brand-light = #2a2520 (near-black).
    // This test asserts var(--brand-light) is NOT used as the gradient end — it will FAIL on unfixed code.
    // Counterexample: gradient ends with var(--brand-light) which resolves to #2a2520 in dark mode.
    const usesBrandLight = darkBtnBeforeBlock.includes('var(--brand-light)');
    expect(usesBrandLight).toBe(false);
    // Expected failure message: "expected true to be false"
  });

  it('contrast ratio of #111 (button text) on #2a2520 (dark mode --brand-light) is below 4.5:1', () => {
    // This test documents the actual contrast failure.
    // It PASSES on unfixed code (confirms the bug is real) and continues to pass after fix
    // because the fix changes the gradient color, not the contrast formula.
    // This is a documentation test — it proves the bug condition is a real contrast failure.
    const buttonTextColor = '#111111';
    const brandLightDarkMode = '#2a2520';
    const ratio = contrastRatio(buttonTextColor, brandLightDarkMode);

    // The contrast ratio of #111 on #2a2520 is approximately 1.05:1 — far below 4.5:1.
    // This assertion confirms the bug: the gradient end color makes text invisible.
    expect(ratio).toBeLessThan(4.5);
  });

  it('after fix: contrast ratio of #111 (button text) on resolved gradient end color should be >= 4.5:1', () => {
    const css = fs.readFileSync(GLOBALS_CSS_PATH, 'utf-8');

    // Find the :root.dark .btn::before rule and extract the gradient end color variable
    const darkBtnBeforeMatch = css.match(/:root\.dark\s+\.btn::before\s*\{([^}]*)\}/);
    expect(darkBtnBeforeMatch).not.toBeNull();

    const darkBtnBeforeBlock = darkBtnBeforeMatch![1];

    // Resolve the gradient end color variable to its actual hex value in dark mode.
    // On UNFIXED code: var(--brand-light) → #2a2520 → contrast ≈ 1.05:1 → FAILS
    // On FIXED code:   var(--brand-2)     → #e7d7c9 → contrast ≈ 10:1   → PASSES
    let resolvedEndColor: string;
    if (darkBtnBeforeBlock.includes('var(--brand-light)')) {
      // Unfixed: --brand-light in dark mode = #2a2520
      resolvedEndColor = '#2a2520';
    } else if (darkBtnBeforeBlock.includes('var(--brand-2)')) {
      // Fixed: --brand-2 in dark mode = #e7d7c9
      resolvedEndColor = '#e7d7c9';
    } else {
      // Unknown variable — extract and fail with a clear message
      resolvedEndColor = '#000000';
    }

    const buttonTextColor = '#111111';
    const ratio = contrastRatio(buttonTextColor, resolvedEndColor);

    // On UNFIXED code: resolvedEndColor = '#2a2520', ratio ≈ 1.05 → FAILS (< 4.5)
    // Counterexample: gradient end resolves to #2a2520, contrastRatio('#111111', '#2a2520') ≈ 1.05
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
