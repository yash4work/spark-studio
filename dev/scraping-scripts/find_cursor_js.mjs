import fs from 'fs';

const files = fs.readdirSync('C:/Users/Dell/sparkstudio-web').filter(f => f.endsWith('.mjs') || f.endsWith('.js'));

files.forEach(f => {
  const content = fs.readFileSync('C:/Users/Dell/sparkstudio-web/' + f, 'utf8');
  if (content.includes('Spark Cursor') || content.includes('SparkCursor') || content.includes('custom-cursor')) {
    console.log(`Found in file: ${f}`);
    const idx = content.indexOf('Spark Cursor');
    if (idx !== -1) {
      console.log(content.slice(Math.max(0, idx - 200), idx + 500));
    }
  }
});
