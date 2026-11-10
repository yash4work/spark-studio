import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_PATH = 'C:\\Users\\Dell\\.gemini\\antigravity-cli\\brain\\4d06d0c0-49b8-4707-b04c-2abc500f56e2\\screenshot_full.png';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle0' });

  // Smoothly scroll to bottom to trigger all framer-motion animations
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });

  // Wait 1 second for animations to settle
  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({ path: OUTPUT_PATH, fullPage: true });
  console.log('Full page screenshot saved to:', OUTPUT_PATH);

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
