import fs from 'fs';
const html = fs.readFileSync('framer_raw.html', 'utf8');

const idx = html.indexOf('data-framer-appear-id="o3c5dm"');
console.log(html.slice(idx, idx + 1000));
