import fs from 'fs';
const html = fs.readFileSync('framer_raw.html', 'utf8');

const idx = html.indexOf('Pipeline Card');
console.log(html.slice(idx, idx + 2000));
