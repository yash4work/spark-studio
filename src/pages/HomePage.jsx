import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';
import Hero from '../components/Hero';
import TechStackBar from '../components/TechStackBar';
import Standards from '../components/Standards';
import AboutSection from '../components/AboutSection';
import Services from '../components/Services';
import TemplatesGrid from '../components/TemplatesGrid';
import BundlesSection from '../components/BundlesSection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';
import Marquee from '../components/Marquee';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language ? i18n.language.slice(0, 2) : 'en';

  const title = currentLang === 'de'
    ? 'Spark Studio — High-Performance Framer Vorlagen & Webdesign'
    : currentLang === 'es'
    ? 'Spark Studio — Plantillas Framer de Alto Rendimiento y Diseño Web a Medida'
    : currentLang === 'fr'
    ? 'Spark Studio — Templates Framer Haute Performance & Sites Web Sur Mesure'
    : 'Spark Studio — Websites, Custom Software & Framer Engineering';

  const description = currentLang === 'de'
    ? 'Spark Studio entwickelt schnelle Framer-Templates, Web-Apps und individuelle Websites für Start-ups — 99+ PageSpeed.'
    : currentLang === 'es'
    ? 'Spark Studio diseña aplicaciones web, sitios a medida y plantillas Framer de alto rendimiento para startups — con 99+ PageSpeed.'
    : currentLang === 'fr'
    ? 'Spark Studio conçoit des applications web sur mesure, des templates Framer et des sites haute performance avec scores 90+.'
    : 'Spark Studio designs and engineers high-performance custom websites, web applications, and Framer/Webflow platforms for ambitious startups and businesses — built with 90+ PageSpeed scores.';

  // Dynamic FAQ structured data for the active language
  const faqItems = t('faq.items', { returnObjects: true }) || [];
  const faqSchema = {
    '@type': 'FAQPage',
    'mainEntity': Array.isArray(faqItems) ? faqItems.map((item) => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    })) : []
  };

  // Google Carousel (ItemList) + FAQPage JSON-LD Schema
  const homepageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': 'https://www.thesparkstudio.digital/#organization',
        'name': 'Spark Studio',
        'url': 'https://www.thesparkstudio.digital/',
        'logo': 'https://www.thesparkstudio.digital/logo.png',
        'image': 'https://www.thesparkstudio.digital/assets/spark-studio-og-image.jpg',
        'description': 'Specialist Framer & Webflow web design studio crafting high-performance custom websites, Next.js web applications, and flagship visual CMS templates.',
        'email': 'sparkstudio0@outlook.com',
        'priceRange': '$$',
        'sameAs': [
          'https://www.framer.com/@sparkstudio0'
        ]
      },
      {
        '@type': 'ItemList',
        'name': 'Spark Studio Work & Templates Catalog',
        'description': 'Production-ready Next.js web applications, bespoke Framer and Webflow client websites, and high-performance digital templates.',
        'url': 'https://www.thesparkstudio.digital/#projects',
        'numberOfItems': 10,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'url': 'https://showcase-r5.vercel.app/',
            'name': 'AI SaaS Platform — Next.js Web Application'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'url': 'https://showcase-r4.vercel.app/',
            'name': 'Luxury Restaurant — Next.js Hospitality Website'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'url': 'https://showcase-r6.vercel.app/',
            'name': 'Premium Healthcare — Clinical Patient Portal'
          },
          {
            '@type': 'ListItem',
            'position': 4,
            'url': 'https://www.thesparkstudio.digital/templates/mavric-estate',
            'name': 'Mavric Estate — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 5,
            'url': 'https://www.thesparkstudio.digital/templates/aurelle-estates',
            'name': 'Aurelle Estates — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 6,
            'url': 'https://www.thesparkstudio.digital/templates/onyx-atelier',
            'name': 'Onyx Atelier — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 7,
            'url': 'https://www.thesparkstudio.digital/templates/vellum-edition',
            'name': 'Vellum Edition — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 8,
            'url': 'https://www.thesparkstudio.digital/templates/halden-edition',
            'name': 'Halden Edition — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 9,
            'url': 'https://www.thesparkstudio.digital/templates/grain-form',
            'name': 'Grain & Form — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 10,
            'url': 'https://www.thesparkstudio.digital/templates/slowgrain',
            'name': 'SLOWGRAIN — Framer Template'
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
      <TechStackBar />
      <Standards />
      <AboutSection />
      <Services />
      <TemplatesGrid />
      <BundlesSection />
      <FAQSection />
      <ContactSection />
      <Marquee />
    </>
  );
}
