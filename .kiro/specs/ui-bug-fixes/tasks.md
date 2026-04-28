# Implementation Plan

- [x] 1. Write bug condition exploration tests (BEFORE implementing any fix)
  - **Property 1: Bug Condition** - Four UI Bug Conditions
  - **CRITICAL**: These tests MUST FAIL on unfixed code — failure confirms each bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: These tests encode expected behavior — they will validate the fixes when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate each bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope each property to the concrete failing case(s)
  - Create `src/__tests__/ui-bug-fixes-exploration.test.ts`
  - **Bug 1 — rAF Race**: Call `applyTheme('dark')` synchronously and immediately assert `document.documentElement.classList.contains('dark') === true` — on unfixed code this FAILS because the class is deferred to the next animation frame
  - **Bug 2 — Hydration**: Assert `<html>` element in rendered layout has `suppressHydrationWarning` attribute — on unfixed code this FAILS because the attribute is absent
  - **Bug 3a — split-body child inflation**: Render a `.split-body p` element with the unfixed CSS and assert `computedFontSize <= 18px` — on unfixed code this FAILS because the container's `clamp(26px, 3vw, 40px)` is inherited
  - **Bug 3b — subhead size**: Assert `.subhead` computed font-size equals `18px` — on unfixed code this FAILS because no explicit size is set and it inherits 16px from body
  - **Bug 4 — button contrast**: In dark mode, resolve the `::before` gradient end color for `.btn` and assert `contrastRatio('#111', resolvedColor) >= 4.5` — on unfixed code this FAILS because `var(--brand-light)` resolves to `#2a2520` giving contrast ≈ 1.05:1
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: All five assertions FAIL (this is correct — it proves each bug exists)
  - Document counterexamples found (e.g. "classList.contains('dark') is false immediately after applyTheme call")
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.3, 1.4, 1.7, 1.10_

- [x] 2. Write preservation property tests (BEFORE implementing any fix)
  - **Property 2: Preservation** - Non-Buggy Input Behaviors
  - **IMPORTANT**: Follow observation-first methodology — run unfixed code with non-buggy inputs first, observe outputs, then encode as tests
  - Create `src/__tests__/ui-bug-fixes-preservation.test.ts`
  - **Observe on unfixed code:**
    - `applyTheme('light')` removes `dark` class (light mode path is not affected by rAF race in the same way — observe actual behavior)
    - `.headline` computed font-size is `clamp(40px, 7vw, 76px)` — not inside `.split-body`, unaffected
    - `.section-head h2` computed font-size is `clamp(28px, 3vw, 40px)` — unaffected by `.split-body` rule
    - `.btn::before` in light mode gradient end resolves to `var(--brand)` (#c7a17a) — not the dark-mode override
    - `.btn--ghost::before` uses `var(--bg-tertiary)` — unaffected by the dark `.btn::before` fix
    - Focus, active, and disabled button states are unchanged
  - Write property-based tests using vitest that generate random `Theme` values and non-hover button states and assert the above behaviors hold
  - Verify tests PASS on UNFIXED code (confirms baseline behavior to preserve)
  - **EXPECTED OUTCOME**: All preservation tests PASS on unfixed code
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11_

- [x] 3. Fix all four UI bugs

  - [x] 3.1 Fix Bug 1 — Remove requestAnimationFrame from applyTheme (ThemeProvider.tsx)
    - In `src/components/ThemeProvider.tsx`, locate the `applyTheme` callback
    - Remove the `requestAnimationFrame(() => { ... })` wrapper entirely
    - Move the `root.classList.add/remove('dark')` and `root.setAttribute('data-theme', ...)` calls to execute directly and synchronously
    - Remove `isChangingTheme.current` from the guard condition in `applyTheme` — keep only the `typeof window === 'undefined'` SSR guard
    - The `isChangingTheme` ref and its usage in `setTheme` can remain (it guards `setTheme`, not `applyTheme`)
    - _Bug_Condition: isBugCondition_1(X) where X.applyMethod = 'rAF'_
    - _Expected_Behavior: applyTheme(resolved) sets document.documentElement.classList synchronously in the same call stack tick_
    - _Preservation: light mode toggle, system mode resolution, and all :root.dark CSS overrides continue to work_
    - _Requirements: 2.1, 2.3, 3.1, 3.2, 3.3_

  - [x] 3.2 Fix Bug 2 — Add suppressHydrationWarning to <html> (layout.tsx)
    - In `src/app/layout.tsx`, add `suppressHydrationWarning` to the `<html>` tag
    - Change: `<html lang="en" className={...}>` → `<html lang="en" className={...} suppressHydrationWarning>`
    - No changes needed to `ThemeToggle.tsx` — the `mounted` guard is already in place
    - _Bug_Condition: isBugCondition_2(X) where html element lacks suppressHydrationWarning and themeInitScript may mutate className_
    - _Expected_Behavior: React does not emit hydration error for class attribute difference on <html>_
    - _Preservation: correct theme toggle icon continues to display after mounted=true; all nav links and header styling unchanged_
    - _Requirements: 2.4, 2.5, 2.6, 3.4, 3.5_

  - [x] 3.3 Fix Bug 3 — Correct font sizes in globals.css
    - In `src/app/globals.css`, locate the `.split-body` rule
    - Remove the line `font-size: clamp(26px, 3vw, 40px);` from `.split-body`
    - Add a new scoped rule immediately after `.split-body`:
      ```css
      .split-body h2 {
        font-family: var(--font-playfair), "Playfair Display", serif;
        font-size: clamp(28px, 3vw, 40px);
        margin: 0 0 16px;
      }
      ```
    - Locate the `.subhead` rule and add `font-size: var(--font-size-lg);` (18px) to it
    - _Bug_Condition: isBugCondition_3(X) where .split-body p/.split-body li computed font-size > 18px OR .subhead computed font-size != 18px_
    - _Expected_Behavior: .split-body p and .split-body li inherit 16px from body; .split-body h2 uses clamp(28px,3vw,40px); .subhead is 18px_
    - _Preservation: .headline remains clamp(40px,7vw,76px); tick list, CTA, and split-media image layout unchanged; all other sections unaffected_
    - _Requirements: 2.7, 2.8, 2.9, 3.6, 3.7, 3.8_

  - [x] 3.4 Fix Bug 4 — Fix dark mode button hover gradient (globals.css)
    - In `src/app/globals.css`, locate the `:root.dark .btn::before` rule
    - Replace `var(--brand-light)` with `var(--brand-2)` in the gradient
    - Change: `background: linear-gradient(135deg, var(--brand-hover), var(--brand-light));`
    - To: `background: linear-gradient(135deg, var(--brand-hover), var(--brand-2));`
    - In dark mode `--brand-2` resolves to `#e7d7c9` (soft nude), giving contrast ratio of ~10:1 against `#111` text
    - _Bug_Condition: isBugCondition_4(X) where X.theme='dark', X.state='hover', contrastRatio('#111', resolvedGradientEnd) < 4.5_
    - _Expected_Behavior: contrastRatio('#111', '#e7d7c9') >= 4.5 (approximately 10:1)_
    - _Preservation: light mode .btn::before gradient unchanged; .btn--ghost/.btn--outline/.btn--light hover unchanged; focus/active/disabled states unchanged_
    - _Requirements: 2.10, 2.11, 3.9, 3.10, 3.11_

  - [x] 3.5 Verify bug condition exploration tests now pass
    - **Property 1: Expected Behavior** - Four UI Bug Conditions Resolved
    - **IMPORTANT**: Re-run the SAME tests from task 1 — do NOT write new tests
    - The tests from task 1 encode the expected behavior for all four bugs
    - When these tests pass, it confirms the expected behavior is satisfied
    - Run `src/__tests__/ui-bug-fixes-exploration.test.ts` on the FIXED code
    - **EXPECTED OUTCOME**: All five assertions PASS (confirms all four bugs are fixed)
    - _Requirements: 2.1, 2.3, 2.4, 2.7, 2.8, 2.10_

  - [x] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Buggy Input Behaviors Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run `src/__tests__/ui-bug-fixes-preservation.test.ts` on the FIXED code
    - **EXPECTED OUTCOME**: All preservation tests PASS (confirms no regressions)
    - Confirm all tests still pass after all four fixes (no regressions introduced)

- [x] 4. Checkpoint — Ensure all tests pass
  - Run the full vitest suite: `npx vitest --run`
  - Ensure `ui-bug-fixes-exploration.test.ts` passes (all five bug condition assertions)
  - Ensure `ui-bug-fixes-preservation.test.ts` passes (all preservation assertions)
  - Ensure no pre-existing tests were broken by the changes
  - Ask the user if any questions arise
