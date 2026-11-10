import fs from 'fs';

const baseUrl = 'https://framerusercontent.com/sites/3mt3DIlb4CNZxsYRjEpd6R/';
const files = [
  'evhvQeDRN874T70W59FZ14PS1IMF6-GH2Zk3lbK_Tgo.BNZAWYWb.mjs',
  '1R7EoQAgYbaep2Y71uBV_sGIdt8z_7E5gkbBe1KqTEc.D4scdYoU.mjs'
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
