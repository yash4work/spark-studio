import fs from 'fs';
const css = fs.readFileSync('framer_extracted.css', 'utf8');

const reg = /\.framer-1d7hknm[^{]*\{[^}]+/g;
console.log('framer-1d7hknm:', css.match(reg));

const listReg = /\.framer-1366xpa[^{]*\{[^}]+/g;
console.log('framer-1366xpa:', css.match(listReg));

const matches = css.match(/grid-template-columns:repeat\(2[^{}]+\}/g);
console.log('grid-cols-2 matches:', matches?.slice(0, 5));
