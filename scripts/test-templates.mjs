// Checks that every template in src/data/templates.js is fully wired up
// everywhere it needs to be. Fails with a clear message naming what's missing.
import { readFileSync } from 'node:fs';
import { TEMPLATE_SLUGS } from '../src/data/templates.js';

const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const errors = [];

// 1. No duplicates
const dupes = TEMPLATE_SLUGS.filter((s, i) => TEMPLATE_SLUGS.indexOf(s) !== i);
if (dupes.length) errors.push('Duplicate slugs in src/data/templates.js: ' + dupes.join(', '));

// 2. Card on the home page grid
const grid = read('src/components/TemplatesGrid.jsx');
const gridSlugs = [...grid.matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1]);
for (const s of TEMPLATE_SLUGS) if (!gridSlugs.includes(s)) errors.push(`TemplatesGrid.jsx: no card with slug: '${s}'`);
for (const s of gridSlugs) if (!TEMPLATE_SLUGS.includes(s)) errors.push(`TemplatesGrid.jsx: card '${s}' is not in src/data/templates.js (its detail page would 404)`);

// 3. Price / demo / images for the detail page
const detail = read('src/pages/TemplateDetailPage.jsx');
for (const s of TEMPLATE_SLUGS) if (!detail.includes(`'${s}': {`)) errors.push(`TemplateDetailPage.jsx: TEMPLATE_META has no entry for '${s}'`);

// 4. Detail page text in every language
for (const lang of ['en', 'de', 'es', 'fr']) {
  const details = JSON.parse(read(`src/i18n/locales/${lang}.json`)).templateDetails || {};
  for (const s of TEMPLATE_SLUGS) if (!details[s]) errors.push(`locales/${lang}.json: templateDetails.${s} is missing`);
}

// 5. vercel.json redirects in sync
const vercel = read('vercel.json');
const group = `:slug(${TEMPLATE_SLUGS.join('|')})`;
if (!vercel.includes(`"/${group}"`) || !vercel.includes(`"/:lang(de|es|fr)/${group}"`)) {
  errors.push('vercel.json: template redirects are out of date. Run: npm run sync-templates');
}

// 6. AI discovery files (llms.txt, ai-catalog.json): every template listed, no links to pages that don't exist
for (const file of ['public/llms.txt', 'public/ai-catalog.json']) {
  const text = read(file);
  const linked = [...text.matchAll(/\/templates\/([a-z0-9-]+)/g)].map(m => m[1]);
  for (const s of linked) if (!TEMPLATE_SLUGS.includes(s)) errors.push(`${file}: links to /templates/${s}, which doesn't exist`);
  for (const s of TEMPLATE_SLUGS) if (!linked.includes(s)) errors.push(`${file}: template '${s}' is not listed`);
}

// 7. Prices quoted in blog posts / translations must match the price on the template card
//    (TemplatesGrid.jsx). "Onyx Atelier Pro" is a separate paid product on Framer and is skipped.
const cards = grid.split(/\n  \{\n/).slice(1).map(b => ({
  name: b.match(/name: ?'([^']*)'/)?.[1],
  price: b.match(/price: ?'([^']*)'/)?.[1],
})).filter(c => c.name && c.price && c.price !== 'Custom Build');
const FREE_WORDS = /^(free|gratis|gratuit|kostenlos)$/i;
const priceTexts = ['src/data/blogData.js', ...['en', 'de', 'es', 'fr'].map(l => `src/i18n/locales/${l}.json`)];
for (const file of priceTexts) {
  const text = read(file);
  for (const { name, price } of cards) {
    const n = name.replace(/&/g, '(?:&|&amp;)').replace(/[.*+?^${}()|[\]\\]/g, m => (m === '(' || m === ')' || m === '|' || m === '?' || m === ':' ? m : '\\' + m));
    const re = new RegExp(`(${n})(?! Pro)[^\\n\\\\$€]{0,45}?(\\$\\s?\\d+|\\d+\\s?€)`, 'gi');
    for (const m of text.matchAll(re)) {
      // the price belongs to a different product named in between (e.g. "SLOWGRAIN (Free) | Onyx Atelier Pro ($129)")
      const between = m[0].slice(m[1].length, -m[2].length).toLowerCase();
      if (between.includes('onyx atelier pro') || cards.some(c => c.name !== name && between.includes(c.name.toLowerCase()))) continue;
      const quoted = m[2].replace(/\s/g, '');
      const ok = FREE_WORDS.test(price) ? false : quoted.replace('€', '').replace('$', '') === price.replace('$', '');
      if (!ok) errors.push(`${file}: "${m[0].slice(0, 70)}" quotes ${quoted}, but the ${name} card says ${price}`);
    }
  }
}

if (errors.length) {
  console.error('[FAIL] Template wiring:\n  - ' + errors.join('\n  - '));
  process.exit(1);
}
console.log(`[PASS] All ${TEMPLATE_SLUGS.length} templates are wired up (grid, detail meta, 4 locales, vercel.json, llms.txt, ai-catalog.json).`);
