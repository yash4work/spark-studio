import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const idx = html.indexOf('Spark Cursor');
console.log(html.slice(idx - 300, idx + 1000));
