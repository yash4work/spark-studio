import fs from 'fs';
import path from 'path';

const projectRoot = 'D:/sparkstudio-live/sparkstudio';

const ARTICLES = [
  {
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
    i18n: {
      en: {
        title: "Onyx Atelier: The Monolithic Framer Template for Architecture & Interior Studios (2026 In-Depth Teardown)",
        category: "Template Teardown",
        readTime: "8 min read",
        date: "November 2026",
        excerpt: "An architectural review of Onyx Atelier: the monolithic Framer template engineered for award-winning architects, interior ateliers, and spatial practices featuring Day & Night lighting switchers, horizontal monograph strips, and 98+ Core Web Vitals."
      },
      de: {
        title: "Onyx Atelier: Die monolithische Framer-Vorlage für Architektur & Interior Design (2026 Analyse)",
        category: "Vorlagen-Analyse",
        readTime: "8 Min. Lesezeit",
        date: "November 2026",
        excerpt: "Ein detaillierter Architektur-Review zu Onyx Atelier: die monolithische Framer-Vorlage für renommierte Architekten und Ateliers mit Tag/Nacht-Lichtwechsler, horizontalem Monographie-Streifen und 98+ PageSpeed."
      },
      es: {
        title: "Onyx Atelier: La plantilla monolítica de Framer para arquitectura e interiores (Análisis 2026)",
        category: "Análisis de Plantillas",
        readTime: "8 min de lectura",
        date: "Noviembre 2026",
        excerpt: "Revisión arquitectónica de Onyx Atelier: la plantilla Framer monolítica creada para estudios de arquitectura y diseño espacial con selector día/noche, galería horizontal de materiales y 98+ PageSpeed."
      },
      fr: {
        title: "Onyx Atelier : Le template Framer monolithique pour l'architecture et les intérieurs (Analyse 2026)",
        category: "Analyse de Templates",
        readTime: "8 min de lecture",
        date: "Novembre 2026",
        excerpt: "Analyse architecturale d'Onyx Atelier : le template Framer monolithique conçu pour les architectes et ateliers spatiaux avec sélecteur jour/nuit, galerie de matières horizontale et 98+ PageSpeed."
      }
    },
    content: `
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
2. View Full Template Specs & Commercial License at [Onyx Atelier Template Details](/templates/onyx-atelier)
3. Need custom engineering or architectural portfolio migration? Contact us at [hello@thesparkstudio.digital](mailto:hello@thesparkstudio.digital)
`
  },
  {
    slug: 'slowgrain-solum-framer-architecture-template-free-review',
    title: 'SLOWGRAIN (Solum): The Best Free Framer Template for Architects & Spatial Ateliers (2026 Review)',
    category: 'Free Template Review',
    categorySlug: 'templates',
    readTime: '7 min read',
    date: 'November 2026',
    isoDate: '2026-11-10',
    author: {
      name: 'The Spark Studio Architecture',
      role: 'Spatial Design & Systems Team',
      avatar: '/assets/spark_studio_avatar.jpg'
    },
    excerpt: 'Looking for the best free Framer template for an architecture or design atelier? A deep-dive review of SLOWGRAIN (Solum)—a zero-cost, museum-grade portfolio template with 99 PageSpeed and full CMS.',
    featuredImage: '/templates/slowgrain.webp',
    tags: ['Free Template', 'SLOWGRAIN', 'Solum', 'Architecture', 'Interior Design', 'Framer', 'Free Download'],
    i18n: {
      en: {
        title: "SLOWGRAIN (Solum): The Best Free Framer Template for Architects & Spatial Ateliers (2026 Review)",
        category: "Free Template Review",
        readTime: "7 min read",
        date: "November 2026",
        excerpt: "Looking for the best free Framer template for an architecture or design atelier? A deep-dive review of SLOWGRAIN (Solum)—a zero-cost, museum-grade portfolio template with 99 PageSpeed and full CMS."
      },
      de: {
        title: "SLOWGRAIN (Solum): Die beste kostenlose Framer-Vorlage für Architekten & Ateliers (2026 Test)",
        category: "Kostenlose Vorlage",
        readTime: "7 Min. Lesezeit",
        date: "November 2026",
        excerpt: "Suchen Sie nach der besten kostenlosen Framer-Vorlage für Architektur und Raumgestaltung? Ausführlicher Test von SLOWGRAIN (Solum)—eine kostenlose, museumsreife Portfolio-Vorlage mit 99 PageSpeed."
      },
      es: {
        title: "SLOWGRAIN (Solum): La mejor plantilla gratuita de Framer para arquitectos y estudios espaciales (2026)",
        category: "Plantilla Gratuita",
        readTime: "7 min de lectura",
        date: "Noviembre 2026",
        excerpt: "¿Buscas la mejor plantilla gratuita de Framer para estudios de arquitectura? Análisis exhaustivo de SLOWGRAIN (Solum): plantilla de nivel de museo, coste cero y 99 PageSpeed."
      },
      fr: {
        title: "SLOWGRAIN (Solum) : Le meilleur template Framer gratuit pour architectes et ateliers (Analyse 2026)",
        category: "Template Gratuit",
        readTime: "7 min de lecture",
        date: "Novembre 2026",
        excerpt: "À la recherche du meilleur template Framer gratuit pour l'architecture et le design spatial ? Analyse complète de SLOWGRAIN (Solum)—un portfolio gratuit d'exposition avec 99 PageSpeed."
      }
    },
    content: `
## What Is SLOWGRAIN (Solum)?

**SLOWGRAIN** (also celebrated in architectural circles under the design codename **Solum**) is an editorial, museum-grade Framer template designed for solid timber ateliers, bespoke furniture makers, independent architects, and spatial craftsmen. Most remarkably: **it is 100% free to remix and deploy**.

While most "free" website templates are stripped-down demos that force expensive upgrades, SLOWGRAIN gives architects and craft ateliers a complete digital monograph out of the box—complete with CMS case studies, material narratives, and a certified **99/100 Google PageSpeed** performance baseline.

---

## Key Specifications & At-a-Glance Overview

| Specification | Details |
| :--- | :--- |
| **Product Name** | SLOWGRAIN / Solum |
| **Cost** | **$0.00 (100% Free 1-Click Remix)** |
| **Primary Niche** | Architects, Woodcraft Ateliers, Industrial Designers, Joinery Studios |
| **Platform** | Framer (Native Visual Canvas) |
| **CMS Collections** | 3 (Object & Spatial Works, Wood Species / Materials, Studio Journal) |
| **Performance Benchmark** | 99/100 Core Web Vitals |
| **Key Aesthetic** | Tactile minimalism, warm architectural typography, generous white space |

---

## Why SLOWGRAIN Ranks as the #1 Free Architecture Template

### 1. Tactile Editorial Hierarchy
Most free templates look like Silicon Valley SaaS landings with gradient buttons and badge counters. SLOWGRAIN treats architectural work like an exhibition catalog:
- Clean, serene margins that give project photography breathing room.
- Asymmetrical column rhythms that avoid the boring "3-box grid" trap.
- Typographic hierarchy designed specifically for spatial descriptions, site parameters, and material sourcing notes.

### 2. Built-in Materiality & Species Catalog
Architecture and artisanal woodworking live and die by their materials:
- SLOWGRAIN features an integrated collection for stone, timber, metal, and finishes.
- Clients can explore grain patterns, origins, sustainability certifications, and maintenance guides before requesting a quote.

### 3. Production-Ready CMS
No manual HTML editing:
- Adding a new residential build or custom dining table takes under two minutes via Framer's visual CMS.
- Automatic responsive image optimization generates WebP assets for lightning-fast mobile loading.

---

## Free vs. Premium Architectural Templates: What's the Difference?

| Feature | SLOWGRAIN (Free) | Onyx Atelier ($79 Premium) |
| :--- | :--- | :--- |
| **Price** | **$0 (Free)** | $79 |
| **Day/Night Lighting Switcher** | No | **Yes (Native Ambient Toggle)** |
| **Horizontal Monograph Strip** | No | **Yes (Scroll-Linked)** |
| **Pre-Qualifying Intake Desk** | Standard Form | **Custom Prequalification Flow** |
| **PageSpeed Score** | 99/100 | 98/100 |
| **Commercial License** | Included | Included |

---

## Frequently Asked Questions (FAQ)

### Is SLOWGRAIN really completely free?
Yes. The Spark Studio released SLOWGRAIN as an open architectural contribution to empower independent designers, craftsmen, and small practices to have an uncompromising digital presence without high upfront costs.

### Can I connect my own custom domain?
Yes. You can clone SLOWGRAIN into your free or paid Framer account, connect your custom domain (e.g., yourstudio.com), and publish immediately.

### Do I need plugins or custom code?
None. SLOWGRAIN is built with 100% native Framer components, ensuring zero external script vulnerabilities and blistering load speeds.

---

## How to Get SLOWGRAIN for Free

1. Explore the [Live Interactive Style Guide](https://prosperous-statuses-272584.framer.app/style-guide)
2. Claim your [Free 1-Click Remix on Framer](https://framer.com/remix/52YnIzlJOEXddxCP5O1n)
3. View template details at [SLOWGRAIN Template Page](/templates/slowgrain)
`
  },
  {
    slug: 'sasso-architect-framer-template-review',
    title: 'SASSO Architect: Monograph-Grade Framer Flagship for Boutique Architecture Practices (2026 Teardown)',
    category: 'Template Teardown',
    categorySlug: 'templates',
    readTime: '8 min read',
    date: 'November 2026',
    isoDate: '2026-11-09',
    author: {
      name: 'The Spark Studio Architecture',
      role: 'Spatial Design & Systems Team',
      avatar: '/assets/spark_studio_avatar.jpg'
    },
    excerpt: 'A comprehensive architectural review of SASSO Architect—the monograph-grade Framer template designed for boutique architecture studios, spatial ateliers, and interior practices.',
    featuredImage: 'https://framerusercontent.com/images/vXQOoXIJexVdw0e3emiEMLvyOds.png',
    tags: ['SASSO Architect', 'Architecture', 'Interior Design', 'Framer Marketplace', 'Boutique Firm'],
    i18n: {
      en: {
        title: "SASSO Architect: Monograph-Grade Framer Flagship for Boutique Architecture Practices (2026 Teardown)",
        category: "Template Teardown",
        readTime: "8 min read",
        date: "November 2026",
        excerpt: "A comprehensive architectural review of SASSO Architect—the monograph-grade Framer template designed for boutique architecture studios, spatial ateliers, and interior practices."
      },
      de: {
        title: "SASSO Architect: Monographie-Framer-Vorlage für Boutique-Architekturbüros (2026 Analyse)",
        category: "Vorlagen-Analyse",
        readTime: "8 Min. Lesezeit",
        date: "November 2026",
        excerpt: "Umfassender Architektur-Test von SASSO Architect—das Flaggschiff für Boutique-Architekturbüros, Raumgestalter und Innenarchitektur-Praxen."
      },
      es: {
        title: "SASSO Architect: Flagship de Framer para estudios boutique de arquitectura (Análisis 2026)",
        category: "Análisis de Plantillas",
        readTime: "8 min de lectura",
        date: "Noviembre 2026",
        excerpt: "Revisión arquitectónica de SASSO Architect: la plantilla de nivel monográfico diseñada para estudios boutique de arquitectura y prácticas de diseño interior."
      },
      fr: {
        title: "SASSO Architect : Le flagship Framer pour agences d'architecture boutique (Analyse 2026)",
        category: "Analyse de Templates",
        readTime: "8 min de lecture",
        date: "Novembre 2026",
        excerpt: "Analyse architecturale complète de SASSO Architect : le template monographique d'exception pour agences d'architecture boutique et designers d'intérieur."
      }
    },
    content: `
## What Is SASSO Architect?

**SASSO Architect** is an authoritative, monograph-grade Framer template built specifically for boutique architecture studios, spatial ateliers, and modern interior practices. Officially curated on the Framer Marketplace, SASSO bridges the tension between brutalist clarity and refined editorial elegance.

For architectural principals looking to win six-figure commercial commissions or bespoke residential briefs, SASSO delivers the visual credibility of an established international atelier from day one.

---

## Key Specifications & At-a-Glance Overview

| Specification | Details |
| :--- | :--- |
| **Product Name** | SASSO Architect |
| **Marketplace Status** | Official Framer Marketplace Certified |
| **Price** | $69 (Commercial License) |
| **Primary Niche** | Boutique Architecture Studios, Spatial Designers, Urban Planners |
| **Platform** | Framer (Native Visual Canvas) |
| **CMS Collections** | 4 (Works & Folios, Monograph Articles, Studio Philosophy, Recognition & Awards) |
| **Performance Benchmark** | 96/100 Core Web Vitals |
| **Signature Dynamic** | Split-screen project narrative, architectural spec sheets, typographic restraint |

---

## 1. Split-Screen Project Narrative
While standard templates force users down long vertical walls of text, SASSO uses an architectural split-screen layout:
- **Left Column (Context & Specs)**: Remains anchored with project typology, location, structural materials, year of completion, and the conceptual brief.
- **Right Column (Spatial Imagery)**: Floats through full-bleed elevation drawings, photography, and interior detail close-ups.

This mirrors the exact experience of viewing an architectural competition presentation board.

---

## 2. Studio Monograph & Theory Publications
Discerning clients and design juries don't just hire builders; they hire thinkers. SASSO gives your practice a dedicated editorial platform:
- Publish theoretical essays, site analyses, and construction methodology papers.
- Structured with reading-time calculators, footnotes, and publication citations for maximum academic and commercial authority.

---

## 3. Awards & Recognition Matrix
Win more pitches by showcasing your practice’s accolades:
- Integrated chronological ledger for RIBA, AIA, Dezeen Awards, and architectural biennials.
- Clean typography without tacky ribbon badges or low-res sponsor icons.

---

## Frequently Asked Questions (FAQ)

### Is SASSO Architect easy to update?
Extremely easy. Every project, article, and award is driven by Framer's visual CMS. You can add a new project in minutes without editing layout files.

### Does it support video walkthroughs?
Yes. SASSO supports native video embeds, Vimeo/YouTube spatial reels, and self-hosted MP4 background video loops with zero layout shift.

---

## How to Get Started with SASSO Architect

1. Preview the [Live Interactive Demo](https://small-bookings-302943.framer.app/)
2. View Full Template Specs at [SASSO Architect Details](/templates/sasso-architect)
3. Available on the [Framer Marketplace](https://www.framer.com/marketplace/templates/sasso-architect/)
`
  },
  {
    slug: 'aurelle-estates-framer-architecture-template-review',
    title: 'Aurelle Estates: Luxury Architecture & High-End Property Flagship for Framer (2026 In-Depth Review)',
    category: 'Template Teardown',
    categorySlug: 'templates',
    readTime: '9 min read',
    date: 'November 2026',
    isoDate: '2026-11-08',
    author: {
      name: 'The Spark Studio Architecture',
      role: 'Spatial Design & Systems Team',
      avatar: '/assets/spark_studio_avatar.jpg'
    },
    excerpt: 'An in-depth breakdown of Aurelle Estates: the $99 Framer flagship template built for ultra-prime real estate developments, luxury residential architects, and private estates.',
    featuredImage: '/templates/aurelle-estates.webp',
    tags: ['Aurelle Estates', 'Luxury Real Estate', 'Architecture', 'Framer', 'High-End Homes'],
    i18n: {
      en: {
        title: "Aurelle Estates: Luxury Architecture & High-End Property Flagship for Framer (2026 In-Depth Review)",
        category: "Template Teardown",
        readTime: "9 min read",
        date: "November 2026",
        excerpt: "An in-depth breakdown of Aurelle Estates: the $99 Framer flagship template built for ultra-prime real estate developments, luxury residential architects, and private estates."
      },
      de: {
        title: "Aurelle Estates: Luxus-Architektur & High-End Immobilien Framer-Vorlage (2026 Analyse)",
        category: "Vorlagen-Analyse",
        readTime: "9 Min. Lesezeit",
        date: "November 2026",
        excerpt: "Detaillierte Analyse von Aurelle Estates: die $99 Framer-Vorlage für Luxus-Wohnarchitektur, High-End Immobilienentwickler und private Anwesen."
      },
      es: {
        title: "Aurelle Estates: Plantilla Framer para arquitectura de lujo e inmuebles de alta gama (Análisis 2026)",
        category: "Análisis de Plantillas",
        readTime: "9 min de lectura",
        date: "Noviembre 2026",
        excerpt: "Análisis en profundidad de Aurelle Estates: la plantilla Framer de $99 diseñada para desarrollos inmobiliarios ultra-prime y arquitectura residencial de lujo."
      },
      fr: {
        title: "Aurelle Estates : Template Framer pour l'architecture de luxe et l'immobilier d'exception (Analyse 2026)",
        category: "Analyse de Templates",
        readTime: "9 min de lecture",
        date: "Novembre 2026",
        excerpt: "Examen approfondi d'Aurelle Estates : le template Framer haut de gamme à 99 $ conçu pour les développements résidentiels de prestige et l'immobilier ultra-luxe."
      }
    },
    content: `
## What Is Aurelle Estates?

**Aurelle Estates** is an ultra-prime Framer flagship template designed specifically for high-net-worth real estate developments, private architectural residences, and luxury estate developments. High-net-worth buyers and prospective investors do not browse generic listing portals—they demand spatial authority, privacy, and architectural grandeur.

Aurelle Estates positions multi-million-dollar residential properties with the exclusivity of an art collection.

---

## Key Specifications & At-a-Glance Overview

| Specification | Details |
| :--- | :--- |
| **Product Name** | Aurelle Estates |
| **Price** | $99 (Commercial License) |
| **Primary Niche** | Luxury Residential Architects, Prime Property Developers, Estate Agents |
| **Platform** | Framer (Native Visual Canvas) |
| **CMS Collections** | 4 (Estate Residences, Architectural Blueprints, Neighborhood Guides, Press & Media) |
| **Performance Benchmark** | 97/100 Core Web Vitals |
| **Signature Features** | Private Viewing Booking Flow, Interactive Floor Plan Viewer, High-Resolution Architectural Framing |

---

## 1. Architectural Storytelling for Prime Residences
Instead of displaying a dizzying list of bedroom counts and prices in commercial bubbles, Aurelle Estates unfolds each residence like a chapter in a luxury hardbound volume:
- Expansive full-width photographic galleries.
- Site orientation and natural light studies.
- Environmental and acoustic isolation details.

---

## 2. Interactive Floor Plan & Spatial Layouts
Architecture enthusiasts and discerning investors want to understand spatial flow:
- Integrated vector floor plan viewer allowing visitors to toggle between ground levels, penthouse terraces, and subterranean wellness suites.
- Clean measurement callouts in both Imperial and Metric formats.

---

## 3. Discrect Private Inquiry Desk
Privacy is paramount in prime real estate:
- Clean, confidential booking module for scheduling private helicopter transfers, on-site walkthroughs, or architectural advisory calls.
- Encrypted data capture ready for HubSpot, Salesforce, or Formspark CRM integration.

---

## Frequently Asked Questions (FAQ)

### Can I adapt Aurelle Estates for single-property showcases?
Yes. Aurelle Estates can be used both as a multi-residence portfolio or dedicated to a single flagship architectural estate.

### Does it support multiple currencies?
Yes. You can display prices in USD, EUR, GBP, or mark them as "Price Upon Request" depending on client confidentiality requirements.

---

## How to Get Started with Aurelle Estates

1. Preview the [Live Interactive Demo](https://wandering-variations-344785.framer.app/)
2. View Full Template Specs at [Aurelle Estates Template Page](/templates/aurelle-estates)
3. Instant 1-Click Remix with commercial license available on Lemon Squeezy
`
  },
  {
    slug: 'vellum-edition-framer-architecture-template-review',
    title: 'Vellum Edition: Quiet Art-Book Monograph Framer Template for Spatial Designers (2026 Review)',
    category: 'Template Teardown',
    categorySlug: 'templates',
    readTime: '6 min read',
    date: 'November 2026',
    isoDate: '2026-11-07',
    author: {
      name: 'The Spark Studio Architecture',
      role: 'Spatial Design & Systems Team',
      avatar: '/assets/spark_studio_avatar.jpg'
    },
    excerpt: 'An architectural review of Vellum Edition: a quiet, $29 art-book monograph Framer template for architecture studios that let photography and material narratives lead.',
    featuredImage: '/templates/vellum-edition.webp',
    tags: ['Vellum Edition', 'Architecture', 'Art Book', 'Minimalism', 'Framer Template'],
    i18n: {
      en: {
        title: "Vellum Edition: Quiet Art-Book Monograph Framer Template for Spatial Designers (2026 Review)",
        category: "Template Teardown",
        readTime: "6 min read",
        date: "November 2026",
        excerpt: "An architectural review of Vellum Edition: a quiet, $29 art-book monograph Framer template for architecture studios that let photography and material narratives lead."
      },
      de: {
        title: "Vellum Edition: Ruhige Kunstbuch-Framer-Vorlage für Raumdesigner (2026 Analyse)",
        category: "Vorlagen-Analyse",
        readTime: "6 Min. Lesezeit",
        date: "November 2026",
        excerpt: "Architektur-Test von Vellum Edition: eine ruhige $29 Kunstbuch-Framer-Vorlage für Architekturbüros, bei denen Fotografie und Materialerzählungen im Mittelpunkt stehen."
      },
      es: {
        title: "Vellum Edition: Plantilla Framer tipo libro de arte para diseñadores espaciales (2026)",
        category: "Análisis de Plantillas",
        readTime: "6 min de lectura",
        date: "Noviembre 2026",
        excerpt: "Revisión arquitectónica de Vellum Edition: una plantilla monográfica de $29 tipo libro de arte para estudios de arquitectura donde la fotografía y la materia son protagonistas."
      },
      fr: {
        title: "Vellum Edition : Le template Framer livre d'art pour designers d'espace (Analyse 2026)",
        category: "Analyse de Templates",
        readTime: "6 min de lecture",
        date: "Novembre 2026",
        excerpt: "Analyse de Vellum Edition : un template Framer épuré à 29 $ façon livre d'art pour les agences d'architecture qui privilégient la photographie et la matière."
      }
    },
    content: `
## What Is Vellum Edition?

**Vellum Edition** is an art-book monograph Framer template designed for architectural practices, spatial photographers, and interior ateliers that believe silence speaks louder than noise. At an accessible price of just **$29**, Vellum provides a sophisticated editorial aesthetic that usually costs thousands in bespoke development.

Inspired by physical Swiss monographs and Japanese architectural journals, Vellum removes all gratuitous decorative elements to let pure spatial photography and tactile materiality lead.

---

## Key Specifications & At-a-Glance Overview

| Specification | Details |
| :--- | :--- |
| **Product Name** | Vellum Edition |
| **Price** | $29 (Commercial License) |
| **Primary Niche** | Architecture Photographers, Spatial Designers, Independent Ateliers |
| **Platform** | Framer (Native Visual Canvas) |
| **CMS Collections** | 3 (Visual Monographs, Material Observations, Studio Notes) |
| **Performance Benchmark** | 99/100 Core Web Vitals |
| **Signature Aesthetic** | Warm paper-toned backgrounds, refined serif typography, unhurried pacing |

---

## 1. Pacing & Art-Book Layout
Digital portfolios are often frantic, pushing visitors into rapid scrolling. Vellum adopts an unhurried, art-book rhythm:
- Deliberate pauses and generous whitespace between architectural series.
- Large plate images with unobtrusive captioning for structural materials, year, and location.

---

## 2. Ultra-Lightweight 99/100 Performance
Because Vellum avoids heavy scripts, excessive canvas animations, or redundant frameworks, it loads virtually instantaneously across all global locations:
- 0ms Cumulative Layout Shift (CLS).
- Sub-second Largest Contentful Paint (LCP) even on cellular connections.

---

## Frequently Asked Questions (FAQ)

### Can I customize the font pairing?
Yes. You can switch to any Google Font, custom Typekit web font, or uploaded OTF/WOFF2 font file in one click in Framer.

### Is Vellum Edition suitable for interior designers?
Absolutely. Interior designers with rich photography collections find Vellum to be the cleanest way to present residential and hospitality projects.

---

## How to Get Started with Vellum Edition

1. Preview the [Live Interactive Demo](https://unlimited-mind-018782.framer.app/)
2. View Full Template Specs at [Vellum Edition Details](/templates/vellum-edition)
3. Instant 1-Click Remix on Lemon Squeezy for $29
`
  }
];

// 1. UPDATE blogData.js
const blogDataPath = path.join(projectRoot, 'src', 'data', 'blogData.js');
let blogDataContent = fs.readFileSync(blogDataPath, 'utf8');

// Normalize CRLF to LF temporarily for matching
const isCRLF = blogDataContent.includes('\r\n');
let normalizedContent = blogDataContent.replace(/\r\n/g, '\n');

ARTICLES.forEach((article) => {
  if (!normalizedContent.includes(`slug: '${article.slug}'`)) {
    const postObject = `  {
    slug: '${article.slug}',
    title: ${JSON.stringify(article.title)},
    category: ${JSON.stringify(article.category)},
    categorySlug: ${JSON.stringify(article.categorySlug)},
    readTime: ${JSON.stringify(article.readTime)},
    date: ${JSON.stringify(article.date)},
    isoDate: ${JSON.stringify(article.isoDate)},
    author: {
      name: ${JSON.stringify(article.author.name)},
      role: ${JSON.stringify(article.author.role)},
      avatar: ${JSON.stringify(article.author.avatar)}
    },
    excerpt: ${JSON.stringify(article.excerpt)},
    featuredImage: ${JSON.stringify(article.featuredImage)},
    tags: ${JSON.stringify(article.tags)},
    content: \`${article.content.replace(/`/g, '\\`')}\`
  },
`;
    normalizedContent = normalizedContent.replace('export const BLOG_POSTS = [\n', 'export const BLOG_POSTS = [\n' + postObject);
    console.log(`Added article: ${article.slug}`);
  } else {
    console.log(`Article already exists: ${article.slug}`);
  }
});

if (isCRLF) {
  normalizedContent = normalizedContent.replace(/\n/g, '\r\n');
}
fs.writeFileSync(blogDataPath, normalizedContent, 'utf8');

// 2. UPDATE i18n Locales (en, de, es, fr)
const localesDir = path.join(projectRoot, 'src', 'i18n', 'locales');
const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8'));
const de = JSON.parse(fs.readFileSync(path.join(localesDir, 'de.json'), 'utf8'));
const es = JSON.parse(fs.readFileSync(path.join(localesDir, 'es.json'), 'utf8'));
const fr = JSON.parse(fs.readFileSync(path.join(localesDir, 'fr.json'), 'utf8'));

en.blogPosts = en.blogPosts || {};
de.blogPosts = de.blogPosts || {};
es.blogPosts = es.blogPosts || {};
fr.blogPosts = fr.blogPosts || {};

ARTICLES.forEach((article) => {
  en.blogPosts[article.slug] = article.i18n.en;
  de.blogPosts[article.slug] = article.i18n.de;
  es.blogPosts[article.slug] = article.i18n.es;
  fr.blogPosts[article.slug] = article.i18n.fr;
});

fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(path.join(localesDir, 'de.json'), JSON.stringify(de, null, 2), 'utf8');
fs.writeFileSync(path.join(localesDir, 'es.json'), JSON.stringify(es, null, 2), 'utf8');
fs.writeFileSync(path.join(localesDir, 'fr.json'), JSON.stringify(fr, null, 2), 'utf8');
console.log('Successfully updated en.json, de.json, es.json, fr.json with all 5 architectural articles!');

// 3. UPDATE scripts/generate-sitemap.mjs
const sitemapGenPath = path.join(projectRoot, 'scripts', 'generate-sitemap.mjs');
let sitemapGen = fs.readFileSync(sitemapGenPath, 'utf8');

ARTICLES.forEach((article) => {
  if (!sitemapGen.includes(`'${article.slug}'`)) {
    sitemapGen = sitemapGen.replace(
      "const BLOG_SLUGS = [\n",
      `const BLOG_SLUGS = [\n  '${article.slug}',\n`
    );
    console.log(`Added ${article.slug} to sitemap generator`);
  }
});
fs.writeFileSync(sitemapGenPath, sitemapGen, 'utf8');
