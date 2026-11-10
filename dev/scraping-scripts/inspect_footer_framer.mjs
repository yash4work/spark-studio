import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const footerIdx = html.indexOf('SPARK STUDIO');
console.log('SPARK STUDIO occurrences:', [...html.matchAll(/SPARK STUDIO/g)].length);

const lastIdx = html.lastIndexOf('SPARK STUDIO');
console.log('Footer SPARK STUDIO snippet:');
console.log(html.slice(lastIdx - 200, lastIdx + 1500));
