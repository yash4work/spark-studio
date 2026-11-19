import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = 'http://127.0.0.1:4173';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  'access-control-allow-headers': '*',
  'content-type': 'application/json'
};

async function run() {
  console.log('--- STARTING COMPREHENSIVE E2E VERIFICATION SUITE ---');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    // =========================================================================
    // TEST 1: NEWSLETTER REGRESSION & FALLBACK REMOVAL
    // =========================================================================
    console.log('\n[TEST 1] Newsletter regression check: inquiries fallback removal...');
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setRequestInterception(true);

      let formSubmitStatus = 500;
      let subscribersStatus = 400;
      let inquiriesRequests = [];

      page.on('request', req => {
        const url = req.url();
        if (req.method() === 'OPTIONS') {
          return req.respond({ status: 200, headers: corsHeaders, body: '' });
        }
        if (url.includes('formsubmit.co')) {
          req.respond({
            status: formSubmitStatus,
            headers: corsHeaders,
            body: JSON.stringify({ success: formSubmitStatus === 200 ? 'true' : 'false' })
          });
        } else if (url.includes('/rest/v1/subscribers')) {
          req.respond({
            status: subscribersStatus,
            headers: corsHeaders,
            body: JSON.stringify(subscribersStatus === 201 ? [{ email: 'test@example.com' }] : { code: '42501', message: 'permission denied' })
          });
        } else if (url.includes('/rest/v1/inquiries')) {
          inquiriesRequests.push({ url, postData: req.postData() });
          req.respond({
            status: 201,
            headers: corsHeaders,
            body: JSON.stringify([{ id: 1 }])
          });
        } else {
          req.continue();
        }
      });

      await page.evaluateOnNewDocument(() => {
        window.dataLayer = [];
        window.gtag = function(...args) {
          window.dataLayer.push(args);
        };
      });

      await page.goto(`${baseUrl}/#projects`, { waitUntil: 'networkidle0' });

      // Find the newsletter email input
      const inputSelector = 'input[type="email"][autoComplete="email"]';
      await page.waitForSelector(inputSelector);
      await page.type(inputSelector, 'test-regression@example.com');

      // Submit with email failing and subscribers failing
      console.log('Submitting newsletter form with Email failing and Subscribers rejecting...');
      await page.click('form button[type="submit"]');

      // Wait for error state
      await page.waitForFunction(() => {
        const el = document.querySelector('form p.text-rose-400');
        return el && el.textContent.length > 0;
      }, { timeout: 5000 });

      // Assert inquiries received 0 requests
      console.log('Inquiries requests received:', inquiriesRequests.length);
      assert.equal(inquiriesRequests.length, 0, 'Inquiries MUST receive zero requests when newsletter insert fails!');

      // Assert form retains address
      const retainedEmail = await page.$eval(inputSelector, el => el.value);
      console.log('Retained email:', retainedEmail);
      assert.equal(retainedEmail, 'test-regression@example.com', 'Form must retain email address on failure');

      // Assert localized retry text appears
      const errorText = await page.$eval('form p.text-rose-400', el => el.textContent);
      console.log('Localized error text:', errorText);
      assert(errorText.includes('Delivery failed') || errorText.includes('failed') || errorText.includes('try again'), 'Localized retry error should appear');

      // Assert no newsletter_subscribe event fired
      const eventsAfterFail = await page.evaluate(() => {
        return (window.dataLayer || []).filter(e => e[0] === 'event' && e[1] === 'newsletter_subscribe');
      });
      console.log('Newsletter subscribe events after failure:', eventsAfterFail.length);
      assert.equal(eventsAfterFail.length, 0, 'No newsletter_subscribe event should fire on failure');

      // Now configure subscribers to SUCCEED
      console.log('Retrying same form with Subscribers succeeding...');
      subscribersStatus = 201;

      await page.click('form button[type="submit"]');

      // Wait for success message
      await page.waitForFunction(() => {
        return document.body.textContent.includes("You're on the early-bird list!");
      }, { timeout: 5000 });

      // Assert success state appears
      const pageText = await page.evaluate(() => document.body.textContent);
      assert(pageText.includes("You're on the early-bird list!"), 'Success message should appear');

      // Assert exactly 1 newsletter_subscribe event fired
      const eventsAfterSuccess = await page.evaluate(() => {
        return (window.dataLayer || []).filter(e => e[0] === 'event' && e[1] === 'newsletter_subscribe');
      });
      console.log('Newsletter subscribe events after retry success:', eventsAfterSuccess.length);
      assert.equal(eventsAfterSuccess.length, 1, 'Exactly one newsletter_subscribe event should fire after retry success');

      // Inspect localStorage for synthetic name, email, message
      const localStorageDump = await page.evaluate(() => ({ ...localStorage }));
      console.log('LocalStorage state:', JSON.stringify(localStorageDump));
      assert.equal(localStorageDump.spark_pipeline_subscribed, 'true', 'Newsletter boolean flag should be set');
      assert.equal(localStorageDump.spark_inquiries, undefined, 'No synthetic inquiries should be in localStorage');
      assert.equal(localStorageDump.spark_subscribers, undefined, 'No synthetic subscribers should be in localStorage');

      await context.close();
      console.log('[PASS] Test 1: Newsletter regression check passed completely!');
    }

    // =========================================================================
    // TEST 2: FORM PERMUTATIONS (EMAIL ALONE, SUPABASE ALONE, CONTACT FORM)
    // =========================================================================
    console.log('\n[TEST 2] Form permutations: email alone, Supabase alone, contact form...');
    {
      // 2A: Newsletter with Email alone succeeding (subscribers failing)
      {
        const context = await browser.createBrowserContext();
        const page = await context.newPage();
        await page.setRequestInterception(true);

        page.on('request', req => {
          const url = req.url();
          if (req.method() === 'OPTIONS') return req.respond({ status: 200, headers: corsHeaders, body: '' });
          if (url.includes('formsubmit.co')) {
            req.respond({ status: 200, headers: corsHeaders, body: JSON.stringify({ success: 'true' }) });
          } else if (url.includes('/rest/v1/subscribers')) {
            req.respond({ status: 400, headers: corsHeaders, body: JSON.stringify({ code: '42501' }) });
          } else {
            req.continue();
          }
        });

        await page.evaluateOnNewDocument(() => {
          window.dataLayer = [];
          window.gtag = (...args) => window.dataLayer.push(args);
        });

        await page.goto(`${baseUrl}/#projects`, { waitUntil: 'networkidle0' });
        const inputSelector = 'input[type="email"][autoComplete="email"]';
        await page.waitForSelector(inputSelector);
        await page.type(inputSelector, 'email-alone@example.com');
        await page.click('form button[type="submit"]');

        await page.waitForFunction(() => document.body.textContent.includes("You're on the early-bird list!"), { timeout: 5000 });
        const events = await page.evaluate(() => (window.dataLayer || []).filter(e => e[0] === 'event' && e[1] === 'newsletter_subscribe'));
        assert.equal(events.length, 1, 'Email alone succeeding should trigger 1 newsletter_subscribe event');
        console.log('  [PASS] Newsletter: Email alone succeeding works (1 event)');
        await context.close();
      }

      // 2B: Contact form with both failing
      {
        const context = await browser.createBrowserContext();
        const page = await context.newPage();
        await page.setRequestInterception(true);

        let inquiriesStatus = 400;

        page.on('request', req => {
          const url = req.url();
          if (req.method() === 'OPTIONS') return req.respond({ status: 200, headers: corsHeaders, body: '' });
          if (url.includes('formsubmit.co')) {
            req.respond({ status: 500, headers: corsHeaders, body: JSON.stringify({ success: 'false' }) });
          } else if (url.includes('/rest/v1/inquiries')) {
            req.respond({ status: inquiriesStatus, headers: corsHeaders, body: JSON.stringify(inquiriesStatus === 201 ? [{ id: 1 }] : { code: '42501' }) });
          } else {
            req.continue();
          }
        });

        await page.evaluateOnNewDocument(() => {
          window.dataLayer = [];
          window.gtag = (...args) => window.dataLayer.push(args);
        });

        await page.goto(`${baseUrl}/#contact`, { waitUntil: 'networkidle0' });
        await page.waitForSelector('#contact-name');
        await page.type('#contact-name', 'Jane Contact');
        await page.type('#contact-email', 'jane@example.com');
        await page.type('#contact-message', 'I need a luxury architecture website.');

        await page.click('#contact form button[type="submit"]');

        // Wait for alert / error
        await page.waitForSelector('#contact [role="alert"]', { timeout: 5000 });
        const contactErrorText = await page.$eval('#contact [role="alert"]', el => el.textContent);
        console.log('  Contact form error text on failure:', contactErrorText);
        assert(contactErrorText.includes('Delivery failed') || contactErrorText.includes('failed') || contactErrorText.includes('try again'), 'Contact error alert shown');

        // Verify retained values
        assert.equal(await page.$eval('#contact-name', el => el.value), 'Jane Contact', 'Name retained');
        assert.equal(await page.$eval('#contact-email', el => el.value), 'jane@example.com', 'Email retained');
        assert.equal(await page.$eval('#contact-message', el => el.value), 'I need a luxury architecture website.', 'Message retained');

        // Verify 0 generate_lead events
        let leadEvents = await page.evaluate(() => (window.dataLayer || []).filter(e => e[0] === 'event' && e[1] === 'generate_lead'));
        assert.equal(leadEvents.length, 0, 'No generate_lead event on failure');
        console.log('  [PASS] Contact form: Both failing correctly retains values and emits 0 events');

        // 2C: Contact form retry with Supabase alone succeeding
        inquiriesStatus = 201;
        await page.click('#contact form button[type="submit"]');

        await page.waitForFunction(() => {
          const h4 = document.querySelector('#contact h4');
          return h4 && h4.textContent.includes('Inquiry Received');
        }, { timeout: 5000 });

        leadEvents = await page.evaluate(() => (window.dataLayer || []).filter(e => e[0] === 'event' && e[1] === 'generate_lead'));
        assert.equal(leadEvents.length, 1, 'Supabase alone succeeding triggers 1 generate_lead event');
        console.log('  [PASS] Contact form: Supabase alone succeeding works and emits 1 event');

        // Inspect localStorage for synthetic name, email, message
        const ls = await page.evaluate(() => ({ ...localStorage }));
        assert.equal(ls.spark_inquiries, undefined, 'No lead data in localStorage');
        assert.equal(ls.name, undefined);
        assert.equal(ls.email, undefined);
        assert.equal(ls.message, undefined);

        await context.close();
      }

      console.log('[PASS] Test 2: All form permutations verified!');
    }

    // =========================================================================
    // TEST 3: CLIENT-SIDE ROUTING & NOT-FOUND HANDLING
    // =========================================================================
    console.log('\n[TEST 3] Client-side routing and 404 handling...');
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();

      // 3A: Root unknown route /unknown-route
      console.log('Testing /unknown-route...');
      await page.goto(`${baseUrl}/unknown-route`, { waitUntil: 'networkidle0' });
      let currentPath = await page.evaluate(() => window.location.pathname);
      console.log('Current path:', currentPath);
      assert.equal(currentPath, '/unknown-route', 'Path should remain /unknown-route');
      let h1Text = await page.$eval('h1', el => el.textContent);
      console.log('H1:', h1Text);
      assert.equal(h1Text, 'Page Not Found', 'H1 should say Page Not Found');
      // Click Home link
      await page.click('a[href="/"]');
      await page.waitForFunction(() => window.location.pathname === '/');
      assert.equal(await page.evaluate(() => window.location.pathname), '/', 'Home link navigates to /');
      console.log('  [PASS] /unknown-route shows 404 and Home link works');

      // 3B: Localized unknown route /de/unknown-route
      console.log('Testing /de/unknown-route...');
      await page.goto(`${baseUrl}/de/unknown-route`, { waitUntil: 'networkidle0' });
      currentPath = await page.evaluate(() => window.location.pathname);
      assert.equal(currentPath, '/de/unknown-route', 'Path should remain /de/unknown-route');
      h1Text = await page.$eval('h1', el => el.textContent);
      assert(h1Text === 'Seite nicht gefunden' || h1Text === 'Page Not Found', 'H1 should be localized German or Page Not Found');
      await page.click('a[href="/de"]');
      await page.waitForFunction(() => window.location.pathname === '/de');
      assert.equal(await page.evaluate(() => window.location.pathname), '/de', 'Home link navigates to /de');
      console.log('  [PASS] /de/unknown-route shows 404 and German home link works');

      // 3C: Unknown template /templates/unknown-template
      console.log('Testing /templates/unknown-template...');
      await page.goto(`${baseUrl}/templates/unknown-template`, { waitUntil: 'networkidle0' });
      currentPath = await page.evaluate(() => window.location.pathname);
      assert.equal(currentPath, '/templates/unknown-template', 'Path should remain /templates/unknown-template');
      h1Text = await page.$eval('h1', el => el.textContent);
      console.log('Template not found H1:', h1Text);
      assert.equal(h1Text, 'Template Not Found');
      await page.click('a[href="/"]');
      await page.waitForFunction(() => window.location.pathname === '/');
      console.log('  [PASS] /templates/unknown-template shows Template Not Found and Home link works');

      // 3D: Unknown blog /blog/unknown-post
      console.log('Testing /blog/unknown-post...');
      await page.goto(`${baseUrl}/blog/unknown-post`, { waitUntil: 'networkidle0' });
      currentPath = await page.evaluate(() => window.location.pathname);
      assert.equal(currentPath, '/blog/unknown-post', 'Path should remain /blog/unknown-post');
      h1Text = await page.$eval('h1', el => el.textContent);
      console.log('Blog not found H1:', h1Text);
      assert.equal(h1Text, 'Article Not Found');
      await page.click('a[href="/"]');
      await page.waitForFunction(() => window.location.pathname === '/');
      console.log('  [PASS] /blog/unknown-post shows Article Not Found and Home link works');

      // 3E: Legacy template alias /onyx-atelier
      console.log('Testing legacy alias client redirect /onyx-atelier...');
      await page.goto(`${baseUrl}/onyx-atelier`, { waitUntil: 'networkidle0' });
      currentPath = await page.evaluate(() => window.location.pathname);
      console.log('Legacy alias resolved path:', currentPath);
      assert.equal(currentPath, '/templates/onyx-atelier', 'Legacy alias should resolve to /templates/onyx-atelier');
      h1Text = await page.$eval('h1', el => el.textContent);
      console.log('Detail page H1:', h1Text);
      assert(h1Text.includes('Onyx Atelier'), 'Onyx Atelier detail page rendered');

      // 3F: Legacy template alias with query parameter /onyx-atelier?ref=marketing&source=test
      console.log('Testing legacy alias query preservation...');
      await page.goto(`${baseUrl}/onyx-atelier?ref=marketing&source=test`, { waitUntil: 'networkidle0' });
      const fullUrl = await page.evaluate(() => window.location.pathname + window.location.search);
      console.log('Resolved URL with search:', fullUrl);
      assert.equal(fullUrl, '/templates/onyx-atelier?ref=marketing&source=test', 'Query parameters must be preserved');

      // 3G: Localized legacy alias /de/onyx-atelier?foo=bar
      console.log('Testing German legacy alias with query preservation...');
      await page.goto(`${baseUrl}/de/onyx-atelier?foo=bar`, { waitUntil: 'networkidle0' });
      const deFullUrl = await page.evaluate(() => window.location.pathname + window.location.search);
      console.log('German resolved URL:', deFullUrl);
      assert.equal(deFullUrl, '/de/templates/onyx-atelier?foo=bar', 'German legacy alias must resolve to /de/templates/onyx-atelier with query params');

      await context.close();
      console.log('[PASS] Test 3: Client-side routing passed completely!');
    }

    // =========================================================================
    // TEST 4: CHECKOUT LINKS, SLOWGRAIN, TERRA, LEMONSQUEEZY OVERLAY EXCEPTION
    // =========================================================================
    console.log('\n[TEST 4] Checkout links, Slowgrain, Terra, LemonSqueezy fallback...');
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();

      // 4A: Check Onyx Atelier catalog card link and buy button
      await page.goto(`${baseUrl}/#projects`, { waitUntil: 'networkidle0' });
      const onyxCardLink = await page.evaluate(() => {
        const link = document.querySelector('a[href="/templates/onyx-atelier"]');
        return link ? link.getAttribute('href') : null;
      });
      console.log('Onyx catalog card link:', onyxCardLink);
      assert.equal(onyxCardLink, '/templates/onyx-atelier', 'Onyx card link is canonical /templates/onyx-atelier');

      // 4B: Check Onyx Atelier detail page buyUrl
      await page.goto(`${baseUrl}/templates/onyx-atelier`, { waitUntil: 'networkidle0' });
      const onyxBuyUrl = await page.evaluate(() => {
        const btn = document.querySelector('a[href*="yashparmar.lemonsqueezy.com/checkout/buy/"]');
        return btn ? btn.getAttribute('href') : null;
      });
      console.log('Onyx detail page buyUrl exposed in browser:', onyxBuyUrl);
      assert(onyxBuyUrl.includes('8ef3a777-6fe5-4148-af7e-e1bb1bba39f7'), 'Onyx buyUrl must use ID 8ef3a777-6fe5-4148-af7e-e1bb1bba39f7');

      // 4C: Check German localized catalog Onyx link
      await page.goto(`${baseUrl}/de#projects`, { waitUntil: 'networkidle0' });
      const deOnyxCardLink = await page.evaluate(() => {
        const link = document.querySelector('a[href="/de/templates/onyx-atelier"]');
        return link ? link.getAttribute('href') : null;
      });
      console.log('German Onyx card link:', deOnyxCardLink);
      assert.equal(deOnyxCardLink, '/de/templates/onyx-atelier', 'German Onyx card link is /de/templates/onyx-atelier');

      // 4D: Check Slowgrain free action
      await page.goto(`${baseUrl}/templates/slowgrain`, { waitUntil: 'networkidle0' });
      const slowgrainRemix = await page.evaluate(() => {
        const btn = document.querySelector('a[href*="framer.com/remix"]');
        return btn ? btn.getAttribute('href') : null;
      });
      console.log('Slowgrain remix URL exposed in browser:', slowgrainRemix);
      assert.equal(slowgrainRemix, 'https://framer.com/remix/52YnIzlJOEXddxCP5O1n', 'Slowgrain opens Framer remix');

      // 4E: Check Terra paid checkout
      await page.goto(`${baseUrl}/templates/terra`, { waitUntil: 'networkidle0' });
      const terraBuyUrl = await page.evaluate(() => {
        const btn = document.querySelector('a[href*="yashparmar.lemonsqueezy.com/checkout/buy/"]');
        return btn ? btn.getAttribute('href') : null;
      });
      console.log('Terra buyUrl exposed in browser:', terraBuyUrl);
      assert.equal(terraBuyUrl, 'https://yashparmar.lemonsqueezy.com/checkout/buy/2202bb1a-4d15-4b53-8b36-73d57153733f?embed=1', 'Terra has its own paid checkout');

      // 4F: Simulate LemonSqueezy overlay exception -> direct navigation
      console.log('Simulating LemonSqueezy overlay exception...');
      await page.setRequestInterception(true);

      let directNavigationUrl = null;
      page.on('request', req => {
        const url = req.url();
        if (url.includes('checkout/buy/')) {
          directNavigationUrl = url;
          req.respond({ status: 200, contentType: 'text/html', body: '<html>Mock Checkout</html>' });
        } else if (url.includes('yashparmar.lemonsqueezy.com')) {
          req.respond({ status: 200, contentType: 'text/html', body: '' });
        } else {
          req.continue();
        }
      });

      await page.evaluate(() => {
        window.LemonSqueezy = {
          Url: {
            Open: () => {
              throw new Error('LemonSqueezy overlay script blocked or failed');
            }
          }
        };
      });

      await page.click('a[href*="yashparmar.lemonsqueezy.com"]');
      await page.waitForFunction(() => window.__directNav || document.location.href.includes('lemonsqueezy.com') || true, { timeout: 3000 });
      // Give browser a short tick for the request to register
      await new Promise(r => setTimeout(r, 500));

      console.log('Fallback navigation target upon overlay exception:', directNavigationUrl);
      assert(directNavigationUrl && directNavigationUrl.includes('2202bb1a-4d15-4b53-8b36-73d57153733f'), 'Fallback directly navigates to checkout URL');

      await context.close();
      console.log('[PASS] Test 4: Checkout links and fallback verified!');
    }

    // =========================================================================
    // TEST 5: RENDERED ARTICLE BODY & TEMPLATE DETAIL PAGE
    // =========================================================================
    console.log('\n[TEST 5] Verifying rendered article body and template detail page...');
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();

      // Rendered article body
      await page.goto(`${baseUrl}/blog/onyx-atelier-framer-architecture-template-review`, { waitUntil: 'networkidle0' });
      const articleTitle = await page.$eval('h1', el => el.textContent);
      const articleBody = await page.$eval('article', el => el.textContent);
      console.log('Article title:', articleTitle);
      console.log('Article body length:', articleBody.length);
      assert(articleTitle.length > 10, 'Article title rendered');
      assert(articleBody.length > 200, 'Article content rendered');

      // Rendered template detail page
      await page.goto(`${baseUrl}/templates/onyx-atelier`, { waitUntil: 'networkidle0' });
      const tplTitle = await page.$eval('h1', el => el.textContent);
      console.log('Template title:', tplTitle);
      assert(tplTitle.includes('Onyx Atelier'), 'Onyx Atelier rendered');

      await context.close();
      console.log('[PASS] Test 5: Rendered pages verified!');
    }

  } finally {
    await browser.close();
  }

  console.log('\n========================================');
  console.log('ALL E2E VERIFICATIONS PASSED SUCCESSFULLY!');
  console.log('========================================');
}

run().catch(err => {
  console.error('\n[FAIL] E2E Verification failed:', err);
  process.exit(1);
});
