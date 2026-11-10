import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const idx = html.indexOf('ayce10');
console.log('ayce10 index in raw HTML:', idx);
if (idx !== -1) {
  console.log(html.slice(idx - 200, idx + 500));
}
