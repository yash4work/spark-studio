import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';
import Hero from '../components/Hero';
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
    : 'Spark Studio — High-Performance Framer Templates & Custom Websites';

  const description = currentLang === 'de'
    ? 'Spark Studio entwickelt schnelle Framer-Templates und individuelle Websites für Start-ups und Unternehmen — 99+ PageSpeed, einfach zu bearbeiten.'
    : currentLang === 'es'
    ? 'Spark Studio diseña plantillas Framer de alto rendimiento y sitios web a medida para startups y creadores — fácil de editar, sin código, con 99+ PageSpeed.'
    : currentLang === 'fr'
    ? 'Spark Studio conçoit des templates Framer haute performance et des sites sur mesure pour startups et créateurs — édition visuelle sans code, avec scores 90+.'
    : 'Spark Studio designs high-performance Framer templates and custom websites for startups and creators — easy to edit, code-free, with 99+ PageSpeed scores.';

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
        '@type': 'ItemList',
        'name': 'Spark Studio Framer Templates Catalog',
        'description': 'Production-ready, high-performance Framer templates for architecture studios, luxury real estate, and digital commerce.',
        'url': 'https://sparkstudio0.framer.ai/',
        'numberOfItems': 7,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'url': 'https://sparkstudio0.framer.ai/templates/mavric-estate',
            'name': 'Mavric Estate — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'url': 'https://sparkstudio0.framer.ai/templates/aurelle-estates',
            'name': 'Aurelle Estates — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'url': 'https://sparkstudio0.framer.ai/templates/onyx-atelier',
            'name': 'Onyx Atelier — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 4,
            'url': 'https://sparkstudio0.framer.ai/templates/vellum-edition',
            'name': 'Vellum Edition — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 5,
            'url': 'https://sparkstudio0.framer.ai/templates/halden-edition',
            'name': 'Halden Edition — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 6,
            'url': 'https://sparkstudio0.framer.ai/templates/grain-form',
            'name': 'Grain & Form — Framer Template'
          },
          {
            '@type': 'ListItem',
            'position': 7,
            'url': 'https://sparkstudio0.framer.ai/templates/slowgrain',
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
