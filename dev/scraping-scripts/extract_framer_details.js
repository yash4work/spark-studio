const fs = require('fs');

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

// Extract all style tags
const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
console.log('Found', styleMatches.length, 'style blocks');

// Combine CSS
const allCss = styleMatches.join('\n');
fs.writeFileSync('C:/Users/Dell/sparkstudio-web/framer_extracted.css', allCss);
console.log('Saved framer_extracted.css, size:', allCss.length);

// Extract all font links and stylesheets
const links = [...html.matchAll(/<link[^>]+>/gi)].map(m => m[0]);
console.log('Link tags:', links);

// Extract the body content (inside __framer-badge-container or main container)
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  console.log('Body length:', bodyMatch[1].length);
}

// Find fonts used
const fonts = [...allCss.matchAll(/font-family:\s*([^;]+);/gi)].map(m => m[1].trim());
console.log('Unique fonts:', [...new Set(fonts)]);

// Find background colors
const bgs = [...allCss.matchAll(/background(?:-color)?:\s*([^;]+);/gi)].map(m => m[1].trim());
console.log('Sample backgrounds:', [...new Set(bgs)].slice(0, 15));
