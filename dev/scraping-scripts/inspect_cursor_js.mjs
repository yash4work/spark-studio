import fs from 'fs';

const content = fs.readFileSync('z86wGdhP_.CDRyhv75.mjs', 'utf8');

const matches = [...content.matchAll(/cursor/gi)];
console.log('Matches for cursor in file:', matches.length);
matches.slice(0, 10).forEach(m => {
  const i = m.index;
  console.log('--- AT', i, '---');
  console.log(content.slice(Math.max(0, i - 100), i + 300));
});
