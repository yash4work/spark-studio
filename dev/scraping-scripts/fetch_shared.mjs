import fs from 'fs';

const baseUrl = 'https://framerusercontent.com/sites/3mt3DIlb4CNZxsYRjEpd6R/';
const files = [
  'z86wGdhP_.CDRyhv75.mjs',
  'shared-lib.elm1Rkhb.mjs'
];

async function run() {
  for (const f of files) {
    try {
      const res = await fetch(baseUrl + f);
      const text = await res.text();
      fs.writeFileSync(`C:/Users/Dell/sparkstudio-web/${f}`, text);
      console.log(`Fetched ${f}, size: ${text.length}`);
    } catch (e) {
      console.error(e.message);
    }
  }
}

run();
