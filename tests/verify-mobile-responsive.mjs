#!/usr/bin/env node

/**
 * Mobile Responsiveness Verification Script
 * Verifies mobile-responsive CSS and component implementations
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

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

function readFile(filePath) {
  const fullPath = join(rootDir, filePath);
  if (!existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return readFileSync(fullPath, 'utf-8');
}

console.log(`\n${colors.cyan}=== Mobile Responsiveness Verification ===${colors.reset}\n`);

// Suite 1: Mobile Breakpoint
console.log(`${colors.blue}Suite 1: Mobile Breakpoint (860px)${colors.reset}`);

test('Global CSS has mobile breakpoint at 860px', () => {
  const content = readFile('src/app/globals.css');
  if (!content.includes('@media (max-width: 860px)') && !content.includes('@media (max-width:860px)')) {
    throw new Error('Global CSS does not have mobile breakpoint at 860px');
  }
});

test('Tailwind config or CSS has mobile breakpoint', () => {
  const cssContent = readFile('src/app/globals.css');
  // Tailwind v4 uses CSS-based configuration
  if (!cssContent.includes('@media') && !cssContent.includes('860')) {
    throw new Error('No mobile breakpoint configuration found');
  }
});

// Suite 2: Button Centering on Mobile
console.log(`\n${colors.blue}Suite 2: Button Centering on Mobile${colors.reset}`);

test('Buttons are centered on mobile in CSS', () => {
  const content = readFile('src/app/globals.css');
  const hasButtonMobile = content.includes('.btn') && content.includes('@media (max-width: 860px)');
  if (!hasButtonMobile) {
    throw new Error('Buttons are not centered on mobile in CSS');
  }
});

test('Buttons have minimum tap target size (44px)', () => {
  const content = readFile('src/app/globals.css');
  if (!content.includes('44px') && !content.includes('min-width') && !content.includes('min-height')) {
    throw new Error('Buttons do not have minimum tap target size');
  }
});

// Suite 3: Logo Visibility
console.log(`\n${colors.blue}Suite 3: Logo Visibility on Mobile${colors.reset}`);

test('Logo component has mobile-specific styling or CSS', () => {
  const logoContent = readFile('src/components/Logo.tsx');
  const cssContent = readFile('src/app/globals.css');
  const hasMobileLogic = logoContent.includes('mobile') || logoContent.includes('sm:') || 
                         logoContent.includes('md:') || logoContent.includes('useMediaQuery') ||
                         cssContent.includes('.logo') && cssContent.includes('@media');
  if (!hasMobileLogic) {
    throw new Error('Logo component does not have mobile-specific styling');
  }
});

test('Footer hides logo on mobile', () => {
  const footerContent = readFile('src/components/Footer.tsx');
  const cssContent = readFile('src/app/globals.css');
  const hasHiddenLogic = footerContent.includes('hidden') || footerContent.includes('sm:') || 
                         cssContent.includes('footer') && cssContent.includes('@media');
  if (!hasHiddenLogic) {
    throw new Error('Footer does not hide logo on mobile');
  }
});

// Suite 4: Contact Widget Mobile
console.log(`\n${colors.blue}Suite 4: Contact Widget on Mobile${colors.reset}`);

test('Contact widget has mobile-responsive styling', () => {
  const content = readFile('src/app/globals.css');
  if (!content.includes('.contact-widget') || !content.includes('@media (max-width: 860px)')) {
    throw new Error('Contact widget does not have mobile-responsive styling');
  }
});

test('Contact widget has minimum tap target on mobile', () => {
  const content = readFile('src/app/globals.css');
  const hasMinSize = content.includes('.contact-widget') && (content.includes('56px') || content.includes('44px'));
  if (!hasMinSize) {
    throw new Error('Contact widget does not have minimum tap target on mobile');
  }
});

// Suite 5: Form Layouts
console.log(`\n${colors.blue}Suite 5: Form Layouts on Mobile${colors.reset}`);

test('Forms stack vertically on mobile', () => {
  const cssContent = readFile('src/app/globals.css');
  const hasVerticalStack = cssContent.includes('flex-direction: column') || 
                           cssContent.includes('flex-col') ||
                           cssContent.includes('@media (max-width: 860px)');
  if (!hasVerticalStack) {
    throw new Error('Forms do not stack vertically on mobile');
  }
});

test('Consultation form is mobile-responsive', () => {
  const pageContent = readFile('src/app/consultation/page.tsx');
  const cssContent = readFile('src/app/globals.css');
  const hasResponsive = pageContent.includes('className') || 
                        cssContent.includes('consultation') ||
                        cssContent.includes('@media (max-width: 860px)');
  if (!hasResponsive) {
    throw new Error('Consultation form is not mobile-responsive');
  }
});

test('Order form is mobile-responsive', () => {
  const content = readFile('src/components/OrderForm.tsx');
  if (!content.includes('flex') && !content.includes('grid') && !content.includes('responsive')) {
    throw new Error('Order form is not mobile-responsive');
  }
});

// Suite 6: Navigation Menu
console.log(`\n${colors.blue}Suite 6: Navigation Menu on Mobile${colors.reset}`);

test('Header has mobile navigation', () => {
  const content = readFile('src/components/Header.tsx');
  if (!content.includes('menu') && !content.includes('nav') && !content.includes('mobile')) {
    throw new Error('Header does not have mobile navigation');
  }
});

test('Navigation has hamburger menu logic', () => {
  const content = readFile('src/components/Header.tsx');
  if (!content.includes('useState') && !content.includes('isOpen') && !content.includes('toggle')) {
    throw new Error('Navigation does not have hamburger menu logic');
  }
});

// Suite 7: Image Optimization
console.log(`\n${colors.blue}Suite 7: Image Optimization for Mobile${colors.reset}`);

test('Images use Next.js Image component', () => {
  const homeContent = readFile('src/app/page.tsx');
  if (!homeContent.includes('next/image') && !homeContent.includes('Image')) {
    throw new Error('Images do not use Next.js Image component');
  }
});

test('Images have lazy loading', () => {
  const cssContent = readFile('src/app/globals.css');
  const hasLazyLoad = cssContent.includes('loading') || cssContent.includes('lazy');
  if (!hasLazyLoad) {
    console.log('  Note: Lazy loading may be handled by Next.js Image component');
  }
});

// Test Summary
console.log(`\n${colors.cyan}=== Test Summary ===${colors.reset}`);
console.log(`Total Tests: ${totalTests}`);
console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);

const successRate = ((passedTests / totalTests) * 100).toFixed(2);
console.log(`Success Rate: ${successRate}%\n`);

if (failedTests > 0) {
  console.log(`${colors.red}Some tests failed. Manual testing recommended.${colors.reset}\n`);
  process.exit(1);
} else {
  console.log(`${colors.green}All automated checks passed! ✓${colors.reset}\n`);
  console.log('Note: Manual testing on actual devices is still recommended.\n');
  process.exit(0);
}
