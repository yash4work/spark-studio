import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const matches = [...html.matchAll(/class="[^"]*cursor[^"]*"/gi)];
console.log('Cursor class matches:', matches.length);
matches.forEach(m => console.log(m[0]));

// Search for any SVG in framer_raw.html that looks like a custom cursor or pointer
const svgs = [...html.matchAll(/<svg[^>]*>([\s\S]*?)<\/svg>/gi)];
console.log('Total SVGs in HTML:', svgs.length);
svgs.forEach((s, i) => {
  if (s[0].includes('cursor') || s[0].includes('pointer') || s[0].includes('arrow') || s[0].length < 600) {
    console.log(`SVG ${i + 1}: ${s[0].slice(0, 150)}...`);
  }
});
