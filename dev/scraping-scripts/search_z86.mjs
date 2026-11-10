import fs from 'fs';

const text = fs.readFileSync('C:/Users/Dell/sparkstudio-web/z86wGdhP_.CDRyhv75.mjs', 'utf8');

console.log('Shader in z86wGdhP:', text.includes('Shader'));
console.log('Cursor in z86wGdhP:', text.includes('Cursor') || text.includes('cursor'));

const shaderIdx = text.indexOf('Shader');
if (shaderIdx !== -1) {
  console.log('Shader snippet:');
  console.log(text.slice(Math.max(0, shaderIdx - 200), shaderIdx + 600));
}

const cursorIdx = text.indexOf('Cursor');
if (cursorIdx !== -1) {
  console.log('Cursor snippet:');
  console.log(text.slice(Math.max(0, cursorIdx - 200), cursorIdx + 600));
}
