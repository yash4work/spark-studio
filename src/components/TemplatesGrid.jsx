import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { initLemonSqueezy, handleLemonCheckout } from '../lib/lemonsqueezy';
import { AnimatePresence } from 'framer-motion';
import { MagneticButton } from '../lib/framer-effects';

const TEMPLATES = [
  // --- REAL CLIENT WEBSITES & CUSTOM SOFTWARE ---
  {
    slug: 'ai-saas',
    name: 'AI SaaS Platform',
    type: 'custom',
    category: 'Web Application & SaaS',
    categoryKey: 'software',
    tagline: 'AI That Works While You Sleep — A high-converting AI SaaS platform engineered with Next.js, React, and Tailwind CSS for workflow automation.',
    techStack: ['Next.js', 'React', 'Tailwind', 'TypeScript', 'Motion'],
    price: 'Custom Build',
    badge: 'Live SaaS',
    image: '/templates/ai-saas.webp',
    demoUrl: 'https://showcase-r5.vercel.app/',
    buyUrl: null
  },
  {
    slug: 'luxury-restaurant',
    name: 'Luxury Restaurant',
    type: 'custom',
    category: 'Custom Hospitality Website',
    categoryKey: 'websites',
    tagline: 'Crafting Culinary Poetry — A premium restaurant landing page crafted to showcase fine dining through immersive storytelling and fluid table reservations.',
    techStack: ['Next.js', 'React', 'Tailwind', 'TypeScript'],
    price: 'Custom Build',
    badge: 'Live Website',
    image: '/templates/restaurant.webp',
    demoUrl: 'https://showcase-r4.vercel.app/',
    buyUrl: null
  },
  {
    slug: 'premium-healthcare',
    name: 'Premium Healthcare',
    type: 'custom',
    category: 'Healthcare & Patient Portal',
    categoryKey: 'websites',
    tagline: 'Expert Care You Can Trust — A modern healthcare website designed to build patient trust through a clean interface and intuitive appointment booking.',
    techStack: ['Next.js', 'React', 'Tailwind', 'TypeScript'],
    price: 'Custom Build',
    badge: 'Live Portal',
    image: '/templates/healthcare.webp',
    demoUrl: 'https://showcase-r6.vercel.app/',
    buyUrl: null
  },

  // --- FRAMER TEMPLATES & DIGITAL FLAGSHIPS ---
  {
    slug: 'mavric-estate',
    name: 'Mavric Estate',
    category: 'Modern real estate CMS & realtor',
    categoryKey: 'real-estate',
    tagline: 'Generic realtor websites lose leads to Zillow. Mavric Estate is engineered to capture them.',
    price: '$69',
    badge: null,
    image: '/templates/mavric-estate.webp',
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
    image: '/templates/aurelle-estates.webp',
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
    image: '/templates/onyx-atelier.webp',
    demoUrl: 'https://sparkstudio-onyx.framer.website/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/8ef3a777-6fe5-4148-af7e-e1bb1bba39f7?embed=1'
  },
  {
    slug: 'vellum-edition',
    name: 'Vellum Edition',
    category: 'Editorial architecture portfolio',
    categoryKey: 'craft',
    tagline: 'A quiet, art-book monograph for architecture studios that let photography and material narratives lead.',
    price: '$39',
    badge: 'Agent',
    image: '/templates/vellum-edition.webp',
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
    image: '/templates/halden-edition.webp',
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
    image: '/templates/grain-form.webp',
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
    image: '/templates/slowgrain.webp',
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
    tagline: 'Tile & Surface Ecommerce Showroom — Architectural ecommerce crafted for tactile surfaces, custom interiors, and design ateliers.',
    price: '$69',
    badge: 'Agent',
    image: 'https://framerusercontent.com/images/3KolCsLSc048U4flMKf2dXWo.png',
    demoUrl: 'https://hilarious-variations-838642.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/02daec5f-f201-48aa-8636-d120270b5adc?embed=1',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/tessovra/'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All projects & templates' },
  { id: 'software', label: 'Custom Software & SaaS' },
  { id: 'websites', label: 'Custom Websites' },
  { id: 'real-estate', label: 'Real estate & living' },
  { id: 'architecture', label: 'Architecture & spatial' },
  { id: 'craft', label: 'Craft & commerce' }
];

export default function TemplatesGrid() {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const currentLang = i18n.language ? i18n.language.slice(0, 2) : 'en';

  useEffect(() => {
    initLemonSqueezy();
  }, []);

  const getTemplateLink = (slug) => {
    return currentLang === 'en' ? `/templates/${slug}` : `/${currentLang}/templates/${slug}`;
  };

  const handleFilterChange = (catId) => {
    setActiveFilter(catId);
    setCurrentPage(1);
  };

  const filteredItems = activeFilter === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter(item => item.categoryKey === activeFilter);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="projects" 
      className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-20 sm:py-28 relative flex flex-col gap-10 sm:gap-12 border-t border-white/10"
    >
      {/* Head: Title on left, Description on right */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <h2 className="text-3xl sm:text-4xl md:text-[38px] font-semibold text-[#f7f6fb] font-heading tracking-[-0.02em] leading-tight max-w-xl">
          {t('templates.title') || 'Selected work, custom software & flagship templates'}
        </h2>
        
        <p className="text-sm md:text-base text-[#8b87a0] font-normal leading-relaxed max-w-md">
          {t('templates.subtitle') || 'From scalable Next.js web applications and SaaS platforms to custom Framer & Webflow client websites and templates — each build engineered for 95+ PageSpeed scores.'}
        </p>
      </div>

      {/* Filter Tabs matching Framer CategoryPills */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleFilterChange(cat.id)}
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

      {/* Templates Grid: 3-COLUMN RESPONSIVE GRID (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        <AnimatePresence>
          {displayedItems.map((template) => (
            <div
              key={template.slug}
              data-framer-name="Template Card"
              className="framer-template-card group rounded-2xl bg-[#1b1826] border border-white/10 flex flex-col overflow-hidden cursor-pointer"
            >
              {/* Image Preview Box */}
              {template.type === 'custom' ? (
                <a 
                  href={template.demoUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-[16/10] overflow-hidden bg-[#15131f] border-b border-white/10"
                  data-framer-name="Card Media"
                >
                  <div data-framer-background-image-wrapper="true" className="w-full h-full">
                    <img
                      src={template.image}
                      alt={`${template.name} — Custom Project by Spark Studio`}
                      className="framer-card-img w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {template.badge && (
                    <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#8e97f7]/25 backdrop-blur-md border border-[#8e97f7]/40 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#f7f6fb]">
                      {template.badge}
                    </div>
                  )}
                </a>
              ) : (
                <Link 
                  to={getTemplateLink(template.slug)} 
                  className="relative block aspect-[16/10] overflow-hidden bg-[#15131f] border-b border-white/10"
                  data-framer-name="Card Media"
                >
                  <div data-framer-background-image-wrapper="true" className="w-full h-full">
                    <img
                      src={template.image}
                      alt={`${template.name} — Framer Template by Spark Studio`}
                      className="framer-card-img w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
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
              )}

              {/* Card Content */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#8e97f7]">
                      {template.category}
                    </span>
                    {template.techStack && (
                      <span className="text-[10px] font-mono text-[#8b87a0]">
                        {template.techStack.slice(0, 3).join(' · ')}
                      </span>
                    )}
                  </div>

                  <div data-framer-name="Card Title">
                    {template.type === 'custom' ? (
                      <a href={template.demoUrl} target="_blank" rel="noopener noreferrer" className="block group-hover:text-[#8e97f7] transition-colors">
                        <h3 className="framer-card-title text-xl sm:text-2xl font-heading font-semibold text-[#f7f6fb]">
                          {template.name}
                        </h3>
                      </a>
                    ) : (
                      <Link to={getTemplateLink(template.slug)} className="block group-hover:text-[#8e97f7] transition-colors">
                        <h3 className="framer-card-title text-xl sm:text-2xl font-heading font-semibold text-[#f7f6fb]">
                          {template.name}
                        </h3>
                      </Link>
                    )}
                  </div>

                  <p className="text-sm md:text-base text-[#8b87a0] font-normal leading-relaxed line-clamp-2">
                    {template.tagline}
                  </p>

                  {template.techStack && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {template.techStack.map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[#c8c4dc]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Meta Row */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  {template.demoUrl ? (
                    <MagneticButton>
                      <a
                        href={template.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Live demo for ${template.title}`}
                        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#f7f6fb] hover:text-[#8e97f7] transition-colors cursor-pointer"
                      >
                        <span>Live demo</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </MagneticButton>
                  ) : (
                    <Link
                      to={getTemplateLink(template.slug)}
                      className="text-[13.5px] font-medium text-[#f7f6fb] hover:text-[#8e97f7] transition-colors"
                    >
                      View details
                    </Link>
                  )}

                  <div className="flex items-center gap-2">
                    {template.type === 'custom' ? (
                      <MagneticButton>
                        <a
                          href="#contact"
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#8e97f7]/15 text-[#8e97f7] hover:bg-[#8e97f7]/30 transition-all border border-[#8e97f7]/30"
                        >
                          Request build →
                        </a>
                      </MagneticButton>
                    ) : (
                      <>
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
                          {template.price === 'Free' ? 'Free remix' : template.price}
                        </span>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </AnimatePresence>

        {/* Pipeline Card (Spans full 3 columns with dark contrast overlay) */}
        {activeFilter === 'all' && currentPage === 1 && (
          <div
            data-framer-name="Pipeline Card"
            className="framer-pipeline-card col-span-1 md:col-span-2 lg:col-span-3 p-8 sm:p-10 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden border border-[#8e97f7]/30"
            style={{
              backgroundColor: '#171333',
              backgroundImage: `url('/assets/facet-pattern.svg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Dark contrast gradient overlay matching user request */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-[#15131f]/95 via-[#1a1438]/85 to-[#15131f]/90 pointer-events-none z-0" 
            />

            <div className="relative z-10 flex flex-col gap-2.5 max-w-2xl">
              <h3 className="font-heading font-semibold text-2xl sm:text-3xl text-white">
                Expanding pipeline
              </h3>
              <p className="text-sm md:text-base text-[#d4d2e8] font-normal leading-relaxed">
                SaaS products, custom Webflow platforms, and creator portfolios — new builds and templates launching weekly. Join the list for early-bird previews.
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <MagneticButton>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8e97f7] hover:text-white transition-colors cursor-pointer"
                >
                  <span>Get launch alerts →</span>
                </a>
              </MagneticButton>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p className="text-xs font-mono text-[#8b87a0]">
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} projects & templates
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl text-xs font-mono border border-white/10 text-[#f7f6fb] hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-9 h-9 rounded-xl text-xs font-mono font-semibold transition-all ${
                  currentPage === pageNum
                    ? 'bg-[#8e97f7] text-[#15131f] shadow-[0_0_15px_rgba(142,151,247,0.35)]'
                    : 'border border-white/10 text-[#8b87a0] hover:text-[#f7f6fb] hover:bg-white/[0.04]'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl text-xs font-mono border border-white/10 text-[#f7f6fb] hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
