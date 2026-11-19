import fs from 'fs';

const files = [
  'dist/onyx-atelier.html',
  'dist/de/onyx-atelier.html',
  'dist/templates/onyx-atelier.html',
  'dist/de/templates/onyx-atelier.html',
  'dist/404.html'
];

for (const file of files) {
  const exists = fs.existsSync(file);
  console.log(`File: ${file} (exists: ${exists})`);
  if (exists) {
    const content = fs.readFileSync(file, 'utf8');
    const title = content.match(/<title>([^<]+)<\/title>/)?.[1];
    const canonical = content.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const ogTitle = content.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
    const ogUrl = content.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
    console.log(`  Title:     ${title}`);
    console.log(`  Canonical: ${canonical}`);
    console.log(`  og:title:  ${ogTitle}`);
    console.log(`  og:url:    ${ogUrl}`);
  }
}
