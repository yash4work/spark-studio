import fs from 'fs';

const text = fs.readFileSync('C:/Users/Dell/sparkstudio-web/z86wGdhP_.CDRyhv75.mjs', 'utf8');

const shaderIdx = text.indexOf('Liquid Gradient');
console.log('Shader definition:');
console.log(text.slice(shaderIdx - 50, shaderIdx + 3000));
