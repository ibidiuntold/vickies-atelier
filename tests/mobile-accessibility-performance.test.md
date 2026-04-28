# Mobile, Accessibility, and Performance Testing

**Test Tasks**: 15.6, 15.7, 15.8  
**Spec**: UX Enhancement and Consultation Booking

## Overview

This consolidated test plan covers mobile responsiveness (Task 15.6), accessibility compliance (Task 15.7), and performance metrics (Task 15.8).

---

## TASK 15.6: Mobile Responsiveness Testing

**Requirements**: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.11

### Test Case M1: All Pages on Mobile Viewport (≤860px)

**Steps**: Test homepage, consultation, order, services pages at 375px, 768px, 860px widths

**Expected Results**:
- ✓ All pages render correctly on mobile
- ✓ No horizontal scrolling
- ✓ Content is readable
- ✓ Images scale appropriately

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case M2: Button Centering on Mobile

**Steps**: Check all buttons on mobile viewport

**Expected Results**:
- ✓ All buttons are centered horizontally
- ✓ Buttons have minimum 44px tap targets
- ✓ Buttons are touch-friendly

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case M3: Logo Visibility (Header Only) on Mobile

**Steps**: View all pages on mobile

**Expected Results**:
- ✓ Logo visible in header on mobile
- ✓ Logo hidden in footer on mobile
- ✓ Logo maintains aspect ratio

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case M4: Contact Widget on Mobile

**Steps**: Test contact widget on mobile viewport

**Expected Results**:
- ✓ Widget is visible and accessible
- ✓ Widget has 44px minimum tap target
- ✓ Widget doesn't obstruct content
- ✓ Expand/collapse works on mobile

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case M5: Form Layouts on Mobile

**Steps**: Test consultation and order forms on mobile

**Expected Results**:
- ✓ Form fields stack vertically
- ✓ All fields are accessible
- ✓ Submit buttons are centered
- ✓ Validation messages are visible

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case M6: Navigation Menu on Mobile

**Steps**: Test navigation on mobile viewport

**Expected Results**:
- ✓ Navigation is collapsible hamburger menu
- ✓ Menu opens/closes correctly
- ✓ All links are accessible
- ✓ Menu doesn't obstruct content

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## TASK 15.7: Accessibility Compliance Testing

**Requirements**: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 15.10, 15.11, 15.12

### Test Case A1: Keyboard Navigation

**Steps**: Navigate all pages using only keyboard (Tab, Enter, Space, Escape)

**Expected Results**:
- ✓ All interactive elements are keyboard accessible
- ✓ Tab order is logical
- ✓ Focus indicators are visible
- ✓ No keyboard traps

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case A2: Screen Reader Compatibility

**Steps**: Test with NVDA, JAWS, or VoiceOver

**Expected Results**:
- ✓ All content is announced correctly
- ✓ ARIA labels are effective
- ✓ Form fields have associated labels
- ✓ Error messages are announced

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case A3: Focus Indicators

**Steps**: Tab through all interactive elements

**Expected Results**:
- ✓ Focus indicators are visible on all elements
- ✓ Focus indicators have sufficient contrast
- ✓ Focus order is logical

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case A4: Color Contrast Ratios

**Steps**: Use contrast checker tool on all text and interactive elements

**Expected Results**:
- ✓ Light mode meets WCAG 2.1 AA standards (4.5:1 for normal text)
- ✓ Dark mode meets WCAG 2.1 AA standards
- ✓ All text is readable in both themes

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## TASK 15.8: Performance Metrics Testing

**Requirements**: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9, 16.10, 16.11, 16.12

### Test Case P1: Lighthouse Audit - Desktop

**Steps**: Run Lighthouse audit on desktop (1920px width)

**Expected Results**:
- ✓ Performance score ≥ 85
- ✓ Accessibility score ≥ 90
- ✓ Best Practices score ≥ 90
- ✓ SEO score ≥ 90

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case P2: Lighthouse Audit - Mobile

**Steps**: Run Lighthouse audit on mobile (375px width)

**Expected Results**:
- ✓ Performance score ≥ 80
- ✓ Accessibility score ≥ 90
- ✓ Best Practices score ≥ 90
- ✓ SEO score ≥ 90

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case P3: Page Load Times on 3G

**Steps**: Simulate 3G connection in dev tools, measure load times

**Expected Results**:
- ✓ Homepage loads in < 3 seconds
- ✓ Consultation page loads in < 3 seconds
- ✓ Order page loads in < 3 seconds
- ✓ Services page loads in < 3 seconds

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case P4: Lazy Loading

**Steps**: Observe image loading behavior while scrolling

**Expected Results**:
- ✓ Images below the fold are lazy loaded
- ✓ Images load as user scrolls
- ✓ No layout shift during image loading
- ✓ Placeholder or loading state is shown

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Execution Summary

**Task 15.6 - Mobile**: ___ / 6 passed  
**Task 15.7 - Accessibility**: ___ / 4 passed  
**Task 15.8 - Performance**: ___ / 4 passed  

**Total**: ___ / 14 passed

**Test Date**: _______________  
**Tester**: _______________  
**Environment**: _______________

---

## Automated Verification

Run the following scripts for automated checks:

```bash
# Mobile responsiveness checks
node tests/verify-mobile-responsive.mjs

# Accessibility checks
node tests/verify-accessibility.mjs

# Performance checks (Lighthouse)
node scripts/lighthouse-test.mjs
```

---

## Notes

- Mobile testing should be done on actual devices when possible
- Accessibility testing requires screen reader software
- Performance testing should be done on production build (`npm run build && npm start`)
- Lighthouse audits should be run in incognito mode

---

## Sign-off

**Tester**: _______________  
**Date**: _______________
