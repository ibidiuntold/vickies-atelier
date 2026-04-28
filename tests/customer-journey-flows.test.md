# Customer Journey Flows - Integration Test Plan

**Test Task**: 15.1 Test customer journey flows  
**Spec**: UX Enhancement and Consultation Booking  
**Requirements**: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6

## Overview

This document provides comprehensive test cases for verifying all customer journey flows work correctly. These tests should be executed manually to ensure the navigation paths function properly, existing functionality is preserved, and the new consultation booking flow integrates seamlessly.

---

## Test Suite 1: Browsing to Consultation Booking Flow

**Requirement**: 9.1, 9.2  
**Objective**: Verify customers can successfully navigate from browsing collections to booking a consultation.

### Test Case 1.1: Homepage to Consultation Booking via Collection Section

**Steps**:
1. Navigate to the homepage (`/`)
2. Scroll to the Collections section
3. Locate the "Bespoke" collection
4. Click the "Book Consultation" button

**Expected Results**:
- ✓ Button is visible and styled with `.btn` class
- ✓ Clicking navigates to `/consultation?collection=bespoke`
- ✓ Consultation page loads successfully
- ✓ Collection type is pre-selected as "Bespoke (45 minutes)"

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.2: Homepage to Consultation Booking via Bridal Collection

**Steps**:
1. Navigate to the homepage (`/`)
2. Scroll to the Collections section
3. Locate the "Bridal" collection
4. Click the "Book Consultation" button

**Expected Results**:
- ✓ Button is visible and styled with `.btn` class
- ✓ Clicking navigates to `/consultation?collection=bridal`
- ✓ Consultation page loads successfully
- ✓ Collection type is pre-selected as "Bridal (60 minutes)"

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.3: Homepage to Consultation Booking via RTW Collection

**Steps**:
1. Navigate to the homepage (`/`)
2. Scroll to the Collections section
3. Locate the "Ready-to-Wear" collection
4. Click the "Book Consultation" button

**Expected Results**:
- ✓ Button is visible and styled with `.btn` class
- ✓ Clicking navigates to `/consultation?collection=rtw`
- ✓ Consultation page loads successfully
- ✓ Collection type is pre-selected as "Ready-to-Wear (30 minutes)"

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.4: Complete Consultation Booking Flow

**Steps**:
1. Navigate to `/consultation`
2. Fill in customer information:
   - Name: "Test Customer"
   - Email: "test@example.com"
   - Phone: "08118660080"
   - Collection Type: "Bespoke (45 minutes)"
3. Select an available time slot from the calendar
4. Click "Confirm Booking" button

**Expected Results**:
- ✓ Form fields accept input correctly
- ✓ Calendar displays available time slots
- ✓ Selected time slot is highlighted
- ✓ Submit button shows "Booking..." loading state
- ✓ Success message displays after booking
- ✓ Confirmation email is sent to customer
- ✓ Notification email is sent to CEO
- ✓ Calendar event is created in Google Calendar

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.5: Consultation Booking Form Validation

**Steps**:
1. Navigate to `/consultation`
2. Click "Confirm Booking" without filling any fields
3. Observe validation errors
4. Fill in name only, click "Confirm Booking"
5. Fill in email with invalid format (e.g., "notanemail"), click "Confirm Booking"
6. Fill in phone with less than 10 digits, click "Confirm Booking"
7. Fill all fields correctly but don't select a time slot, click "Confirm Booking"

**Expected Results**:
- ✓ Name error: "Name is required" displays
- ✓ Email error: "Email is required" displays
- ✓ Phone error: "Phone number is required" displays
- ✓ Slot error: "Please select an available time slot" displays
- ✓ Invalid email shows: "Please enter a valid email address"
- ✓ Invalid phone shows: "Please enter a valid phone number (at least 10 digits)"
- ✓ Errors clear when user corrects the input
- ✓ Form cannot be submitted while validation errors exist

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 2: Browsing to Direct Order Flow

**Requirement**: 9.3  
**Objective**: Verify customers can successfully navigate from browsing collections to placing a direct order.

### Test Case 2.1: Homepage to Order via Bespoke Collection

**Steps**:
1. Navigate to the homepage (`/`)
2. Scroll to the Collections section
3. Locate the "Bespoke" collection
4. Click the "Order Now" button

**Expected Results**:
- ✓ Button is visible and styled with `.btn` class
- ✓ Clicking navigates to `/order?collection=bespoke`
- ✓ Order page loads successfully
- ✓ Collection type is pre-selected as "Bespoke"

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.2: Homepage to Order via Bridal Collection

**Steps**:
1. Navigate to the homepage (`/`)
2. Scroll to the Collections section
3. Locate the "Bridal" collection
4. Click the "Order Now" button

**Expected Results**:
- ✓ Button is visible and styled with `.btn` class
- ✓ Clicking navigates to `/order?collection=bridal`
- ✓ Order page loads successfully
- ✓ Collection type is pre-selected as "Bridal"

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.3: Homepage to Order via RTW Collection

**Steps**:
1. Navigate to the homepage (`/`)
2. Scroll to the Collections section
3. Locate the "Ready-to-Wear" collection
4. Click the "Order Now" button

**Expected Results**:
- ✓ Button is visible and styled with `.btn` class
- ✓ Clicking navigates to `/order?collection=rtw`
- ✓ Order page loads successfully
- ✓ Collection type is pre-selected as "Ready-to-Wear"

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.4: Services Page to Order Flow

**Steps**:
1. Navigate to `/services`
2. Scroll to the "What to Expect" section
3. Click the "Place an Order" button
4. Verify navigation to order page
5. Scroll to the "Ready to Begin?" section
6. Click the "Place an Order" button

**Expected Results**:
- ✓ Both "Place an Order" buttons are visible and styled with `.btn` class
- ✓ Clicking navigates to `/order`
- ✓ Order page loads successfully
- ✓ No collection is pre-selected (user can choose)

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.5: Homepage Callout to Order Flow

**Steps**:
1. Navigate to the homepage (`/`)
2. Scroll to the bottom callout section ("bespoke. bridal. ready-to-wear.")
3. Click the "Book a Consultation" button (which links to order page)

**Expected Results**:
- ✓ Button is visible and styled with `.btn btn--light` classes
- ✓ Clicking navigates to `/order`
- ✓ Order page loads successfully

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 3: Existing Order Flow Functionality Preserved

**Requirement**: 9.4  
**Objective**: Verify the existing 3-step order flow (Collection → Measurements → Contact) remains functional.

### Test Case 3.1: Order Form Step 1 - Collection Selection

**Steps**:
1. Navigate to `/order`
2. Verify the collection selection step is displayed
3. Select "Bespoke" collection
4. Click "Continue" or "Next" button

**Expected Results**:
- ✓ Collection options are displayed (Bespoke, Bridal, Ready-to-Wear)
- ✓ User can select a collection
- ✓ Continue button is enabled after selection
- ✓ Clicking Continue advances to measurements step

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.2: Order Form Step 2 - Measurements with Photo Upload

**Steps**:
1. Complete Step 1 (Collection Selection)
2. Verify measurements form is displayed
3. Observe measurement fields (bust, waist, hips, height, shoulder, sleeve, inseam)
4. Verify photo upload component is present
5. Verify measurement diagrams are displayed
6. Verify link to measurement tutorial video is present
7. Fill in all measurement fields with valid values
8. Upload 1-3 photos (JPEG/PNG, under 10MB each)
9. Click "Continue" button

**Expected Results**:
- ✓ All measurement fields are displayed and accept numeric input
- ✓ Photo upload component allows drag-and-drop and file selection
- ✓ Photo previews display after upload
- ✓ Measurement diagrams are visible and theme-aware
- ✓ Tutorial link opens YouTube video in new tab
- ✓ Continue button is disabled until all required fields are filled
- ✓ Validation errors display for empty fields if Continue is clicked
- ✓ Clicking Continue with valid data advances to contact step
- ✓ Photos are included in the order data

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.3: Order Form Step 2 - Measurement Validation

**Steps**:
1. Complete Step 1 (Collection Selection)
2. On measurements step, leave all fields empty
3. Click "Continue" button
4. Observe validation errors
5. Fill in only bust measurement
6. Click "Continue" button
7. Fill in all measurements
8. Click "Continue" button

**Expected Results**:
- ✓ Continue button is disabled when fields are empty
- ✓ Validation errors display for all empty required fields
- ✓ Errors display inline for each field
- ✓ Errors clear when user fills in the field
- ✓ Continue button enables only when all required fields are filled
- ✓ Form advances to next step when all validations pass

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.4: Order Form Step 3 - Contact Information

**Steps**:
1. Complete Steps 1 and 2
2. Verify contact information form is displayed
3. Fill in contact details:
   - Name: "Test Customer"
   - Email: "test@example.com"
   - Phone: "08118660080"
   - Additional notes (if applicable)
4. Click "Submit Order" button

**Expected Results**:
- ✓ Contact form fields are displayed
- ✓ Fields accept input correctly
- ✓ Email validation works (invalid format shows error)
- ✓ Phone validation works (invalid format shows error)
- ✓ Submit button shows loading state during submission
- ✓ Order confirmation message displays after successful submission
- ✓ Confirmation email is sent to customer
- ✓ Order notification email is sent to CEO with photos attached
- ✓ Order data is saved to Google Sheets

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.5: Order Form Navigation Between Steps

**Steps**:
1. Navigate to `/order`
2. Complete Step 1, advance to Step 2
3. Click "Back" button (if available) to return to Step 1
4. Verify data is preserved
5. Advance to Step 2 again
6. Complete Step 2, advance to Step 3
7. Click "Back" button to return to Step 2
8. Verify data is preserved

**Expected Results**:
- ✓ Back navigation works correctly
- ✓ Form data is preserved when navigating back
- ✓ User can move forward again without re-entering data
- ✓ Step indicators show current step

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 4: Collections Carousel Functionality Preserved

**Requirement**: 9.5  
**Objective**: Verify the collections carousel on the homepage functions correctly.

### Test Case 4.1: Bespoke Collection Carousel

**Steps**:
1. Navigate to the homepage (`/`)
2. Scroll to the Bespoke collection section
3. Observe the carousel component
4. Click the next arrow to advance slides
5. Click the previous arrow to go back
6. Verify all 6 images are accessible

**Expected Results**:
- ✓ Carousel displays images correctly
- ✓ Next arrow advances to next image
- ✓ Previous arrow goes to previous image
- ✓ All 6 bespoke images are accessible
- ✓ Images load with proper aspect ratio
- ✓ Carousel is responsive on mobile and desktop

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.2: Bridal Collection Carousel

**Steps**:
1. Navigate to the homepage (`/`)
2. Scroll to the Bridal collection section
3. Observe the carousel component
4. Click the next arrow to advance slides
5. Click the previous arrow to go back
6. Verify all 6 images are accessible

**Expected Results**:
- ✓ Carousel displays images correctly
- ✓ Next arrow advances to next image
- ✓ Previous arrow goes to previous image
- ✓ All 6 bridal images are accessible
- ✓ Images load with proper aspect ratio
- ✓ Carousel is responsive on mobile and desktop

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.3: Ready-to-Wear Collection Carousel

**Steps**:
1. Navigate to the homepage (`/`)
2. Scroll to the Ready-to-Wear collection section
3. Observe the carousel component
4. Click the next arrow to advance slides
5. Click the previous arrow to go back
6. Verify all 5 images are accessible

**Expected Results**:
- ✓ Carousel displays images correctly
- ✓ Next arrow advances to next image
- ✓ Previous arrow goes to previous image
- ✓ All 5 RTW images are accessible
- ✓ Images load with proper aspect ratio
- ✓ Carousel is responsive on mobile and desktop

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.4: Carousel Touch/Swipe Functionality (Mobile)

**Steps**:
1. Open the homepage on a mobile device or use browser dev tools mobile emulation
2. Navigate to any collection carousel
3. Swipe left to advance
4. Swipe right to go back

**Expected Results**:
- ✓ Swipe left advances to next image
- ✓ Swipe right goes to previous image
- ✓ Swipe gestures are smooth and responsive
- ✓ Images don't break layout on mobile

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 5: Services Page Functionality Preserved

**Requirement**: 9.6  
**Objective**: Verify the services page displays correctly with all process steps and information.

### Test Case 5.1: Services Page Content Display

**Steps**:
1. Navigate to `/services`
2. Verify hero section displays
3. Scroll through all process steps (01-05)
4. Verify "What to Expect" section displays
5. Verify "Turnaround Times" section displays
6. Verify "Ready to Begin?" CTA section displays

**Expected Results**:
- ✓ Hero section displays with title "From Vision to Garment"
- ✓ All 5 process steps are displayed in order:
  - 01: Consultation
  - 02: Measurement & Pattern
  - 03: Fabric Sourcing
  - 04: Construction & Fittings
  - 05: Final Delivery
- ✓ Each step shows number, title, and description
- ✓ "What to Expect" section displays with bullet points
- ✓ "Turnaround Times" cards display for all three collections
- ✓ CTA section displays with "Place an Order" and "Send an Enquiry" buttons

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.2: Services Page Navigation Links

**Steps**:
1. Navigate to `/services`
2. In "What to Expect" section, click "Place an Order" button
3. Verify navigation to `/order`
4. Go back to `/services`
5. In "Ready to Begin?" section, click "Place an Order" button
6. Verify navigation to `/order`
7. Go back to `/services`
8. Click "Send an Enquiry" button
9. Verify navigation to `/#contact` (homepage contact section)

**Expected Results**:
- ✓ All "Place an Order" buttons navigate to `/order`
- ✓ "Send an Enquiry" button navigates to homepage contact section
- ✓ All buttons are styled correctly with `.btn` class
- ✓ Navigation works without errors

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.3: Services Page Responsive Layout

**Steps**:
1. Navigate to `/services`
2. Resize browser to mobile width (≤860px)
3. Verify layout adapts correctly
4. Verify process cards stack vertically
5. Verify "What to Expect" split section stacks vertically
6. Verify turnaround time cards stack vertically
7. Resize to desktop width (>860px)
8. Verify layout displays in grid/columns

**Expected Results**:
- ✓ Mobile layout stacks content vertically
- ✓ Desktop layout displays content in columns/grid
- ✓ Images resize appropriately
- ✓ Text remains readable at all sizes
- ✓ Buttons are centered on mobile
- ✓ No horizontal scrolling on mobile

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 6: Cross-Journey Integration Tests

**Objective**: Verify seamless transitions between different customer journeys.

### Test Case 6.1: Switch from Consultation to Order

**Steps**:
1. Navigate to `/consultation`
2. Start filling in consultation form
3. Navigate to `/order` (via browser navigation or link)
4. Complete order form
5. Navigate back to `/consultation`

**Expected Results**:
- ✓ Navigation between pages works smoothly
- ✓ No errors occur during navigation
- ✓ Both pages function independently
- ✓ No data conflicts between forms

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 6.2: Multiple Collection Selections

**Steps**:
1. Navigate to homepage
2. Click "Book Consultation" for Bespoke
3. Verify Bespoke is pre-selected
4. Navigate back to homepage
5. Click "Order Now" for Bridal
6. Verify Bridal is pre-selected
7. Navigate back to homepage
8. Click "Book Consultation" for RTW
9. Verify RTW is pre-selected

**Expected Results**:
- ✓ Each collection button correctly pre-selects the collection type
- ✓ Query parameters are passed correctly
- ✓ Forms display the correct pre-selected collection
- ✓ No conflicts between different collection selections

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 6.3: Contact Widget Accessibility Throughout Journey

**Steps**:
1. Navigate to homepage
2. Verify Contact Widget is visible
3. Navigate to `/consultation`
4. Verify Contact Widget is visible
5. Navigate to `/order`
6. Verify Contact Widget is visible
7. Navigate to `/services`
8. Verify Contact Widget is visible
9. Click Contact Widget to expand
10. Verify email, WhatsApp, and phone links work

**Expected Results**:
- ✓ Contact Widget is visible on all pages
- ✓ Widget remains in fixed position while scrolling
- ✓ Widget expands/collapses correctly
- ✓ All contact links work (email, WhatsApp, phone)
- ✓ Widget doesn't obstruct important content
- ✓ Widget adapts to theme changes

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Execution Summary

**Total Test Cases**: 25  
**Passed**: ___  
**Failed**: ___  
**Not Run**: ___  

**Test Execution Date**: _______________  
**Tester**: _______________  
**Environment**: _______________  
**Browser**: _______________  

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
