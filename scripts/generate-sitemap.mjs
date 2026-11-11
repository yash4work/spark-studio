import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'https://www.thesparkstudio.digital';
const today = new Date().toISOString().split('T')[0];

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
  'how-we-achieve-90-plus-pagespeed-on-framer-sites',
  'top-framer-templates-for-real-estate-and-architecture-2026',
  'figma-to-framer-agency-migration-guide'
];

const LANGUAGES = ['', '/de', '/es', '/fr'];

const urls = [];

// 1. Homepages
LANGUAGES.forEach((lang) => {
  urls.push({
    loc: `${BASE_URL}${lang || '/'}`,
    changefreq: 'daily',
    priority: '1.0',
    lastmod: today
  });
});

// 2. Blog Hub
LANGUAGES.forEach((lang) => {
  urls.push({
    loc: `${BASE_URL}${lang}/blog`,
    changefreq: 'daily',
    priority: '0.9',
    lastmod: today
  });
});

// 3. Blog Articles
BLOG_SLUGS.forEach((slug) => {
  LANGUAGES.forEach((lang) => {
    urls.push({
      loc: `${BASE_URL}${lang}/blog/${slug}`,
      changefreq: 'weekly',
      priority: '0.85',
      lastmod: today
    });
  });
});

// 4. Template Detail Pages
TEMPLATE_SLUGS.forEach((slug) => {
  LANGUAGES.forEach((lang) => {
    urls.push({
      loc: `${BASE_URL}${lang}/templates/${slug}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: today
    });
  });
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

const publicPath = path.join(rootDir, 'public', 'sitemap.xml');
fs.writeFileSync(publicPath, sitemapXml, 'utf8');

console.log(`Generated sitemap.xml with ${urls.length} URLs at ${publicPath}`);
