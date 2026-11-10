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
  screenshots/  Reference screenshots of the live site
dev/            Scraping/inspection scripts used during development
                (not part of the shipped app — see dev/README.md)
```

## Notes
- Routes are language-prefixed (`/de`, `/es`, `/fr`, default `en`); see
  `RouteManager` in `src/App.jsx`.
- Template detail pages are lazy-loaded and validated against `VALID_SLUGS`
  in `src/App.jsx`.
