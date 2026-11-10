import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

// Find all section elements or major containers
const mainMatch = html.match(/<div id="main"[^>]*>([\s\S]*?)<\/div>\s*<!--\/\$-->/i);
if (mainMatch) {
  console.log('Main container length:', mainMatch[1].length);
}

// Let's check the images
const images = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[0]);
console.log('Total images in Framer SSR:', images.length);
images.slice(0, 10).forEach(img => console.log(img));
