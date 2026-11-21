import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';
import Hero from '../components/Hero';
import TechStackBar from '../components/TechStackBar';
import Standards from '../components/Standards';
import AboutSection from '../components/AboutSection';
import Services from '../components/Services';
import TemplatesGrid from '../components/TemplatesGrid';
import BundlesSection from '../components/BundlesSection';
import BlogSection from '../components/BlogSection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';
import Marquee from '../components/Marquee';
import { ScrollReveal } from '../lib/framer-effects';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language ? i18n.language.slice(0, 2) : 'en';

  const title = currentLang === 'de'
    ? 'The Spark Studio — High-Performance Framer Vorlagen & Webdesign'
    : currentLang === 'es'
    ? 'The Spark Studio — Plantillas Framer de Alto Rendimiento y Diseño Web a Medida'
    : currentLang === 'fr'
    ? 'The Spark Studio — Templates Framer Haute Performance & Sites Web Sur Mesure'
    : 'The Spark Studio — Websites, Custom Software & Framer Engineering';

  const description = currentLang === 'de'
    ? 'The Spark Studio entwickelt schnelle Framer-Templates, Web-Apps und individuelle Websites für Start-ups — 99+ PageSpeed.'
    : currentLang === 'es'
    ? 'The Spark Studio diseña aplicaciones web, sitios a medida y plantillas Framer de alto rendimiento para startups — con 99+ PageSpeed.'
    : currentLang === 'fr'
    ? 'The Spark Studio conçoit des applications web sur mesure, des templates Framer et des sites haute performance avec scores 90+.'
    : 'The Spark Studio designs and engineers high-performance custom websites, web applications, and bespoke Framer platforms for ambitious startups and businesses — built with 90+ PageSpeed scores.';

  const homePrefix = currentLang === 'en' ? '' : `/${currentLang}`;
  const localizedUrl = `https://www.thesparkstudio.digital${homePrefix || '/'}`;

  // Dynamic FAQ structured data for the active language
  const faqItems = t('faq.items', { returnObjects: true }) || [];
  const faqSchema = {
    '@type': 'FAQPage',
    'inLanguage': currentLang,
    'mainEntity': Array.isArray(faqItems) ? faqItems.map((item) => ({
      '@type': 'Question',
      'name': item.question || item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer || item.a
      }
    })) : []
  };

  // Google Carousel (ItemList) + FAQPage JSON-LD Schema
  const homepageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.thesparkstudio.digital/#website',
        'url': 'https://www.thesparkstudio.digital/',
        'name': 'The Spark Studio',
        'publisher': { '@id': 'https://www.thesparkstudio.digital/#organization' }
      },
      {
        '@type': 'ProfessionalService',
        '@id': 'https://www.thesparkstudio.digital/#organization',
        'name': 'The Spark Studio',
        'alternateName': ['Spark Studio', 'thesparkstudio.digital'],
        'url': localizedUrl,
        'logo': 'https://www.thesparkstudio.digital/logo.png',
        'image': 'https://www.thesparkstudio.digital/assets/spark-studio-og-image.jpg',
        'description': description,
        'inLanguage': currentLang,
        'email': 'sparkstudio0@outlook.com',
        'priceRange': '$$',
        'sameAs': [
          'https://www.framer.com/@thesparkstudio',
          'https://www.linkedin.com/company/sparkstudio0'
        ]
      },
      {
        '@type': 'ItemList',
        'name': currentLang === 'de'
          ? 'The Spark Studio Portfolio & Vorlagen-Katalog'
          : currentLang === 'es'
          ? 'The Spark Studio Catálogo de Plantillas y Proyectos'
          : currentLang === 'fr'
          ? 'The Spark Studio Catalogue de Templates et Projets'
          : 'The Spark Studio Work & Templates Catalog',
        'description': description,
        'url': `${localizedUrl}#projects`,
        'numberOfItems': 13,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'url': `https://www.thesparkstudio.digital${homePrefix}/templates/ai-saas`,
            'name': 'AI SaaS Platform — Next.js Web Application'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'url': `https://www.thesparkstudio.digital${homePrefix}/templates/luxury-restaurant`,
            'name': 'Luxury Restaurant — Next.js Hospitality Website'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'url': `https://www.thesparkstudio.digital${homePrefix}/templates/premium-healthcare`,
            'name': 'Premium Healthcare — Clinical Patient Portal'
          },
          {
            '@type': 'ListItem',
            'position': 4,
            'url': `https://www.thesparkstudio.digital${homePrefix}/templates/mavric-estate`,
            'name': 'Mavric Estate — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 5,
            'url': `https://www.thesparkstudio.digital${homePrefix}/templates/aurelle-estates`,
            'name': 'Aurelle Estates — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 6,
            'url': `https://www.thesparkstudio.digital${homePrefix}/templates/onyx-atelier`,
            'name': 'Onyx Atelier — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 7,
            'url': `https://www.thesparkstudio.digital${homePrefix}/templates/vellum-edition`,
            'name': 'Vellum Edition — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 8,
            'url': `https://www.thesparkstudio.digital${homePrefix}/templates/halden-edition`,
            'name': 'Halden Edition — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 9,
            'url': `https://www.thesparkstudio.digital${homePrefix}/templates/grain-form`,
            'name': 'Grain & Form — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 10,
            'url': `https://www.thesparkstudio.digital${homePrefix}/templates/slowgrain`,
            'name': 'SLOWGRAIN — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 11,
            'url': `https://www.thesparkstudio.digital${homePrefix}/templates/terra`,
            'name': 'TERRA — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 12,
            'url': `https://www.thesparkstudio.digital${homePrefix}/templates/sasso-architect`,
            'name': 'SASSO Architect — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 13,
            'url': `https://www.thesparkstudio.digital${homePrefix}/templates/tessovra`,
            'name': 'TESSOVRA — Framer Template'
          }
        ]
      },
      faqSchema
    ]
  };

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        image="/assets/spark-studio-og-image.jpg"
        jsonLd={homepageJsonLd}
      />
      <Hero />
      <ScrollReveal><TechStackBar /></ScrollReveal>
      <ScrollReveal><Standards /></ScrollReveal>
      <ScrollReveal><AboutSection /></ScrollReveal>
      <ScrollReveal><Services /></ScrollReveal>
      <ScrollReveal><TemplatesGrid /></ScrollReveal>
      <ScrollReveal><BundlesSection /></ScrollReveal>
      <ScrollReveal><BlogSection /></ScrollReveal>
      <ScrollReveal><FAQSection /></ScrollReveal>
      <ScrollReveal><ContactSection /></ScrollReveal>
      <Marquee />
    </>
  );
}
