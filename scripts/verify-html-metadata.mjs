import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const preview = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173';
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]));
assert.equal(urls.length, 70);
const paths = new Set(urls.map(u => u.pathname));
const alternates = new Map();
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage']
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(page.url() + ' ' + error.message));
  await page.setRequestInterception(true);
  page.on('request', req => req.url().startsWith(preview) ? req.continue() : req.abort());
  for (const url of urls) {
    const response = await page.goto(preview + url.pathname, {waitUntil: 'domcontentloaded'});
    assert.equal(response.status(), 200, url.href);
    const html = await response.text();
    assert.equal((html.match(/<h1\b/g) || []).length, 1, url.href);
    assert.deepEqual([...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(m => m[1]), [url.href]);
    assert.ok(html.match(/<main\b[\s\S]*?<\/main>/)?.[0].replace(/<[^>]+>/g, '').length > 200, url.href);
    const links = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
    const languages = url.pathname.startsWith('/blog/') ? ['en','x-default'] : ['en','de','es','fr','x-default'];
    assert.deepEqual(links.map(m => m[1]).sort(), languages.sort());
    alternates.set(url.href, links.map(m => m[2]));
    for (const m of html.matchAll(/<a\b[^>]* href="(\/[^"]*)"/g)) {
      const dest = new URL(m[1], url).pathname.replace(/\/$/, '') || '/';
      assert.ok(paths.has(dest), url.pathname + ' links to ' + dest);
    }
    await page.waitForFunction(() => window.dataLayer?.some(event => event[2]?.page_path === location.pathname));
    if (url.pathname.startsWith('/blog/')) {
      for (const lang of ['de','es','fr']) {
        const redirect = await fetch(preview + '/' + lang + url.pathname, {redirect:'manual'});
        assert.ok([301,308].includes(redirect.status));
        assert.equal(new URL(redirect.headers.get('location'), preview).pathname, url.pathname);
      }
    }
  }
  for (const [url, links] of alternates) for (const target of links) assert.ok(alternates.get(target)?.includes(url), target);
  const missing = await page.goto(preview + '/missing-route-for-seo-check');
  assert.equal(missing.status(),404);
  assert.equal((await missing.text()).match(/<meta name="robots"/g)?.length,1);
  const guide = '/blog/figma-to-framer-agency-migration-guide';
  for (const width of [390, 1440]) {
    await page.setViewport({width,height:850});
    await page.goto(preview + guide);
    await page.click('a[href="/#contact"]::-p-text(Contact us today)');
    await page.waitForFunction(() => location.pathname === '/' && location.hash === '#contact' && document.querySelector('#contact-name'));
    await page.goto(preview + '/blog');
    await page.click('a[href="' + guide + '"]');
    await page.waitForSelector('a[href="/#contact"]::-p-text(Contact us today)');
  }
  await page.goto(preview + '/templates/onyx-atelier');
  await page.evaluate(() => { window.LemonSqueezy = {Url:{Open() {}}}; });
  await page.click('a[href*="/checkout/buy/"]');
  const starts = await page.evaluate(() => window.dataLayer.filter(e => e[1] === 'begin_checkout').map(e => e[2]));
  assert.equal(starts.length,1);
  assert.equal(starts[0].items[0].item_id,'onyx-atelier');
  assert.deepEqual(errors,[]);
  console.log('Passed 70 retained pages, 30 permanent redirects, reciprocal alternates, hydration, contact navigation and checkout.');
} finally {
  await browser.close();
}
