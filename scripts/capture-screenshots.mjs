import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '..', 'docs', 'screenshots');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  console.log('Launching Chrome from:', chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars']
  });

  const page = await browser.newPage();

  // 1. Desktop Screenshot (1920px wide)
  console.log('Capturing Desktop Screenshot (1920px wide)...');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://www.thesparkstudio.digital/', { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));

  const desktopPath = path.join(outDir, 'spark-studio-desktop-fullpage.png');
  await page.screenshot({ path: desktopPath, fullPage: true });
  console.log('Saved desktop screenshot to:', desktopPath);

  // Also create a hero viewport screenshot (1920x1080)
  const desktopHeroPath = path.join(outDir, 'spark-studio-desktop-hero.png');
  await page.screenshot({ path: desktopHeroPath, fullPage: false });
  console.log('Saved desktop hero screenshot to:', desktopHeroPath);

  // 2. Mobile Screenshot (390px wide)
  console.log('Capturing Mobile Screenshot (390px wide)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('https://www.thesparkstudio.digital/', { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));

  const mobilePath = path.join(outDir, 'spark-studio-mobile-fullpage.png');
  await page.screenshot({ path: mobilePath, fullPage: true });
  console.log('Saved mobile screenshot to:', mobilePath);

  const mobileHeroPath = path.join(outDir, 'spark-studio-mobile-hero.png');
  await page.screenshot({ path: mobileHeroPath, fullPage: false });
  console.log('Saved mobile hero screenshot to:', mobileHeroPath);

  await browser.close();
  console.log('Done capturing all screenshots!');
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
