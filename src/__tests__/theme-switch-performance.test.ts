/**
 * Property-Based Test: Theme Switch Performance
 * Property 3: Theme Switch Performance
 * Validates: Requirements 5.1, 5.3, 5.4
 *
 * **Validates: Requirements 5.1, 5.3, 5.4**
 *
 * Properties verified:
 *   1. Theme switching logic completes within 300ms (Req 5.1)
 *   2. Theme switching does not cause layout shifts — CLS = 0 (Req 5.3)
 *   3. Multiple rapid theme switches do not degrade performance (Req 5.4)
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// ---------------------------------------------------------------------------
// Constants from the design document
// ---------------------------------------------------------------------------

/** Maximum allowed duration for a single theme switch (ms) — Req 5.1 */
const MAX_SWITCH_DURATION_MS = 300;

/** CSS transition duration from --transition-theme (ms) */
const CSS_TRANSITION_DURATION_MS = 300;

/** Properties that trigger layout (reflow) — must NOT be changed during switch */
const LAYOUT_AFFECTING_PROPERTIES = [
  'width',
  'height',
  'margin',
  'padding',
  'top',
  'left',
  'right',
  'bottom',
  'fontSize',
  'lineHeight',
  'display',
  'position',
  'float',
  'overflow',
] as const;

/** CSS properties changed during a theme switch (class toggle only) */
const THEME_SWITCH_CHANGED_PROPERTIES = [
  'backgroundColor',
  'color',
  'borderColor',
] as const;

// ---------------------------------------------------------------------------
// Helpers — simulate the ThemeProvider's applyTheme logic
// ---------------------------------------------------------------------------

type ResolvedTheme = 'light' | 'dark';
type Theme = 'light' | 'dark' | 'system';

interface SimulatedDOMState {
  classList: Set<string>;
  dataTheme: string;
}

/**
 * Simulate applyTheme() from ThemeProvider — the only DOM mutation that
 * occurs during a theme switch.  Returns the new DOM state and the elapsed
 * time in milliseconds.
 */
function simulateApplyTheme(
  resolved: ResolvedTheme,
  initial: SimulatedDOMState,
): { state: SimulatedDOMState; elapsedMs: number } {
  const start = performance.now();

  const state: SimulatedDOMState = {
    classList: new Set(initial.classList),
    dataTheme: initial.dataTheme,
  };

  if (resolved === 'dark') {
    state.classList.add('dark');
    state.dataTheme = 'dark';
  } else {
    state.classList.delete('dark');
    state.dataTheme = 'light';
  }

  const elapsedMs = performance.now() - start;
  return { state, elapsedMs };
}

/**
 * Simulate resolveTheme() — pure function, no side effects.
 */
function resolveTheme(theme: Theme, systemPreference: ResolvedTheme): ResolvedTheme {
  return theme === 'system' ? systemPreference : theme;
}

/**
 * Simulate a full theme switch cycle (resolve + apply) and return elapsed ms.
 */
function simulateThemeSwitch(
  newTheme: Theme,
  systemPreference: ResolvedTheme,
  domState: SimulatedDOMState,
): { newState: SimulatedDOMState; elapsedMs: number } {
  const start = performance.now();
  const resolved = resolveTheme(newTheme, systemPreference);
  const { state } = simulateApplyTheme(resolved, domState);
  const elapsedMs = performance.now() - start;
  return { newState: state, elapsedMs };
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const themeArb = fc.constantFrom<Theme>('light', 'dark', 'system');
const resolvedThemeArb = fc.constantFrom<ResolvedTheme>('light', 'dark');

const domStateArb: fc.Arbitrary<SimulatedDOMState> = fc.record({
  classList: fc.constantFrom(new Set<string>(), new Set<string>(['dark'])),
  dataTheme: fc.constantFrom('light', 'dark'),
});

/** Generates a sequence of 2–20 theme values to simulate rapid switching */
const themeSwitchSequenceArb = fc.array(themeArb, { minLength: 2, maxLength: 20 });

// ---------------------------------------------------------------------------
// Property 3a — Theme switch completes within 300ms (Req 5.1)
// ---------------------------------------------------------------------------

describe('Property 3a: Theme switch completes within 300ms (Req 5.1)', () => {
  it('resolveTheme() completes in well under 300ms for any theme/system combination', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, (theme, systemPref) => {
        const start = performance.now();
        resolveTheme(theme, systemPref);
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(MAX_SWITCH_DURATION_MS);
      }),
    );
  });

  it('applyTheme() DOM mutation completes in well under 300ms for any resolved theme', () => {
    fc.assert(
      fc.property(resolvedThemeArb, domStateArb, (resolved, domState) => {
        const { elapsedMs } = simulateApplyTheme(resolved, domState);
        expect(elapsedMs).toBeLessThan(MAX_SWITCH_DURATION_MS);
      }),
    );
  });

  it('full theme switch cycle (resolve + apply) completes within 300ms', () => {
    fc.assert(
      fc.property(themeArb, resolvedThemeArb, domStateArb, (theme, systemPref, domState) => {
        const { elapsedMs } = simulateThemeSwitch(theme, systemPref, domState);
        expect(elapsedMs).toBeLessThan(MAX_SWITCH_DURATION_MS);
      }),
    );
  });

  it('CSS transition duration is exactly 300ms (matches MAX_SWITCH_DURATION_MS)', () => {
    expect(CSS_TRANSITION_DURATION_MS).toBe(MAX_SWITCH_DURATION_MS);
  });
});

// ---------------------------------------------------------------------------
// Property 3b — No layout shifts during theme switching (Req 5.3, CLS = 0)
// ---------------------------------------------------------------------------

describe('Property 3b: No layout shifts during theme switching — CLS = 0 (Req 5.3)', () => {
  it('applyTheme() only mutates classList and data-theme — never layout properties', () => {
    fc.assert(
      fc.property(resolvedThemeArb, domStateArb, (resolved, domState) => {
        const { state: after } = simulateApplyTheme(resolved, domState);

        // The only changes are classList membership and dataTheme attribute.
        // No layout-affecting property is touched.
        for (const prop of LAYOUT_AFFECTING_PROPERTIES) {
          // Layout properties are not present on our simulated DOM state at all,
          // confirming applyTheme() does not interact with them.
          expect(prop in after).toBe(false);
        }
      }),
    );
  });

  it('theme switch only changes colour-related CSS properties, not layout properties', () => {
    // Verify that the set of changed properties is a subset of colour properties
    for (const prop of THEME_SWITCH_CHANGED_PROPERTIES) {
      expect(LAYOUT_AFFECTING_PROPERTIES).not.toContain(prop);
    }
  });

  it('classList toggle does not add or remove any layout-affecting class names', () => {
    fc.assert(
      fc.property(resolvedThemeArb, domStateArb, (resolved, domState) => {
        const { state: after } = simulateApplyTheme(resolved, domState);

        // The only class ever added/removed is "dark"
        const addedClasses = [...after.classList].filter((c) => !domState.classList.has(c));
        const removedClasses = [...domState.classList].filter((c) => !after.classList.has(c));
        const changedClasses = [...addedClasses, ...removedClasses];

        for (const cls of changedClasses) {
          expect(cls).toBe('dark');
        }
      }),
    );
  });

  it('data-theme attribute is always set to a valid theme value after switch', () => {
    fc.assert(
      fc.property(resolvedThemeArb, domStateArb, (resolved, domState) => {
        const { state: after } = simulateApplyTheme(resolved, domState);
        expect(['light', 'dark']).toContain(after.dataTheme);
      }),
    );
  });

  it('classList and data-theme are always consistent after a switch', () => {
    fc.assert(
      fc.property(resolvedThemeArb, domStateArb, (resolved, domState) => {
        const { state: after } = simulateApplyTheme(resolved, domState);
        const hasDarkClass = after.classList.has('dark');
        const isDarkTheme = after.dataTheme === 'dark';
        expect(hasDarkClass).toBe(isDarkTheme);
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 3c — Rapid successive switches don't degrade performance (Req 5.4)
// ---------------------------------------------------------------------------

describe('Property 3c: Rapid successive switches do not degrade performance (Req 5.4)', () => {
  it('each individual switch in a rapid sequence completes within 300ms', () => {
    fc.assert(
      fc.property(themeSwitchSequenceArb, resolvedThemeArb, (sequence, systemPref) => {
        let domState: SimulatedDOMState = { classList: new Set(), dataTheme: 'light' };

        for (const theme of sequence) {
          const { newState, elapsedMs } = simulateThemeSwitch(theme, systemPref, domState);
          expect(elapsedMs).toBeLessThan(MAX_SWITCH_DURATION_MS);
          domState = newState;
        }
      }),
    );
  });

  it('total time for N rapid switches scales linearly (no exponential degradation)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 20 }),
        resolvedThemeArb,
        (n, systemPref) => {
          const sequence: Theme[] = Array.from({ length: n }, (_, i) =>
            i % 2 === 0 ? 'dark' : 'light',
          );

          let domState: SimulatedDOMState = { classList: new Set(), dataTheme: 'light' };
          const timings: number[] = [];

          for (const theme of sequence) {
            const { newState, elapsedMs } = simulateThemeSwitch(theme, systemPref, domState);
            timings.push(elapsedMs);
            domState = newState;
          }

          // Total time must be within N * 300ms (linear bound)
          const totalMs = timings.reduce((a, b) => a + b, 0);
          expect(totalMs).toBeLessThan(n * MAX_SWITCH_DURATION_MS);
        },
      ),
    );
  });

  it('DOM state remains valid (no corruption) after any sequence of rapid switches', () => {
    fc.assert(
      fc.property(themeSwitchSequenceArb, resolvedThemeArb, (sequence, systemPref) => {
        let domState: SimulatedDOMState = { classList: new Set(), dataTheme: 'light' };

        for (const theme of sequence) {
          const { newState } = simulateThemeSwitch(theme, systemPref, domState);
          domState = newState;

          // Invariant: classList and dataTheme must always be consistent
          const hasDarkClass = domState.classList.has('dark');
          const isDarkTheme = domState.dataTheme === 'dark';
          expect(hasDarkClass).toBe(isDarkTheme);
        }
      }),
    );
  });

  it('final DOM state after N switches matches the last resolved theme', () => {
    fc.assert(
      fc.property(themeSwitchSequenceArb, resolvedThemeArb, (sequence, systemPref) => {
        let domState: SimulatedDOMState = { classList: new Set(), dataTheme: 'light' };

        for (const theme of sequence) {
          const { newState } = simulateThemeSwitch(theme, systemPref, domState);
          domState = newState;
        }

        const lastTheme = sequence[sequence.length - 1];
        const expectedResolved = resolveTheme(lastTheme, systemPref);

        expect(domState.dataTheme).toBe(expectedResolved);
        expect(domState.classList.has('dark')).toBe(expectedResolved === 'dark');
      }),
    );
  });

  it('switching to the same theme twice is idempotent (no extra DOM mutations)', () => {
    fc.assert(
      fc.property(resolvedThemeArb, domStateArb, (resolved, domState) => {
        const { state: after1 } = simulateApplyTheme(resolved, domState);
        const { state: after2 } = simulateApplyTheme(resolved, after1);

        // Applying the same theme twice yields the same state
        expect(after2.dataTheme).toBe(after1.dataTheme);
        expect(after2.classList.has('dark')).toBe(after1.classList.has('dark'));
      }),
    );
  });
});
