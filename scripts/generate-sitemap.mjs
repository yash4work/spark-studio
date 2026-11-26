import { localizedArticleSlugs } from '../src/data/localizedArticles.js';
import { TEMPLATE_SLUGS } from '../src/data/templates.js';
import { BLOG_POSTS } from '../src/data/blogData.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'https://www.thesparkstudio.digital';


// English-only posts (localized ones get their own entries below). Comes straight from
// src/data/blogData.js, so new posts are added to the sitemap automatically.
const BLOG_SLUGS = BLOG_POSTS.map(p => p.slug).filter(slug => !localizedArticleSlugs.includes(slug));

// <lastmod> = date of the last real change (Google & AI crawlers use it for freshness).
const day = d => new Date(d).toISOString().slice(0, 10);
const newestMtime = paths => day(Math.max(...paths.flatMap(p => {
  const full = path.join(rootDir, p);
  return fs.statSync(full).isDirectory()
    ? fs.readdirSync(full).map(f => fs.statSync(path.join(full, f)).mtimeMs)
    : [fs.statSync(full).mtimeMs];
})));
const postDate = slug => {
  const post = BLOG_POSTS.find(p => p.slug === slug);
  return post?.modifiedDate || post?.isoDate;
};
const LASTMOD = {
  home: newestMtime(['src/pages/HomePage.jsx', 'src/components', 'src/i18n/locales']),
  blogHub: BLOG_POSTS.map(p => p.modifiedDate || p.isoDate).filter(Boolean).sort().at(-1),
  templates: newestMtime(['src/pages/TemplateDetailPage.jsx', 'src/data/templates.js', 'src/i18n/locales']),
};
const lastmod = date => (date ? `
    <lastmod>${date}</lastmod>` : '');

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
    <loc>${loc}</loc>${lastmod(LASTMOD.home)}
${alternates}
    <image:image>
      <image:loc>${BASE_URL}/assets/spark-studio-og-image.jpg</image:loc>
      <image:title>The Spark Studio</image:title>
    </image:image>
  </url>`);
});

// 2. Blog Hub (/blog, /de/blog, /es/blog, /fr/blog)
LANGUAGES.forEach(active => {
  const loc = `${BASE_URL}${active.prefix}/blog`;
  const alternates = getAlternates(prefix => `${prefix}/blog`);
  entries.push(`  <url>
    <loc>${loc}</loc>${lastmod(LASTMOD.blogHub)}
${alternates}
    <image:image>
      <image:loc>${BASE_URL}/assets/spark-studio-og-image.jpg</image:loc>
      <image:title>The Spark Studio Blog &amp; Insights</image:title>
    </image:image>
  </url>`);
});

// 3. Blog Articles
BLOG_SLUGS.forEach(slug => {
  entries.push(`  <url><loc>${BASE_URL}/blog/${slug}</loc>${lastmod(postDate(slug))}
  </url>`);
});

for (const slug of localizedArticleSlugs) {
  const route = prefix => prefix + '/blog/' + slug;
  for (const lang of LANGUAGES) {
    entries.push(`  <url><loc>${BASE_URL}${route(lang.prefix)}</loc>${lastmod(postDate(slug))}
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
    <loc>${loc}</loc>${lastmod(LASTMOD.templates)}
${alternates}
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
