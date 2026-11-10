import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');
const servIdx = html.indexOf('Framer Speed Boost');
console.log(html.slice(servIdx, servIdx + 2000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
