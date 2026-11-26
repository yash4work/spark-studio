# The Spark Studio — Official Website & Framer Template Showcase

A React + Vite marketing site with i18n (EN/DE/ES/FR), Supabase, and Lemon Squeezy checkout.

## Stack
- React 19 + React Router 7
- Vite 8, Tailwind CSS 4
- i18next (4 locales)
- Supabase (data) · Lemon Squeezy (payments)
- Framer Motion

## Getting started
```bash
npm install
cp .env.example .env   # fill in Supabase / Lemon Squeezy keys
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Project structure
```
src/
  components/   Reusable UI sections (Navbar, Hero, Footer, FAQ, ...)
  pages/        Route-level pages (HomePage, TemplateDetailPage)
  lib/          Integrations (Supabase client, Lemon Squeezy, Framer effects)
  i18n/         i18next setup + locales/ (en, de, es, fr)
  App.jsx       Routes + language/slug handling
  main.jsx      App entry point

public/         Static files served as-is (favicon, logo, templates, flags)
supabase/       Database schema (schema.sql)
docs/
  bundle-pricing.md          Catalog pricing, vault bundles & 48% discount documentation
  contact-form-pipeline.md   Contact form delivery & Zoho Mail pipeline
  screenshots/               Reference screenshots of the live site
```

## Notes
- Routes are language-prefixed (`/de`, `/es`, `/fr`, default `en`); see
  `RouteManager` in `src/App.jsx`.
- Template detail pages are lazy-loaded. Valid template URLs come from
  `src/data/templates.js` (see **Adding a new template** below).

## Contact Form & Email Delivery Pipeline

The contact form (`src/components/ContactSection.jsx`) is live and working. On submit it does two things at the same time:

1. **Email** — posts to the [FormSubmit](https://formsubmit.co) relay
   (`https://formsubmit.co/ajax/hello@thesparkstudio.digital`). FormSubmit sends the email
   to `hello@thesparkstudio.digital`, a mailbox hosted on **Zoho Mail**.
   The site never talks to Zoho directly — FormSubmit is the sender (`submissions@formsubmit.co`).
2. **Database** — saves a copy to the Supabase `inquiries` table (`saveInquiry` in `src/lib/supabase.js`).

The visitor sees "sent" if **either** succeeds. A GA4 `generate_lead` event is then recorded.

**Spam protection** (`src/lib/formGuard.js`):
- A hidden *honeypot* field (`_honey`) that people never see. If a bot fills it in, the form
  shows "sent" but nothing is delivered. FormSubmit also drops any message where `_honey` is filled.
- Submissions made less than 3 seconds after the form appeared are treated as bots the same way.
- FormSubmit's own CAPTCHA stays off (`_captcha: "false"`) so real visitors get no popup.

Full details: `docs/contact-form-pipeline.md`.

## Adding a new template

Template URLs are listed **once**, in `src/data/templates.js`. Routes (`src/App.jsx`),
the sitemap and the short-URL redirects in `vercel.json` are all generated from it.

To add a template (example slug `my-template`):

1. **`src/data/templates.js`** — add `'my-template'` to `TEMPLATE_SLUGS`.
2. **`src/components/TemplatesGrid.jsx`** — add a card to `TEMPLATES` with `slug: 'my-template'`
   (name, price, image, category, buy/remix link).
3. **`src/pages/TemplateDetailPage.jsx`** — add a `'my-template': { ... }` entry to `TEMPLATE_META`
   (prices per language, demo URL, buy URL, main image, gallery).
4. **`src/i18n/locales/{en,de,es,fr}.json`** — add `templateDetails.my-template` text in all 4 languages.
5. **Images** — put `my-template.webp` (plus `-192.webp` and `-384.webp` thumbnails) in `public/templates/`.
6. Run **`npm test`**. It lists anything you forgot, by file. Then run `npm run build`, which
   also updates `vercel.json` and the sitemap automatically. Commit the changed `vercel.json`.

## Tests

`npm test` runs:
- `scripts/test-templates.mjs` — every template is wired up (grid card, detail meta, 4 languages, vercel.json).
- `scripts/test-forms.mjs` — email validation and the spam guard.
- `scripts/test-subscriber.mjs` — forms report failure (not fake success) when Supabase is unavailable.
- `scripts/verify-pipeline.mjs` — the newsletter form text exists in all 4 languages.
