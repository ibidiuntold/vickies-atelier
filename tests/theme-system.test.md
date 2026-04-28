# Theme System - Integration Test Plan

**Test Task**: 15.2 Test theme system across all pages  
**Spec**: UX Enhancement and Consultation Booking  
**Requirements**: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9

## Overview

This document provides comprehensive test cases for verifying the dark/light mode theme system works correctly across all pages.

---

## Test Suite 1: Theme Detection on Initial Load

**Requirement**: 4.1, 4.2, 4.3  
**Objective**: Verify the system correctly detects and applies the system preference on initial page load.

### Test Case 1.1: Light Mode System Preference Detection

**Prerequisites**:
- Set operating system to light mode
- Clear browser localStorage for the site

**Steps**:
1. Open browser and navigate to homepage (`/`)
2. Observe the initial theme applied

**Expected Results**:
- ✓ Page loads with light theme applied
- ✓ Document root does NOT have `dark` class
- ✓ No flash of incorrect theme occurs

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.2: Dark Mode System Preference Detection

**Prerequisites**:
- Set operating system to dark mode
- Clear browser localStorage for the site

**Steps**:
1. Open browser and navigate to homepage (`/`)
2. Observe the initial theme applied

**Expected Results**:
- ✓ Page loads with dark theme applied
- ✓ Document root has `dark` class
- ✓ No flash of incorrect theme occurs

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 2: Manual Theme Toggle Functionality

**Requirement**: 4.4, 4.5, 4.12  
**Objective**: Verify the theme toggle switch works correctly.

### Test Case 2.1: Toggle from Light to Dark Mode

**Steps**:
1. Navigate to homepage in light mode
2. Click the theme toggle button
3. Observe the theme change

**Expected Results**:
- ✓ Theme switches from light to dark
- ✓ Transition is smooth
- ✓ Toggle button icon changes

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.2: Keyboard Accessibility for Theme Toggle

**Steps**:
1. Navigate to homepage
2. Tab to theme toggle button
3. Press Enter key

**Expected Results**:
- ✓ Button is keyboard accessible
- ✓ Shows visible focus indicator
- ✓ Enter toggles the theme

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 3: Theme Persistence

**Requirement**: 4.6, 4.7  
**Objective**: Verify theme preference persists.

### Test Case 3.1: Persistence During Navigation

**Steps**:
1. Toggle theme to dark mode
2. Navigate to different pages
3. Observe theme consistency

**Expected Results**:
- ✓ Dark theme persists across pages
- ✓ localStorage contains theme preference

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.2: Persistence After Browser Refresh

**Steps**:
1. Toggle theme to dark mode
2. Refresh the browser
3. Observe the theme

**Expected Results**:
- ✓ Dark theme maintained after refresh
- ✓ No flash of light theme

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 4: Logo Switching

**Requirement**: 4.8, 4.9  
**Objective**: Verify logo switches between variants.

### Test Case 4.1: Logo in Light Mode

**Steps**:
1. Navigate to homepage in light mode
2. Inspect the logo

**Expected Results**:
- ✓ Logo uses dark variant
- ✓ Logo is visible and clickable

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.2: Logo in Dark Mode

**Steps**:
1. Navigate to homepage in dark mode
2. Inspect the logo

**Expected Results**:
- ✓ Logo uses white variant
- ✓ Logo is visible and clickable

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.3: Logo Switching When Theme Toggles

**Steps**:
1. Start in light mode
2. Toggle to dark mode
3. Observe logo change

**Expected Results**:
- ✓ Logo switches to white variant
- ✓ Transition is smooth

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 5: Component Theme Adaptation

**Requirement**: 4.10, 4.11, 4.12  
**Objective**: Verify all components adapt to theme changes.

### Test Case 5.1: Homepage Components

**Steps**:
1. Navigate to homepage in light mode
2. Toggle to dark mode
3. Observe all components

**Expected Results**:
- ✓ All components adapt to theme
- ✓ Text is readable in both themes
- ✓ Transitions are smooth

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.2: Consultation Page Components

**Steps**:
1. Navigate to consultation page
2. Toggle theme
3. Observe form and calendar

**Expected Results**:
- ✓ Form fields adapt to theme
- ✓ Calendar adapts to theme
- ✓ All text is readable

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.3: Order Page Components

**Steps**:
1. Navigate to order page
2. Toggle theme
3. Observe form and photo upload

**Expected Results**:
- ✓ Form adapts to theme
- ✓ Photo upload adapts to theme
- ✓ Diagrams adapt to theme

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.4: Contact Widget Theme Adaptation

**Steps**:
1. Open contact widget
2. Toggle theme
3. Observe widget styling

**Expected Results**:
- ✓ Widget adapts to theme
- ✓ Icons and text are visible

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Execution Summary

**Total Test Cases**: 14  
**Passed**: ___  
**Failed**: ___  
**Not Run**: ___  

**Test Execution Date**: _______________  
**Tester**: _______________
