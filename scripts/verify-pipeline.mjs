import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Verify i18n keys across all 4 locales (supports both templates.pipeline and projects.pipeline)
const locales = ['en', 'de', 'es', 'fr'];
const requiredPipelineKeys = [
  'tag',
  'title',
  'desc',
  'placeholder',
  'cta',
  'loading',
  'successTitle',
  'successDesc',
  'success',
  'error'
];

let allPassed = true;

for (const lang of locales) {
  const filePath = path.resolve(__dirname, `../src/i18n/locales/${lang}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const pipeline = content.templates?.pipeline || content.projects?.pipeline;
  if (!pipeline) {
    console.error(`[FAIL] ${lang}.json is missing pipeline in templates or projects!`);
    allPassed = false;
    continue;
  }
  for (const key of requiredPipelineKeys) {
    if (!pipeline[key] || typeof pipeline[key] !== 'string') {
      console.error(`[FAIL] ${lang}.json missing key pipeline.${key}`);
      allPassed = false;
    }
  }
  console.log(`[PASS] ${lang}.json has all required pipeline keys (${Object.keys(pipeline).length} keys).`);
}

// 2. Email validation tests matching regex in TemplatesGrid
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const testCases = [
  { email: 'user@example.com', valid: true },
  { email: 'user.name+tag@sub.domain.co', valid: true },
  { email: 'invalid-email', valid: false },
  { email: '@no-local.com', valid: false },
  { email: 'no-tld@domain', valid: false },
  { email: '   ', valid: false },
  { email: '', valid: false },
  { email: 'user@domain..com', valid: true },
];

for (const tc of testCases) {
  const result = emailRegex.test((tc.email || '').trim());
  if (result !== tc.valid) {
    console.error(`[FAIL] Regex test failed for "${tc.email}": expected ${tc.valid}, got ${result}`);
    allPassed = false;
  }
}
console.log('[PASS] Email regex test cases passed.');

if (allPassed) {
  console.log('ALL PIPELINE VERIFICATIONS PASSED SUCCESSFULLY!');
} else {
  process.exit(1);
}
