import fs from 'fs';

const css = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_extracted.css', 'utf8');

console.log('=== HERO CONTAINER IN CSS ===');
const heroClasses = css.match(/\.framer-1fzvrso[^{]*\{[^}]+\}/g);
if (heroClasses) heroClasses.forEach(c => console.log(c));

console.log('\n=== HERO GLOW IN CSS ===');
const glowClasses = css.match(/\.framer-1ec96fu[^{]*\{[^}]+\}|\.framer-w52f8q[^{]*\{[^}]+\}/g);
if (glowClasses) glowClasses.forEach(c => console.log(c));

console.log('\n=== STATS ROW IN CSS ===');
const statsClasses = css.match(/\.framer-vw2sx5[^{]*\{[^}]+\}/g);
if (statsClasses) statsClasses.forEach(c => console.log(c));

console.log('\n=== PRIMARY BUTTON IN CSS ===');
const btnClasses = css.match(/\.framer-s8qoej[^{]*\{[^}]+\}|\.framer-r6l4py[^{]*\{[^}]+\}/g);
if (btnClasses) btnClasses.slice(0, 5).forEach(c => console.log(c));
