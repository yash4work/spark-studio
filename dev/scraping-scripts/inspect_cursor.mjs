import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const matches = [...html.matchAll(/cursor/gi)];
console.log('Cursor matches count:', matches.length);

const cIdx = html.indexOf('Spark Cursor');
if (cIdx !== -1) {
  console.log(html.slice(cIdx - 300, cIdx + 800));
}
