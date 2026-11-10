import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const scriptMatches = [...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/gi)];
console.log('Script sources count:', scriptMatches.length);
scriptMatches.forEach((s, i) => console.log(`${i + 1}: ${s[1]}`));

const moduleMatches = [...html.matchAll(/https:\/\/framerusercontent\.com\/modules\/[a-zA-Z0-9_-]+/g)];
console.log('\nUnique Framer modules count:', new Set(moduleMatches.map(m => m[0])).size);
[...new Set(moduleMatches.map(m => m[0]))].forEach(m => console.log(m));
