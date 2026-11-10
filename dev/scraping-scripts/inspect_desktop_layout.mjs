import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

console.log('=== DESKTOP NAV LAYOUT ===');
const navMatch = html.match(/data-framer-name="Desktop"[\s\S]*?<\/header>/i) || html.match(/data-framer-name="Desktop"[\s\S]*?data-framer-name="Hero Glow"/i);
if (navMatch) {
  console.log(navMatch[0].slice(0, 1500));
}

console.log('\n=== HERO CONTAINER & ALIGNMENT ===');
const heroIdx = html.indexOf('data-framer-name="Hero"');
console.log(html.slice(heroIdx - 500, heroIdx + 2000));
