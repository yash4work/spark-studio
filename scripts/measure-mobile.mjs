import puppeteer from 'puppeteer-core';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { extname, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] || 'dist');
const mime = { '.js':'text/javascript', '.css':'text/css', '.html':'text/html', '.png':'image/png', '.webp':'image/webp', '.svg':'image/svg+xml' };
const server = createServer(async (req, res) => {
  let path = new URL(req.url, 'http://localhost').pathname;
  if (!extname(path)) path = (path === '/' ? '/index' : path) + '.html';
  const file = resolve(root, '.' + path);
  try {
    if (!file.startsWith(root + sep)) throw Error();
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Content-Encoding':'gzip' });
    res.end(gzipSync(data));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = 'http://127.0.0.1:' + server.address().port;
const browser = await puppeteer.launch({executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args:['--no-sandbox','--disable-dev-shm-usage']});
try {
  for (const route of ['/', '/templates/onyx-atelier']) {
    const runs = [];
    for (let trial = 0; trial < 3; trial++) {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true});
      await page.setCacheEnabled(false);
      await page.setRequestInterception(true);
      page.on('request', req => req.url().startsWith(origin) ? req.continue() : req.abort());
      await page.emulateCPUThrottling(4);
      await page.emulateNetworkConditions({download:200000,upload:93750,latency:150});
      await page.evaluateOnNewDocument(() => {
        new PerformanceObserver(list => { window.lastPaint = list.getEntries().at(-1).startTime; }).observe({type:'largest-contentful-paint',buffered:true});
      });
      await page.goto(origin + route, {waitUntil:'domcontentloaded',timeout:60000});
      await new Promise(done => setTimeout(done, 8000));
      runs.push(await page.evaluate(() => ({
        fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0].startTime),
        lcp: Math.round(window.lastPaint)
      })));
      await context.close();
    }
    console.log(route, JSON.stringify(runs));
  }
} finally {
  await browser.close();
  server.close();
}
