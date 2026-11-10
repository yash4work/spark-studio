import fs from 'fs';
const html = fs.readFileSync('framer_raw.html', 'utf8');

const matches = [...html.matchAll(/data-framer-name="Primary"[^>]*>/gi)];
console.log('Primary buttons:');
matches.forEach(m => console.log(m[0]));
