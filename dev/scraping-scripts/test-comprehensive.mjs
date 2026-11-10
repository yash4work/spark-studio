import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';

const baseDir = 'C:/Users/Dell/sparkstudio-web';
let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    totalPassed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    totalFailed++;
  }
}

console.log('================================================================');
console.log('SPARK STUDIO COMPREHENSIVE VERIFICATION SUITE');
console.log('================================================================\n');

// 1. Structure & Essential Files Verification
console.log('1. Checking Core Architecture & Deployment Files...');
const requiredFiles = [
  'index.html',
  'package.json',
  'vite.config.js',
  'public/robots.txt',
  'public/sitemap.xml',
  'public/favicon.png',
  'public/logo.png',
  'supabase/schema.sql',
  'src/App.jsx',
  'src/main.jsx',
  'src/index.css',
  'src/i18n/index.js',
  'src/i18n/locales/en.json',
  'src/i18n/locales/de.json',
  'src/i18n/locales/es.json',
  'src/i18n/locales/fr.json',
  'src/lib/supabase.js',
  'src/lib/lemonsqueezy.js',
  'src/components/Navbar.jsx',
  'src/components/Footer.jsx',
  'src/components/SEOHead.jsx',
  'src/components/Hero.jsx',
  'src/components/Standards.jsx',
  'src/components/TemplatesGrid.jsx',
  'src/components/Services.jsx',
  'src/components/BundlesSection.jsx',
  'src/components/AboutSection.jsx',
  'src/components/FAQSection.jsx',
  'src/components/ContactSection.jsx',
  'src/pages/HomePage.jsx',
  'src/pages/TemplateDetailPage.jsx'
];

for (const f of requiredFiles) {
  assert(fs.existsSync(path.join(baseDir, f)), `File exists: ${f}`);
}

// 2. Multi-language i18n Dictionary Checks (4 Languages)
console.log('\n2. Checking Multi-Language Locale Dictionaries (en, de, es, fr)...');
const langs = ['en', 'de', 'es', 'fr'];
const templateSlugs = [
  'mavric-estate',
  'aurelle-estates',
  'onyx-atelier',
  'vellum-edition',
  'halden-edition',
  'grain-form',
  'slowgrain'
];

for (const lang of langs) {
  const p = path.join(baseDir, `src/i18n/locales/${lang}.json`);
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'));

  assert(data.nav?.projects && data.nav?.cta, `[${lang}] Nav dictionary complete`);
  assert(data.hero?.title && data.hero?.exploreCta, `[${lang}] Hero dictionary complete`);
  assert(data.standards?.title && data.standards?.cards?.length === 3, `[${lang}] Standards dictionary complete`);
  assert(data.services?.items?.length === 4, `[${lang}] Services items = 4`);
  assert(data.faq?.items?.length === 4, `[${lang}] FAQ items = 4`);
  assert(data.contact?.formName && data.contact?.submitBtn, `[${lang}] Contact form fields complete`);

  // Check all 7 templates
  for (const slug of templateSlugs) {
    const detail = data.templateDetails?.[slug];
    assert(
      detail && detail.name && detail.headline && detail.features?.length > 0 && detail.included?.length > 0,
      `[${lang}] Template detail complete: ${slug}`
    );
  }
}

// 3. Direct Channels Verification (Requirement 4)
console.log('\n3. Verifying Direct Channels (Email, LinkedIn, Teams, Slack)...');
const contactSectionCode = fs.readFileSync(path.join(baseDir, 'src/components/ContactSection.jsx'), 'utf-8');
const footerCode = fs.readFileSync(path.join(baseDir, 'src/components/Footer.jsx'), 'utf-8');

assert(contactSectionCode.includes('sparkstudio0@outlook.com'), 'ContactSection has direct email');
assert(contactSectionCode.includes('https://www.linkedin.com/company/sparkstudio0'), 'ContactSection has LinkedIn');
assert(contactSectionCode.includes('https://teams.microsoft.com/l/chat'), 'ContactSection has Microsoft Teams');
assert(contactSectionCode.includes('https://sparkstudio0.slack.com'), 'ContactSection has Slack');

assert(footerCode.includes('sparkstudio0@outlook.com'), 'Footer has direct email');
assert(footerCode.includes('https://www.linkedin.com/company/sparkstudio0'), 'Footer has LinkedIn');
assert(footerCode.includes('https://teams.microsoft.com/l/chat'), 'Footer has Microsoft Teams');
assert(footerCode.includes('https://sparkstudio0.slack.com'), 'Footer has Slack');

// 4. LemonSqueezy Checkout Class & Overlay Integration
console.log('\n4. Verifying LemonSqueezy Checkout Integration...');
const templateDetailCode = fs.readFileSync(path.join(baseDir, 'src/pages/TemplateDetailPage.jsx'), 'utf-8');
const bundlesCode = fs.readFileSync(path.join(baseDir, 'src/components/BundlesSection.jsx'), 'utf-8');
const templatesGridCode = fs.readFileSync(path.join(baseDir, 'src/components/TemplatesGrid.jsx'), 'utf-8');

assert(templateDetailCode.includes('lemonsqueezy-button'), 'TemplateDetailPage has lemonsqueezy-button class');
assert(bundlesCode.includes('lemonsqueezy-button'), 'BundlesSection has lemonsqueezy-button class');
assert(templatesGridCode.includes('lemonsqueezy-button'), 'TemplatesGrid has lemonsqueezy-button class');
assert(templateDetailCode.includes('handleLemonCheckout'), 'TemplateDetailPage uses handleLemonCheckout');

// 5. SEO / AEO Structured Data Verification
console.log('\n5. Verifying SEO & AEO Structured Data...');
const indexHtml = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf-8');
const seoHeadCode = fs.readFileSync(path.join(baseDir, 'src/components/SEOHead.jsx'), 'utf-8');
const homePageCode = fs.readFileSync(path.join(baseDir, 'src/pages/HomePage.jsx'), 'utf-8');

assert(indexHtml.includes('"@type": "Organization"'), 'index.html contains Organization schema');
assert(indexHtml.includes('"@type": "WebSite"'), 'index.html contains WebSite schema');
assert(indexHtml.includes('"@type": "ProfessionalService"'), 'index.html contains ProfessionalService schema');
assert(homePageCode.includes('@type\': \'ItemList\'') || homePageCode.includes('"@type": "ItemList"'), 'HomePage contains ItemList catalog schema');
assert(homePageCode.includes('@type\': \'FAQPage\'') || homePageCode.includes('"@type": "FAQPage"'), 'HomePage contains FAQPage schema');
assert(templateDetailCode.includes('\'@type\': \'Product\''), 'TemplateDetailPage contains Product schema');
assert(seoHeadCode.includes('link[rel="alternate"][hreflang='), 'SEOHead dynamically upserts hreflang alternate tags');

// 6. Supabase Client & Storage Helpers Verification
console.log('\n6. Verifying Supabase Storage & Client Integration...');
const supabaseCode = fs.readFileSync(path.join(baseDir, 'src/lib/supabase.js'), 'utf-8');
const schemaSql = fs.readFileSync(path.join(baseDir, 'supabase/schema.sql'), 'utf-8');

assert(supabaseCode.includes('uploadToStorage'), 'supabase.js exports uploadToStorage');
assert(supabaseCode.includes('getStoragePublicUrl'), 'supabase.js exports getStoragePublicUrl');
assert(supabaseCode.includes('getTemplateStorageUrl'), 'supabase.js exports getTemplateStorageUrl');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.inquiries'), 'schema.sql defines inquiries table');
assert(schemaSql.includes('sparkstudio-templates'), 'schema.sql defines sparkstudio-templates bucket');

// 7. Route Accessibility Verification via Vite Preview Server
console.log('\n7. Running HTTP Route Verification against Production Build...');

const routesToTest = [
  '/',
  '/de',
  '/es',
  '/fr',
  '/templates/mavric-estate',
  '/templates/aurelle-estates',
  '/templates/onyx-atelier',
  '/templates/vellum-edition',
  '/templates/halden-edition',
  '/templates/grain-form',
  '/templates/slowgrain',
  '/mavric-estate',
  '/de/mavric-estate',
  '/aurelle-estates',
  '/es/aurelle-estates',
  '/slowgrain',
  '/fr/slowgrain',
  '/de/templates/mavric-estate',
  '/es/templates/aurelle-estates',
  '/fr/templates/onyx-atelier',
  '/robots.txt',
  '/sitemap.xml'
];

async function testServer() {
  const server = spawn('npx', ['vite', 'preview', '--port', '4174'], {
    cwd: baseDir,
    shell: true
  });

  await new Promise(r => setTimeout(r, 2000));

  for (const route of routesToTest) {
    const url = `http://localhost:4174${route}`;
    try {
      const res = await fetch(url);
      const text = await res.text();
      assert(res.status === 200 && text.length > 50, `Route reachable: ${route} (200 OK, length: ${text.length})`);
    } catch (e) {
      assert(false, `Route error: ${route} (${e.message})`);
    }
  }

  server.kill();

  console.log('\n================================================================');
  console.log(`FINAL RESULTS: ${totalPassed} Passed, ${totalFailed} Failed.`);
  console.log('================================================================');

  process.exit(totalFailed > 0 ? 1 : 0);
}

testServer();
