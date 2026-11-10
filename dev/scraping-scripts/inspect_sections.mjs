import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const cardMatches = [...html.matchAll(/data-framer-name=["']Template Card["'][\s\S]*?(?=data-framer-name=["']Template Card["']|data-framer-name=["']Pipeline Card["']|$)/gi)];

cardMatches.forEach((card, i) => {
  const text = card[0];
  const titleMatch = text.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Unknown';
  const imgMatch = text.match(/src=["'](https:\/\/framerusercontent\.com\/images\/[^"']+)["']/i);
  console.log(`Card ${i + 1}: ${title} -> ${imgMatch ? imgMatch[1] : 'No image'}`);
});
