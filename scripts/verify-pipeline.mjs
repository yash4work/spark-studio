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

// Email validation is tested against the real helper in scripts/test-forms.mjs

// 2. Every locale has exactly the same keys as en.json.
// Required: each page downloads only its own language, with no English fallback.
const flatKeys = (obj, prefix = '') => Object.entries(obj).flatMap(([k, v]) =>
  v && typeof v === 'object' && !Array.isArray(v) ? flatKeys(v, prefix + k + '.') : [prefix + k]);
const load = lang => JSON.parse(fs.readFileSync(path.resolve(__dirname, `../src/i18n/locales/${lang}.json`), 'utf-8'));
const enKeys = new Set(flatKeys(load('en')));
for (const lang of ['de', 'es', 'fr']) {
  const keys = new Set(flatKeys(load(lang)));
  const missing = [...enKeys].filter(k => !keys.has(k));
  const extra = [...keys].filter(k => !enKeys.has(k));
  if (missing.length || extra.length) {
    allPassed = false;
    if (missing.length) console.error(`[FAIL] ${lang}.json is missing ${missing.length} keys, e.g. ${missing.slice(0, 5).join(', ')}`);
    if (extra.length) console.error(`[FAIL] ${lang}.json has ${extra.length} keys not in en.json, e.g. ${extra.slice(0, 5).join(', ')}`);
  } else console.log(`[PASS] ${lang}.json has the same ${enKeys.size} keys as en.json.`);
}

if (allPassed) {
  console.log('ALL PIPELINE VERIFICATIONS PASSED SUCCESSFULLY!');
} else {
  process.exit(1);
}
