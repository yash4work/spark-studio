import fs from 'fs';
import path from 'path';

const projectRoot = 'D:/sparkstudio-live/sparkstudio';

// 1. Read blogData.js and prepend the Onyx article
const blogDataPath = path.join(projectRoot, 'src', 'data', 'blogData.js');
let blogDataContent = fs.readFileSync(blogDataPath, 'utf8');

const onyxPostObject = `  {
    slug: 'onyx-atelier-framer-architecture-template-review',
    title: 'Onyx Atelier: The Monolithic Framer Template for Architecture & Interior Studios (2026 In-Depth Teardown)',
    category: 'Template Teardown',
    categorySlug: 'templates',
    readTime: '8 min read',
    date: 'November 2026',
    isoDate: '2026-11-10',
    author: {
      name: 'The Spark Studio Architecture',
      role: 'Spatial Design & Systems Team',
      avatar: '/assets/spark_studio_avatar.jpg'
    },
    excerpt: 'An architectural review of Onyx Atelier: the monolithic Framer template engineered for award-winning architects, interior ateliers, and spatial practices featuring Day & Night lighting switchers, horizontal monograph strips, and 98+ Core Web Vitals.',
    featuredImage: '/templates/onyx-atelier.webp',
    tags: ['Onyx Atelier', 'Architecture', 'Interior Design', 'Framer Template', 'Minimalism', 'AEO', 'SEO'],
    content: \`
## What Is Onyx Atelier?

**Onyx Atelier** is a premium, monograph-grade Framer template specifically engineered for high-end architecture practices, interior design ateliers, and spatial studios. Unlike conventional website templates that rely on generic image tiles and commercial blog layouts, Onyx Atelier is built like an architectural exhibition monograph—giving physical structures, tactile materiality, and light a museum-grade presence online.

Built natively in Framer by The Spark Studio, Onyx Atelier requires **zero lines of code to customize**, supports instant 1-click remixing, and benchmarks at **98/100 on Google Core Web Vitals** out of the box.

---

## Key Specifications & At-a-Glance Overview

| Specification | Details |
| :--- | :--- |
| **Product Name** | Onyx Atelier |
| **Primary Niche** | Architecture Practices, Interior Ateliers, Landscape Architects |
| **Platform** | Framer (Native Visual Canvas) |
| **Price** | $79 (Single Commercial License) |
| **CMS Collections** | 4 (Project Monographs, Case Studies, Publications, Team Profiles) |
| **PageSpeed Score** | 98/100 Mobile & Desktop Certified |
| **Responsive Breakpoints** | Desktop (1440px+), Tablet (810px), Mobile (390px) |
| **Unique Mechanics** | Interactive Day/Night Contrast Switcher, Horizontal Monograph Strip, Pre-qualifying Intake Desk |

---

## 1. The Monograph Hero & Scroll Expansion

Traditional architecture portfolios make the critical mistake of cluttering the viewport with commercial sales banners and heavy navigation bars. High-net-worth clients commissioning multi-million-dollar residential or commercial builds seek calm, confident spatial authority.

- **Monolithic Typography**: The hero section opens with expansive, architecturally proportioned display typography that commands attention without screaming.
- **Scroll-Linked Unfold**: As the user scrolls, the focal imagery dynamically expands from a grounded column into an immersive full-bleed spatial photograph, seamlessly immersing the visitor into the practice's signature project.

---

## 2. Interactive Day & Night Ambient Switcher

Lighting is the fundamental medium of architecture. A daylight photograph communicates spatial volume and natural airflow, while an evening photograph reveals ambient illumination, shadow play, and interior warmth.

- **Dual-State Spatial Preview**: Onyx Atelier includes a native, zero-lag Day/Night ambient toggle.
- **Client Immersion**: Prospective clients can instantly flip between sunlit architectural photography and dramatic nocturnal lighting scenarios without reloading the page.

---

## 3. The Horizontal Monograph Strip for Materiality

Architecture is tactile. Discerning clients care deeply about stone veining, timber joinery, concrete aggregates, and brushed metal finishes.

- **Sideways-Scrolling Plate Gallery**: Instead of burying material studies inside nested tabs, Onyx Atelier features an editorial horizontal scrolling strip dedicated to material samples, texture close-ups, and construction sketches.
- **Curated Pace**: Gives prospective clients the sensation of flipping through a heavy, clothbound architectural monograph.

---

## 4. Structured CMS Project Folios

Every project casework page in Onyx Atelier is engineered with the rigor of an architectural drawing:

- **Rigorous Technical Specifications**: Built-in data points for Project Typology (e.g. Private Residence, Cultural Pavilion), Completion Year, Gross Floor Area (GFA), Location, and Structural Collaborators.
- **Editorial Narrative Layouts**: Split-column reading sections allowing architects to explain the site context, the client brief, and the final structural resolution alongside full-height photographs.

---

## 5. The Commission Intake Desk (High-Intent Lead Routing)

Most agency contact forms ask for an email and a generic message box, resulting in low-quality inquiries.

- **Pre-Qualifying Architectural Questionnaire**: Onyx Atelier's intake desk prompts clients for project typology, estimated square footage, anticipated timeline, and budget range.
- **Frictionless Handoff**: Connects directly to Formspark, Formcarry, or custom Webhooks so principal architects receive qualified project briefs straight to their inbox.

---

## Frequently Asked Questions (FAQ)

### Can I customize Onyx Atelier without knowing how to code?
Yes. Onyx Atelier is built 100% natively on Framer’s visual canvas. You can swap typography, adjust color palettes, upload high-resolution photography, and re-order sections through Framer’s intuitive drag-and-drop interface.

### How do I update projects in the CMS?
Updating projects takes seconds. Simply open the Framer CMS collection, click "New Item", enter the project title, location, area, and upload your photo gallery. The template automatically formats and generates the responsive detail page.

### Does Onyx Atelier include commercial usage rights?
Yes. Every purchase includes a commercial license allowing you to deploy one live production website for your architecture studio or your client's firm.

### What PageSpeed score does Onyx Atelier achieve?
Onyx Atelier is engineered to achieve 95–99/100 on Google PageSpeed Insights, ensuring top search engine visibility and zero bounce rate from slow mobile connections.

---

## How to Get Started with Onyx Atelier

Ready to elevate your architecture firm's digital flagship? 

1. Preview the [Live Interactive Demo](https://active-strengthening-218427.framer.app/)
2. Get Instant 1-Click Remix & Commercial License at [Onyx Atelier Template Page](/templates/onyx-atelier)
3. Need custom engineering or architectural portfolio migration? Contact us at [hello@thesparkstudio.digital](mailto:hello@thesparkstudio.digital)
\`
  },
`;

if (!blogDataContent.includes('onyx-atelier-framer-architecture-template-review')) {
  blogDataContent = blogDataContent.replace('export const BLOG_POSTS = [\n', 'export const BLOG_POSTS = [\n' + onyxPostObject);
  fs.writeFileSync(blogDataPath, blogDataContent, 'utf8');
  console.log('Added Onyx Atelier to blogData.js');
}

// 2. Add localized records to en, de, es, fr
const localesDir = path.join(projectRoot, 'src', 'i18n', 'locales');
const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8'));
const de = JSON.parse(fs.readFileSync(path.join(localesDir, 'de.json'), 'utf8'));
const es = JSON.parse(fs.readFileSync(path.join(localesDir, 'es.json'), 'utf8'));
const fr = JSON.parse(fs.readFileSync(path.join(localesDir, 'fr.json'), 'utf8'));

const onyxSlug = 'onyx-atelier-framer-architecture-template-review';

en.blogPosts[onyxSlug] = {
  title: "Onyx Atelier: The Monolithic Framer Template for Architecture & Interior Studios (2026 In-Depth Teardown)",
  category: "Template Teardown",
  readTime: "8 min read",
  date: "November 2026",
  excerpt: "An architectural review of Onyx Atelier: the monolithic Framer template engineered for award-winning architects, interior ateliers, and spatial practices featuring Day & Night lighting switchers, horizontal monograph strips, and 98+ Core Web Vitals."
};

de.blogPosts[onyxSlug] = {
  title: "Onyx Atelier: Die monolithische Framer-Vorlage für Architektur & Interior Design (2026 Analyse)",
  category: "Vorlagen-Analyse",
  readTime: "8 Min. Lesezeit",
  date: "November 2026",
  excerpt: "Ein detaillierter Architektur-Review zu Onyx Atelier: die monolithische Framer-Vorlage für renommierte Architekten und Ateliers mit Tag/Nacht-Lichtwechsler, horizontalem Monographie-Streifen und 98+ PageSpeed."
};

es.blogPosts[onyxSlug] = {
  title: "Onyx Atelier: La plantilla monolítica de Framer para arquitectura e interiores (Análisis 2026)",
  category: "Análisis de Plantillas",
  readTime: "8 min de lectura",
  date: "Noviembre 2026",
  excerpt: "Revisión arquitectónica de Onyx Atelier: la plantilla Framer monolítica creada para estudios de arquitectura y diseño espacial con selector día/noche, galería horizontal de materiales y 98+ PageSpeed."
};

fr.blogPosts[onyxSlug] = {
  title: "Onyx Atelier : Le template Framer monolithique pour l'architecture et les intérieurs (Analyse 2026)",
  category: "Analyse de Templates",
  readTime: "8 min de lecture",
  date: "Novembre 2026",
  excerpt: "Analyse architecturale d'Onyx Atelier : le template Framer monolithique conçu pour les architectes et ateliers spatiaux avec sélecteur jour/nuit, galerie de matières horizontale et 98+ PageSpeed."
};

fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(path.join(localesDir, 'de.json'), JSON.stringify(de, null, 2), 'utf8');
fs.writeFileSync(path.join(localesDir, 'es.json'), JSON.stringify(es, null, 2), 'utf8');
fs.writeFileSync(path.join(localesDir, 'fr.json'), JSON.stringify(fr, null, 2), 'utf8');
console.log('Updated en, de, es, fr with Onyx Atelier translations');

// 3. Update sitemap generator
const sitemapGenPath = path.join(projectRoot, 'scripts', 'generate-sitemap.mjs');
let sitemapGen = fs.readFileSync(sitemapGenPath, 'utf8');
if (!sitemapGen.includes('onyx-atelier-framer-architecture-template-review')) {
  sitemapGen = sitemapGen.replace(
    "const BLOG_SLUGS = [\n",
    "const BLOG_SLUGS = [\n  'onyx-atelier-framer-architecture-template-review',\n"
  );
  fs.writeFileSync(sitemapGenPath, sitemapGen, 'utf8');
  console.log('Added Onyx Atelier to sitemap generator');
}
