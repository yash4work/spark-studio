import fs from 'fs';

const text = fs.readFileSync('C:/Users/Dell/sparkstudio-web/1R7EoQAgYbaep2Y71uBV_sGIdt8z_7E5gkbBe1KqTEc.D4scdYoU.mjs', 'utf8');

const ayIdx = text.indexOf('ayce10');
console.log('ayce10 index in page JS:', ayIdx);
if (ayIdx !== -1) {
  console.log(text.slice(ayIdx - 500, ayIdx + 1000));
}

const iuIdx = text.indexOf('iuc1yh');
console.log('iuc1yh index in page JS:', iuIdx);
if (iuIdx !== -1) {
  console.log(text.slice(iuIdx - 500, iuIdx + 1000));
}
