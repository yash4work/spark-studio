import fs from 'fs';

const css = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_extracted.css', 'utf8');

// Find all CSS custom properties (--token-, --framer-, etc.)
const vars = [...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m => ({ name: m[1], val: m[2].trim() }));
console.log('Total CSS variables found:', vars.length);

// Sample interesting color variables
const colorVars = vars.filter(v => v.val.startsWith('#') || v.val.startsWith('rgb') || v.val.startsWith('hsl'));
console.log('Unique color values:', [...new Set(colorVars.map(v => v.val))].slice(0, 30));

// Find Google font imports or font-face definitions
const fontFaces = [...css.matchAll(/@font-face\s*\{([^}]+)\}/g)].map(m => m[1]);
console.log('Font faces count:', fontFaces.length);
fontFaces.slice(0, 5).forEach((f, i) => console.log(`Font face ${i}:`, f.replace(/\s+/g, ' ')));
