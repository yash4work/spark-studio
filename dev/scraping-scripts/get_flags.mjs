import fs from 'fs';

const html = fs.readFileSync('framer_raw.html', 'utf8');

const regex = /data-framer-name="Flag (EN|DE|ES|FR)"[\s\S]*?src="([^"]+)"/g;
const matches = [...html.matchAll(regex)];

const flags = {};
for (const m of matches) {
  if (!flags[m[1]]) {
    flags[m[1]] = m[2];
  }
}

console.log('Flags found:', flags);
