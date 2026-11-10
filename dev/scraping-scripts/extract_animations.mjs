import fs from 'fs';

const text = fs.readFileSync('C:/Users/Dell/sparkstudio-web/1R7EoQAgYbaep2Y71uBV_sGIdt8z_7E5gkbBe1KqTEc.D4scdYoU.mjs', 'utf8');

// Find transition definitions
const transitions = [...text.matchAll(/transition:\s*\{[^}]+\}/g)];
console.log('Transitions found:', transitions.length);
transitions.slice(0, 10).forEach((t, i) => console.log(`Transition ${i + 1}: ${t[0]}`));

// Find animate / variants
const variants = [...text.matchAll(/variants:\s*\{[^}]+\}/g)];
console.log('\nVariants found:', variants.length);
variants.slice(0, 10).forEach((v, i) => console.log(`Variant ${i + 1}: ${v[0]}`));

// Find cubic-bezier
const easings = [...text.matchAll(/cubic-bezier\([^\)]+\)/g)];
console.log('\nCubic beziers:', [...new Set(easings.map(e => e[0]))]);
