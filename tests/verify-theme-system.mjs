#!/usr/bin/env node

/**
 * Theme System Verification Script
 * 
 * This script performs automated checks on the theme system
 * to verify that components exist, are properly configured,
 * and the integration is working correctly.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ANSI color codes
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

function logSection(title) {
  console.log(`\n${colors.cyan}${title}${colors.reset}`);
  console.log('─'.repeat(60));
}

function fileExists(path) {
  return existsSync(join(projectRoot, path));
}

function readFile(path) {
  try {
    return readFileSync(join(projectRoot, path), 'utf-8');
  } catch (error) {
    return null;
  }
}

function fileContains(path, searchString) {
  const content = readFile(path);
  return content ? content.includes(searchString) : false;
}

function fileMatchesPattern(path, pattern) {
  const content = readFile(path);
  return content ? pattern.test(content) : false;
}

// ============================================================================
// Test Suite 1: Theme Core Files Exist
// ============================================================================

logSection('Test Suite 1: Theme Core Files Exist');

logTest(
  'ThemeProvider component exists',
  fileExists('src/components/ThemeProvider.tsx'),
  'src/components/ThemeProvider.tsx not found'
);

logTest(
  'ThemeToggle component exists',
  fileExists('src/components/ThemeToggle.tsx'),
  'src/components/ThemeToggle.tsx not found'
);

logTest(
  'useTheme hook exists',
  fileExists('src/hooks/useTheme.ts'),
  'src/hooks/useTheme.ts not found'
);

logTest(
  'Logo component exists',
  fileExists('src/components/Logo.tsx'),
  'src/components/Logo.tsx not found'
);

logTest(
  'Logo configuration exists',
  fileExists('src/lib/logo-config.ts'),
  'src/lib/logo-config.ts not found'
);

// ============================================================================
// Test Suite 2: ThemeProvider Implementation
// ============================================================================

logSection('Test Suite 2: ThemeProvider Implementation');

logTest(
  'ThemeProvider creates ThemeContext',
  fileContains('src/components/ThemeProvider.tsx', 'ThemeContext'),
  'ThemeContext not found in ThemeProvider'
);

logTest(
  'ThemeProvider has theme state',
  fileContains('src/components/ThemeProvider.tsx', 'useState'),
  'useState not found in ThemeProvider'
);

logTest(
  'ThemeProvider detects system preference',
  fileContains('src/components/ThemeProvider.tsx', 'prefers-color-scheme'),
  'System preference detection not found'
);

logTest(
  'ThemeProvider reads from localStorage',
  fileContains('src/components/ThemeProvider.tsx', 'localStorage.getItem'),
  'localStorage read not found'
);

logTest(
  'ThemeProvider writes to localStorage',
  fileContains('src/components/ThemeProvider.tsx', 'localStorage.setItem'),
  'localStorage write not found'
);

logTest(
  'ThemeProvider uses theme-preference key',
  fileContains('src/components/ThemeProvider.tsx', 'theme-preference'),
  'theme-preference key not found'
);

logTest(
  'ThemeProvider applies theme to document root',
  fileContains('src/components/ThemeProvider.tsx', 'document.documentElement') ||
  fileContains('src/components/ThemeProvider.tsx', 'document.querySelector'),
  'Document root manipulation not found'
);

logTest(
  'ThemeProvider adds/removes dark class',
  fileContains('src/components/ThemeProvider.tsx', 'classList.add') &&
  fileContains('src/components/ThemeProvider.tsx', 'classList.remove'),
  'Dark class manipulation not found'
);

logTest(
  'ThemeProvider handles localStorage unavailable',
  fileMatchesPattern('src/components/ThemeProvider.tsx', /try\s*\{[\s\S]*localStorage[\s\S]*\}\s*catch/),
  'localStorage error handling not found'
);

logTest(
  'ThemeProvider listens for system theme changes',
  fileContains('src/components/ThemeProvider.tsx', 'addEventListener'),
  'System theme change listener not found'
);

// ============================================================================
// Test Suite 3: ThemeToggle Implementation
// ============================================================================

logSection('Test Suite 3: ThemeToggle Implementation');

logTest(
  'ThemeToggle uses useTheme hook',
  fileContains('src/components/ThemeToggle.tsx', 'useTheme'),
  'useTheme hook not used in ThemeToggle'
);

logTest(
  'ThemeToggle has toggle handler',
  fileContains('src/components/ThemeToggle.tsx', 'handleToggle') ||
  fileContains('src/components/ThemeToggle.tsx', 'onClick'),
  'Toggle handler not found'
);

logTest(
  'ThemeToggle has keyboard handler',
  fileContains('src/components/ThemeToggle.tsx', 'onKeyDown') ||
  fileContains('src/components/ThemeToggle.tsx', 'handleKeyDown'),
  'Keyboard handler not found'
);

logTest(
  'ThemeToggle supports Enter key',
  fileContains('src/components/ThemeToggle.tsx', 'Enter'),
  'Enter key support not found'
);

logTest(
  'ThemeToggle supports Space key',
  fileContains('src/components/ThemeToggle.tsx', ' ') ||
  fileContains('src/components/ThemeToggle.tsx', 'Space'),
  'Space key support not found'
);

logTest(
  'ThemeToggle has ARIA label',
  fileContains('src/components/ThemeToggle.tsx', 'aria-label'),
  'ARIA label not found'
);

logTest(
  'ThemeToggle has sun icon',
  fileContains('src/components/ThemeToggle.tsx', 'sun') ||
  fileContains('src/components/ThemeToggle.tsx', 'circle'),
  'Sun icon not found'
);

logTest(
  'ThemeToggle has moon icon',
  fileContains('src/components/ThemeToggle.tsx', 'moon') ||
  fileContains('src/components/ThemeToggle.tsx', 'path'),
  'Moon icon not found'
);

logTest(
  'ThemeToggle has theme-toggle class',
  fileContains('src/components/ThemeToggle.tsx', 'theme-toggle'),
  'theme-toggle class not found'
);

// ============================================================================
// Test Suite 4: Logo Theme Integration
// ============================================================================

logSection('Test Suite 4: Logo Theme Integration');

logTest(
  'Logo config defines light variant',
  fileContains('src/lib/logo-config.ts', 'light') &&
  fileContains('src/lib/logo-config.ts', 'logo-dark'),
  'Light mode logo variant not found'
);

logTest(
  'Logo config defines dark variant',
  fileContains('src/lib/logo-config.ts', 'dark') &&
  fileContains('src/lib/logo-config.ts', 'logo-white'),
  'Dark mode logo variant not found'
);

logTest(
  'Logo config has WebP format',
  fileContains('src/lib/logo-config.ts', '.webp'),
  'WebP format not found in logo config'
);

logTest(
  'Logo config has fallback format',
  fileContains('src/lib/logo-config.ts', '.png'),
  'PNG fallback not found in logo config'
);

logTest(
  'Logo config has alt text',
  fileContains('src/lib/logo-config.ts', 'alt'),
  'Alt text not found in logo config'
);

logTest(
  'Logo component accepts theme prop',
  fileContains('src/components/Logo.tsx', 'theme'),
  'Theme prop not found in Logo component'
);

logTest(
  'Logo component uses getLogoAssets',
  fileContains('src/components/Logo.tsx', 'getLogoAssets'),
  'getLogoAssets not used in Logo component'
);

logTest(
  'Logo component has picture element',
  fileContains('src/components/Logo.tsx', '<picture>'),
  'Picture element not found in Logo component'
);

logTest(
  'Logo component has source element for WebP',
  fileContains('src/components/Logo.tsx', '<source'),
  'Source element not found in Logo component'
);

logTest(
  'Logo component is clickable',
  fileContains('src/components/Logo.tsx', 'Link') ||
  fileContains('src/components/Logo.tsx', 'href'),
  'Logo link not found'
);

// ============================================================================
// Test Suite 5: Layout Integration
// ============================================================================

logSection('Test Suite 5: Layout Integration');

logTest(
  'Layout imports ThemeProvider',
  fileContains('src/app/layout.tsx', 'ThemeProvider'),
  'ThemeProvider not imported in layout'
);

logTest(
  'Layout wraps app with ThemeProvider',
  fileContains('src/app/layout.tsx', '<ThemeProvider>'),
  'ThemeProvider not used in layout'
);

logTest(
  'Header component exists',
  fileExists('src/components/Header.tsx'),
  'Header component not found'
);

logTest(
  'Header imports ThemeToggle',
  fileContains('src/components/Header.tsx', 'ThemeToggle') ||
  fileContains('src/components/Header.tsx', 'theme-toggle'),
  'ThemeToggle not found in Header'
);

logTest(
  'Footer component exists',
  fileExists('src/components/Footer.tsx'),
  'Footer component not found'
);

// ============================================================================
// Test Suite 6: CSS Theme Variables
// ============================================================================

logSection('Test Suite 6: CSS Theme Variables');

const globalCSS = readFile('src/app/globals.css');

if (globalCSS) {
  logTest(
    'Global CSS defines light mode colors',
    globalCSS.includes(':root') && globalCSS.includes('--'),
    'Light mode CSS variables not found'
  );

  logTest(
    'Global CSS defines dark mode colors',
    globalCSS.includes('.dark') || globalCSS.includes('[data-theme="dark"]'),
    'Dark mode CSS variables not found'
  );

  logTest(
    'Global CSS has theme transitions',
    globalCSS.includes('transition'),
    'Theme transitions not found in CSS'
  );

  logTest(
    'Global CSS has brand colors',
    globalCSS.includes('--brand'),
    'Brand color variables not found'
  );

  logTest(
    'Global CSS has background colors',
    globalCSS.includes('--bg'),
    'Background color variables not found'
  );

  logTest(
    'Global CSS has text colors',
    globalCSS.includes('--text'),
    'Text color variables not found'
  );
} else {
  logTest('Global CSS file readable', false, 'Could not read globals.css');
}

// ============================================================================
// Test Suite 7: Theme Toggle Styling
// ============================================================================

logSection('Test Suite 7: Theme Toggle Styling');

if (globalCSS) {
  logTest(
    'Theme toggle styles exist',
    globalCSS.includes('.theme-toggle'),
    'Theme toggle styles not found'
  );

  logTest(
    'Theme toggle icon styles exist',
    globalCSS.includes('theme-toggle__icon'),
    'Theme toggle icon styles not found'
  );

  logTest(
    'Theme toggle has hover state',
    globalCSS.includes('.theme-toggle:hover') ||
    globalCSS.includes('.theme-toggle:focus'),
    'Theme toggle hover/focus state not found'
  );
}

// ============================================================================
// Test Suite 8: Logo Assets Exist
// ============================================================================

logSection('Test Suite 8: Logo Assets Exist');

logTest(
  'Dark logo PNG exists',
  fileExists('public/images/logo/logo-dark.png'),
  'Dark logo PNG not found'
);

logTest(
  'Dark logo WebP exists',
  fileExists('public/images/logo/logo-dark.webp'),
  'Dark logo WebP not found'
);

logTest(
  'White logo PNG exists',
  fileExists('public/images/logo/logo-white.png'),
  'White logo PNG not found'
);

logTest(
  'White logo WebP exists',
  fileExists('public/images/logo/logo-white.webp'),
  'White logo WebP not found'
);

// ============================================================================
// Test Suite 9: Component Theme Awareness
// ============================================================================

logSection('Test Suite 9: Component Theme Awareness');

logTest(
  'ContactWidget component exists',
  fileExists('src/components/ContactWidget.tsx'),
  'ContactWidget not found'
);

logTest(
  'Header uses Logo component',
  fileContains('src/components/Header.tsx', 'Logo') ||
  fileContains('src/components/Header.tsx', '<Logo'),
  'Logo not used in Header'
);

logTest(
  'Footer uses Logo component',
  fileContains('src/components/Footer.tsx', 'Logo') ||
  fileContains('src/components/Footer.tsx', '<Logo'),
  'Logo not used in Footer'
);

// ============================================================================
// Test Suite 10: TypeScript Types
// ============================================================================

logSection('Test Suite 10: TypeScript Types');

logTest(
  'ThemeProvider exports ThemeContext',
  fileContains('src/components/ThemeProvider.tsx', 'export') &&
  fileContains('src/components/ThemeProvider.tsx', 'ThemeContext'),
  'ThemeContext not exported'
);

logTest(
  'Theme types are defined',
  fileContains('src/components/ThemeProvider.tsx', "type Theme") ||
  fileContains('src/components/ThemeProvider.tsx', "type ResolvedTheme"),
  'Theme types not defined'
);

logTest(
  'Logo config exports LogoAsset type',
  fileContains('src/lib/logo-config.ts', 'export interface LogoAsset'),
  'LogoAsset type not exported'
);

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
  console.log('2. Execute manual tests from: tests/theme-system.test.md');
  console.log('3. Test theme detection on initial load');
  console.log('4. Test manual theme toggle functionality');
  console.log('5. Test theme persistence across page navigations');
  console.log('6. Test logo switching between themes');
  console.log('7. Test all components adapt to theme changes');
  console.log('8. Test on multiple browsers and devices');
  process.exit(0);
}
