import fs from 'fs';
import path from 'path';

const url = 'https://framerusercontent.com/images/aQ41xYmrR56VwXjqMPWOS7KsZ0.svg';
const dest = path.join('public', 'assets', 'facet-pattern.svg');

const res = await fetch(url);
const text = await res.text();
fs.writeFileSync(dest, text);
console.log('Saved facet pattern SVG:', text.length, 'bytes');
