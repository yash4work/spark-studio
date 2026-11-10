import fs from 'fs';
const html = fs.readFileSync('framer_raw.html', 'utf8');

const idx = html.indexOf('Save up to 68% with curated template bundles');
console.log(html.slice(idx + 7500, idx + 14000));
