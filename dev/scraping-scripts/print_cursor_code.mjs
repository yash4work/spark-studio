import fs from 'fs';

const text = fs.readFileSync('C:/Users/Dell/sparkstudio-web/z86wGdhP_.CDRyhv75.mjs', 'utf8');

const matches = [...text.matchAll(/(Spark\s*Cursor|[a-zA-Z0-9_$]*Cursor[a-zA-Z0-9_$]*)/g)];
console.log('Matches:', [...new Set(matches.map(m => m[0]))]);

const idx = text.indexOf('Cursor');
console.log(text.slice(Math.max(0, idx - 300), idx + 800));
