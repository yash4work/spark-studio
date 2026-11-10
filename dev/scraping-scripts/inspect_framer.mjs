import fs from 'fs';
const html = fs.readFileSync('framer_raw.html', 'utf8');

const idx = html.indexOf(`Pick Any 3 Starter Pack`);
console.log(html.slice(Math.max(0, idx - 1500), idx));
