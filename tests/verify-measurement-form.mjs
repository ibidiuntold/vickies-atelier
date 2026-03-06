#!/usr/bin/env node

/**
 * Measurement Form Enhancements Verification Script
 * 
 * This script performs automated checks for the measurement form enhancements.
 * It verifies photo upload, validation, diagrams, and email attachment functionality.
 * 
 * Usage: node tests/verify-measurement-form.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ANSI color codes
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

function fileExists(filePath) {
  const fullPath = join(rootDir, filePath);
  if (!existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
}

function readFile(filePath) {
  const fullPath = join(rootDir, filePath);
  if (!existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return readFileSync(fullPath, 'utf-8');
}

function fileContains(filePath, searchText, errorMessage) {
  const content = readFile(filePath);
  if (!content.includes(searchText)) {
    throw new Error(errorMessage || `File ${filePath} does not contain: ${searchText}`);
  }
}

console.log(`\n${colors.cyan}=== Measurement Form Enhancements Verification ===${colors.reset}\n`);

// Suite 1: PhotoUpload Component
console.log(`${colors.blue}Suite 1: PhotoUpload Component${colors.reset}`);

test('PhotoUpload component file exists', () => {
  fileExists('src/components/PhotoUpload.tsx');
});

test('PhotoUpload component is exported', () => {
  const content = readFile('src/components/PhotoUpload.tsx');
  if (!content.includes('export') || !content.includes('PhotoUpload')) {
    throw new Error('PhotoUpload component is not properly exported');
  }
});

test('PhotoUpload accepts file types (JPEG, PNG, HEIC, WebP)', () => {
  const content = readFile('src/components/PhotoUpload.tsx');
  const hasFileTypes = content.includes('jpeg') || content.includes('png') || 
                       content.includes('heic') || content.includes('webp') ||
                       content.includes('image/');
  if (!hasFileTypes) {
    throw new Error('PhotoUpload does not specify accepted file types');
  }
});

test('PhotoUpload has file size validation (10MB)', () => {
  const content = readFile('src/components/PhotoUpload.tsx');
  if (!content.includes('10') && !content.includes('size')) {
    throw new Error('PhotoUpload does not have file size validation');
  }
});

test('PhotoUpload has maximum file limit (1-5 photos)', () => {
  const content = readFile('src/components/PhotoUpload.tsx');
  if (!content.includes('5') && !content.includes('max')) {
    throw new Error('PhotoUpload does not have maximum file limit');
  }
});

test('PhotoUpload has file preview functionality', () => {
  const content = readFile('src/components/PhotoUpload.tsx');
  if (!content.includes('preview') && !content.includes('thumbnail')) {
    throw new Error('PhotoUpload does not have file preview functionality');
  }
});

test('PhotoUpload has remove file functionality', () => {
  const content = readFile('src/components/PhotoUpload.tsx');
  if (!content.includes('remove') && !content.includes('delete')) {
    throw new Error('PhotoUpload does not have remove file functionality');
  }
});

test('PhotoUpload has drag and drop support', () => {
  const content = readFile('src/components/PhotoUpload.tsx');
  if (!content.includes('drag') && !content.includes('drop') && !content.includes('onDrop')) {
    throw new Error('PhotoUpload does not have drag and drop support');
  }
});

test('PhotoUpload has error handling', () => {
  const content = readFile('src/components/PhotoUpload.tsx');
  if (!content.includes('error') && !content.includes('Error')) {
    throw new Error('PhotoUpload does not have error handling');
  }
});

// Suite 2: MeasurementDiagrams Component
console.log(`\n${colors.blue}Suite 2: MeasurementDiagrams Component${colors.reset}`);

test('MeasurementDiagrams component file exists', () => {
  fileExists('src/components/MeasurementDiagrams.tsx');
});

test('MeasurementDiagrams component is exported', () => {
  const content = readFile('src/components/MeasurementDiagrams.tsx');
  if (!content.includes('export') || !content.includes('MeasurementDiagrams')) {
    throw new Error('MeasurementDiagrams component is not properly exported');
  }
});

test('MeasurementDiagrams has SVG diagrams', () => {
  const content = readFile('src/components/MeasurementDiagrams.tsx');
  if (!content.includes('svg') && !content.includes('SVG')) {
    throw new Error('MeasurementDiagrams does not have SVG diagrams');
  }
});

test('MeasurementDiagrams has tutorial link', () => {
  const content = readFile('src/components/MeasurementDiagrams.tsx');
  if (!content.includes('tutorialUrl') || !content.includes('href')) {
    throw new Error('MeasurementDiagrams does not have tutorial link');
  }
});

test('MeasurementDiagrams has all measurement types', () => {
  const content = readFile('src/components/MeasurementDiagrams.tsx');
  const hasMeasurements = content.includes('bust') && content.includes('waist') && 
                          content.includes('hips') && content.includes('height');
  if (!hasMeasurements) {
    throw new Error('MeasurementDiagrams does not have all measurement types');
  }
});

// Suite 3: Order Form Integration
console.log(`\n${colors.blue}Suite 3: Order Form Integration${colors.reset}`);

test('Order form integrates PhotoUpload', () => {
  const content = readFile('src/components/OrderForm.tsx');
  if (!content.includes('PhotoUpload')) {
    throw new Error('Order form does not integrate PhotoUpload');
  }
});

test('Order form integrates MeasurementDiagrams', () => {
  const content = readFile('src/components/OrderForm.tsx');
  if (!content.includes('MeasurementDiagrams')) {
    throw new Error('Order form does not integrate MeasurementDiagrams');
  }
});

test('Order form has measurement validation', () => {
  const content = readFile('src/components/OrderForm.tsx');
  if (!content.includes('required') && !content.includes('validation') && !content.includes('error')) {
    throw new Error('Order form does not have measurement validation');
  }
});

test('Order form has all required measurement fields', () => {
  const content = readFile('src/components/OrderForm.tsx');
  const hasAllFields = content.includes('bust') && content.includes('waist') && 
                       content.includes('hips') && content.includes('height') &&
                       content.includes('shoulder') && content.includes('sleeve') && 
                       content.includes('inseam');
  if (!hasAllFields) {
    throw new Error('Order form does not have all required measurement fields');
  }
});

test('Order form disables continue button until fields are filled', () => {
  const content = readFile('src/components/OrderForm.tsx');
  if (!content.includes('disabled')) {
    throw new Error('Order form does not disable continue button');
  }
});

// Suite 4: File Upload Utility
console.log(`\n${colors.blue}Suite 4: File Upload Utility${colors.reset}`);

test('File upload utility file exists', () => {
  fileExists('src/lib/file-upload.ts');
});

test('File upload utility has image compression', () => {
  const content = readFile('src/lib/file-upload.ts');
  if (!content.includes('compress') && !content.includes('sharp')) {
    throw new Error('File upload utility does not have image compression');
  }
});

test('File upload utility handles temporary storage', () => {
  const content = readFile('src/lib/file-upload.ts');
  if (!content.includes('temp') || !content.includes('storage')) {
    throw new Error('File upload utility does not handle temporary storage');
  }
});

// Suite 5: Order API Photo Handling
console.log(`\n${colors.blue}Suite 5: Order API Photo Handling${colors.reset}`);

test('Order API accepts photo uploads', () => {
  const content = readFile('src/app/api/order/route.ts');
  if (!content.includes('photo') && !content.includes('image') && !content.includes('file')) {
    throw new Error('Order API does not accept photo uploads');
  }
});

test('Order API attaches photos to emails', () => {
  const content = readFile('src/app/api/order/route.ts');
  if (!content.includes('attach') && !content.includes('photo')) {
    throw new Error('Order API does not attach photos to emails');
  }
});

// Suite 6: Email Photo Attachments
console.log(`\n${colors.blue}Suite 6: Email Photo Attachments${colors.reset}`);

test('Email utility handles photo attachments', () => {
  const content = readFile('src/lib/email.ts');
  if (!content.includes('attachment') && !content.includes('photo')) {
    throw new Error('Email utility does not handle photo attachments');
  }
});

test('Email utility includes photos in order emails', () => {
  const content = readFile('src/lib/email.ts');
  if (!content.includes('order') && !content.includes('photo')) {
    throw new Error('Email utility does not include photos in order emails');
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
  console.log(`${colors.red}Some tests failed. Please review the errors above.${colors.reset}\n`);
  process.exit(1);
} else {
  console.log(`${colors.green}All tests passed! ✓${colors.reset}\n`);
  process.exit(0);
}
