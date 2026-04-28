# Measurement Form Enhancements - Test Plan

**Test Task**: 15.5 Test measurement form enhancements  
**Spec**: UX Enhancement and Consultation Booking  
**Requirements**: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.9, 3.10, 3.11, 3.12

## Overview

This document provides comprehensive test cases for the measurement form enhancements, including photo upload functionality, photo preview and removal, measurement validation, tutorial link, and photo attachments to order emails.

---

## Test Suite 1: Photo Upload Functionality

**Requirement**: 3.2, 3.3, 3.4, 12.1, 12.2, 12.3, 12.4, 12.5  
**Objective**: Verify photo upload works with various file types and sizes.

### Test Case 1.1: Upload JPEG Photo

**Steps**:
1. Navigate to order page measurement step
2. Click photo upload area or "Choose Files" button
3. Select a JPEG image file (< 10MB)
4. Observe the upload

**Expected Results**:
- ✓ File is accepted
- ✓ Upload progress is shown (if applicable)
- ✓ Photo preview appears after upload
- ✓ No error messages

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.2: Upload PNG Photo

**Steps**:
1. Navigate to order page measurement step
2. Upload a PNG image file (< 10MB)

**Expected Results**:
- ✓ File is accepted
- ✓ Photo preview appears
- ✓ No error messages

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.3: Upload HEIC Photo

**Steps**:
1. Navigate to order page measurement step
2. Upload a HEIC image file (< 10MB)

**Expected Results**:
- ✓ File is accepted
- ✓ Photo preview appears
- ✓ No error messages

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.4: Upload WebP Photo

**Steps**:
1. Navigate to order page measurement step
2. Upload a WebP image file (< 10MB)

**Expected Results**:
- ✓ File is accepted
- ✓ Photo preview appears
- ✓ No error messages

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.5: Reject Invalid File Type

**Steps**:
1. Navigate to order page measurement step
2. Attempt to upload a non-image file (e.g., .pdf, .txt, .docx)

**Expected Results**:
- ✓ File is rejected
- ✓ Error message displays: "Please upload only image files (JPEG, PNG, HEIC, WebP)"
- ✓ No preview appears
- ✓ User can try again with valid file

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.6: Reject Oversized File

**Steps**:
1. Navigate to order page measurement step
2. Attempt to upload an image file > 10MB

**Expected Results**:
- ✓ File is rejected
- ✓ Error message displays: "File size must be less than 10MB"
- ✓ No preview appears
- ✓ User can try again with smaller file

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.7: Upload Multiple Photos (1-5)

**Steps**:
1. Navigate to order page measurement step
2. Upload 3 photos one by one
3. Observe the upload behavior

**Expected Results**:
- ✓ All 3 photos are accepted
- ✓ All 3 previews are displayed
- ✓ Photos are numbered or labeled
- ✓ User can upload up to 5 photos total

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.8: Exceed Maximum Photo Limit

**Steps**:
1. Navigate to order page measurement step
2. Upload 5 photos
3. Attempt to upload a 6th photo

**Expected Results**:
- ✓ 6th photo is rejected
- ✓ Error message displays: "Maximum 5 photos allowed"
- ✓ First 5 photos remain uploaded
- ✓ User must remove a photo to upload another

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 1.9: Drag and Drop Photo Upload

**Steps**:
1. Navigate to order page measurement step
2. Drag an image file from file explorer
3. Drop it onto the upload area

**Expected Results**:
- ✓ File is accepted via drag and drop
- ✓ Photo preview appears
- ✓ Same validation rules apply (file type, size)

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 2: Photo Preview and Removal

**Requirement**: 12.6, 12.7  
**Objective**: Verify photo preview displays correctly and photos can be removed.

### Test Case 2.1: Photo Preview Display

**Steps**:
1. Navigate to order page measurement step
2. Upload a photo
3. Observe the preview

**Expected Results**:
- ✓ Photo preview displays as thumbnail
- ✓ Preview is clear and recognizable
- ✓ Preview maintains aspect ratio
- ✓ Preview has appropriate size (not too large or small)

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.2: Remove Single Photo

**Steps**:
1. Upload 3 photos
2. Click remove/delete button on the 2nd photo
3. Observe the behavior

**Expected Results**:
- ✓ 2nd photo is removed
- ✓ 1st and 3rd photos remain
- ✓ Preview updates immediately
- ✓ User can upload another photo (now 2/5 slots used)

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.3: Remove All Photos

**Steps**:
1. Upload 3 photos
2. Remove each photo one by one

**Expected Results**:
- ✓ Each photo is removed successfully
- ✓ Upload area returns to empty state
- ✓ User can upload new photos
- ✓ No errors occur

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 2.4: Photo Preview on Mobile

**Steps**:
1. Set browser to mobile viewport (≤860px)
2. Upload photos
3. Observe preview layout

**Expected Results**:
- ✓ Previews display correctly on mobile
- ✓ Previews are appropriately sized for mobile
- ✓ Remove buttons are touch-friendly (44px minimum)
- ✓ Layout doesn't break on small screens

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 3: Measurement Validation

**Requirement**: 3.10, 3.11, 3.12  
**Objective**: Verify measurement fields are validated correctly.

### Test Case 3.1: Required Field Validation

**Steps**:
1. Navigate to order page measurement step
2. Leave all measurement fields empty
3. Click "Continue" button

**Expected Results**:
- ✓ Continue button is disabled
- ✓ Validation errors display for all empty fields
- ✓ Error messages are field-specific
- ✓ Form cannot be submitted

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.2: Individual Field Validation

**Steps**:
1. Fill in bust measurement only
2. Attempt to continue
3. Fill in waist measurement
4. Attempt to continue
5. Continue until all fields are filled

**Expected Results**:
- ✓ Errors display for unfilled fields
- ✓ Errors clear as fields are filled
- ✓ Continue button enables only when all fields are filled
- ✓ Inline validation provides immediate feedback

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.3: All Required Measurements

**Steps**:
1. Verify all required measurement fields:
   - Bust
   - Waist
   - Hips
   - Height
   - Shoulder
   - Sleeve
   - Inseam

**Expected Results**:
- ✓ All 7 measurement fields are present
- ✓ All fields are marked as required
- ✓ All fields must be filled to continue

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 3.4: Numeric Input Validation

**Steps**:
1. Attempt to enter non-numeric values in measurement fields
2. Attempt to enter negative numbers
3. Enter valid numeric values

**Expected Results**:
- ✓ Non-numeric input is rejected or filtered
- ✓ Negative numbers are rejected
- ✓ Valid positive numbers are accepted
- ✓ Decimal values are accepted (if applicable)

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 4: Tutorial Link

**Requirement**: 3.5, 3.6, 13.1, 13.2, 13.3, 13.7, 13.8  
**Objective**: Verify tutorial link opens correctly and is accessible.

### Test Case 4.1: Tutorial Link Display

**Steps**:
1. Navigate to order page measurement step
2. Locate the measurement tutorial link

**Expected Results**:
- ✓ Tutorial link is prominently displayed
- ✓ Link is labeled clearly (e.g., "How to Measure - Video Guide")
- ✓ Link is positioned at top of measurement form
- ✓ Link is styled consistently with other links

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.2: Tutorial Link Opens YouTube Video

**Steps**:
1. Click the tutorial link
2. Observe the behavior

**Expected Results**:
- ✓ YouTube video opens in new tab
- ✓ Video is the correct measurement tutorial
- ✓ Original form tab remains open
- ✓ Form data is preserved

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 4.3: Tutorial Link Keyboard Accessibility

**Steps**:
1. Use Tab key to navigate to tutorial link
2. Press Enter to activate link

**Expected Results**:
- ✓ Link is reachable via keyboard
- ✓ Focus indicator is visible
- ✓ Enter key opens the link
- ✓ Link has appropriate ARIA label

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 5: Measurement Diagrams

**Requirement**: 3.7, 3.8, 13.5, 13.6  
**Objective**: Verify visual diagrams display correctly.

### Test Case 5.1: Diagrams Display

**Steps**:
1. Navigate to order page measurement step
2. Observe the measurement diagrams

**Expected Results**:
- ✓ Diagrams are displayed for each measurement type
- ✓ Diagrams show how to measure each body dimension
- ✓ Diagrams are clear and understandable
- ✓ Diagrams are appropriately sized

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.2: Diagrams Theme Awareness

**Steps**:
1. View diagrams in light mode
2. Toggle to dark mode
3. Observe diagram appearance

**Expected Results**:
- ✓ Diagrams are visible in light mode
- ✓ Diagrams are visible in dark mode
- ✓ Diagrams adapt colors to theme
- ✓ Diagrams remain clear in both themes

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 5.3: Diagrams on Mobile

**Steps**:
1. Set browser to mobile viewport (≤860px)
2. Observe diagrams

**Expected Results**:
- ✓ Diagrams are responsive
- ✓ Diagrams are appropriately sized for mobile
- ✓ Diagrams don't break layout
- ✓ Diagrams remain clear and readable

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

## Test Suite 6: Photos Attached to Order Emails

**Requirement**: 3.9, 10.4, 12.8, 12.9  
**Objective**: Verify photos are attached to order confirmation emails.

### Test Case 6.1: Order Submission with Photos

**Steps**:
1. Complete order form with all measurements
2. Upload 3 photos
3. Fill in contact information
4. Submit order

**Expected Results**:
- ✓ Order submits successfully
- ✓ Confirmation message displays
- ✓ No errors occur during submission

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 6.2: Photos in Customer Email

**Steps**:
1. Submit order with photos
2. Check customer's email inbox
3. Open order confirmation email

**Expected Results**:
- ✓ Email is received
- ✓ Photos are attached to email
- ✓ All uploaded photos are included
- ✓ Photos are in correct format

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 6.3: Photos in CEO Email

**Steps**:
1. Submit order with photos
2. Check CEO's email inbox
3. Open order notification email

**Expected Results**:
- ✓ Email is received
- ✓ Photos are attached to email
- ✓ All uploaded photos are included
- ✓ Photos are accessible and viewable

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 6.4: Photo Compression

**Steps**:
1. Upload large photos (close to 10MB each)
2. Submit order
3. Check email attachments

**Expected Results**:
- ✓ Photos are compressed for email delivery
- ✓ Photo quality remains acceptable
- ✓ Email size is reasonable
- ✓ Photos are still viewable

**Status**: ⬜ Not Run | ✅ Pass | ❌ Fail

---

### Test Case 6.5: Order Without Photos

**Steps**:
1. Complete order form without uploading photos
2. Submit order

**Expected Results**:
- ✓ Order submits successfully
- ✓ Email is sent without photo attachments
- ✓ No errors occur
- ✓ Photos are optional, not required

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

---

## Notes and Issues

### Issues Found

1. **Issue ID**: ___  
   **Test Case**: ___  
   **Description**: ___  
   **Severity**: Critical | High | Medium | Low  
   **Status**: Open | In Progress | Resolved  

---

## Sign-off

**Tester Signature**: _______________  
**Date**: _______________  

**Reviewer Signature**: _______________  
**Date**: _______________
