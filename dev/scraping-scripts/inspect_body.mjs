import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

// What are the script tags in body or head?
const scripts = [...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
console.log('Script sources:', scripts);

// What is inside body?
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '';
console.log('Body length:', body.length);

// Let's see the first 2000 chars of body
console.log('Body start:', body.slice(0, 1500));
