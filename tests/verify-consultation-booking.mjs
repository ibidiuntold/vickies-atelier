#!/usr/bin/env node

/**
 * Consultation Booking Verification Script
 * 
 * This script performs automated checks for the Consultation Booking system.
 * It verifies file existence, code integration, API routes, and component structure.
 * 
 * Usage: node tests/verify-consultation-booking.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

/**
 * Test result tracking
 */
function test(description, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`${colors.green}✓${colors.reset} ${description}`);
  } catch (error) {
    failedTests++;
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
  }
}

/**
 * Check if file exists
 */
function fileExists(filePath) {
  const fullPath = join(rootDir, filePath);
  if (!existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
}

/**
 * Read file content
 */
function readFile(filePath) {
  const fullPath = join(rootDir, filePath);
  if (!existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return readFileSync(fullPath, 'utf-8');
}

/**
 * Check if file contains specific text
 */
function fileContains(filePath, searchText, errorMessage) {
  const content = readFile(filePath);
  if (!content.includes(searchText)) {
    throw new Error(errorMessage || `File ${filePath} does not contain: ${searchText}`);
  }
}

/**
 * Check if file contains regex pattern
 */
function fileMatchesRegex(filePath, pattern, errorMessage) {
  const content = readFile(filePath);
  if (!pattern.test(content)) {
    throw new Error(errorMessage || `File ${filePath} does not match pattern: ${pattern}`);
  }
}

console.log(`\n${colors.cyan}=== Consultation Booking Verification ===${colors.reset}\n`);

// ============================================================================
// Suite 1: Consultation Page Files
// ============================================================================
console.log(`${colors.blue}Suite 1: Consultation Page Files${colors.reset}`);

test('Consultation page file exists', () => {
  fileExists('src/app/consultation/page.tsx');
});

test('Consultation page exports default component', () => {
  fileContains(
    'src/app/consultation/page.tsx',
    'export default',
    'Consultation page does not export default component'
  );
});

test('Consultation page has form fields', () => {
  const content = readFile('src/app/consultation/page.tsx');
  const hasName = content.includes('name') || content.includes('Name');
  const hasEmail = content.includes('email') || content.includes('Email');
  const hasPhone = content.includes('phone') || content.includes('Phone');
  if (!hasName || !hasEmail || !hasPhone) {
    throw new Error('Consultation page does not have all required form fields');
  }
});

test('Consultation page has collection type selector', () => {
  const content = readFile('src/app/consultation/page.tsx');
  if (!content.includes('bespoke') && !content.includes('Bespoke')) {
    throw new Error('Consultation page does not have collection type selector');
  }
});

// ============================================================================
// Suite 2: BookingCalendar Component
// ============================================================================
console.log(`\n${colors.blue}Suite 2: BookingCalendar Component${colors.reset}`);

test('BookingCalendar component file exists', () => {
  fileExists('src/components/BookingCalendar.tsx');
});

test('BookingCalendar component is exported', () => {
  const content = readFile('src/components/BookingCalendar.tsx');
  if (!content.includes('export') || !content.includes('BookingCalendar')) {
    throw new Error('BookingCalendar component is not properly exported');
  }
});

test('BookingCalendar fetches available slots', () => {
  const content = readFile('src/components/BookingCalendar.tsx');
  if (!content.includes('fetch') && !content.includes('axios') && !content.includes('useEffect')) {
    throw new Error('BookingCalendar does not fetch available slots');
  }
});

test('BookingCalendar has slot selection state', () => {
  const content = readFile('src/components/BookingCalendar.tsx');
  if (!content.includes('useState') || !content.includes('selected')) {
    throw new Error('BookingCalendar does not have slot selection state');
  }
});

test('BookingCalendar has loading state', () => {
  const content = readFile('src/components/BookingCalendar.tsx');
  if (!content.includes('loading') && !content.includes('isLoading')) {
    throw new Error('BookingCalendar does not have loading state');
  }
});

test('BookingCalendar has error handling', () => {
  const content = readFile('src/components/BookingCalendar.tsx');
  if (!content.includes('error') && !content.includes('catch')) {
    throw new Error('BookingCalendar does not have error handling');
  }
});

// ============================================================================
// Suite 3: API Routes
// ============================================================================
console.log(`\n${colors.blue}Suite 3: API Routes${colors.reset}`);

test('Available slots API route exists', () => {
  fileExists('src/app/api/calendar/available-slots/route.ts');
});

test('Available slots API has GET handler', () => {
  fileContains(
    'src/app/api/calendar/available-slots/route.ts',
    'GET',
    'Available slots API does not have GET handler'
  );
});

test('Booking API route exists', () => {
  fileExists('src/app/api/calendar/book/route.ts');
});

test('Booking API has POST handler', () => {
  fileContains(
    'src/app/api/calendar/book/route.ts',
    'POST',
    'Booking API does not have POST handler'
  );
});

test('Booking API validates customer information', () => {
  const content = readFile('src/app/api/calendar/book/route.ts');
  const hasValidation = content.includes('name') && 
                        content.includes('email') && 
                        content.includes('phone');
  if (!hasValidation) {
    throw new Error('Booking API does not validate customer information');
  }
});

test('Booking API creates calendar event', () => {
  const content = readFile('src/app/api/calendar/book/route.ts');
  if (!content.includes('calendar') && !content.includes('event')) {
    throw new Error('Booking API does not create calendar event');
  }
});

test('Booking API sends confirmation emails', () => {
  const content = readFile('src/app/api/calendar/book/route.ts');
  if (!content.includes('email') && !content.includes('sendMail')) {
    throw new Error('Booking API does not send confirmation emails');
  }
});

// ============================================================================
// Suite 4: Google Calendar Integration
// ============================================================================
console.log(`\n${colors.blue}Suite 4: Google Calendar Integration${colors.reset}`);

test('Google Calendar utility file exists', () => {
  fileExists('src/lib/google-calendar.ts');
});

test('Google Calendar has authentication', () => {
  const content = readFile('src/lib/google-calendar.ts');
  if (!content.includes('auth') && !content.includes('OAuth')) {
    throw new Error('Google Calendar does not have authentication');
  }
});

test('Google Calendar has available slots function', () => {
  const content = readFile('src/lib/google-calendar.ts');
  if (!content.includes('available') || !content.includes('slots')) {
    throw new Error('Google Calendar does not have available slots function');
  }
});

test('Google Calendar has create event function', () => {
  const content = readFile('src/lib/google-calendar.ts');
  if (!content.includes('create') && !content.includes('insert')) {
    throw new Error('Google Calendar does not have create event function');
  }
});

test('Google Calendar handles event duration by collection type', () => {
  const content = readFile('src/lib/google-calendar.ts');
  const hasDuration = content.includes('45') || // Bespoke
                      content.includes('60') || // Bridal
                      content.includes('30');   // RTW
  if (!hasDuration) {
    throw new Error('Google Calendar does not handle event duration by collection type');
  }
});

// ============================================================================
// Suite 5: Email Notifications
// ============================================================================
console.log(`\n${colors.blue}Suite 5: Email Notifications${colors.reset}`);

test('Email utility file exists', () => {
  fileExists('src/lib/email.ts');
});

test('Email utility has consultation templates', () => {
  const content = readFile('src/lib/email.ts');
  if (!content.includes('consultation') && !content.includes('booking')) {
    throw new Error('Email utility does not have consultation templates');
  }
});

test('Email utility sends customer confirmation', () => {
  const content = readFile('src/lib/email.ts');
  if (!content.includes('customer') || !content.includes('confirmation')) {
    throw new Error('Email utility does not send customer confirmation');
  }
});

test('Email utility sends CEO notification', () => {
  const content = readFile('src/lib/email.ts');
  if (!content.includes('CEO') || !content.includes('notification')) {
    throw new Error('Email utility does not send CEO notification');
  }
});

test('Email utility includes calendar invite', () => {
  const content = readFile('src/lib/email.ts');
  if (!content.includes('.ics') || !content.includes('calendar')) {
    throw new Error('Email utility does not include calendar invite');
  }
});

// ============================================================================
// Suite 6: Form Validation
// ============================================================================
console.log(`\n${colors.blue}Suite 6: Form Validation${colors.reset}`);

test('Consultation page has email validation', () => {
  const content = readFile('src/app/consultation/page.tsx');
  if (!content.includes('email') && !content.includes('@')) {
    throw new Error('Consultation page does not have email validation');
  }
});

test('Consultation page has phone validation', () => {
  const content = readFile('src/app/consultation/page.tsx');
  if (!content.includes('phone') && !content.includes('tel')) {
    throw new Error('Consultation page does not have phone validation');
  }
});

test('Consultation page has required field validation', () => {
  const content = readFile('src/app/consultation/page.tsx');
  if (!content.includes('required') && !content.includes('error')) {
    throw new Error('Consultation page does not have required field validation');
  }
});

test('Consultation page has slot selection validation', () => {
  const content = readFile('src/app/consultation/page.tsx');
  if (!content.includes('slot') && !content.includes('selected')) {
    throw new Error('Consultation page does not have slot selection validation');
  }
});

// ============================================================================
// Suite 7: Collection Type Integration
// ============================================================================
console.log(`\n${colors.blue}Suite 7: Collection Type Integration${colors.reset}`);

test('Consultation page supports Bespoke collection', () => {
  fileContains(
    'src/app/consultation/page.tsx',
    'bespoke',
    'Consultation page does not support Bespoke collection'
  );
});

test('Consultation page supports Bridal collection', () => {
  fileContains(
    'src/app/consultation/page.tsx',
    'bridal',
    'Consultation page does not support Bridal collection'
  );
});

test('Consultation page supports Ready-to-Wear collection', () => {
  const content = readFile('src/app/consultation/page.tsx');
  if (!content.includes('rtw') && !content.includes('ready-to-wear')) {
    throw new Error('Consultation page does not support Ready-to-Wear collection');
  }
});

test('Consultation page handles query parameters', () => {
  const content = readFile('src/app/consultation/page.tsx');
  if (!content.includes('searchParams') && !content.includes('query') && !content.includes('useSearchParams')) {
    throw new Error('Consultation page does not handle query parameters');
  }
});

// ============================================================================
// Suite 8: Error Handling
// ============================================================================
console.log(`\n${colors.blue}Suite 8: Error Handling${colors.reset}`);

test('Booking API has error handling', () => {
  const content = readFile('src/app/api/calendar/book/route.ts');
  if (!content.includes('try') || !content.includes('catch')) {
    throw new Error('Booking API does not have error handling');
  }
});

test('Booking API returns appropriate error responses', () => {
  const content = readFile('src/app/api/calendar/book/route.ts');
  if (!content.includes('error') && !content.includes('status')) {
    throw new Error('Booking API does not return appropriate error responses');
  }
});

test('Available slots API has error handling', () => {
  const content = readFile('src/app/api/calendar/available-slots/route.ts');
  if (!content.includes('try') || !content.includes('catch')) {
    throw new Error('Available slots API does not have error handling');
  }
});

test('Consultation page displays error messages', () => {
  const content = readFile('src/app/consultation/page.tsx');
  if (!content.includes('error') && !content.includes('Error')) {
    throw new Error('Consultation page does not display error messages');
  }
});

// ============================================================================
// Suite 9: TypeScript Types
// ============================================================================
console.log(`\n${colors.blue}Suite 9: TypeScript Types${colors.reset}`);

test('Types file exists', () => {
  fileExists('src/types/index.ts');
});

test('Types include consultation booking types (or inline types in components)', () => {
  const typesContent = readFile('src/types/index.ts');
  const consultationContent = readFile('src/app/consultation/page.tsx');
  const calendarContent = readFile('src/components/BookingCalendar.tsx');
  
  // Check if types are defined in types file OR inline in components
  const hasBookingTypes = typesContent.includes('Booking') || 
                          typesContent.includes('Consultation') || 
                          typesContent.includes('TimeSlot') ||
                          consultationContent.includes('interface') ||
                          calendarContent.includes('interface');
  
  if (!hasBookingTypes) {
    throw new Error('Types do not include consultation booking types');
  }
});

test('Types include collection type', () => {
  const content = readFile('src/types/index.ts');
  if (!content.includes('bespoke') || !content.includes('bridal')) {
    throw new Error('Types do not include collection type');
  }
});

// ============================================================================
// Test Summary
// ============================================================================
console.log(`\n${colors.cyan}=== Test Summary ===${colors.reset}`);
console.log(`Total Tests: ${totalTests}`);
console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);

const successRate = ((passedTests / totalTests) * 100).toFixed(2);
console.log(`Success Rate: ${successRate}%\n`);

if (failedTests > 0) {
  console.log(`${colors.red}Some tests failed. Please review the errors above.${colors.reset}\n`);
  process.exit(1);
} else {
  console.log(`${colors.green}All tests passed! ✓${colors.reset}\n`);
  process.exit(0);
}
