import fs from 'fs';

const html = fs.readFileSync('C:/Users/Dell/sparkstudio-web/framer_raw.html', 'utf8');

console.log('=== ABOUT SECTION ===');
const aboutIdx = html.indexOf('id="about"');
const aboutEnd = html.indexOf('id="services"');
const aboutSlice = html.slice(aboutIdx, aboutEnd !== -1 ? aboutEnd : aboutIdx + 10000);
console.log(aboutSlice.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1000));

console.log('\n=== SERVICES / PROCESS ===');
const servIdx = html.indexOf('id="services"');
const servSlice = html.slice(servIdx, servIdx + 10000);
console.log(servSlice.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1000));

console.log('\n=== FAQ SECTION ===');
const faqIdx = html.indexOf('id="faq"');
const faqEnd = html.indexOf('id="contact"');
const faqSlice = html.slice(faqIdx, faqEnd !== -1 ? faqEnd : faqIdx + 10000);
const faqs = [...faqSlice.matchAll(/data-framer-name="Question"[\s\S]*?>([^<]+)<[\s\S]*?data-framer-name="Answer"[\s\S]*?>([^<]+)</gi)];
faqs.forEach((f, i) => console.log(`FAQ ${i+1}: Q: ${f[1].trim()} | A: ${f[2].trim()}`));

console.log('\n=== CONTACT / FOOTER ===');
const contIdx = html.indexOf('id="contact"');
const contSlice = html.slice(contIdx, contIdx + 5000);
console.log(contSlice.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1000));
