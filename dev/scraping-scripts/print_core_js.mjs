import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const coreStart = html.indexOf('name="Spark Core (smooth scroll, grain, progress)"');
const slice = html.slice(coreStart - 1000, coreStart + 6000);
console.log(slice);
