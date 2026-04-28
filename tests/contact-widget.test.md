# Contact Widget Functionality - Test Plan

**Test Task**: 15.3 Test contact widget functionality  
**Spec**: UX Enhancement and Consultation Booking  
**Requirements**: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9

## Overview

This document provides comprehensive test cases for verifying the Contact Widget functionality across all pages, including expand/collapse behavior, contact method links, positioning, and content obstruction checks.

---

## Test Suite 1: Widget Expand/Collapse Functionality

**Requirement**: 2.1, 2.2, 18.4, 18.5, 18.6, 18.10  
**Objective**: Verify the contact widget expands and collapses correctly on all pages.

### Test Case 1.1: Widget Initial State on Homepage

**Steps**:
1. Navigate to the homepage (`/`)
2. Observe the contact widget in the bottom-right corner
3. Verify the widget is in collapsed state (icon only)

**Expected Results**:
- ✓ Widget is visible in bottom-right corner
- ✓ Widget displays only an icon button in collapsed state
- ✓ Widget has fixed positioning
- ✓ Widget maintains 20px minimum distance from viewport edges

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.2: Widget Expand on Click

**Steps**:
1. Navigate to any page
2. Click the collapsed contact widget icon
3. Observe the widget expansion animation

**Expected Results**:
- ✓ Widget expands smoothly with animation
- ✓ Expanded widget displays all contact options (email, WhatsApp, phone)
- ✓ Close button (X) is visible when expanded
- ✓ Widget remains in fixed position during expansion

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.3: Widget Collapse on Close Button

**Steps**:
1. Expand the contact widget
2. Click the close button (X)
3. Observe the widget collapse animation

**Expected Results**:
- ✓ Widget collapses smoothly with animation
- ✓ Widget returns to icon-only state
- ✓ Close button is hidden when collapsed

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.4: Widget Collapse on Click Outside

**Steps**:
1. Expand the contact widget
2. Click anywhere outside the widget (on the page content)
3. Observe the widget behavior

**Expected Results**:
- ✓ Widget collapses when clicking outside
- ✓ Widget returns to icon-only state
- ✓ Page content remains interactive

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.5: Widget Expand/Collapse on All Pages

**Steps**:
1. Navigate to homepage (`/`)
2. Expand and collapse the widget
3. Navigate to consultation page (`/consultation`)
4. Expand and collapse the widget
5. Navigate to order page (`/order`)
6. Expand and collapse the widget
7. Navigate to services page (`/services`)
8. Expand and collapse the widget

**Expected Results**:
- ✓ Widget is visible on all pages
- ✓ Expand/collapse functionality works consistently on all pages
- ✓ Widget state resets (collapses) when navigating between pages
- ✓ No errors occur during navigation

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 2: Contact Method Links

**Requirement**: 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 15.7  
**Objective**: Verify all contact method links work correctly.

### Test Case 2.1: Email Link Functionality

**Steps**:
1. Expand the contact widget
2. Locate the email address (vickiesatelier@gmail.com)
3. Click the email link
4. Observe the behavior

**Expected Results**:
- ✓ Email address is displayed correctly
- ✓ Email has a clickable mailto link
- ✓ Clicking opens the default email client
- ✓ Email address is pre-filled in the "To" field
- ✓ Email icon is visible alongside text label

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.2: WhatsApp Link Functionality

**Steps**:
1. Expand the contact widget
2. Locate the WhatsApp number (08118660080)
3. Click the WhatsApp link
4. Observe the behavior

**Expected Results**:
- ✓ WhatsApp number is displayed correctly
- ✓ WhatsApp has a clickable link
- ✓ Clicking opens WhatsApp (web or app)
- ✓ Number is pre-filled in WhatsApp
- ✓ WhatsApp icon is visible alongside text label

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.3: Phone Call Link Functionality

**Steps**:
1. Expand the contact widget
2. Locate the call line number (081607422412)
3. Click the phone link
4. Observe the behavior

**Expected Results**:
- ✓ Phone number is displayed correctly
- ✓ Phone has a clickable tel link
- ✓ Clicking initiates a phone call (on mobile) or opens phone app
- ✓ Number is pre-filled
- ✓ Phone icon is visible alongside text label

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.4: Contact Links Accessibility

**Steps**:
1. Expand the contact widget
2. Use Tab key to navigate through contact links
3. Press Enter on each link
4. Use screen reader to verify ARIA labels

**Expected Results**:
- ✓ All contact links are keyboard accessible
- ✓ Tab order is logical (email → WhatsApp → phone)
- ✓ Focus indicators are visible on each link
- ✓ ARIA labels are present for icon-only buttons
- ✓ Screen reader announces link purpose correctly

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 3: Widget Positioning

**Requirement**: 2.1, 2.2, 18.1, 18.2, 18.3, 18.8  
**Objective**: Verify widget positioning on desktop and mobile viewports.

### Test Case 3.1: Desktop Positioning (>860px)

**Steps**:
1. Set browser width to >860px (e.g., 1920px)
2. Navigate to any page
3. Observe widget position
4. Scroll down the page
5. Observe widget behavior while scrolling

**Expected Results**:
- ✓ Widget is positioned at bottom-right corner
- ✓ Widget maintains 20px distance from right edge
- ✓ Widget maintains 20px distance from bottom edge
- ✓ Widget remains visible while scrolling (fixed position)
- ✓ Widget doesn't overlap with footer content

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.2: Mobile Positioning (≤860px)

**Steps**:
1. Set browser width to ≤860px (e.g., 375px for mobile)
2. Navigate to any page
3. Observe widget position
4. Scroll down the page
5. Observe widget behavior while scrolling

**Expected Results**:
- ✓ Widget is positioned at bottom-right corner
- ✓ Widget maintains 20px distance from right edge
- ✓ Widget maintains 20px distance from bottom edge
- ✓ Widget remains visible while scrolling (fixed position)
- ✓ Widget size is appropriate for mobile (not too large)

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.3: Widget Z-Index Layering

**Steps**:
1. Navigate to any page
2. Expand the contact widget
3. Observe widget layering relative to page content
4. If modal dialogs exist, open one and observe widget layering

**Expected Results**:
- ✓ Widget appears above page content
- ✓ Widget has appropriate z-index (higher than content)
- ✓ Widget appears below modal dialogs (if any)
- ✓ Widget doesn't interfere with page interactions

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.4: Widget Positioning on Different Pages

**Steps**:
1. Navigate to homepage (`/`)
2. Observe widget position
3. Navigate to consultation page (`/consultation`)
4. Observe widget position
5. Navigate to order page (`/order`)
6. Observe widget position
7. Navigate to services page (`/services`)
8. Observe widget position

**Expected Results**:
- ✓ Widget position is consistent across all pages
- ✓ Widget maintains bottom-right corner position
- ✓ Widget doesn't shift or jump between page navigations

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 4: Content Obstruction

**Requirement**: 8.5, 18.9  
**Objective**: Verify widget doesn't obstruct important content.

### Test Case 4.1: Homepage Content Obstruction

**Steps**:
1. Navigate to homepage (`/`)
2. Scroll through entire page
3. Observe if widget obstructs any important content:
   - Hero section
   - Collections sections
   - Callout section
   - Footer

**Expected Results**:
- ✓ Widget doesn't obstruct hero section content
- ✓ Widget doesn't obstruct collection images or buttons
- ✓ Widget doesn't obstruct callout section
- ✓ Widget doesn't overlap footer content on desktop
- ✓ All interactive elements remain accessible

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.2: Consultation Page Content Obstruction

**Steps**:
1. Navigate to consultation page (`/consultation`)
2. Observe if widget obstructs:
   - Form fields
   - Calendar/time slot selector
   - Submit button
   - Validation messages

**Expected Results**:
- ✓ Widget doesn't obstruct form fields
- ✓ Widget doesn't obstruct calendar/time slots
- ✓ Widget doesn't obstruct submit button
- ✓ Widget doesn't hide validation messages
- ✓ All form elements remain accessible

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.3: Order Page Content Obstruction

**Steps**:
1. Navigate to order page (`/order`)
2. Go through all order steps
3. Observe if widget obstructs:
   - Collection selection
   - Measurement form fields
   - Photo upload component
   - Contact form fields
   - Submit buttons

**Expected Results**:
- ✓ Widget doesn't obstruct any form fields
- ✓ Widget doesn't obstruct photo upload area
- ✓ Widget doesn't obstruct submit buttons
- ✓ Widget doesn't hide validation messages
- ✓ All form elements remain accessible throughout all steps

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.4: Services Page Content Obstruction

**Steps**:
1. Navigate to services page (`/services`)
2. Scroll through entire page
3. Observe if widget obstructs:
   - Process steps
   - "What to Expect" section
   - Turnaround times cards
   - CTA buttons

**Expected Results**:
- ✓ Widget doesn't obstruct process step content
- ✓ Widget doesn't obstruct "What to Expect" section
- ✓ Widget doesn't obstruct turnaround time cards
- ✓ Widget doesn't obstruct CTA buttons
- ✓ All content remains readable

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.5: Mobile Content Obstruction

**Steps**:
1. Set browser width to mobile (≤860px)
2. Navigate to each page (homepage, consultation, order, services)
3. Scroll through entire page on each
4. Observe if widget obstructs important content or buttons

**Expected Results**:
- ✓ Widget doesn't obstruct mobile navigation menu
- ✓ Widget doesn't obstruct form submit buttons on mobile
- ✓ Widget doesn't obstruct important text content
- ✓ Widget size is appropriate for mobile screens
- ✓ Widget has minimum 44px tap target on mobile

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 5: Theme Adaptation

**Requirement**: 2.10, 18.11  
**Objective**: Verify widget adapts styling to match active theme mode.

### Test Case 5.1: Widget in Light Mode

**Steps**:
1. Set theme to light mode (toggle if needed)
2. Observe widget styling in collapsed state
3. Expand the widget
4. Observe widget styling in expanded state

**Expected Results**:
- ✓ Widget background color matches light theme
- ✓ Widget text color is readable in light theme
- ✓ Widget icons are visible in light theme
- ✓ Widget border/shadow matches light theme aesthetic
- ✓ Contact links are styled appropriately for light theme

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.2: Widget in Dark Mode

**Steps**:
1. Set theme to dark mode (toggle if needed)
2. Observe widget styling in collapsed state
3. Expand the widget
4. Observe widget styling in expanded state

**Expected Results**:
- ✓ Widget background color matches dark theme
- ✓ Widget text color is readable in dark theme
- ✓ Widget icons are visible in dark theme
- ✓ Widget border/shadow matches dark theme aesthetic
- ✓ Contact links are styled appropriately for dark theme

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.3: Widget Theme Transition

**Steps**:
1. Set theme to light mode
2. Expand the contact widget
3. Toggle theme to dark mode
4. Observe widget transition
5. Toggle back to light mode
6. Observe widget transition

**Expected Results**:
- ✓ Widget transitions smoothly between themes
- ✓ No jarring visual shifts during theme change
- ✓ Widget remains functional during theme transition
- ✓ All contact links remain visible and accessible

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 6: Keyboard Navigation and Accessibility

**Requirement**: 15.1, 15.2, 15.3, 15.4, 15.11, 15.12  
**Objective**: Verify widget is fully keyboard accessible and doesn't trap focus.

### Test Case 6.1: Keyboard Navigation to Widget

**Steps**:
1. Navigate to any page
2. Press Tab repeatedly to navigate through page elements
3. Observe when focus reaches the contact widget
4. Press Enter or Space to expand the widget

**Expected Results**:
- ✓ Widget icon button is reachable via Tab key
- ✓ Focus indicator is visible on widget button
- ✓ Enter or Space key expands the widget
- ✓ Widget is included in logical tab order

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 6.2: Keyboard Navigation Within Expanded Widget

**Steps**:
1. Expand the contact widget using keyboard (Enter/Space)
2. Press Tab to navigate through contact links
3. Press Enter on each link to activate
4. Press Escape key

**Expected Results**:
- ✓ Tab key navigates through all contact links
- ✓ Focus indicators are visible on each link
- ✓ Enter key activates the focused link
- ✓ Escape key collapses the widget
- ✓ Tab order is logical (email → WhatsApp → phone → close button)

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 6.3: Widget Doesn't Trap Keyboard Focus

**Steps**:
1. Expand the contact widget using keyboard
2. Press Tab repeatedly to navigate through all widget elements
3. Continue pressing Tab after the last widget element
4. Observe focus behavior

**Expected Results**:
- ✓ Focus moves through all widget elements
- ✓ After last widget element, focus moves to next page element
- ✓ Focus is not trapped within the widget
- ✓ User can navigate away from widget using keyboard

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 6.4: Screen Reader Compatibility

**Steps**:
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate to the contact widget
3. Expand the widget
4. Navigate through contact links
5. Listen to screen reader announcements

**Expected Results**:
- ✓ Widget button has descriptive label (e.g., "Contact us")
- ✓ Screen reader announces widget state (collapsed/expanded)
- ✓ Contact links have descriptive labels
- ✓ ARIA labels are present for icon-only buttons
- ✓ Screen reader announces link purpose (email, WhatsApp, phone)

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 7: Touch Interaction (Mobile)

**Requirement**: 8.4, 8.8  
**Objective**: Verify widget is touch-friendly on mobile devices.

### Test Case 7.1: Touch Target Size

**Steps**:
1. Set browser to mobile viewport (≤860px)
2. Measure the widget icon button size
3. Expand the widget
4. Measure each contact link size

**Expected Results**:
- ✓ Widget icon button is at least 44px × 44px
- ✓ All contact links are at least 44px × 44px
- ✓ Close button is at least 44px × 44px
- ✓ Touch targets don't overlap

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 7.2: Touch Interaction on Mobile

**Steps**:
1. Open site on actual mobile device or use touch emulation
2. Tap the widget icon to expand
3. Tap each contact link
4. Tap outside the widget to collapse
5. Tap the close button to collapse

**Expected Results**:
- ✓ Widget expands on tap
- ✓ Contact links respond to tap
- ✓ Widget collapses on tap outside
- ✓ Close button collapses widget on tap
- ✓ No accidental taps or missed interactions

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Execution Summary

**Total Test Cases**: 28  
**Passed**: ___  
**Failed**: ___  
**Not Run**: ___  

**Test Execution Date**: _______________  
**Tester**: _______________  
**Environment**: _______________  
**Browser**: _______________  
**Screen Sizes Tested**: Desktop (___px), Mobile (___px)

---

## Notes and Issues

### Issues Found

1. **Issue ID**: ___  
   **Test Case**: ___  
   **Description**: ___  
   **Severity**: Critical | High | Medium | Low  
   **Status**: Open | In Progress | Resolved  

2. **Issue ID**: ___  
   **Test Case**: ___  
   **Description**: ___  
   **Severity**: Critical | High | Medium | Low  
   **Status**: Open | In Progress | Resolved  

---

## Recommendations

After completing all test cases, document any recommendations for improvements or additional testing needed.

---

## Sign-off

**Tester Signature**: _______________  
**Date**: _______________  

**Reviewer Signature**: _______________  
**Date**: _______________
