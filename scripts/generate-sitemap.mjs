import { localizedArticleSlugs } from '../src/data/localizedArticles.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'https://www.thesparkstudio.digital';

const TEMPLATE_SLUGS = [
  'ai-saas',
  'luxury-restaurant',
  'premium-healthcare',
  'mavric-estate',
  'aurelle-estates',
  'onyx-atelier',
  'vellum-edition',
  'halden-edition',
  'grain-form',
  'slowgrain',
  'terra',
  'sasso-architect',
  'tessovra'
];

const BLOG_SLUGS = [
  'best-luxury-real-estate-framer-templates-for-brokers',
  'top-10-framer-templates-for-architects-and-design-studios-2026',
  'onyx-atelier-framer-architecture-template-review',
  'slowgrain-solum-framer-architecture-template-free-review',
  'sasso-architect-framer-template-review',
  'aurelle-estates-framer-architecture-template-review',
  'vellum-edition-framer-architecture-template-review',
  'how-we-achieve-90-plus-pagespeed-on-framer-sites',
  'top-framer-templates-for-real-estate-and-architecture-2026',
  'figma-to-framer-agency-migration-guide'
];

const LANGUAGES = [
  { code: 'en', prefix: '' },
  { code: 'de', prefix: '/de' },
  { code: 'es', prefix: '/es' },
  { code: 'fr', prefix: '/fr' }
];

// Helper to generate alternate hreflang links
function getAlternates(getPath) {
  const links = LANGUAGES.map(lang => {
    const full = `${BASE_URL}${getPath(lang.prefix)}`;
    return `    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${full}" />`;
  });
  const xDefault = `${BASE_URL}${getPath('')}`;
  links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefault}" />`);
  return links.join('\n');
}

const entries = [];

// 1. Homepages (/, /de, /es, /fr)
LANGUAGES.forEach(active => {
  const loc = `${BASE_URL}${active.prefix || '/'}`;
  const alternates = getAlternates(prefix => prefix || '/');
  entries.push(`  <url>
    <loc>${loc}</loc>
${alternates}
    <image:image>
      <image:loc>${BASE_URL}/assets/spark-studio-og-image.jpg</image:loc>
      <image:title>The Spark Studio</image:title>
    </image:image>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);
});

// 2. Blog Hub (/blog, /de/blog, /es/blog, /fr/blog)
LANGUAGES.forEach(active => {
  const loc = `${BASE_URL}${active.prefix}/blog`;
  const alternates = getAlternates(prefix => `${prefix}/blog`);
  entries.push(`  <url>
    <loc>${loc}</loc>
${alternates}
    <image:image>
      <image:loc>${BASE_URL}/assets/spark-studio-og-image.jpg</image:loc>
      <image:title>The Spark Studio Blog &amp; Insights</image:title>
    </image:image>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);
});

// 3. Blog Articles
BLOG_SLUGS.forEach(slug => {
  entries.push(`  <url><loc>${BASE_URL}/blog/${slug}</loc></url>`);
});

for (const slug of localizedArticleSlugs) {
  const route = prefix => prefix + '/blog/' + slug;
  for (const lang of LANGUAGES) {
    entries.push(`  <url><loc>${BASE_URL}${route(lang.prefix)}</loc>
${getAlternates(route)}
  </url>`);
  }
}

// 4. Template Detail Pages
TEMPLATE_SLUGS.forEach(slug => {
  LANGUAGES.forEach(active => {
    const loc = `${BASE_URL}${active.prefix}/templates/${slug}`;
    const alternates = getAlternates(prefix => `${prefix}/templates/${slug}`);
    entries.push(`  <url>
    <loc>${loc}</loc>
${alternates}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`;

const publicPath = path.join(rootDir, 'public', 'sitemap.xml');
fs.writeFileSync(publicPath, sitemapXml, 'utf8');

console.log(`Generated multilingual sitemap with ${entries.length} URLs and complete hreflang cross-linking at ${publicPath}`);
