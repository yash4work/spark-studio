import fs from 'fs';
import path from 'path';

const urls = {
  en: 'https://framerusercontent.com/images/3T30gQHGEDnAEsgxV10AcoOlLOQ.svg',
  de: 'https://framerusercontent.com/images/oi9iFF7irpAZ9FP9yKPtHZ9so.svg',
  es: 'https://framerusercontent.com/images/rJtRNBPqQXb5wW63Bu9C02I3UAE.svg',
  fr: 'https://framerusercontent.com/images/2Kb3wf1URfXEo3puwPeqvwqFH1M.svg'
};

const dir = path.join('public', 'flags');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

for (const [code, url] of Object.entries(urls)) {
  const res = await fetch(url);
  const text = await res.text();
  const filePath = path.join(dir, `${code}.svg`);
  fs.writeFileSync(filePath, text);
  console.log(`Saved ${code}.svg (${text.length} bytes)`);
}
