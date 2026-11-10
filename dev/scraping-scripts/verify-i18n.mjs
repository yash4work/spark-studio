import fs from 'fs';
import path from 'path';

const localesDir = 'C:/Users/Dell/sparkstudio-web/src/i18n/locales';
const langs = ['en', 'de', 'es', 'fr'];
const templates = [
  'mavric-estate',
  'aurelle-estates',
  'onyx-atelier',
  'vellum-edition',
  'halden-edition',
  'grain-form',
  'slowgrain'
];

let totalChecks = 0;
let errors = [];

for (const lang of langs) {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing locale file: ${filePath}`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  // Check nav
  totalChecks++;
  if (!data.nav?.projects || !data.nav?.cta) {
    errors.push(`[${lang}] Incomplete nav translation`);
  }

  // Check hero
  totalChecks++;
  if (!data.hero?.title || !data.hero?.description) {
    errors.push(`[${lang}] Incomplete hero translation`);
  }

  // Check all 7 templates in templateDetails
  for (const t of templates) {
    totalChecks++;
    const tDetail = data.templateDetails?.[t];
    if (!tDetail) {
      errors.push(`[${lang}] Missing templateDetails for ${t}`);
      continue;
    }
    if (!tDetail.name || !tDetail.headline || !tDetail.features?.length) {
      errors.push(`[${lang}] Incomplete details for template ${t}`);
    }
  }

  // Check FAQ
  totalChecks++;
  if (!data.faq?.items || data.faq.items.length !== 4) {
    errors.push(`[${lang}] FAQ items count is not 4`);
  }

  // Check services
  totalChecks++;
  if (!data.services?.items || data.services.items.length !== 4) {
    errors.push(`[${lang}] Services items count is not 4`);
  }
}

console.log(`Executed ${totalChecks} structural translation checks across 4 languages.`);
if (errors.length > 0) {
  console.error("Errors found:", errors);
  process.exit(1);
} else {
  console.log("All structural checks passed cleanly with 100% integrity!");
}
