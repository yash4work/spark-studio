import fs from 'fs';

// Let's see all the modules loaded in framer_raw.html
const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const modules = [...html.matchAll(/href=["'](https:\/\/framerusercontent\.com\/sites\/[^"']+)["']/gi)].map(m => m[1]);
console.log('Framer modules:', modules);

// Check CSS links
const cssLinks = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)].map(m => m[0]);
console.log('CSS links:', cssLinks);
