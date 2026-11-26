// Rewrites the template short-URL redirects in vercel.json from src/data/templates.js.
// Runs automatically at the start of `npm run build`; can also be run alone:
//   npm run sync-templates
import { readFileSync, writeFileSync } from 'node:fs';
import { TEMPLATE_SLUGS } from '../src/data/templates.js';

const file = new URL('../vercel.json', import.meta.url);
const original = readFileSync(file, 'utf8');
const config = JSON.parse(original);
const group = `:slug(${TEMPLATE_SLUGS.join('|')})`;

let found = 0;
for (const rule of config.redirects) {
  if (rule.destination === '/templates/:slug') { rule.source = `/${group}`; found++; }
  if (rule.destination === '/:lang/templates/:slug') { rule.source = `/:lang(de|es|fr)/${group}`; found++; }
}
if (found !== 2) throw new Error('vercel.json: expected 2 template redirect rules, found ' + found);

const updated = JSON.stringify(config, null, 2) + '\n';
if (updated !== original) {
  writeFileSync(file, updated);
  console.log(`vercel.json: template redirects updated (${TEMPLATE_SLUGS.length} templates).`);
} else {
  console.log('vercel.json: template redirects already up to date.');
}
