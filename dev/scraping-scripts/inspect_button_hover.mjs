import fs from 'fs';

const css = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_extracted.css', 'utf8');

const hoverMatches = [...css.matchAll(/[^{}]*button[^{}]*:hover[^{}]*\{[^}]+\}|[^{}]*Primary[^{}]*:hover[^{}]*\{[^}]+\}|[^{}]*s8qoej[^{}]*:hover[^{}]*\{[^}]+\}|[^{}]*req8vh[^{}]*:hover[^{}]*\{[^}]+\}/gi)];
console.log('Button hover matches:', hoverMatches.length);
hoverMatches.forEach(m => console.log(m[0]));

const ctaContainer = css.match(/\.framer-[a-zA-Z0-9]+[^{]*\{[^}]*CTAButtons[^}]*\}/g);
console.log('CTA Container:', ctaContainer);
