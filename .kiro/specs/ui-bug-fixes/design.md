# UI Bug Fixes Design

## Overview

This document covers the fix design for four co-occurring UI bugs in the Vickie's Atelier Next.js 16 / Tailwind CSS v4 application. The bugs are:

1. **Theme Regression** — `applyTheme` in `ThemeProvider` wraps the DOM class toggle in `requestAnimationFrame`, racing with the inline `themeInitScript` in `layout.tsx` and causing flicker or reversion.
2. **Hydration Errors** — The `<html>` tag is missing `suppressHydrationWarning`; `ThemeToggle` renders theme-dependent icons before the `mounted` guard is confirmed.
3. **Oversized Fonts** — `.split-body` has `font-size: clamp(26px, 3vw, 40px)` on the container div, inflating all child text; `.subhead` has no explicit size.
4. **Invisible Button Text** — In dark mode, `.btn::before` hover gradient ends in `var(--brand-light)` which resolves to `#2a2520` (near-black), matching the `#111` button text color.

All fixes are surgical: no existing systems are rebuilt, and all unchanged behaviors are preserved.

---

## Glossary

- **Bug_Condition (C)**: The set of inputs or states that trigger a defect.
- **Property (P)**: The desired correct behavior when the bug condition holds.
- **Preservation**: Existing behaviors that must remain identical after the fix.
- **applyTheme**: The function in `ThemeProvider.tsx` that adds/removes the `dark` class on `document.documentElement`.
- **themeInitScript**: The inline `<script>` in `layout.tsx` that applies the `dark` class before first paint to prevent FOUC.
- **mounted**: The boolean flag in `ThemeProvider` that becomes `true` after the first `useEffect` runs on the client.
- **resolvedTheme**: The computed `'light' | 'dark'` value after resolving `'system'` against `window.matchMedia`.
- **split-body**: The container div in the "Our Story" section that currently carries an inflated block-level `font-size`.
- **brand-light**: A CSS custom property that resolves to `#f5ede5` in light mode and `#2a2520` in dark mode.

---

## Bug Details

### Bug 1 — Theme Regression

The bug manifests when `ThemeProvider` initialises or when the user toggles the theme. The `applyTheme` function defers the DOM class mutation inside `requestAnimationFrame`, which means the class is applied one frame after the state update. This creates a race with the synchronous `themeInitScript` that already set the correct class before React hydrated, and can cause a visible flicker or reversion when React re-renders.

**Formal Specification:**
```
FUNCTION isBugCondition_1(X)
  INPUT: X = { applyMethod: 'rAF' | 'sync', storedTheme: string | null }
  OUTPUT: boolean

  RETURN X.applyMethod = 'rAF'
         OR (X.storedTheme IN ['dark', 'system']
             AND document.documentElement.classList NOT CONTAINS 'dark'
             immediately after ThemeProvider.init(X))
END FUNCTION
```

**Examples:**
- User has `theme-preference = "dark"` in localStorage → page loads, `themeInitScript` adds `dark` class → React hydrates → `useEffect` fires → `applyTheme` schedules `requestAnimationFrame` → one frame later the class is re-added (no-op) but in the gap React may have removed it → **flicker observed**.
- User clicks ThemeToggle to switch to dark → `setTheme('dark')` called → state updates synchronously → `applyTheme` schedules rAF → component re-renders with `resolvedTheme = 'dark'` but DOM still has no `dark` class for one frame → **brief flash of light styles**.
- User has `theme-preference = "system"` and OS is dark → same rAF race as above.
- User has `theme-preference = "light"` → no `dark` class expected → rAF is still deferred but no visible difference (edge case, no flicker).

---

### Bug 2 — Hydration Errors

The bug manifests in two places:

**2a — Missing `suppressHydrationWarning` on `<html>`:** The server renders `<html lang="en" class="...fonts...">` with no `dark` class. The `themeInitScript` runs synchronously on the client and may add `dark` before React hydrates. React then sees a class mismatch and logs a hydration error.

**2b — ThemeToggle renders before `mounted`:** `ThemeToggle` uses `const currentTheme = mounted ? resolvedTheme : 'light'` which is correct, but the icon visibility is controlled by a className conditional on `currentTheme`. The server renders with `currentTheme = 'light'` (moon icon active). If the stored theme is `dark`, the client's first render also uses `'light'` (correct), but the `useEffect` immediately fires and sets `mounted = true` + `resolvedTheme = 'dark'`, causing a second render that swaps the icon — this is a post-hydration update, not a hydration error, but it produces a visible icon flash.

**Formal Specification:**
```
FUNCTION isBugCondition_2(X)
  INPUT: X = { htmlElement: DOMElement, mountedFlag: boolean, storedTheme: string }
  OUTPUT: boolean

  RETURN (NOT htmlElement.hasAttribute('suppressHydrationWarning')
          AND themeInitScript MAY mutate htmlElement.className)
         OR (mountedFlag = false
             AND ThemeToggle renders theme-dependent icon classes)
END FUNCTION
```

**Examples:**
- Server HTML: `<html lang="en" class="font-playfair font-inter">` → client script adds `dark` → React hydrates → class mismatch → **hydration warning in console**.
- Stored theme is `dark` → server renders moon icon active → client first render also moon active (correct) → `useEffect` fires → `mounted = true`, `resolvedTheme = 'dark'` → re-render shows sun icon active → **icon flash**.

---

### Bug 3 — Oversized Fonts

The bug manifests in the "Our Story" section and the Hero section.

**3a — `.split-body` container inflation:** The rule `font-size: clamp(26px, 3vw, 40px)` is applied to the `.split-body` div. All child elements (`p`, `li`, `.ticks li`) inherit this size, making body copy render at 26–40px instead of the standard 16px.

**3b — `.subhead` missing explicit size:** The `.subhead` rule has `color` and `max-width` but no `font-size`, so it inherits from the nearest ancestor. Inside `.split-body` it inherits the inflated size; in the Hero it inherits the body default (16px) rather than the intended 18px.

**Formal Specification:**
```
FUNCTION isBugCondition_3(X)
  INPUT: X = { element: DOMElement }
  OUTPUT: boolean

  RETURN (X.element.matches('.split-body p, .split-body li, .split-body .ticks li')
          AND computedFontSize(X.element) > 18px)
         OR (X.element.matches('.subhead')
             AND computedFontSize(X.element) != 18px)
END FUNCTION
```

**Examples:**
- `.split-body p` → computed font-size = `clamp(26px, 3vw, 40px)` → at 1200px viewport = 36px → **oversized body copy**.
- `.ticks li` inside `.split-body` → same inheritance → **oversized tick list items**.
- `.subhead` in Hero → no explicit size → inherits 16px body default → **inconsistent with 18px subheadings elsewhere**.
- `.subhead` inside `.split-body` → inherits 26–40px → **severely oversized**.
- `.split-body h2` → inherits 26–40px instead of using `.section-head h2` rule → **wrong heading size**.

---

### Bug 4 — Invisible Button Text on Hover

The bug manifests when a user hovers over a `.btn` in dark mode.

**Formal Specification:**
```
FUNCTION isBugCondition_4(X)
  INPUT: X = { theme: 'light' | 'dark', buttonVariant: string, state: 'hover' }
  OUTPUT: boolean

  RETURN X.state = 'hover'
         AND X.theme = 'dark'
         AND X.buttonVariant = 'btn' (primary)
         AND contrastRatio(textColor(X), resolvedGradientEndColor(X)) < 4.5
END FUNCTION
```

**Root of the problem:** In `globals.css`:
```css
:root.dark .btn::before {
  background: linear-gradient(135deg, var(--brand-hover), var(--brand-light));
}
```
In dark mode: `--brand-hover` = `#d4b08c`, `--brand-light` = `#2a2520`. The gradient ends at `#2a2520` (near-black). Button text color is `#111`. Contrast ratio of `#111` on `#2a2520` ≈ 1.05:1 — effectively invisible.

**Examples:**
- Dark mode, hover `.btn` "Explore Collections" → `::before` fades in, gradient end is `#2a2520`, text is `#111` → **text invisible**.
- Dark mode, hover `.btn` "Place an Order" in header → same issue → **text invisible**.
- Light mode, hover `.btn` → gradient is `var(--brand-hover)` (#b89168) to `var(--brand)` (#c7a17a) → text `#111` → contrast ≈ 4.6:1 → **readable** (not a bug).
- Dark mode, hover `.btn--ghost` → `::before` uses `var(--bg-tertiary)` (#1a1a1a), text overridden to `var(--brand)` (#c7a17a) → contrast ≈ 4.8:1 → acceptable, but the explicit dark mode override `color: var(--brand)` is redundant and should be verified.

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Light mode theme toggle continues to remove the `dark` class and persist `"light"` to localStorage.
- `"system"` mode continues to resolve from `window.matchMedia` and update on OS preference change.
- All `:root.dark` CSS custom property overrides in `globals.css` continue to apply when the `dark` class is present.
- The correct theme toggle icon (sun/moon) continues to display after `mounted = true`.
- All navigation links and the theme toggle button continue to render with correct styling.
- `.headline` in the Hero continues to display at `clamp(40px, 7vw, 76px)` — intentional large display heading.
- The tick list, CTA button, and split-media image in "Our Story" continue to render without layout changes.
- All other sections (Collections, Lookbook, Callout, Footer) continue to use their existing font sizes.
- Light mode button hover continues to show the warm gold gradient with dark (`#111`) text.
- Focus, active, and disabled button states continue to apply existing styles unchanged.
- `.btn--ghost` and `.btn--outline` in light mode continue to show `var(--brand)` text on hover.

**Scope:**
All inputs that do NOT match the four bug conditions above are completely unaffected by these fixes.

---

## Hypothesized Root Cause

### Bug 1 — Theme Regression
1. **Deferred DOM mutation**: `requestAnimationFrame` in `applyTheme` was added as a "performance optimization" comment but introduces a one-frame delay that races with React's synchronous reconciliation and the already-synchronous `themeInitScript`.
2. **Guard condition blocks sync apply**: The `if (isChangingTheme.current) return` guard inside the rAF callback could theoretically skip the apply if `isChangingTheme` is reset before the frame fires (unlikely but possible).

### Bug 2 — Hydration Errors
1. **Missing `suppressHydrationWarning`**: The `<html>` element in `layout.tsx` does not have `suppressHydrationWarning`, so React diffs the server-rendered class list against the client class list after `themeInitScript` mutates it.
2. **Icon flash**: `ThemeToggle` correctly defers to `'light'` before `mounted`, but the transition from unmounted→mounted state causes a visible re-render of the icon. A CSS-only approach (hide until mounted) or rendering both icons and toggling visibility via CSS would eliminate the flash.

### Bug 3 — Oversized Fonts
1. **Block-level font-size on container**: The `font-size: clamp(26px, 3vw, 40px)` rule was likely intended for the `h2` inside `.split-body` but was mistakenly placed on the container itself, causing all descendants to inherit it.
2. **Missing explicit size on `.subhead`**: The `.subhead` rule was written without a `font-size`, relying on context. This works in most places but fails inside `.split-body` and produces inconsistency in the Hero.

### Bug 4 — Invisible Button Text
1. **Semantic mismatch of `--brand-light`**: In light mode `--brand-light` is a pale cream (`#f5ede5`) — a sensible "light brand" color. In dark mode it was repurposed as a dark near-black (`#2a2520`) for subtle dark backgrounds. Using it as the gradient end of a hover overlay in dark mode creates a near-black surface under near-black text.
2. **No dark-mode-specific contrast check**: The `:root.dark .btn::before` override was added to differentiate the hover from light mode but the chosen end color was not checked against the fixed `#111` text color.

---

## Correctness Properties

Property 1: Bug Condition — Synchronous Theme Application

_For any_ call to `applyTheme(resolved)` where `resolved` is `'dark'` or `'light'`, the fixed function SHALL synchronously add or remove the `dark` class on `document.documentElement` in the same call stack tick, without deferring to `requestAnimationFrame`, so the class is present immediately after the function returns.

**Validates: Requirements 2.1, 2.3**

Property 2: Bug Condition — Hydration Safety

_For any_ server-rendered page where the `themeInitScript` may add the `dark` class before React hydrates, the fixed `<html>` element SHALL carry `suppressHydrationWarning` so React does not emit a hydration error, AND the `ThemeToggle` SHALL render a server/client-consistent initial state until `mounted === true`.

**Validates: Requirements 2.4, 2.5, 2.6**

Property 3: Bug Condition — Child Font Size Inheritance

_For any_ element matching `.split-body p`, `.split-body li`, or `.split-body .ticks li`, the fixed stylesheet SHALL produce a computed `font-size` of `16px` (inherited from body), and for any element matching `.subhead` the computed `font-size` SHALL be `18px` (`var(--font-size-lg)`).

**Validates: Requirements 2.7, 2.8, 2.9**

Property 4: Bug Condition — Button Hover Contrast in Dark Mode

_For any_ `.btn` (primary variant) in dark mode hover state, the fixed stylesheet SHALL produce a contrast ratio of at least 4.5:1 between the button text color (`#111`) and the resolved hover overlay background color, ensuring text remains legible.

**Validates: Requirements 2.10, 2.11, 2.12**

Property 5: Preservation — Non-Buggy Inputs Unchanged

_For any_ input where none of the four bug conditions hold (light mode theme ops, non-hover button states, non-split-body font contexts, non-html-root hydration paths), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11**

---

## Fix Implementation

### Changes Required

#### File: `src/components/ThemeProvider.tsx`

**Function: `applyTheme`**

**Specific Changes:**
1. **Remove `requestAnimationFrame` wrapper**: Replace the deferred DOM mutation with a direct synchronous call. The `isChangingTheme.current` guard should also be removed from `applyTheme` since it was only needed to prevent the rAF from firing after a rapid state change — with synchronous application this is no longer a concern.

   Before:
   ```ts
   requestAnimationFrame(() => {
     if (resolved === 'dark') {
       root.classList.add('dark');
       root.setAttribute('data-theme', 'dark');
     } else {
       root.classList.remove('dark');
       root.setAttribute('data-theme', 'light');
     }
   });
   ```
   After:
   ```ts
   if (resolved === 'dark') {
     root.classList.add('dark');
     root.setAttribute('data-theme', 'dark');
   } else {
     root.classList.remove('dark');
     root.setAttribute('data-theme', 'light');
   }
   ```

2. **Remove `isChangingTheme` guard from `applyTheme`**: The `if (typeof window === 'undefined' || isChangingTheme.current) return` check should drop the `isChangingTheme.current` condition. The `typeof window` guard is still needed for SSR safety.

---

#### File: `src/app/layout.tsx`

**Element: `<html>`**

**Specific Changes:**
1. **Add `suppressHydrationWarning`** to the `<html>` tag so React ignores the class attribute difference introduced by `themeInitScript`.

   Before:
   ```tsx
   <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
   ```
   After:
   ```tsx
   <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
   ```

---

#### File: `src/components/ThemeToggle.tsx`

**Specific Changes:**
1. **Render both icons always, control visibility via CSS class**: The current approach conditionally adds `active` to one icon. This is already correct for hydration (both icons are always in the DOM). No structural change needed — the `mounted` guard on `currentTheme` is already in place. However, to eliminate the icon flash, add a `data-mounted` attribute to the button that CSS can use to hide the toggle until mounted, or simply accept the post-hydration flash as a known limitation since it is not a React error.

   Minimal fix: no change required to `ThemeToggle.tsx` — the `suppressHydrationWarning` on `<html>` resolves the hydration error; the icon flash is a UX polish item, not a hydration error.

---

#### File: `src/app/globals.css`

**Specific Changes:**

**Bug 3 — Font sizes:**

1. **Remove `font-size` from `.split-body`**:
   ```css
   /* Before */
   .split-body {
     width: 100%;
     max-width: 500px;
     display: flex;
     flex-direction: column;
     justify-content: center;
     font-size: clamp(26px, 3vw, 40px);  /* ← remove this line */
   }
   ```

2. **Add scoped `.split-body h2` rule** with the correct heading size (matching `.section-head h2`):
   ```css
   .split-body h2 {
     font-family: var(--font-playfair), "Playfair Display", serif;
     font-size: clamp(28px, 3vw, 40px);
     margin: 0 0 16px;
   }
   ```

3. **Add explicit `font-size` to `.subhead`**:
   ```css
   .subhead {
     font-size: var(--font-size-lg); /* 18px */
     color: var(--muted);
     max-width: 740px;
     margin: 0 auto 20px;
   }
   ```

**Bug 4 — Button hover contrast:**

4. **Fix `:root.dark .btn::before` gradient end color**: Replace `var(--brand-light)` (which resolves to `#2a2520` in dark mode) with `var(--brand-2)` (which resolves to `#e7d7c9`, a light nude — high contrast against `#111`):
   ```css
   /* Before */
   :root.dark .btn::before {
     background: linear-gradient(135deg, var(--brand-hover), var(--brand-light));
   }

   /* After */
   :root.dark .btn::before {
     background: linear-gradient(135deg, var(--brand-hover), var(--brand-2));
   }
   ```

5. **Verify `.btn > *` z-index rule is present** (already exists in current code — no change needed): `z-index: 1` on `.btn > *` ensures direct child elements sit above the `::before` overlay.

---

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate each bug on the unfixed code, then verify the fix works correctly and preserves existing behavior.

---

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate each bug BEFORE implementing the fix. Confirm or refute the root cause analysis.

**Test Plan**: Write unit tests that directly invoke `applyTheme`, render the layout, compute CSS values, and simulate hover states. Run on UNFIXED code to observe failures.

**Test Cases:**

1. **rAF Race Test** (Bug 1): Call `applyTheme('dark')` and immediately check `document.documentElement.classList.contains('dark')` — expect `false` on unfixed code because the class is deferred to the next animation frame.

2. **Hydration Class Mismatch Test** (Bug 2): Render `RootLayout` server-side, inject `themeInitScript` output, then check if React hydration produces a warning — expect warning on unfixed code.

3. **Split-body Child Font Size Test** (Bug 3): Render the "Our Story" section, query a `.split-body p` element, check `getComputedStyle(el).fontSize` — expect a value > 18px on unfixed code.

4. **Subhead Font Size Test** (Bug 3): Render the Hero section, query `.subhead`, check `getComputedStyle(el).fontSize` — expect `16px` (not `18px`) on unfixed code.

5. **Button Hover Contrast Test** (Bug 4): In dark mode, simulate hover on `.btn`, resolve the `::before` background gradient end color, compute contrast ratio against `#111` — expect < 4.5 on unfixed code.

**Expected Counterexamples:**
- `applyTheme` returns before the class is set (rAF deferred).
- React hydration warning logged for `<html>` class mismatch.
- `.split-body p` computed font-size is `clamp(26px, 3vw, 40px)` resolved value (e.g. 36px at 1200px viewport).
- `.subhead` computed font-size is `16px`.
- Dark mode `.btn::before` gradient end resolves to `#2a2520`, contrast ratio ≈ 1.05:1.

---

### Fix Checking

**Goal**: Verify that for all inputs where each bug condition holds, the fixed code produces the expected behavior.

**Pseudocode:**
```
FOR ALL X WHERE isBugCondition_1(X) DO
  applyTheme_fixed(X.resolved)
  ASSERT document.documentElement.classList.contains('dark') === (X.resolved === 'dark')
  // class is set synchronously, no rAF
END FOR

FOR ALL X WHERE isBugCondition_2(X) DO
  ASSERT html.hasAttribute('suppressHydrationWarning') = true
  ASSERT ThemeToggle.serverRender() = ThemeToggle.clientFirstRender()
END FOR

FOR ALL X WHERE isBugCondition_3(X) DO
  result := computedFontSize(X.element)
  IF X.element.matches('.split-body p, .split-body li') THEN
    ASSERT result = 16px
  ELSE IF X.element.matches('.subhead') THEN
    ASSERT result = 18px
  END IF
END FOR

FOR ALL X WHERE isBugCondition_4(X) DO
  result := resolvedHoverBgColor(X.button, 'dark')
  ASSERT contrastRatio('#111', result) >= 4.5
END FOR
```

---

### Preservation Checking

**Goal**: Verify that for all inputs where the bug conditions do NOT hold, the fixed code produces the same result as the original code.

**Pseudocode:**
```
FOR ALL X WHERE NOT isBugCondition_1(X)
             AND NOT isBugCondition_2(X)
             AND NOT isBugCondition_3(X)
             AND NOT isBugCondition_4(X) DO
  ASSERT original(X) = fixed(X)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because it generates many test cases automatically across the input domain and catches edge cases that manual unit tests might miss.

**Test Cases:**
1. **Light Mode Theme Preservation**: Verify `applyTheme('light')` still removes `dark` class synchronously after fix.
2. **System Mode Preservation**: Verify `resolveTheme('system')` still reads `window.matchMedia` and updates on OS change.
3. **Headline Font Preservation**: Verify `.headline` computed font-size remains `clamp(40px, 7vw, 76px)` after removing `.split-body` font-size.
4. **Other Section Font Preservation**: Verify `.section-head h2`, `.card-body h3`, footer text, etc. are unaffected.
5. **Light Mode Button Hover Preservation**: Verify `.btn::before` in light mode still uses `var(--brand-hover)` to `var(--brand)` gradient.
6. **Button Focus/Active/Disabled Preservation**: Verify focus ring, active scale, and disabled opacity are unchanged.
7. **Ghost/Outline Light Mode Hover Preservation**: Verify `var(--brand)` text on hover in light mode is unchanged.

---

### Unit Tests

- Test `applyTheme('dark')` sets `document.documentElement.classList` synchronously (no rAF).
- Test `applyTheme('light')` removes `dark` class synchronously.
- Test `<html>` element in rendered layout has `suppressHydrationWarning` attribute.
- Test `ThemeToggle` server render matches initial client render (both use `'light'` fallback).
- Test `.split-body p` computed font-size equals `16px` after fix.
- Test `.split-body h2` computed font-size equals `clamp(28px, 3vw, 40px)` after fix.
- Test `.subhead` computed font-size equals `18px` after fix.
- Test dark mode `.btn::before` gradient end color is not `#2a2520`.

### Property-Based Tests

- Generate random `Theme` values (`'light'`, `'dark'`, `'system'`) and verify `applyTheme` always sets the correct class synchronously.
- Generate random viewport widths and verify `.split-body` child elements never exceed `18px` font-size.
- Generate random button variants and verify contrast ratio >= 4.5:1 in dark mode hover state for all variants.
- Generate random non-hover button states and verify they are identical before and after the fix.

### Integration Tests

- Full page render in dark mode: verify no hydration warnings in console, correct theme applied, correct icon shown after mount.
- Full page render with `theme-preference = "system"` and dark OS: verify `dark` class present before and after hydration.
- "Our Story" section render: verify heading, body copy, and tick list all use correct font sizes.
- Hero section render: verify `.headline` unchanged, `.subhead` is 18px.
- Button hover in dark mode across all pages: verify text is legible (contrast >= 4.5:1).
- Theme toggle interaction: verify switching light → dark → system → light produces correct class state at each step with no flicker.
