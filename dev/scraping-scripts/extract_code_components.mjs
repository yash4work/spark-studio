import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const matches = [...html.matchAll(/(Spark Core|Spark Cursor|SmoothScroll|Cursor|grain|progress)/gi)];
console.log('Matches found:', matches.length);

const coreIdx = html.indexOf('Spark Core');
if (coreIdx !== -1) {
  console.log('Spark Core snippet:');
  console.log(html.slice(Math.max(0, coreIdx - 500), coreIdx + 1500));
}

const cursorIdx = html.indexOf('Spark Cursor');
if (cursorIdx !== -1) {
  console.log('Spark Cursor snippet:');
  console.log(html.slice(Math.max(0, cursorIdx - 500), cursorIdx + 1500));
}
