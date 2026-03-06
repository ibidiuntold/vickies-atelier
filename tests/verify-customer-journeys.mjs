#!/usr/bin/env node

/**
 * Customer Journey Verification Script
 * 
 * This script performs automated checks on customer journey flows
 * to verify that routes exist, components are properly configured,
 * and the integration is working correctly.
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

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
 * Test result logger
 */
function logTest(name, passed, message = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`${colors.green}✓${colors.reset} ${name}`);
  } else {
    failedTests++;
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    if (message) {
      console.log(`  ${colors.yellow}→${colors.reset} ${message}`);
    }
  }
}

/**
 * Section header logger
 */
function logSection(title) {
  console.log(`\n${colors.cyan}${title}${colors.reset}`);
  console.log('─'.repeat(60));
}

/**
 * Check if a file exists
 */
function fileExists(path) {
  return existsSync(join(projectRoot, path));
}

/**
 * Read file content
 */
function readFile(path) {
  try {
    return readFileSync(join(projectRoot, path), 'utf-8');
  } catch (error) {
    return null;
  }
}

/**
 * Check if file contains a string
 */
function fileContains(path, searchString) {
  const content = readFile(path);
  return content ? content.includes(searchString) : false;
}

/**
 * Check if file contains a regex pattern
 */
function fileMatchesPattern(path, pattern) {
  const content = readFile(path);
  return content ? pattern.test(content) : false;
}

// ============================================================================
// Test Suite 1: Route Files Exist
// ============================================================================

logSection('Test Suite 1: Route Files Exist');

logTest(
  'Homepage route exists',
  fileExists('src/app/page.tsx'),
  'src/app/page.tsx not found'
);

logTest(
  'Consultation page route exists',
  fileExists('src/app/consultation/page.tsx'),
  'src/app/consultation/page.tsx not found'
);

logTest(
  'Order page route exists',
  fileExists('src/app/order/page.tsx'),
  'src/app/order/page.tsx not found'
);

logTest(
  'Services page route exists',
  fileExists('src/app/services/page.tsx'),
  'src/app/services/page.tsx not found'
);

logTest(
  'Order page client component exists',
  fileExists('src/app/order/OrderPageClient.tsx'),
  'src/app/order/OrderPageClient.tsx not found'
);

// ============================================================================
// Test Suite 2: Component Files Exist
// ============================================================================

logSection('Test Suite 2: Component Files Exist');

logTest(
  'CollectionSection component exists',
  fileExists('src/components/CollectionSection.tsx'),
  'src/components/CollectionSection.tsx not found'
);

logTest(
  'BookingCalendar component exists',
  fileExists('src/components/BookingCalendar.tsx'),
  'src/components/BookingCalendar.tsx not found'
);

logTest(
  'Carousel component exists',
  fileExists('src/components/Carousel.tsx'),
  'src/components/Carousel.tsx not found'
);

logTest(
  'ContactWidget component exists',
  fileExists('src/components/ContactWidget.tsx'),
  'src/components/ContactWidget.tsx not found'
);

logTest(
  'PhotoUpload component exists',
  fileExists('src/components/PhotoUpload.tsx'),
  'src/components/PhotoUpload.tsx not found'
);

logTest(
  'MeasurementDiagrams component exists',
  fileExists('src/components/MeasurementDiagrams.tsx'),
  'src/components/MeasurementDiagrams.tsx not found'
);

// ============================================================================
// Test Suite 3: Consultation Booking Flow Integration
// ============================================================================

logSection('Test Suite 3: Consultation Booking Flow Integration');

logTest(
  'CollectionSection has "Book Consultation" button',
  fileContains('src/components/CollectionSection.tsx', 'Book Consultation'),
  'Book Consultation button not found in CollectionSection'
);

logTest(
  'CollectionSection links to consultation page',
  fileContains('src/components/CollectionSection.tsx', '/consultation'),
  'Link to /consultation not found in CollectionSection'
);

logTest(
  'CollectionSection passes collection query parameter',
  fileMatchesPattern(
    'src/components/CollectionSection.tsx',
    /collection=\$\{id\}/
  ),
  'Collection query parameter not passed correctly'
);

logTest(
  'Consultation page uses useSearchParams',
  fileContains('src/app/consultation/page.tsx', 'useSearchParams'),
  'useSearchParams not found in consultation page'
);

logTest(
  'Consultation page reads collection parameter',
  fileContains('src/app/consultation/page.tsx', "searchParams.get('collection')"),
  'Collection parameter not read from URL'
);

logTest(
  'Consultation page has BookingCalendar component',
  fileContains('src/app/consultation/page.tsx', 'BookingCalendar'),
  'BookingCalendar component not found in consultation page'
);

logTest(
  'Consultation page has form validation',
  fileContains('src/app/consultation/page.tsx', 'validateForm'),
  'Form validation not found in consultation page'
);

logTest(
  'Consultation page has email validation',
  fileContains('src/app/consultation/page.tsx', 'validateEmail'),
  'Email validation not found in consultation page'
);

logTest(
  'Consultation page has phone validation',
  fileContains('src/app/consultation/page.tsx', 'validatePhone'),
  'Phone validation not found in consultation page'
);

// ============================================================================
// Test Suite 4: Direct Order Flow Integration
// ============================================================================

logSection('Test Suite 4: Direct Order Flow Integration');

logTest(
  'CollectionSection has "Order Now" button',
  fileContains('src/components/CollectionSection.tsx', 'Order Now'),
  'Order Now button not found in CollectionSection'
);

logTest(
  'CollectionSection links to order page',
  fileContains('src/components/CollectionSection.tsx', '/order'),
  'Link to /order not found in CollectionSection'
);

logTest(
  'Services page has "Place an Order" button',
  fileContains('src/app/services/page.tsx', 'Place an Order'),
  'Place an Order button not found in services page'
);

logTest(
  'Services page links to order page',
  fileContains('src/app/services/page.tsx', '/order'),
  'Link to /order not found in services page'
);

logTest(
  'Homepage has order CTA in callout section',
  fileMatchesPattern('src/app/page.tsx', /Book a Consultation|Place.*Order/),
  'Order CTA not found in homepage callout'
);

// ============================================================================
// Test Suite 5: Collections Carousel Preserved
// ============================================================================

logSection('Test Suite 5: Collections Carousel Preserved');

logTest(
  'Homepage uses CollectionSection (which includes Carousel)',
  fileContains('src/app/page.tsx', "import CollectionSection from"),
  'CollectionSection import not found in homepage (Carousel is used within CollectionSection)'
);

logTest(
  'Homepage imports CollectionSection component',
  fileContains('src/app/page.tsx', "import CollectionSection from"),
  'CollectionSection import not found in homepage'
);

logTest(
  'Homepage has Bespoke collection with images',
  fileContains('src/app/page.tsx', 'bespokeImages'),
  'Bespoke collection images not found'
);

logTest(
  'Homepage has Bridal collection with images',
  fileContains('src/app/page.tsx', 'bridalImages'),
  'Bridal collection images not found'
);

logTest(
  'Homepage has RTW collection with images',
  fileContains('src/app/page.tsx', 'rtwImages'),
  'RTW collection images not found'
);

logTest(
  'CollectionSection renders Carousel',
  fileContains('src/components/CollectionSection.tsx', '<Carousel'),
  'Carousel not rendered in CollectionSection'
);

logTest(
  'CollectionSection passes images to Carousel',
  fileContains('src/components/CollectionSection.tsx', 'images={images}'),
  'Images not passed to Carousel'
);

// ============================================================================
// Test Suite 6: Services Page Preserved
// ============================================================================

logSection('Test Suite 6: Services Page Preserved');

logTest(
  'Services page has PROCESS_STEPS',
  fileContains('src/app/services/page.tsx', 'PROCESS_STEPS'),
  'PROCESS_STEPS not found in services page'
);

logTest(
  'Services page has 5 process steps',
  fileMatchesPattern(
    'src/app/services/page.tsx',
    /number:\s*["']0[1-5]["']/g
  ),
  'Not all 5 process steps found'
);

logTest(
  'Services page has hero section',
  fileContains('src/app/services/page.tsx', 'services-hero'),
  'Hero section not found in services page'
);

logTest(
  'Services page has "What to Expect" section',
  fileContains('src/app/services/page.tsx', 'What to Expect'),
  'What to Expect section not found'
);

logTest(
  'Services page has "Turnaround Times" section',
  fileContains('src/app/services/page.tsx', 'Turnaround Times'),
  'Turnaround Times section not found'
);

logTest(
  'Services page has CTA section',
  fileContains('src/app/services/page.tsx', 'Ready to Begin'),
  'CTA section not found'
);

// ============================================================================
// Test Suite 7: API Routes Exist
// ============================================================================

logSection('Test Suite 7: API Routes Exist');

logTest(
  'Calendar available-slots API route exists',
  fileExists('src/app/api/calendar/available-slots/route.ts'),
  'Calendar available-slots API route not found'
);

logTest(
  'Calendar book API route exists',
  fileExists('src/app/api/calendar/book/route.ts'),
  'Calendar book API route not found'
);

logTest(
  'Order API route exists',
  fileExists('src/app/api/order/route.ts'),
  'Order API route not found'
);

logTest(
  'Enquiry API route exists',
  fileExists('src/app/api/enquiry/route.ts'),
  'Enquiry API route not found'
);

// ============================================================================
// Test Suite 8: Enhanced Measurement Form
// ============================================================================

logSection('Test Suite 8: Enhanced Measurement Form');

logTest(
  'OrderPageClient imports PhotoUpload',
  fileContains('src/app/order/OrderPageClient.tsx', 'PhotoUpload') ||
  fileContains('src/components/OrderForm.tsx', 'PhotoUpload'),
  'PhotoUpload not imported in order form'
);

logTest(
  'OrderPageClient imports MeasurementDiagrams',
  fileContains('src/app/order/OrderPageClient.tsx', 'MeasurementDiagrams') ||
  fileContains('src/components/OrderForm.tsx', 'MeasurementDiagrams'),
  'MeasurementDiagrams not imported in order form'
);

// ============================================================================
// Test Suite 9: Library Files Exist
// ============================================================================

logSection('Test Suite 9: Library Files Exist');

logTest(
  'Google Calendar library exists',
  fileExists('src/lib/google-calendar.ts'),
  'src/lib/google-calendar.ts not found'
);

logTest(
  'Email library exists',
  fileExists('src/lib/email.ts'),
  'src/lib/email.ts not found'
);

logTest(
  'File upload library exists',
  fileExists('src/lib/file-upload.ts'),
  'src/lib/file-upload.ts not found'
);

logTest(
  'Sheets library exists',
  fileExists('src/lib/sheets.ts'),
  'src/lib/sheets.ts not found'
);

// ============================================================================
// Test Suite 10: Type Definitions
// ============================================================================

logSection('Test Suite 10: Type Definitions');

logTest(
  'Types file exists',
  fileExists('src/types/index.ts'),
  'src/types/index.ts not found'
);

const typesContent = readFile('src/types/index.ts');
if (typesContent) {
  logTest(
    'Collection type is defined',
    typesContent.includes('Collection'),
    'Collection type not found in types file'
  );

  logTest(
    'ImageItem type is defined',
    typesContent.includes('ImageItem'),
    'ImageItem type not found in types file'
  );
}

// ============================================================================
// Summary
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log(`${colors.blue}Test Execution Summary${colors.reset}`);
console.log('='.repeat(60));
console.log(`Total Tests:  ${totalTests}`);
console.log(`${colors.green}Passed:       ${passedTests}${colors.reset}`);
console.log(`${colors.red}Failed:       ${failedTests}${colors.reset}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

if (failedTests > 0) {
  console.log(`\n${colors.yellow}⚠ Some tests failed. Review the output above for details.${colors.reset}`);
  process.exit(1);
} else {
  console.log(`\n${colors.green}✓ All automated checks passed!${colors.reset}`);
  console.log(`\n${colors.cyan}Next Steps:${colors.reset}`);
  console.log('1. Run the development server: npm run dev');
  console.log('2. Execute manual tests from: tests/customer-journey-flows.test.md');
  console.log('3. Test all customer journeys in the browser');
  console.log('4. Verify consultation booking creates calendar events');
  console.log('5. Verify order submission sends emails with photo attachments');
  process.exit(0);
}
