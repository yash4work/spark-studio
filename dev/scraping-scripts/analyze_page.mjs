import fs from 'fs';

const text = fs.readFileSync('C:/Users/Dell/sparkstudio-web/1R7EoQAgYbaep2Y71uBV_sGIdt8z_7E5gkbBe1KqTEc.D4scdYoU.mjs', 'utf8');

console.log('Searching for code component imports and animations...');
const imports = [...text.matchAll(/import\s*\{[^}]*\}\s*from\s*["']([^"']+)["']/g)];
console.log('Total imports:', imports.length);
imports.forEach(m => console.log('  ', m[1]));

const dynamicImports = [...text.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g)];
console.log('\nDynamic imports:', dynamicImports.length);
dynamicImports.forEach(m => console.log('  ', m[1]));
