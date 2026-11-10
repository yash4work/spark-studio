import fs from 'fs';

const baseUrl = 'https://framerusercontent.com/sites/3mt3DIlb4CNZxsYRjEpd6R/';
const files = [
  'augiA20Il.CWubzj-k.mjs'
];

async function run() {
  for (const f of files) {
    const res = await fetch(baseUrl + f);
    const text = await res.text();
    fs.writeFileSync(`C:/Users/Dell/sparkstudio-web/${f}`, text);
    console.log(`Fetched ${f}, size: ${text.length}`);
  }
}

run();
