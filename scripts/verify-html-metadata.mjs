import fs from 'fs';
import path from 'path';

const routes = [
  // English
  { route: '/', file: 'dist/index.html', lang: 'en', type: 'home' },
  { route: '/blog', file: 'dist/blog.html', lang: 'en', type: 'blog-index' },
  { route: '/blog/onyx-atelier-framer-architecture-template-review', file: 'dist/blog/onyx-atelier-framer-architecture-template-review.html', lang: 'en', type: 'blog-post' },
  { route: '/templates/onyx-atelier', file: 'dist/templates/onyx-atelier.html', lang: 'en', type: 'template-detail' },
  { route: '/onyx-atelier', file: 'dist/onyx-atelier.html', lang: 'en', type: 'alias' },

  // German
  { route: '/de', file: 'dist/de.html', lang: 'de', type: 'home' },
  { route: '/de/blog', file: 'dist/de/blog.html', lang: 'de', type: 'blog-index' },
  { route: '/de/blog/onyx-atelier-framer-architecture-template-review', file: 'dist/de/blog/onyx-atelier-framer-architecture-template-review.html', lang: 'de', type: 'blog-post' },
  { route: '/de/templates/onyx-atelier', file: 'dist/de/templates/onyx-atelier.html', lang: 'de', type: 'template-detail' },
  { route: '/de/onyx-atelier', file: 'dist/de/onyx-atelier.html', lang: 'de', type: 'alias' },

  // Spanish
  { route: '/es', file: 'dist/es.html', lang: 'es', type: 'home' },
  { route: '/es/blog', file: 'dist/es/blog.html', lang: 'es', type: 'blog-index' },
  { route: '/es/blog/onyx-atelier-framer-architecture-template-review', file: 'dist/es/blog/onyx-atelier-framer-architecture-template-review.html', lang: 'es', type: 'blog-post' },
  { route: '/es/templates/onyx-atelier', file: 'dist/es/templates/onyx-atelier.html', lang: 'es', type: 'template-detail' },
  { route: '/es/onyx-atelier', file: 'dist/es/onyx-atelier.html', lang: 'es', type: 'alias' },

  // French
  { route: '/fr', file: 'dist/fr.html', lang: 'fr', type: 'home' },
  { route: '/fr/blog', file: 'dist/fr/blog.html', lang: 'fr', type: 'blog-index' },
  { route: '/fr/blog/onyx-atelier-framer-architecture-template-review', file: 'dist/fr/blog/onyx-atelier-framer-architecture-template-review.html', lang: 'fr', type: 'blog-post' },
  { route: '/fr/templates/onyx-atelier', file: 'dist/fr/templates/onyx-atelier.html', lang: 'fr', type: 'template-detail' },
  { route: '/fr/onyx-atelier', file: 'dist/fr/onyx-atelier.html', lang: 'fr', type: 'alias' },
];

console.log('=== RAW HTML PRE-RENDER METADATA AUDIT ===\n');

for (const item of routes) {
  if (!fs.existsSync(item.file)) {
    console.error(`[FAIL] File missing: ${item.file}`);
    continue;
  }
  const html = fs.readFileSync(item.file, 'utf8');

  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const hreflangs = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(m => `${m[1]}->${m[2]}`);
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
  const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1];
  const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  const twitterTitle = html.match(/<meta (?:name|property)="twitter:title" content="([^"]+)"/)?.[1];

  console.log(`Route: ${item.route} (${item.lang.toUpperCase()} - ${item.type})`);
  console.log(`  File:        ${item.file}`);
  console.log(`  Title:       ${title}`);
  console.log(`  Canonical:   ${canonical}`);
  console.log(`  og:title:    ${ogTitle}`);
  console.log(`  og:url:      ${ogUrl}`);
  console.log(`  Hreflang count: ${hreflangs.length}`);
  console.log(`  Hreflang sample: ${hreflangs.slice(0, 3).join(' | ')}`);
  console.log('');
}
