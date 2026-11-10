import fs from 'fs';

const url = 'https://framerusercontent.com/sites/3mt3DIlb4CNZxsYRjEpd6R/script_main.BKNh288_.mjs';

async function main() {
  const res = await fetch(url);
  const text = await res.text();
  fs.writeFileSync('C:/Users/Dell/sparkstudio-web/framer_main_bundle.js', text);
  console.log('Saved bundle, size:', text.length);

  // Search for imported module URLs in the bundle
  const moduleUrls = [...text.matchAll(/https:\/\/framerusercontent\.com\/modules\/[a-zA-Z0-9_\-\.\/]+/g)];
  console.log('Modules referenced:', new Set(moduleUrls.map(m => m[0])).size);
  [...new Set(moduleUrls.map(m => m[0]))].forEach(m => console.log('  ', m));
}

main();
