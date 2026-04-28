# Bugfix Requirements Document

## Introduction

This document covers four UI bugs in the Vickie's Atelier Next.js 16 / Tailwind CSS v4 application. The bugs span the theme system (dark/light mode regression), hydration mismatches in the layout and header, disproportionate font sizes in the "Our Story" and Hero sections, and invisible button text on hover across the entire app. All four issues affect user experience and visual consistency and must be fixed without rebuilding existing systems.

---

## Bug Analysis

### Bug 1 — Dark / Light / System Mode Regression

#### Current Behavior (Defect)

1.1 WHEN the user activates dark mode via the ThemeToggle THEN the system does not apply the `dark` class to `<html>` reliably, causing the UI to remain in light mode or revert on navigation.

1.2 WHEN the page loads and a `theme-preference` value of `"system"` or `"dark"` is stored in localStorage THEN the system does not consistently apply the correct theme class before first paint, causing a flash of the wrong theme.

1.3 WHEN `ThemeProvider` initialises on the client THEN the `applyTheme` function wraps the DOM class toggle inside `requestAnimationFrame`, which defers the class application by one frame and can cause a visible flicker or race condition with the inline theme-init script in `layout.tsx`.

#### Expected Behavior (Correct)

2.1 WHEN the user activates dark mode via the ThemeToggle THEN the system SHALL immediately add the `dark` class to `document.documentElement` and persist `"dark"` to localStorage so the theme is stable across navigation and page reloads.

2.2 WHEN the page loads with a stored `theme-preference` of `"system"` or `"dark"` THEN the system SHALL apply the correct `dark` class before first paint via the inline script in `layout.tsx`, and the `ThemeProvider` SHALL hydrate to the same resolved theme to avoid any flash.

2.3 WHEN `ThemeProvider` applies a theme change THEN the system SHALL apply the DOM class synchronously (without `requestAnimationFrame`) so the class is set in the same tick as the state update, eliminating the flicker race condition.

#### Unchanged Behavior (Regression Prevention)

3.1 WHEN the user selects `"light"` mode THEN the system SHALL CONTINUE TO remove the `dark` class from `<html>` and persist `"light"` to localStorage.

3.2 WHEN the user selects `"system"` mode THEN the system SHALL CONTINUE TO resolve the theme from `window.matchMedia('(prefers-color-scheme: dark)')` and update when the OS preference changes.

3.3 WHEN the theme is `"dark"` THEN the system SHALL CONTINUE TO apply all `:root.dark` CSS custom property overrides defined in `globals.css`.

---

### Bug 2 — Hydration Errors in Theme/Layout Wrapper and Header

#### Current Behavior (Defect)

1.4 WHEN Next.js renders the `<html>` element on the server THEN the element has no `dark` class, but the inline `themeInitScript` adds it on the client before React hydrates, causing a class mismatch and a hydration error.

1.5 WHEN `ThemeProvider` initialises THEN `useState` starts with `'light'` on both server and client, but the `useEffect` immediately reads localStorage and calls `applyTheme`, which mutates the DOM before React has finished reconciling, triggering a hydration warning.

1.6 WHEN the `Header` component renders THEN it is a Client Component that reads `ThemeToggle` state; if any child reads `mounted` or `resolvedTheme` before the `mounted` flag is set, the server-rendered HTML differs from the initial client render, producing a hydration mismatch.

#### Expected Behavior (Correct)

2.4 WHEN the `<html>` element is rendered THEN the system SHALL add `suppressHydrationWarning` to the `<html>` tag in `layout.tsx` so React does not error on the class difference introduced by the inline theme-init script.

2.5 WHEN `ThemeProvider` mounts THEN the system SHALL defer all localStorage reads and DOM mutations to `useEffect` (already done), and the `ThemeToggle` SHALL render a neutral/placeholder state until `mounted === true` to ensure the server-rendered HTML matches the initial client render.

2.6 WHEN the `Header` component renders server-side THEN the system SHALL ensure no child component reads browser-only APIs (`window`, `localStorage`, `document`) outside of a `useEffect` or `mounted` guard, so the initial render is identical on server and client.

#### Unchanged Behavior (Regression Prevention)

3.4 WHEN the app loads in a browser THEN the system SHALL CONTINUE TO display the correct theme toggle icon (sun or moon) after the `mounted` flag is set.

3.5 WHEN the `Header` is rendered THEN the system SHALL CONTINUE TO show all navigation links and the theme toggle button with correct styling.

---

### Bug 3 — Oversized & Inconsistent Fonts in "Our Story" and Hero/Landing Sections

#### Current Behavior (Defect)

1.7 WHEN the "Our Story" section renders THEN the `.split-body` element has `font-size: clamp(26px, 3vw, 40px)` applied as a block-level font size on the container div, which causes all child text (paragraphs, list items, tick items) to inherit an oversized base font instead of only affecting the heading.

1.8 WHEN the Hero section renders THEN the `.headline` class uses `font-size: clamp(40px, 7vw, 76px)` and `.subhead` inherits the body font size without explicit sizing, making the subheading appear inconsistently sized relative to other section subheadings across the site.

1.9 WHEN the "Our Story" `<h2>` renders THEN it does not use the `.section-head h2` rule (`clamp(28px, 3vw, 40px)`) because it is inside `.split-body`, so it falls back to the browser default `h2` size, which is larger than the rest of the site's section headings.

1.13 A full audit of `globals.css` confirms `.split-body` is the only block-level container with an inflated `font-size`. All other `font-size` declarations in the stylesheet are correctly scoped to heading or text elements (`h1`, `h2`, `h3`, `p`, `.headline`, `.subhead`, etc.) and do not cause child inheritance issues.

#### Expected Behavior (Correct)

2.7 WHEN the "Our Story" section renders THEN the system SHALL apply the same heading size as other section headings (`clamp(28px, 3vw, 40px)` via the `.split-body h2` rule or an equivalent scoped rule) and body copy SHALL use the standard body font size (`16px` / `var(--font-size-base)`).

2.8 WHEN the Hero section renders THEN the `.subhead` SHALL have an explicit font size of `var(--font-size-lg)` (18px) consistent with section subheadings elsewhere (e.g. `.services-hero p` uses `font-size: 18px`).

2.9 WHEN the "Our Story" section renders THEN the system SHALL remove the `font-size: clamp(26px, 3vw, 40px)` rule from `.split-body` so it no longer inflates all child text, and SHALL add a scoped `.split-body h2` rule with the correct heading size.

2.13 No other sections require font-size corrections — the audit found no additional block-level container font-size inflation outside of `.split-body`.

#### Unchanged Behavior (Regression Prevention)

3.6 WHEN the Hero section renders THEN the system SHALL CONTINUE TO display `.headline` at `clamp(40px, 7vw, 76px)` — the large display heading is intentional and must not change.

3.7 WHEN the "Our Story" section renders THEN the system SHALL CONTINUE TO display the tick list, CTA button, and split-media image without layout changes.

3.8 WHEN other sections (Collections, Lookbook, Callout, Footer) render THEN the system SHALL CONTINUE TO use their existing font sizes unchanged.

---

### Bug 4 — Button Hover State Makes Text Invisible

#### Current Behavior (Defect)

1.10 WHEN a user hovers over a `.btn` (primary gradient button) THEN the `::before` pseudo-element fades in a `linear-gradient(135deg, var(--brand-hover), var(--brand-light))` overlay; in dark mode `--brand-light` resolves to `#2a2520` (near-black), making the button background very dark while the text color remains `#111` (also near-black), rendering the text invisible.

1.11 WHEN a user hovers over a `.btn--ghost`, `.btn--outline`, or `.btn--light` button THEN the `::before` pseudo-element fades in `var(--bg-tertiary)` as the hover background; in dark mode `--bg-tertiary` resolves to `#1a1a1a` (near-black), while the text color is `var(--text)` which also resolves to `#f7f7f7` — this combination is actually fine, but the explicit `:root.dark .btn--ghost:hover` rule overrides `color` to `var(--brand)` (#c7a17a) which has insufficient contrast against `#1a1a1a` in some contexts.

1.12 WHEN a user hovers over any button in light mode THEN the `.btn::before` gradient uses `var(--brand-hover)` (#b89168) to `var(--brand)` (#c7a17a), both warm gold tones, while the text is `#111` — this is readable, but the `::before` overlay sits at `z-index: 0` while button children are at `z-index: 1`, so if any button renders text directly (not wrapped in a child element), the text may be obscured.

#### Expected Behavior (Correct)

2.10 WHEN a user hovers over a `.btn` in dark mode THEN the system SHALL ensure the hover overlay (`::before`) uses colors that maintain sufficient contrast with the button text color `#111`; specifically the `:root.dark .btn::before` rule SHALL use a lighter gradient (e.g. `var(--brand-hover)` to `var(--brand-2)`) instead of the near-black `var(--brand-light)`.

2.11 WHEN a user hovers over any `.btn` variant THEN the system SHALL ensure all direct text content inside the button is wrapped in a child element (or the text itself is at `z-index: 1`) so the `::before` overlay never obscures it.

2.12 WHEN a user hovers over `.btn--ghost`, `.btn--outline`, or `.btn--light` in dark mode THEN the system SHALL ensure the hover text color has sufficient contrast against the hover background; if the background is `var(--bg-tertiary)` (#1a1a1a), the text SHALL be `var(--text)` (#f7f7f7) rather than `var(--brand)` (#c7a17a) which may fail contrast at small sizes.

#### Unchanged Behavior (Regression Prevention)

3.9 WHEN a user hovers over any button in light mode THEN the system SHALL CONTINUE TO display the warm gold gradient hover effect with dark (`#111`) text.

3.10 WHEN buttons are in focus, active, or disabled states THEN the system SHALL CONTINUE TO apply the existing focus ring, active scale, and disabled opacity styles unchanged.

3.11 WHEN the `.btn--ghost` and `.btn--outline` variants render in light mode THEN the system SHALL CONTINUE TO show `var(--brand)` text on hover, as the light background provides sufficient contrast.

---

## Bug Condition Summary

```pascal
// Bug 1 — Theme Regression
FUNCTION isBugCondition_1(X)
  INPUT: X = { storedTheme: string | null, applyMethod: 'rAF' | 'sync' }
  RETURN X.applyMethod = 'rAF' OR (X.storedTheme IN ['dark', 'system'] AND html.classList NOT CONTAINS 'dark' after init)
END FUNCTION

FOR ALL X WHERE isBugCondition_1(X) DO
  result ← ThemeProvider.init(X)
  ASSERT html.classList CONTAINS 'dark' === expected AND no_flicker(result)
END FOR

// Bug 2 — Hydration Mismatch
FUNCTION isBugCondition_2(X)
  INPUT: X = { serverHTML: string, clientHTML: string }
  RETURN serverHTML.html.class !== clientHTML.html.class
END FUNCTION

FOR ALL X WHERE isBugCondition_2(X) DO
  ASSERT React.hydrate(X) produces NO hydration warning
END FOR

// Bug 3 — Font Size Inflation
FUNCTION isBugCondition_3(X)
  INPUT: X = { element: DOMElement, section: 'story' | 'hero' }
  RETURN (X.section = 'story' AND X.element.matches('.split-body p, .split-body li'))
      OR (X.section = 'hero' AND X.element.matches('.subhead'))
END FUNCTION

FOR ALL X WHERE isBugCondition_3(X) DO
  result ← computedFontSize(X.element)
  ASSERT result <= 18px  // consistent with site-wide body/subhead scale
END FOR

// Bug 4 — Invisible Button Text on Hover
FUNCTION isBugCondition_4(X)
  INPUT: X = { theme: 'light' | 'dark', buttonVariant: string, state: 'hover' }
  RETURN X.state = 'hover' AND contrastRatio(textColor(X), bgColor(X)) < 4.5
END FUNCTION

FOR ALL X WHERE isBugCondition_4(X) DO
  result ← renderButton(X)
  ASSERT contrastRatio(result.textColor, result.bgColor) >= 4.5
END FOR

// Preservation — all non-buggy inputs
FOR ALL X WHERE NOT isBugCondition_1(X) AND NOT isBugCondition_2(X)
             AND NOT isBugCondition_3(X) AND NOT isBugCondition_4(X) DO
  ASSERT F(X) = F'(X)  // existing behaviour unchanged
END FOR
```
