import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const slugs = [
  'mavric-estate',
  'aurelle-estates',
  'onyx-atelier',
  'vellum-edition',
  'halden-edition',
  'grain-form',
  'slowgrain'
];

slugs.forEach(slug => {
  const idx = html.indexOf(slug);
  if (idx !== -1) {
    const surrounding = html.slice(Math.max(0, idx - 1000), idx + 2000);
    const hrefs = [...surrounding.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    console.log(`\nSlug: ${slug}`);
    console.log('Hrefs:', hrefs);
  }
});
