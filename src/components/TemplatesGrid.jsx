import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { initLemonSqueezy, handleLemonCheckout } from '../lib/lemonsqueezy';
import { AnimatePresence } from 'framer-motion';
import { MagneticButton } from '../lib/framer-effects';

const TEMPLATES = [
  {
    slug: 'mavric-estate',
    name: 'Mavric Estate',
    category: 'Modern real estate CMS & realtor',
    categoryKey: 'real-estate',
    tagline: 'Generic realtor websites lose leads to Zillow. Mavric Estate is engineered to capture them.',
    price: '$69',
    badge: null,
    image: '/templates/mavric-estate.png',
    demoUrl: 'https://mavric-estate.framer.website/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/f22889c0-30a4-45d5-87c0-730fb44cc172?embed=1'
  },
  {
    slug: 'aurelle-estates',
    name: 'Aurelle Estates',
    category: 'Editorial luxury real estate',
    categoryKey: 'real-estate',
    tagline: 'High-net-worth buyers don’t browse standard portals — they seek architectural authority.',
    price: '$99',
    badge: 'Agent',
    image: '/templates/aurelle-estates.png',
    demoUrl: 'https://wandering-variations-344785.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/e4d03d2d-2408-4a55-92e4-84c50735f47d?embed=1'
  },
  {
    slug: 'onyx-atelier',
    name: 'Onyx Atelier',
    category: 'Monolithic architecture & interior',
    categoryKey: 'architecture',
    tagline: 'Most architecture portfolios look like generic image grids. Onyx Atelier is built like an exhibition monograph.',
    price: '$79',
    badge: 'Agent',
    image: '/templates/onyx-atelier.png',
    demoUrl: 'https://sparkstudio-onyx.framer.website/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/8ef3a777-6fe5-4148-af7e-e1bb1bba39f7?embed=1'
  },
  {
    slug: 'vellum-edition',
    name: 'Vellum Edition',
    category: 'Editorial architecture portfolio',
    categoryKey: 'craft',
    tagline: 'A quiet, art-book monograph for architecture studios that let photography and material narratives lead.',
    price: '$29',
    badge: 'Agent',
    image: '/templates/vellum-edition.png',
    demoUrl: 'https://unlimited-mind-018782.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/2daaa04b-a936-499a-abec-1d66c1c4f859?embed=1'
  },
  {
    slug: 'halden-edition',
    name: 'Halden Edition',
    category: 'Custom furniture & object studio',
    categoryKey: 'real-estate',
    tagline: 'Mass-market shop templates kill artisanal value. Halden Edition is curated for collectible craft.',
    price: '$59',
    badge: null,
    image: '/templates/halden-edition.png',
    demoUrl: 'https://past-network-244230.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/aaf77205-9810-4ffd-9b12-05cb48912e71?embed=1'
  },
  {
    slug: 'grain-form',
    name: 'Grain & Form',
    category: 'Artisan homeware & tactile commerce',
    categoryKey: 'architecture',
    tagline: 'Generic online shops feel disposable. Grain & Form makes home decor feel personal and tactile.',
    price: '$58',
    badge: null,
    image: '/templates/grain-form.png',
    demoUrl: 'https://mindful-account-986092.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/5fa7e190-f8a1-4c9a-ac9c-0cf78e79c8e7?embed=1'
  },
  {
    slug: 'slowgrain',
    name: 'SLOWGRAIN',
    category: 'Solid timber & heirloom furniture',
    categoryKey: 'craft',
    tagline: 'An editorial, museum-grade template for solid timber ateliers, heirloom furniture makers and joinery workshops.',
    price: 'Free',
    badge: null,
    image: '/templates/slowgrain.png',
    demoUrl: 'https://prosperous-statuses-272584.framer.app/style-guide',
    buyUrl: null
  },
  {
    slug: 'terra',
    name: 'TERRA',
    category: 'Editorial store for furniture & design galleries',
    categoryKey: 'craft',
    tagline: 'A quiet, editorial store template engineered for furniture studios, object makers, and contemporary design galleries.',
    price: '$69',
    badge: 'Agent',
    image: 'https://framerusercontent.com/images/H2DMerPuJWTvVUiihF3BX14Wdo.png',
    demoUrl: 'https://vibrant-checkbox-000943.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/2202bb1a-4d15-4b53-8b36-73d57153733f?embed=1',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/terra/'
  },
  {
    slug: 'sasso-architect',
    name: 'SASSO Architect',
    category: 'Architecture & interior studio monograph',
    categoryKey: 'architecture',
    tagline: 'Architecture & Interior Studio — Monograph-grade digital flagship for boutique architecture studios, spatial ateliers, and interior practices.',
    price: '$69',
    badge: 'Agent',
    image: 'https://framerusercontent.com/images/vXQOoXIJexVdw0e3emiEMLvyOds.png',
    demoUrl: 'https://small-bookings-302943.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/ec2dbd50-66e1-44d5-b412-588da7f013d8?embed=1',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/sasso-architect/'
  },
  {
    slug: 'tessovra',
    name: 'TESSOVRA',
    category: 'Tile & surface ecommerce showroom',
    categoryKey: 'craft',
    tagline: 'Tile & Surface Ecommerce Showroom — Architectural ecommerce crafted for tactile surfaces, bespoke interiors, and design ateliers.',
    price: '$69',
    badge: 'Agent',
    image: 'https://framerusercontent.com/images/3KolCsLSc048U4flMKf2dXWo.png',
    demoUrl: 'https://hilarious-variations-838642.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/02daec5f-f201-48aa-8636-d120270b5adc?embed=1',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/tessovra/'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All templates' },
  { id: 'real-estate', label: 'Real estate & living' },
  { id: 'architecture', label: 'Architecture & spatial' },
  { id: 'craft', label: 'Craft & commerce' }
];

export default function TemplatesGrid() {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const currentLang = i18n.language ? i18n.language.slice(0, 2) : 'en';

  useEffect(() => {
    initLemonSqueezy();
  }, []);

  const rawCats = t('templates.categories', { returnObjects: true });
  const categoriesList = Array.isArray(rawCats) && rawCats.length > 0 ? rawCats : CATEGORIES;

  const rawItems = t('templates.items', { returnObjects: true });
  const allTemplates = TEMPLATES.map((tmpl) => {
    if (Array.isArray(rawItems)) {
      const match = rawItems.find((li) => li.slug === tmpl.slug);
      if (match) {
        return {
          ...tmpl,
          category: match.category || tmpl.category,
          tagline: match.tagline || tmpl.tagline,
          price: match.price || tmpl.price,
        };
      }
    }
    return tmpl;
  });

  const getTemplateLink = (slug) => {
    return currentLang === 'en' ? `/templates/${slug}` : `/${currentLang}/templates/${slug}`;
  };

  const filteredItems = activeFilter === 'all' 
    ? allTemplates 
    : allTemplates.filter(item => item.categoryKey === activeFilter);

  return (
    <section 
      id="projects" 
      className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28 relative flex flex-col gap-10 sm:gap-12 border-t border-white/10"
    >
      {/* Head: Title on left, Description on right (Exact Framer .framer-z922t7) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <h2 className="text-3xl sm:text-4xl md:text-[38px] font-semibold text-[#f7f6fb] font-heading tracking-[-0.02em] leading-tight max-w-xl">
          {t('templates.title') || 'Production-ready templates & digital flagships'}
        </h2>
        
        <p className="text-sm sm:text-[14.5px] text-[#8b87a0] font-normal leading-relaxed max-w-md">
          {t('templates.subtitle') || 'Flagship Framer templates, built with modular CMS collections and fluid responsive interactions — each one ready to adapt to any brand.'}
        </p>
      </div>

      {/* Filter Tabs matching Framer CategoryPills */}
      <div className="flex flex-wrap items-center gap-2">
        {categoriesList.map((cat) => {
          const isActive = activeFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-[12.5px] font-mono transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#f7f6fb] text-[#15131f] font-semibold shadow-md'
                  : 'bg-transparent text-[#8b87a0] hover:text-[#f7f6fb] border border-white/10 hover:border-white/30'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Templates Grid: EXACT FRAMER 2-COLUMN GRID (grid-cols-1 md:grid-cols-2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8">
        <AnimatePresence>
          {filteredItems.map((template) => (
            <div
              key={template.slug}
              data-framer-name="Template Card"
              className="framer-template-card group rounded-2xl bg-[#1b1826] border border-white/10 flex flex-col overflow-hidden cursor-pointer"
            >
              {/* Image Preview Box */}
              <Link 
                to={getTemplateLink(template.slug)} 
                className="relative block aspect-[16/10] overflow-hidden bg-[#15131f] border-b border-white/10"
                data-framer-name="Card Media"
              >
                <div data-framer-background-image-wrapper="true" className="w-full h-full">
                  <img
                    src={template.image}
                    alt={`${template.name} ${t('detailPage.metaTitleSuffix') || '— Framer Template by Spark Studio'}`}
                    className="framer-card-img w-full h-full object-cover object-top"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/assets/template1.png';
                    }}
                  />
                </div>

                {template.badge && (
                  <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-mono font-semibold uppercase tracking-wider text-white">
                    {template.badge}
                  </div>
                )}
              </Link>

              {/* Card Content */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-5">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#8e97f7]">
                    {template.category}
                  </span>

                  <div data-framer-name="Card Title">
                    <Link to={getTemplateLink(template.slug)} className="block">
                      <h3 className="framer-card-title text-xl sm:text-2xl font-heading font-semibold text-[#f7f6fb]">
                        {template.name}
                      </h3>
                    </Link>
                  </div>

                  <p className="text-sm text-[#8b87a0] font-normal leading-relaxed line-clamp-2">
                    {template.tagline}
                  </p>
                </div>

                {/* Card Meta Row */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  {template.demoUrl ? (
                    <MagneticButton>
                      <a
                        href={template.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#f7f6fb] hover:text-[#8e97f7] transition-colors cursor-pointer"
                      >
                        <span>{t('templates.liveDemo') || 'Live demo'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </MagneticButton>
                  ) : (
                    <Link
                      to={getTemplateLink(template.slug)}
                      className="text-[13.5px] font-medium text-[#f7f6fb] hover:text-[#8e97f7] transition-colors"
                    >
                      {t('templates.viewDetails') || 'View details'}
                    </Link>
                  )}

                  <div className="flex items-center gap-2">
                    {template.buyUrl && (
                      <a
                        href={template.buyUrl}
                        onClick={(e) => handleLemonCheckout(e, template.buyUrl)}
                        className="lemonsqueezy-button hidden"
                        aria-hidden="true"
                      >
                        Buy
                      </a>
                    )}
                    <span className="font-mono text-sm font-semibold text-[#f7f6fb]">
                      {template.price === 'Free' || template.price === 'Kostenlos' || template.price === 'Gratis' || template.price === 'Gratuit'
                        ? (t('templates.freeRemix') || 'Free remix')
                        : template.price}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </AnimatePresence>

        {/* 8th Pipeline Card (Exact Match to User Image 0) */}
        {activeFilter === 'all' && (
          <div
            data-framer-name="Pipeline Card"
            className="framer-pipeline-card md:col-span-2 p-8 sm:p-10 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden"
            style={{
              backgroundColor: '#27204f',
              backgroundImage: `url('/assets/facet-pattern.svg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid rgba(142, 151, 247, 0.25)'
            }}
          >
            <div className="relative z-10 flex flex-col gap-2.5 max-w-2xl">
              <h3 className="font-heading font-semibold text-2xl sm:text-3xl text-white">
                {t('templates.pipeline.title') || 'Expanding pipeline'}
              </h3>
              <p className="text-sm sm:text-[15px] text-[#d4d2e8] font-normal leading-relaxed">
                {t('templates.pipeline.desc') || 'SaaS, digital commerce and creator portfolios — new templates launching soon. Join the list for early-bird pricing.'}
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <MagneticButton>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8e97f7] hover:text-white transition-colors cursor-pointer"
                >
                  <span>{t('templates.pipeline.cta') || 'Get launch alerts →'}</span>
                </a>
              </MagneticButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
