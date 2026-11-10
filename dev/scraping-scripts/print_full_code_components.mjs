import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const coreStart = html.indexOf('name="Spark Core (smooth scroll, grain, progress)"');
if (coreStart !== -1) {
  console.log('=== SPARK CORE FULL COMPONENT ===');
  console.log(html.slice(coreStart, coreStart + 4000));
}

const cursorStart = html.indexOf('name="Spark Cursor"');
if (cursorStart !== -1) {
  console.log('\n=== SPARK CURSOR FULL COMPONENT ===');
  console.log(html.slice(cursorStart, cursorStart + 3000));
}
