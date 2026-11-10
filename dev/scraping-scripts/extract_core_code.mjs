import fs from 'fs';

const text = fs.readFileSync('C:/Users/Dell/sparkstudio-web/1R7EoQAgYbaep2Y71uBV_sGIdt8z_7E5gkbBe1KqTEc.D4scdYoU.mjs', 'utf8');

const coreIdx = text.indexOf('Spark Core');
if (coreIdx !== -1) {
  console.log('Spark Core code snippet:');
  console.log(text.slice(Math.max(0, coreIdx - 1000), coreIdx + 2000));
}

const cursorIdx = text.indexOf('Spark Cursor');
if (cursorIdx !== -1) {
  console.log('\nSpark Cursor code snippet:');
  console.log(text.slice(Math.max(0, cursorIdx - 1000), cursorIdx + 2000));
}
