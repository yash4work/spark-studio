import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

console.log('=== HERO HTML & BACKGROUND ===');
const heroIdx = html.indexOf('data-framer-name="Hero"');
console.log(html.slice(Math.max(0, heroIdx - 200), heroIdx + 1200));

console.log('\n=== HERO GLOW / SHADER ===');
const glowIdx = html.indexOf('data-framer-name="Hero Glow"');
if (glowIdx !== -1) {
  console.log(html.slice(glowIdx, glowIdx + 1000));
}

const shaderIdx = html.indexOf('Hero Shader');
if (shaderIdx !== -1) {
  console.log(html.slice(shaderIdx - 100, shaderIdx + 1000));
}

console.log('\n=== BUTTON HOVER & STYLES ===');
const ctaIdx = html.indexOf('data-framer-name="CTAButtons"');
if (ctaIdx !== -1) {
  console.log(html.slice(ctaIdx, ctaIdx + 1200));
}
