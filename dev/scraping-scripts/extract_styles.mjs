import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

console.log('\n=== 6. STANDARDS ROWS ===');
const rowsIdx = html.indexOf('data-framer-name="Rows"');
if (rowsIdx !== -1) {
  console.log(html.slice(rowsIdx, rowsIdx + 1500));
}

console.log('\n=== 7. ABOUT / CUSTOM BUILDS ===');
const aboutIdx = html.indexOf('data-framer-name="About"');
if (aboutIdx !== -1) {
  console.log(html.slice(aboutIdx, aboutIdx + 1500));
}

console.log('\n=== 8. FAQ ===');
const faqIdx = html.indexOf('data-framer-name="FAQ Item"');
if (faqIdx !== -1) {
  console.log(html.slice(faqIdx, faqIdx + 1200));
}

console.log('\n=== 9. CONTACT ===');
const contactIdx = html.indexOf('id="contact"');
if (contactIdx !== -1) {
  console.log(html.slice(contactIdx, contactIdx + 1500));
}

console.log('\n=== 10. SOCIAL LINKS ===');
const socialIdx = html.indexOf('data-framer-name="Social Links"');
if (socialIdx !== -1) {
  console.log(html.slice(socialIdx, socialIdx + 1000));
}
