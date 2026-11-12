# SparkStudio Web

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
  assets/       Images/icons bundled by Vite
  App.jsx       Routes + language/slug handling
  main.jsx      App entry point

public/         Static files served as-is (favicon, logo, templates, flags)
supabase/       Database schema (schema.sql)
docs/
  bundle-pricing.md          Catalog pricing, vault bundles & 48% discount documentation
  contact-form-pipeline.md   Contact form delivery & Zoho Mail pipeline
  screenshots/               Reference screenshots of the live site
dev/            Scraping/inspection scripts used during development
                (not part of the shipped app — see dev/README.md)
```

## Notes
- Routes are language-prefixed (`/de`, `/es`, `/fr`, default `en`); see
  `RouteManager` in `src/App.jsx`.
- Template detail pages are lazy-loaded and validated against `VALID_SLUGS`
  in `src/App.jsx`.

## Contact Form & Email Delivery Pipeline

The contact form in `src/components/ContactSection.jsx` delivers inquiries straight to **Zoho Mail**:

- **Target Inbox:** `hello@thesparkstudio.digital` / `yashparmar@thesparkstudio.digital` (Zoho Mail)
- **Email Relay:** [FormSubmit](https://formsubmit.co) AJAX endpoint (`https://formsubmit.co/ajax/hello@thesparkstudio.digital`)
  - Form activated for `https://www.thesparkstudio.digital/` (confirmation token: `2d6f508ef2845b9fc01eef8596816b63`)
  - Configured with `_template: "table"` for clean lead formatting and `_captcha: "false"`.
  - Dynamic subject lines formatted as: `New Lead: <Name> - <ProjectType>`.
- **Dual Persistence:**
  - Concurrent cloud persistence via Supabase (`saveInquiry` in `src/lib/supabase.js`)
  - Graceful fallback to client-side `localStorage` (`spark_inquiries`)
- **Event Tracking:** Dispatches Google Analytics 4 (`generate_lead`) event upon submission.
