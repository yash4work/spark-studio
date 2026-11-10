import fs from 'fs';

const text = fs.readFileSync('C:/Users/Dell/sparkstudio-web/1R7EoQAgYbaep2Y71uBV_sGIdt8z_7E5gkbBe1KqTEc.D4scdYoU.mjs', 'utf8');

const heroGlowIdx = text.indexOf('Hero Shader');
console.log('Hero Shader in page code:');
console.log(text.slice(Math.max(0, heroGlowIdx - 200), heroGlowIdx + 1500));
