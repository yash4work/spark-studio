import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const cursorIdx = html.indexOf('Spark Cursor');
console.log('Cursor section in raw HTML:');
console.log(html.slice(cursorIdx - 200, cursorIdx + 1500));
