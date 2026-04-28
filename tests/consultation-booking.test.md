# Consultation Booking End-to-End - Test Plan

**Test Task**: 15.4 Test consultation booking end-to-end  
**Spec**: UX Enhancement and Consultation Booking  
**Requirements**: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9

## Overview

This document provides comprehensive end-to-end test cases for the consultation booking system, including available slots fetching, slot selection, booking submission, calendar event creation, confirmation emails, and error handling.

---

## Test Suite 1: Available Slots Fetching and Display

**Requirement**: 1.2, 1.9, 19.1, 19.2, 19.3, 19.4, 19.9  
**Objective**: Verify available time slots are fetched and displayed correctly.

### Test Case 1.1: Initial Slots Loading

**Steps**:
1. Navigate to `/consultation`
2. Observe the calendar/time slot section
3. Wait for slots to load

**Expected Results**:
- ✓ Loading indicator is displayed while fetching slots
- ✓ Available time slots appear after loading completes
- ✓ Slots are grouped by date
- ✓ Dates are displayed in user-friendly format (e.g., "Monday, Jan 15, 2024")
- ✓ Times are displayed in 12-hour format with AM/PM

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.2: Slots Display for Next 14 Days

**Steps**:
1. Navigate to `/consultation`
2. Observe the date range of available slots
3. Count the number of days displayed

**Expected Results**:
- ✓ Slots are displayed for the next 14 days
- ✓ Past dates are not shown
- ✓ Today's date is included if slots are available
- ✓ Dates are in chronological order

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.3: No Availability Display

**Steps**:
1. Navigate to `/consultation`
2. Observe dates with no available slots
3. Check for "No availability" message

**Expected Results**:
- ✓ Dates with no slots display "No availability" message
- ✓ Message is clear and user-friendly
- ✓ User can still see other dates with availability

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.4: Business Hours Display

**Steps**:
1. Navigate to `/consultation`
2. Observe the time slots displayed
3. Verify they fall within business hours

**Expected Results**:
- ✓ Time slots are within business hours (e.g., 9 AM - 6 PM)
- ✓ No slots are shown outside business hours
- ✓ Business hours information is displayed (if applicable)

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.5: Weekend Exclusion (if applicable)

**Steps**:
1. Navigate to `/consultation`
2. Check if weekend dates (Saturday, Sunday) are shown
3. Verify weekend handling

**Expected Results**:
- ✓ If CEO is not available on weekends, no weekend slots are shown
- ✓ If CEO is available on weekends, weekend slots are shown
- ✓ Weekend handling is consistent with business policy

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.6: Slots Refresh After Booking

**Steps**:
1. Navigate to `/consultation`
2. Note the available slots
3. Complete a booking
4. Return to consultation page
5. Observe if the booked slot is removed

**Expected Results**:
- ✓ Booked slot is no longer available
- ✓ Other slots remain available
- ✓ Slots refresh automatically or on page reload

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 2: Slot Selection and Booking Submission

**Requirement**: 1.8, 19.11, 19.12  
**Objective**: Verify slot selection and booking form submission work correctly.

### Test Case 2.1: Slot Selection

**Steps**:
1. Navigate to `/consultation`
2. Click on an available time slot
3. Observe the visual feedback

**Expected Results**:
- ✓ Selected slot is highlighted
- ✓ Visual indicator shows which slot is selected
- ✓ Only one slot can be selected at a time
- ✓ Clicking another slot deselects the previous one

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.2: Change Selected Slot

**Steps**:
1. Navigate to `/consultation`
2. Select a time slot
3. Select a different time slot
4. Observe the selection change

**Expected Results**:
- ✓ First slot is deselected
- ✓ Second slot is highlighted
- ✓ Form data is preserved when changing slots
- ✓ No errors occur during slot change

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.3: Complete Booking Form

**Steps**:
1. Navigate to `/consultation`
2. Fill in customer information:
   - Name: "Test Customer"
   - Email: "test@example.com"
   - Phone: "08118660080"
3. Select collection type: "Bespoke (45 minutes)"
4. Select an available time slot
5. Click "Confirm Booking" button

**Expected Results**:
- ✓ All form fields accept input correctly
- ✓ Collection type dropdown works
- ✓ Time slot can be selected
- ✓ Submit button is enabled when all fields are filled
- ✓ Submit button shows "Booking..." loading state
- ✓ Form submits successfully

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.4: Booking Form Validation

**Steps**:
1. Navigate to `/consultation`
2. Click "Confirm Booking" without filling any fields
3. Observe validation errors
4. Fill in name only, click "Confirm Booking"
5. Fill in invalid email format, click "Confirm Booking"
6. Fill in invalid phone number, click "Confirm Booking"
7. Fill all fields but don't select a slot, click "Confirm Booking"

**Expected Results**:
- ✓ Name error: "Name is required" displays
- ✓ Email error: "Email is required" displays
- ✓ Phone error: "Phone number is required" displays
- ✓ Slot error: "Please select an available time slot" displays
- ✓ Invalid email shows: "Please enter a valid email address"
- ✓ Invalid phone shows: "Please enter a valid phone number"
- ✓ Errors clear when user corrects the input
- ✓ Form cannot be submitted while validation errors exist

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.5: Booking Confirmation Display

**Steps**:
1. Complete a successful booking
2. Observe the confirmation message

**Expected Results**:
- ✓ Success message is displayed
- ✓ Message includes booking details (date, time, collection type)
- ✓ Message confirms emails have been sent
- ✓ User can navigate away or book another consultation

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 3: Calendar Event Creation

**Requirement**: 1.4, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7  
**Objective**: Verify calendar events are created correctly in Google Calendar.

### Test Case 3.1: Calendar Event for Bespoke Consultation

**Steps**:
1. Book a consultation with collection type "Bespoke (45 minutes)"
2. Check the CEO's Google Calendar
3. Verify the event details

**Expected Results**:
- ✓ Calendar event is created in Google Calendar
- ✓ Event duration is 45 minutes
- ✓ Event title includes "Bespoke Consultation"
- ✓ Event description includes customer name, email, phone
- ✓ Event time matches the selected slot

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.2: Calendar Event for Bridal Consultation

**Steps**:
1. Book a consultation with collection type "Bridal (60 minutes)"
2. Check the CEO's Google Calendar
3. Verify the event details

**Expected Results**:
- ✓ Calendar event is created in Google Calendar
- ✓ Event duration is 60 minutes
- ✓ Event title includes "Bridal Consultation"
- ✓ Event description includes customer name, email, phone
- ✓ Event time matches the selected slot

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.3: Calendar Event for Ready-to-Wear Consultation

**Steps**:
1. Book a consultation with collection type "Ready-to-Wear (30 minutes)"
2. Check the CEO's Google Calendar
3. Verify the event details

**Expected Results**:
- ✓ Calendar event is created in Google Calendar
- ✓ Event duration is 30 minutes
- ✓ Event title includes "Ready-to-Wear Consultation"
- ✓ Event description includes customer name, email, phone
- ✓ Event time matches the selected slot

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.4: Calendar Event Details

**Steps**:
1. Book a consultation
2. Open the created calendar event in Google Calendar
3. Verify all event details

**Expected Results**:
- ✓ Event has correct date and time
- ✓ Event has correct duration based on collection type
- ✓ Event description includes:
  - Customer name
  - Customer email
  - Customer phone number
  - Collection type
- ✓ Event is in the CEO's primary calendar

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 4: Confirmation Emails

**Requirement**: 1.6, 1.7, 10.1, 10.2, 10.3, 10.6, 10.7  
**Objective**: Verify confirmation emails are sent to customer and CEO.

### Test Case 4.1: Customer Confirmation Email

**Steps**:
1. Book a consultation with email "test@example.com"
2. Check the customer's email inbox
3. Verify the confirmation email

**Expected Results**:
- ✓ Confirmation email is received by customer
- ✓ Email subject includes "Consultation Booking Confirmation"
- ✓ Email body includes:
  - Booking date and time
  - Collection type
  - Duration
  - CEO contact information
- ✓ Email is formatted to match luxury brand aesthetic
- ✓ Email includes calendar invite attachment (.ics file)

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.2: CEO Notification Email

**Steps**:
1. Book a consultation
2. Check the CEO's email inbox
3. Verify the notification email

**Expected Results**:
- ✓ Notification email is received by CEO
- ✓ Email subject includes "New Consultation Booking"
- ✓ Email body includes:
  - Customer name
  - Customer email
  - Customer phone number
  - Booking date and time
  - Collection type
  - Duration
- ✓ Email is formatted professionally
- ✓ Email includes calendar invite attachment (.ics file)

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.3: Email Content Formatting

**Steps**:
1. Book a consultation
2. Open both customer and CEO emails
3. Verify formatting and branding

**Expected Results**:
- ✓ Emails use luxury brand aesthetic
- ✓ Emails include Vickie's Atelier branding
- ✓ Text is well-formatted and readable
- ✓ Contact information is included
- ✓ No broken links or images

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.4: Calendar Invite Attachment

**Steps**:
1. Book a consultation
2. Open customer confirmation email
3. Check for calendar invite attachment
4. Open the attachment

**Expected Results**:
- ✓ Email includes .ics calendar invite attachment
- ✓ Attachment can be opened
- ✓ Attachment adds event to customer's calendar
- ✓ Event details match the booking

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 5: Error Handling

**Requirement**: 17.4, 17.5, 17.6, 17.12  
**Objective**: Verify error handling for booking failures.

### Test Case 5.1: API Unavailable Error

**Steps**:
1. Simulate Google Calendar API being unavailable (disconnect network or use dev tools)
2. Navigate to `/consultation`
3. Observe the error handling

**Expected Results**:
- ✓ Error message is displayed: "Unable to load available slots. Please try again later."
- ✓ Retry button is provided
- ✓ User can click retry to attempt loading again
- ✓ No technical error details are exposed to user

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.2: Booking Submission Failure

**Steps**:
1. Fill in booking form completely
2. Simulate network failure during submission
3. Click "Confirm Booking"
4. Observe the error handling

**Expected Results**:
- ✓ Error message is displayed: "Booking failed. Please try again."
- ✓ Customer input is preserved (not lost)
- ✓ User can retry submission
- ✓ No technical error details are exposed to user

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.3: Calendar Event Creation Failure

**Steps**:
1. Simulate Google Calendar API failure during event creation
2. Submit a booking
3. Observe the error handling

**Expected Results**:
- ✓ Error is logged on server
- ✓ User-friendly error message is displayed
- ✓ Customer is notified to contact support
- ✓ Booking data is preserved for manual processing

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.4: Email Sending Failure

**Steps**:
1. Simulate email service failure
2. Submit a booking
3. Observe the error handling

**Expected Results**:
- ✓ Error is logged on server
- ✓ User-friendly message is displayed
- ✓ Calendar event is still created (if possible)
- ✓ Customer is notified that confirmation email may be delayed

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.5: Double-Booking Prevention

**Steps**:
1. Open consultation page in two browser tabs
2. Select the same time slot in both tabs
3. Submit booking in first tab
4. Submit booking in second tab
5. Observe the behavior

**Expected Results**:
- ✓ First booking succeeds
- ✓ Second booking fails with error: "This time slot is no longer available"
- ✓ User is prompted to select a different slot
- ✓ Available slots are refreshed

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.6: Input Preserved on Error

**Steps**:
1. Fill in booking form completely
2. Simulate a booking failure
3. Observe if input is preserved

**Expected Results**:
- ✓ Customer name is preserved
- ✓ Customer email is preserved
- ✓ Customer phone is preserved
- ✓ Selected collection type is preserved
- ✓ Selected time slot is preserved
- ✓ User can correct and resubmit without re-entering all data

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 6: Collection Type Integration

**Requirement**: 1.5, 1.8  
**Objective**: Verify booking system works for all collection types.

### Test Case 6.1: Bespoke Collection Booking

**Steps**:
1. Navigate to `/consultation?collection=bespoke`
2. Verify "Bespoke (45 minutes)" is pre-selected
3. Complete booking

**Expected Results**:
- ✓ Collection type is pre-selected
- ✓ Duration shows 45 minutes
- ✓ Booking completes successfully
- ✓ Calendar event has 45-minute duration

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 6.2: Bridal Collection Booking

**Steps**:
1. Navigate to `/consultation?collection=bridal`
2. Verify "Bridal (60 minutes)" is pre-selected
3. Complete booking

**Expected Results**:
- ✓ Collection type is pre-selected
- ✓ Duration shows 60 minutes
- ✓ Booking completes successfully
- ✓ Calendar event has 60-minute duration

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 6.3: Ready-to-Wear Collection Booking

**Steps**:
1. Navigate to `/consultation?collection=rtw`
2. Verify "Ready-to-Wear (30 minutes)" is pre-selected
3. Complete booking

**Expected Results**:
- ✓ Collection type is pre-selected
- ✓ Duration shows 30 minutes
- ✓ Booking completes successfully
- ✓ Calendar event has 30-minute duration

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 6.4: Manual Collection Type Selection

**Steps**:
1. Navigate to `/consultation` (no query parameter)
2. Manually select each collection type from dropdown
3. Observe duration changes

**Expected Results**:
- ✓ All three collection types are available in dropdown
- ✓ Selecting Bespoke shows 45 minutes
- ✓ Selecting Bridal shows 60 minutes
- ✓ Selecting Ready-to-Wear shows 30 minutes
- ✓ Duration updates when selection changes

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 7: Mobile Responsiveness

**Requirement**: 8.7  
**Objective**: Verify consultation booking works on mobile devices.

### Test Case 7.1: Mobile Booking Form

**Steps**:
1. Set browser width to mobile (≤860px)
2. Navigate to `/consultation`
3. Observe form layout

**Expected Results**:
- ✓ Form fields stack vertically
- ✓ All fields are accessible
- ✓ Text is readable without horizontal scrolling
- ✓ Buttons are centered and touch-friendly (44px minimum)

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 7.2: Mobile Time Slot Selection

**Steps**:
1. Set browser width to mobile (≤860px)
2. Navigate to `/consultation`
3. Observe time slot display
4. Select a time slot

**Expected Results**:
- ✓ Time slots are displayed in scrollable list
- ✓ Slots are easy to tap (44px minimum)
- ✓ Selected slot is clearly highlighted
- ✓ Scrolling works smoothly

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 7.3: Mobile Booking Submission

**Steps**:
1. Set browser width to mobile (≤860px)
2. Complete booking form
3. Submit booking

**Expected Results**:
- ✓ Submit button is accessible
- ✓ Loading state is visible
- ✓ Confirmation message is readable
- ✓ No layout issues on mobile

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Execution Summary

**Total Test Cases**: 32  
**Passed**: ___  
**Failed**: ___  
**Not Run**: ___  

**Test Execution Date**: _______________  
**Tester**: _______________  
**Environment**: _______________  
**Browser**: _______________  
**Google Calendar Access**: ✅ Yes | ❌ No  
**Email Access**: ✅ Yes | ❌ No

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

## Prerequisites for Testing

### Required Access

1. **Google Calendar Access**: Tester needs access to the CEO's Google Calendar to verify event creation
2. **Email Access**: Tester needs access to test email accounts to verify confirmation emails
3. **Development Environment**: Access to development server or staging environment

### Test Data

- **Test Email**: Use a test email address that you can access
- **Test Phone**: Use a valid phone number format (e.g., 08118660080)
- **Test Name**: Use "Test Customer" or similar

### Environment Setup

1. Ensure Google Calendar API is configured and authenticated
2. Ensure email service (Nodemailer) is configured
3. Ensure development server is running: `npm run dev`
4. Ensure `.env.local` has all required environment variables

---

## Recommendations

After completing all test cases, document any recommendations for improvements or additional testing needed.

---

## Sign-off

**Tester Signature**: _______________  
**Date**: _______________  

**Reviewer Signature**: _______________  
**Date**: _______________
