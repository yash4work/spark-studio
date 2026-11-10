import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

const stdIdx = html.indexOf('id="standards"');
const aboutIdx = html.indexOf('id="about"');
const slice = html.slice(stdIdx, aboutIdx !== -1 ? aboutIdx : stdIdx + 15000);

const rowMatches = [...slice.matchAll(/data-framer-name="Standard Row"([\s\S]*?)(?=data-framer-name="Standard Row"|$)/gi)];
console.log('Standard rows count:', rowMatches.length);
rowMatches.forEach((r, i) => {
  const numMatch = r[0].match(/data-framer-name="Std Num"[\s\S]*?>(\d+)</);
  const titleMatch = r[0].match(/data-framer-name="Std Title"[\s\S]*?>([^<]+)</);
  const text = r[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`Row ${i + 1}: ${text.slice(0, 200)}...`);
});
