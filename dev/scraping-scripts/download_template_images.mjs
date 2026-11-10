import fs from 'fs';

const imageMap = {
  'mavric-estate': 'https://framerusercontent.com/images/DPwsGmESscRIXXHXL8LcOuKZ4Hs.png',
  'aurelle-estates': 'https://framerusercontent.com/images/lAIyHF7bTPsELzbli5745AtFyVc.png',
  'onyx-atelier': 'https://framerusercontent.com/images/SQBq4aYCRrDEgzESuLyV5RMkyo.png',
  'vellum-edition': 'https://framerusercontent.com/images/FkzjK8BS18Pzkm1EYK7g5At0k.png',
  'halden-edition': 'https://framerusercontent.com/images/BUbE69gqi8HWVJtYVnjDGyXBNE.png',
  'grain-form': 'https://framerusercontent.com/images/VyYvxxjIRl4VU3bMej4lEK0WIBA.png',
  'slowgrain': 'https://framerusercontent.com/images/6UTAtLCQFhh1j6oiIxTpQA3nHoo.png'
};

async function downloadImages() {
  for (const [slug, url] of Object.entries(imageMap)) {
    console.log(`Downloading ${slug}...`);
    try {
      const res = await fetch(url);
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(`C:/Users/Dell/sparkstudio-web/public/templates/${slug}.png`, buffer);
      console.log(`Saved public/templates/${slug}.png (${buffer.length} bytes)`);
    } catch (e) {
      console.error(`Failed to download ${slug}:`, e.message);
    }
  }
}

downloadImages();
