import fs from 'fs';
const css = fs.readFileSync('framer_extracted.css', 'utf8');

function find(name) {
  const reg = new RegExp(`\\.${name}[\\s\\{][^\\}]+`, 'g');
  console.log(`CSS for .${name}:`, css.match(reg));
}

find('framer-euz5iv');
find('framer-iuqg8e-container');
find('framer-1ec96fu');
find('framer-w52f8q');
