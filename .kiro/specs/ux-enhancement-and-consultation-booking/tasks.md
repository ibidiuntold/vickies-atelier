# Implementation Plan: UX Enhancement and Consultation Booking

## Overview

This implementation plan breaks down the UX enhancement and consultation booking feature into incremental, actionable tasks. The feature adds dark/light mode theming, Tailwind CSS integration, Google Calendar consultation booking, photo uploads for measurements, a floating contact widget, and various UX improvements while maintaining the existing luxury aesthetic.

## Tasks

- [x] 1. Set up Tailwind CSS integration and configuration
  - Install Tailwind CSS, PostCSS, and autoprefixer as dependencies
  - Create tailwind.config.ts with custom theme configuration matching existing design tokens
  - Configure PostCSS to process Tailwind directives
  - Add Tailwind base, components, and utilities to global stylesheet
  - Define custom colors (--brand, --brand-2, --bg, --text, --muted) in Tailwind config
  - Define custom spacing, border-radius (18px), and shadow values
  - Configure font families (Playfair Display for headings, Inter for body)
  - Set up content paths for purging unused styles in production
  - Test that existing styles remain unaffected
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11, 7.12_

- [x] 2. Implement dark/light mode theme system
  - [x] 2.1 Create theme context and provider
    - Create src/hooks/useTheme.ts hook for theme state management
    - Create src/components/ThemeProvider.tsx with theme context
    - Implement system preference detection using matchMedia
    - Implement localStorage persistence for theme preference
    - Add theme class application to document root
    - Prevent flash of incorrect theme (FOIT) with inline script
    - _Requirements: 4.1, 4.2, 4.3, 4.6, 4.7, 14.1, 14.2, 14.3, 14.4, 14.8, 14.9, 14.10_
  
  - [x] 2.2 Create theme toggle component
    - Create src/components/ThemeToggle.tsx with sun/moon icons
    - Implement toggle functionality with smooth transitions
    - Add keyboard accessibility (Enter/Space to toggle)
    - Add ARIA labels for screen readers
    - Style toggle to match luxury aesthetic
    - _Requirements: 4.4, 4.5, 4.12, 15.10_
  
  - [x] 2.3 Define CSS custom properties for themes
    - Define light mode color values in global CSS
    - Define dark mode color values in global CSS
    - Ensure smooth transitions between theme changes
    - Test color contrast ratios meet WCAG 2.1 AA standards
    - _Requirements: 4.10, 4.11, 4.12, 15.6, 20.6, 20.7_
  
  - [x] 2.4 Integrate theme provider into app layout
    - Wrap app with ThemeProvider in src/app/layout.tsx
    - Add ThemeToggle to Header component
    - Ensure theme toggle is accessible on mobile
    - _Requirements: 4.4, 8.12_

- [x] 3. Enhance logo implementation with theme variants
  - [x] 3.1 Prepare logo assets
    - Optimize logo files for web delivery (WebP with fallbacks)
    - Create light mode logo variant (for light backgrounds)
    - Create dark mode logo variant (for dark backgrounds)
    - Ensure logos maintain aspect ratio
    - Add appropriate alt text for accessibility
    - _Requirements: 5.5, 5.6, 5.7, 5.8, 5.9, 16.2_
  
  - [x] 3.2 Update Header component with larger, theme-aware logo
    - Increase logo size in Header component
    - Implement theme-based logo switching
    - Make logo clickable to return to homepage
    - Ensure logo is responsive across screen sizes
    - _Requirements: 5.1, 5.8, 5.9, 5.10_
  
  - [x] 3.3 Update Footer component with conditional logo display
    - Display theme-aware logo in Footer on desktop (>860px)
    - Hide logo from Footer on mobile (≤860px)
    - Ensure logo maintains aspect ratio
    - _Requirements: 5.2, 5.3, 5.4, 5.6, 5.7_

- [x] 4. Implement floating contact widget
  - [x] 4.1 Create ContactWidget component
    - Create src/components/ContactWidget.tsx with collapsible design
    - Implement fixed positioning at bottom-right corner
    - Add expand/collapse animation
    - Implement click-outside-to-collapse functionality
    - Add close button when expanded
    - _Requirements: 2.1, 2.2, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.10, 18.12_
  
  - [x] 4.2 Add contact methods to widget
    - Display email address (vickiesatelier@gmail.com) with mailto link
    - Display WhatsApp number (08118660080) with WhatsApp link
    - Display call line number (081607422412) with tel link
    - Add icons for each contact method
    - Add text labels alongside icons for accessibility
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 15.7_
  
  - [x] 4.3 Style widget with theme awareness and accessibility
    - Apply theme-aware styling that adapts to light/dark mode
    - Ensure minimum 44px tap targets on mobile
    - Add ARIA labels for icon-only buttons
    - Implement keyboard navigation support
    - Ensure widget doesn't trap keyboard focus
    - Set appropriate z-index (above content, below modals)
    - Ensure widget doesn't overlap Footer on desktop
    - _Requirements: 2.10, 8.4, 8.5, 15.4, 15.11, 15.12, 18.7, 18.8, 18.9, 18.11_
  
  - [x] 4.4 Integrate widget into app layout
    - Add ContactWidget to src/app/layout.tsx
    - Ensure widget is accessible from all pages
    - Test widget doesn't obstruct important content
    - Lazy load widget to avoid blocking page render
    - _Requirements: 2.9, 9.10, 16.11_

- [x] 5. Create Google Calendar integration infrastructure
  - [x] 5.1 Set up Google Calendar API authentication
    - Create src/lib/google-calendar.ts utility module
    - Implement OAuth 2.0 authentication flow
    - Store credentials securely in environment variables
    - Handle authentication errors gracefully
    - _Requirements: 11.1, 11.8_
  
  - [x] 5.2 Implement available slots fetching
    - Create function to fetch CEO's calendar availability
    - Filter out busy time slots
    - Return available slots for next 14 days
    - Exclude weekends if CEO not available
    - Handle API failures with appropriate error messages
    - _Requirements: 1.9, 11.10, 19.1, 19.8_
  
  - [x] 5.3 Implement calendar event creation
    - Create function to create calendar events
    - Set event duration based on collection type (Bridal: 60min, Bespoke: 45min, RTW: 30min)
    - Include customer details in event description
    - Handle event creation failures with logging
    - _Requirements: 1.4, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.9_

- [x] 6. Build consultation booking API endpoints
  - [x] 6.1 Create available slots API route
    - Create src/app/api/calendar/available-slots/route.ts
    - Implement GET handler to fetch available time slots
    - Return slots grouped by date for next 14 days
    - Include business hours information
    - Handle errors and return appropriate status codes
    - _Requirements: 1.2, 19.1, 19.2, 19.7, 19.9_
  
  - [x] 6.2 Create booking API route
    - Create src/app/api/calendar/book/route.ts
    - Implement POST handler to create calendar event
    - Validate customer information (name, email, phone, collection type)
    - Create calendar event via Google Calendar API
    - Return booking confirmation with event details
    - Handle double-booking prevention
    - _Requirements: 1.4, 1.8, 11.2, 11.3_
  
  - [x] 6.3 Implement booking email notifications
    - Enhance src/lib/email.ts with consultation templates
    - Send confirmation email to customer with booking details
    - Send notification email to CEO with customer details
    - Include calendar invite attachment (.ics file)
    - Format emails to match luxury brand aesthetic
    - Include contact information in emails
    - Handle email failures with logging and user feedback
    - _Requirements: 1.6, 1.7, 10.1, 10.2, 10.3, 10.6, 10.7, 10.8, 10.9, 10.10_

- [x] 7. Create consultation booking UI components
  - [x] 7.1 Create BookingCalendar component
    - Create src/components/BookingCalendar.tsx
    - Fetch available slots from API on mount
    - Display slots grouped by date with user-friendly formatting
    - Implement slot selection with visual highlighting
    - Show loading indicator while fetching slots
    - Display "No availability" for dates without slots
    - Add refresh capability
    - Make scrollable list for mobile optimization
    - _Requirements: 1.2, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.9, 19.10, 19.11, 19.12, 8.7_
  
  - [x] 7.2 Create consultation booking page
    - Create src/app/consultation/page.tsx
    - Add form to collect customer information (name, email, phone)
    - Add collection type selector (Bespoke, Bridal, Ready-to-Wear)
    - Integrate BookingCalendar component
    - Implement form validation (email format, phone format, required fields)
    - Add submit button with loading state
    - Display confirmation message on successful booking
    - Handle booking errors with retry option
    - Preserve customer input on errors
    - _Requirements: 1.1, 1.5, 1.8, 1.10, 9.2, 9.8, 17.2, 17.4, 17.5, 17.7, 17.12_
  
  - [x] 7.3 Add booking option to collections
    - Update collection pages to display "Book Consultation" button
    - Update collection pages to display "Order Now" button
    - Link "Book Consultation" to consultation booking page
    - Link "Order Now" to existing order flow
    - Ensure buttons follow .btn styling standard
    - _Requirements: 1.10, 9.1, 9.2, 9.3_

- [x] 8. Enhance measurement form with photo upload
  - [x] 8.1 Create PhotoUpload component
    - Create src/components/PhotoUpload.tsx
    - Implement file input with drag-and-drop support
    - Validate file types (JPEG, PNG, HEIC, WebP)
    - Validate file size (max 10MB per image)
    - Allow 1-5 photos upload
    - Display image previews with thumbnails
    - Add remove button for individual photos
    - Show upload progress indication
    - Display clear error messages for validation failures
    - _Requirements: 3.2, 3.3, 3.4, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.10_
  
  - [x] 8.2 Create file upload utility
    - Create src/lib/file-upload.ts
    - Implement image compression using Sharp
    - Store uploaded photos temporarily during order process
    - Optimize images for email delivery without quality loss
    - _Requirements: 3.9, 12.8, 12.11, 16.7_
  
  - [x] 8.3 Create MeasurementDiagrams component
    - Create src/components/MeasurementDiagrams.tsx
    - Create SVG diagrams for each measurement type (bust, waist, hips, height, shoulder, sleeve, inseam)
    - Make diagrams responsive and theme-aware
    - Add tooltip descriptions for each measurement
    - Add prominent link to YouTube tutorial video
    - Ensure link opens in new tab
    - Add accessible alt text for diagrams
    - _Requirements: 3.5, 3.6, 3.7, 3.8, 13.1, 13.2, 13.3, 13.5, 13.6, 13.7, 13.8, 13.9_
  
  - [x] 8.4 Update measurement form with enhancements
    - Integrate PhotoUpload component into measurement form
    - Integrate MeasurementDiagrams component
    - Add required field validation for all measurements (bust, waist, hips, height, shoulder, sleeve, inseam)
    - Display inline validation errors as user completes fields
    - Disable "Continue" button until all required fields are filled
    - Show field-specific error messages on submission attempt
    - Clear validation errors when user corrects input
    - Preserve form data when user navigates to tutorial
    - Stack form fields vertically on mobile
    - _Requirements: 3.1, 3.10, 3.11, 3.12, 8.6, 13.4, 17.1, 17.8, 17.9, 17.10_
  
  - [x] 8.5 Update order API to handle photo attachments
    - Enhance src/app/api/order/route.ts
    - Accept photo uploads in order submission
    - Attach photos to order confirmation email
    - Store photos temporarily and clean up after email sent
    - _Requirements: 3.9, 10.4_

- [x] 9. Standardize button styling and behavior
  - [x] 9.1 Audit and update button components
    - Review all Button components across the application
    - Apply .btn class styling consistently
    - Ensure consistent padding, border-radius, font-weight, font-size
    - Implement consistent hover states for desktop
    - Add consistent transition animations
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.10, 20.9_
  
  - [x] 9.2 Implement mobile button optimizations
    - Center all buttons horizontally on mobile (≤860px)
    - Ensure minimum 44px tap targets on mobile
    - Test touch-friendliness on mobile devices
    - _Requirements: 6.5, 6.9, 8.1, 8.8_
  
  - [x] 9.3 Add disabled state styling
    - Implement consistent disabled state styling
    - Prevent click interactions when disabled
    - Ensure disabled buttons are visually distinct
    - _Requirements: 6.7, 6.8_

- [x] 10. Implement mobile optimizations
  - [x] 10.1 Optimize navigation for mobile
    - Ensure navigation menu is collapsible hamburger on mobile
    - Test navigation usability on mobile devices
    - Maintain existing responsive navigation functionality
    - _Requirements: 8.11, 9.7_
  
  - [x] 10.2 Optimize images for mobile
    - Implement lazy loading for images below the fold
    - Serve images in modern formats (WebP) with fallbacks
    - Optimize image loading for mobile bandwidth
    - _Requirements: 8.10, 16.1, 16.3_
  
  - [x] 10.3 Ensure text readability on mobile
    - Test that text remains readable without horizontal scrolling
    - Verify all interactive elements have minimum 44px tap targets
    - _Requirements: 8.9_

- [x] 11. Implement accessibility features
  - [x] 11.1 Add keyboard navigation support
    - Ensure all interactive elements are keyboard accessible
    - Ensure all buttons are keyboard accessible
    - Provide visible focus indicators for all interactive elements
    - Maintain logical tab order throughout all pages
    - Test keyboard navigation on all pages
    - _Requirements: 15.1, 15.2, 15.3, 15.11, 13.10_
  
  - [x] 11.2 Add ARIA labels and semantic HTML
    - Add ARIA labels for icon-only buttons
    - Ensure form fields have associated label elements
    - Ensure error messages are announced to screen readers
    - Add alt text for all images
    - _Requirements: 15.4, 15.5, 15.8, 15.9_
  
  - [x] 11.3 Verify color contrast compliance
    - Test color contrast ratios in light mode meet WCAG 2.1 AA
    - Test color contrast ratios in dark mode meet WCAG 2.1 AA
    - Adjust colors if needed to meet standards
    - _Requirements: 15.6_

- [ ] 12. Implement performance optimizations
  - [x] 12.1 Optimize asset loading
    - Implement code splitting for route-based components
    - Preload critical fonts (Playfair Display, Inter)
    - Minify CSS and JavaScript in production builds
    - Cache static assets with appropriate headers
    - _Requirements: 16.4, 16.5, 16.6, 16.8_
  
  - [x] 12.2 Test and optimize performance scores
    - Run Lighthouse performance tests on desktop
    - Run Lighthouse performance tests on mobile
    - Optimize to achieve score ≥85 on desktop
    - Optimize to achieve score ≥80 on mobile
    - _Requirements: 16.9, 16.10_

- [x] 13. Implement error handling and validation
  - [x] 13.1 Add form validation across all forms
    - Implement email format validation
    - Implement phone number format validation
    - Display inline validation errors
    - Prevent form submission while validation errors exist
    - _Requirements: 17.2, 17.7, 17.8, 17.9, 17.10_
  
  - [x] 13.2 Add error handling for API failures
    - Display user-friendly error messages for API failures
    - Log errors for debugging without exposing technical details
    - Provide retry options for failed actions
    - Handle Google Calendar API unavailability gracefully
    - Handle email sending failures gracefully
    - _Requirements: 17.3, 17.4, 17.5, 17.6, 17.11, 17.12_

- [x] 14. Maintain design system consistency
  - [x] 14.1 Apply existing design tokens to new components
    - Use existing CSS custom properties (--brand, --brand-2, --bg, --text, --muted)
    - Use existing border-radius value (18px) for card-like components
    - Use existing shadow value for elevated components
    - Use Playfair Display for headings in new components
    - Use Inter for body text in new components
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.10_
  
  - [x] 14.2 Ensure visual consistency
    - Match existing card hover effects in new components
    - Use existing button styles (.btn, .btn--ghost, .btn--outline)
    - Maintain consistent spacing (88px vertical section padding)
    - Ensure new form inputs match existing form field styling
    - Preserve existing gradient backgrounds for hero sections
    - _Requirements: 20.8, 20.9, 20.10, 20.11, 20.12_

- [x] 15. Integration and testing checkpoint
  - [x] 15.1 Test customer journey flows
    - Test browsing to consultation booking flow
    - Test browsing to direct order flow
    - Verify existing order flow functionality preserved
    - Verify collections carousel functionality preserved
    - Verify services page functionality preserved
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [x] 15.2 Test theme system across all pages
    - Test theme detection on initial load
    - Test manual theme toggle functionality
    - Test theme persistence across page navigations
    - Test logo switching between themes
    - Test all components adapt to theme changes
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_
  
  - [x] 15.3 Test contact widget functionality
    - Test widget expand/collapse on all pages
    - Test email, WhatsApp, and phone links
    - Test widget positioning on desktop and mobile
    - Test widget doesn't obstruct content
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_
  
  - [x] 15.4 Test consultation booking end-to-end
    - Test available slots fetching and display
    - Test slot selection and booking submission
    - Test calendar event creation in Google Calendar
    - Test confirmation emails sent to customer and CEO
    - Test error handling for booking failures
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_
  
  - [x] 15.5 Test measurement form enhancements
    - Test photo upload with various file types and sizes
    - Test photo preview and removal
    - Test measurement validation
    - Test tutorial link opens correctly
    - Test photos attached to order emails
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.9, 3.10, 3.11, 3.12_
  
  - [x] 15.6 Test mobile responsiveness
    - Test all pages on mobile viewport (≤860px)
    - Test button centering on mobile
    - Test logo visibility (header only) on mobile
    - Test contact widget on mobile
    - Test form layouts on mobile
    - Test navigation menu on mobile
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.11_
  
  - [x] 15.7 Test accessibility compliance
    - Test keyboard navigation on all pages
    - Test screen reader compatibility
    - Test focus indicators visibility
    - Test ARIA labels effectiveness
    - Verify color contrast ratios
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 15.10, 15.11, 15.12_
  
  - [x] 15.8 Test performance metrics
    - Run Lighthouse audits on desktop and mobile
    - Verify performance scores meet targets (≥85 desktop, ≥80 mobile)
    - Test page load times on 3G connection
    - Verify lazy loading works correctly
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9, 16.10, 16.11, 16.12_

- [ ] 16. Final checkpoint - Ensure all tests pass
  - Ensure all functionality works as expected
  - Verify no regressions in existing features
  - Confirm all requirements are met
  - Ask the user if questions arise

## Notes

- All tasks reference specific requirements for traceability
- Tasks are organized to build incrementally (infrastructure → components → integration)
- Checkpoints ensure validation at key milestones
- Theme system is implemented early as it affects all subsequent components
- Google Calendar integration is set up before building booking UI
- Mobile optimizations and accessibility are integrated throughout, with final verification
- Performance optimizations are applied continuously and verified at the end
- The implementation maintains the existing luxury aesthetic and preserves all current functionality
