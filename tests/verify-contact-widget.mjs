#!/usr/bin/env node

/**
 * Contact Widget Verification Script
 * 
 * This script performs automated checks for the Contact Widget implementation.
 * It verifies file existence, code integration, and component structure.
 * 
 * Usage: node tests/verify-contact-widget.mjs
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

console.log(`\n${colors.cyan}=== Contact Widget Verification ===${colors.reset}\n`);

// ============================================================================
// Suite 1: Contact Widget Component Files
// ============================================================================
console.log(`${colors.blue}Suite 1: Contact Widget Component Files${colors.reset}`);

test('ContactWidget.tsx file exists', () => {
  fileExists('src/components/ContactWidget.tsx');
});

test('ContactWidget component is exported', () => {
  fileContains(
    'src/components/ContactWidget.tsx',
    'export default function ContactWidget',
    'ContactWidget component is not properly exported'
  );
});

test('ContactWidget has expand/collapse state', () => {
  const content = readFile('src/components/ContactWidget.tsx');
  if (!content.includes('useState') || !content.includes('isExpanded')) {
    throw new Error('ContactWidget does not have isExpanded state');
  }
});

test('ContactWidget has email link (vickiesatelier@gmail.com)', () => {
  fileContains(
    'src/components/ContactWidget.tsx',
    'vickiesatelier@gmail.com',
    'ContactWidget does not contain email address'
  );
});

test('ContactWidget has WhatsApp link (08118660080)', () => {
  fileContains(
    'src/components/ContactWidget.tsx',
    '08118660080',
    'ContactWidget does not contain WhatsApp number'
  );
});

test('ContactWidget has phone link (081607422412)', () => {
  fileContains(
    'src/components/ContactWidget.tsx',
    '081607422412',
    'ContactWidget does not contain phone number'
  );
});

test('ContactWidget has mailto link', () => {
  fileContains(
    'src/components/ContactWidget.tsx',
    'mailto:',
    'ContactWidget does not have mailto link'
  );
});

test('ContactWidget has WhatsApp link format', () => {
  const content = readFile('src/components/ContactWidget.tsx');
  if (!content.includes('wa.me') && !content.includes('whatsapp')) {
    throw new Error('ContactWidget does not have WhatsApp link format');
  }
});

test('ContactWidget has tel link', () => {
  fileContains(
    'src/components/ContactWidget.tsx',
    'tel:',
    'ContactWidget does not have tel link'
  );
});

test('ContactWidget has close button', () => {
  const content = readFile('src/components/ContactWidget.tsx');
  if (!content.includes('close') && !content.includes('Close') && !content.includes('×')) {
    throw new Error('ContactWidget does not have close button');
  }
});

// ============================================================================
// Suite 2: Layout Integration
// ============================================================================
console.log(`\n${colors.blue}Suite 2: Layout Integration${colors.reset}`);

test('layout.tsx file exists', () => {
  fileExists('src/app/layout.tsx');
});

test('ContactWidget is imported in layout', () => {
  fileContains(
    'src/app/layout.tsx',
    'ContactWidget',
    'ContactWidget is not imported in layout'
  );
});

test('ContactWidget is rendered in layout', () => {
  const content = readFile('src/app/layout.tsx');
  if (!content.includes('<ContactWidget') && !content.includes('<ContactWidget/>')) {
    throw new Error('ContactWidget is not rendered in layout');
  }
});

// ============================================================================
// Suite 3: Widget Positioning and Styling
// ============================================================================
console.log(`\n${colors.blue}Suite 3: Widget Positioning and Styling${colors.reset}`);

test('ContactWidget has fixed positioning in CSS', () => {
  const content = readFile('src/app/globals.css');
  if (!content.includes('.contact-widget') || !content.includes('position: fixed')) {
    throw new Error('ContactWidget does not have fixed positioning in CSS');
  }
});

test('ContactWidget has bottom-right positioning', () => {
  const content = readFile('src/components/ContactWidget.tsx');
  const hasBottom = content.includes('bottom') || content.includes('bottom-');
  const hasRight = content.includes('right') || content.includes('right-');
  if (!hasBottom || !hasRight) {
    throw new Error('ContactWidget does not have bottom-right positioning');
  }
});

test('ContactWidget has z-index for layering in CSS', () => {
  const content = readFile('src/app/globals.css');
  if (!content.includes('.contact-widget') || !content.includes('z-index')) {
    throw new Error('ContactWidget does not have z-index for layering in CSS');
  }
});

test('ContactWidget has theme-aware styling in CSS', () => {
  const content = readFile('src/app/globals.css');
  // Check for CSS variables which are theme-aware
  const hasThemeVars = content.includes('.contact-widget') && (
    content.includes('var(--') || 
    content.includes('var(--card)') || 
    content.includes('var(--brand)')
  );
  if (!hasThemeVars) {
    throw new Error('ContactWidget does not have theme-aware styling in CSS');
  }
});

// ============================================================================
// Suite 4: Accessibility Features
// ============================================================================
console.log(`\n${colors.blue}Suite 4: Accessibility Features${colors.reset}`);

test('ContactWidget has ARIA labels', () => {
  const content = readFile('src/components/ContactWidget.tsx');
  if (!content.includes('aria-label') && !content.includes('ariaLabel')) {
    throw new Error('ContactWidget does not have ARIA labels');
  }
});

test('ContactWidget has keyboard accessibility (Escape key)', () => {
  const content = readFile('src/components/ContactWidget.tsx');
  const hasKeyboard = content.includes('Escape') || content.includes('keydown') || content.includes('KeyboardEvent');
  if (!hasKeyboard) {
    throw new Error('ContactWidget does not have keyboard accessibility');
  }
});

test('ContactWidget has text labels alongside icons', () => {
  const content = readFile('src/components/ContactWidget.tsx');
  const hasLabels = content.includes('Email') || content.includes('WhatsApp') || content.includes('Call') || content.includes('Phone');
  if (!hasLabels) {
    throw new Error('ContactWidget does not have text labels alongside icons');
  }
});

// ============================================================================
// Suite 5: Click Outside to Close
// ============================================================================
console.log(`\n${colors.blue}Suite 5: Click Outside to Close${colors.reset}`);

test('ContactWidget has click outside handler', () => {
  const content = readFile('src/components/ContactWidget.tsx');
  const hasClickOutside = content.includes('useEffect') && (
    content.includes('mousedown') || 
    content.includes('click') ||
    content.includes('addEventListener')
  );
  if (!hasClickOutside) {
    throw new Error('ContactWidget does not have click outside handler');
  }
});

test('ContactWidget has ref for click outside detection', () => {
  const content = readFile('src/components/ContactWidget.tsx');
  if (!content.includes('useRef') && !content.includes('ref=')) {
    throw new Error('ContactWidget does not have ref for click outside detection');
  }
});

// ============================================================================
// Suite 6: Animation and Transitions
// ============================================================================
console.log(`\n${colors.blue}Suite 6: Animation and Transitions${colors.reset}`);

test('ContactWidget has expand/collapse animation in CSS', () => {
  const content = readFile('src/app/globals.css');
  const hasAnimation = content.includes('.contact-widget') && (
    content.includes('transition') || 
    content.includes('transform') || 
    content.includes('animation')
  );
  if (!hasAnimation) {
    throw new Error('ContactWidget does not have expand/collapse animation in CSS');
  }
});

test('ContactWidget conditionally renders expanded content', () => {
  const content = readFile('src/components/ContactWidget.tsx');
  if (!content.includes('isExpanded') || !content.includes('?') || !content.includes(':')) {
    throw new Error('ContactWidget does not conditionally render expanded content');
  }
});

// ============================================================================
// Suite 7: Mobile Optimization
// ============================================================================
console.log(`\n${colors.blue}Suite 7: Mobile Optimization${colors.reset}`);

test('ContactWidget has mobile-responsive styling in CSS', () => {
  const content = readFile('src/app/globals.css');
  const hasMobile = content.includes('.contact-widget') && (
    content.includes('@media (max-width: 860px)') || 
    content.includes('@media (max-width:860px)')
  );
  if (!hasMobile) {
    throw new Error('ContactWidget does not have mobile-responsive styling in CSS');
  }
});

test('ContactWidget has appropriate touch target size', () => {
  const content = readFile('src/components/ContactWidget.tsx');
  // Check for minimum size classes or explicit sizing
  const hasSize = content.includes('w-') || 
                  content.includes('h-') || 
                  content.includes('p-') ||
                  content.includes('width') ||
                  content.includes('height');
  if (!hasSize) {
    throw new Error('ContactWidget does not have appropriate touch target size');
  }
});

// ============================================================================
// Suite 8: Contact Links Format
// ============================================================================
console.log(`\n${colors.blue}Suite 8: Contact Links Format${colors.reset}`);

test('Email link uses mailto protocol', () => {
  fileMatchesRegex(
    'src/components/ContactWidget.tsx',
    /mailto:vickiesatelier@gmail\.com/,
    'Email link does not use correct mailto format'
  );
});

test('WhatsApp link uses correct format', () => {
  const content = readFile('src/components/ContactWidget.tsx');
  const hasWhatsAppLink = content.includes('wa.me') || 
                          content.includes('api.whatsapp.com') ||
                          content.includes('whatsapp://');
  if (!hasWhatsAppLink) {
    throw new Error('WhatsApp link does not use correct format');
  }
});

test('Phone link uses tel protocol', () => {
  fileMatchesRegex(
    'src/components/ContactWidget.tsx',
    /tel:\+?[\d]+/,
    'Phone link does not use correct tel format'
  );
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
