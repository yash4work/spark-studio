import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ShoppingBag, 
  Check, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Database,
  ExternalLink 
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { initLemonSqueezy, handleLemonCheckout } from '../lib/lemonsqueezy';
import { getTemplateStorageUrl } from '../lib/supabase';
import { motion } from 'framer-motion';

const TEMPLATE_META = {
  'mavric-estate': {
    price: '$69',
    priceDe: '69 €',
    priceEs: '69 €',
    priceFr: '69 €',
    numericPrice: '69.00',
    demoUrl: 'https://mavric-estate.framer.website/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/f22889c0-30a4-45d5-87c0-730fb44cc172?embed=1',
    remixUrl: 'https://framer.com/remix/A2wFOoozRxj7JhGKve5x',
    image: '/templates/mavric-estate.png',
    gallery: ['/templates/mavric-estate.png', '/assets/template1.png', '/assets/template2.png']
  },
  'aurelle-estates': {
    price: '$99',
    priceDe: '99 €',
    priceEs: '99 €',
    priceFr: '99 €',
    numericPrice: '99.00',
    demoUrl: 'https://wandering-variations-344785.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/e4d03d2d-2408-4a55-92e4-84c50735f47d?embed=1',
    remixUrl: 'https://framer.com/remix/kktBLW5OAcjQ8farEylL',
    image: '/templates/aurelle-estates.png',
    gallery: ['/templates/aurelle-estates.png', '/assets/template2.png', '/assets/template3.png']
  },
  'onyx-atelier': {
    price: '$79',
    priceDe: '79 €',
    priceEs: '79 €',
    priceFr: '79 €',
    numericPrice: '79.00',
    demoUrl: 'https://active-strengthening-218427.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/964d9218-93b1-4110-a9cf-c2a897adc31b?embed=1',
    remixUrl: 'https://framer.com/remix/qdTLRcAS411L53TOswm9',
    image: '/templates/onyx-atelier.png',
    gallery: ['/templates/onyx-atelier.png', '/assets/template3.png', '/assets/template4.png']
  },
  'vellum-edition': {
    price: '$29',
    priceDe: '29 €',
    priceEs: '29 €',
    priceFr: '29 €',
    numericPrice: '29.00',
    demoUrl: 'https://unlimited-mind-018782.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/2daaa04b-a936-499a-abec-1d66c1c4f859?embed=1',
    remixUrl: 'https://framer.com/remix/bedsbRAX0HralLdA1OFW',
    image: '/templates/vellum-edition.png',
    gallery: ['/templates/vellum-edition.png', '/assets/template4.png', '/assets/template1.png']
  },
  'halden-edition': {
    price: '$59',
    priceDe: '59 €',
    priceEs: '59 €',
    priceFr: '59 €',
    numericPrice: '59.00',
    demoUrl: 'https://past-network-244230.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/aaf77205-9810-4ffd-9b12-05cb48912e71?embed=1',
    remixUrl: 'https://framer.com/remix/y995Rq0IottjMfWKZwpL',
    image: '/templates/halden-edition.png',
    gallery: ['/templates/halden-edition.png', '/assets/template2.png', '/assets/template4.png']
  },
  'grain-form': {
    price: '$58',
    priceDe: '58 €',
    priceEs: '58 €',
    priceFr: '58 €',
    numericPrice: '58.00',
    demoUrl: 'https://mindful-account-986092.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/5fa7e190-f8a1-4c9a-ac9c-0cf78e79c8e7?embed=1',
    remixUrl: 'https://framer.com/remix/uJLrxhYatV1KDfmU9tMs',
    image: '/templates/grain-form.png',
    gallery: ['/templates/grain-form.png', '/assets/template1.png', '/assets/template3.png']
  },
  'slowgrain': {
    price: 'Free',
    priceDe: 'Kostenlos',
    priceEs: 'Gratis',
    priceFr: 'Gratuit',
    numericPrice: '0.00',
    demoUrl: 'https://prosperous-statuses-272584.framer.app/style-guide',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/2202bb1a-4d15-4b53-8b36-73d57153733f?embed=1',
    remixUrl: 'https://framer.com/remix/52YnIzlJOEXddxCP5O1n',
    image: '/templates/slowgrain.png',
    gallery: ['/templates/slowgrain.png', '/assets/template3.png', '/assets/template2.png']
  },
  'terra': {
    price: '$69',
    priceDe: '69 €',
    priceEs: '69 €',
    priceFr: '69 €',
    numericPrice: '69.00',
    demoUrl: 'https://vibrant-checkbox-000943.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/2202bb1a-4d15-4b53-8b36-73d57153733f?embed=1',
    remixUrl: 'https://www.framer.com/marketplace/templates/terra/',
    image: 'https://framerusercontent.com/images/H2DMerPuJWTvVUiihF3BX14Wdo.png',
    gallery: ['https://framerusercontent.com/images/H2DMerPuJWTvVUiihF3BX14Wdo.png', '/assets/template1.png', '/assets/template2.png']
  },
  'sasso-architect': {
    price: '$69',
    priceDe: '69 €',
    priceEs: '69 €',
    priceFr: '69 €',
    numericPrice: '69.00',
    demoUrl: 'https://small-bookings-302943.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/ec2dbd50-66e1-44d5-b412-588da7f013d8?embed=1',
    remixUrl: 'https://www.framer.com/marketplace/templates/sasso-architect/',
    image: 'https://framerusercontent.com/images/vXQOoXIJexVdw0e3emiEMLvyOds.png',
    gallery: ['https://framerusercontent.com/images/vXQOoXIJexVdw0e3emiEMLvyOds.png', '/assets/template2.png', '/assets/template3.png']
  },
  'tessovra': {
    price: '$69',
    priceDe: '69 €',
    priceEs: '69 €',
    priceFr: '69 €',
    numericPrice: '69.00',
    demoUrl: 'https://hilarious-variations-838642.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/02daec5f-f201-48aa-8636-d120270b5adc?embed=1',
    remixUrl: 'https://www.framer.com/marketplace/templates/tessovra/',
    image: 'https://framerusercontent.com/images/3KolCsLSc048U4flMKf2dXWo.png',
    gallery: ['https://framerusercontent.com/images/3KolCsLSc048U4flMKf2dXWo.png', '/assets/template1.png', '/assets/template3.png']
  }
};

export default function TemplateDetailPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const currentLang = i18n.language ? i18n.language.slice(0, 2) : 'en';
  const meta = TEMPLATE_META[slug];
  const templateInfo = t(`templateDetails.${slug}`, { returnObjects: true });

  useEffect(() => {
    window.scrollTo(0, 0);
    initLemonSqueezy();
  }, [slug]);

  if (!meta || !templateInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          {t('detailPage.notFoundTitle') || 'Template Not Found'}
        </h1>
        <p className="text-zinc-400 mb-6">
          {t('detailPage.notFoundDesc') || 'The requested template could not be located.'}
        </p>
        <Link
          to={currentLang === 'en' ? '/' : `/${currentLang}`}
          className="px-6 py-3 rounded-full bg-white text-black font-semibold text-sm"
        >
          {t('detailPage.returnHome') || 'Return to Studio Home'}
        </Link>
      </div>
    );
  }

  const localizedPrice = currentLang === 'de' ? meta.priceDe 
    : currentLang === 'es' ? meta.priceEs 
    : currentLang === 'fr' ? meta.priceFr 
    : meta.price;

  const homeLink = currentLang === 'en' ? '/' : `/${currentLang}`;
  const templatesLink = currentLang === 'en' ? '/#projects' : `/${currentLang}#projects`;

  // Dynamic template image resolving with Supabase support
  const mainImage = getTemplateStorageUrl(slug, 'cover.png', meta.image);

  // Product + Breadcrumb JSON-LD structured data for rich snippets & AI engines
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `https://thesparkstudio.digital/templates/${slug}#product`,
        'name': templateInfo.name,
        'description': templateInfo.headline,
        'image': `https://thesparkstudio.digital${meta.image}`,
        'category': 'Software > Website Templates',
        'brand': {
          '@type': 'Brand',
          'name': 'Spark Studio'
        },
        'offers': {
          '@type': 'Offer',
          'price': meta.numericPrice,
          'priceCurrency': 'USD',
          'availability': 'https://schema.org/InStock',
          'url': `https://thesparkstudio.digital/templates/${slug}`,
          'seller': {
            '@type': 'Organization',
            'name': 'Spark Studio'
          }
        }
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': t('detailPage.breadcrumbHome') || 'Home',
            'item': `https://thesparkstudio.digital${homeLink}`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': t('detailPage.breadcrumbTemplates') || 'Templates',
            'item': `https://thesparkstudio.digital${templatesLink}`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': templateInfo.name,
            'item': `https://thesparkstudio.digital${currentLang === 'en' ? '' : `/${currentLang}`}/templates/${slug}`
          }
        ]
      }
    ]
  };

  // Other studio templates for "More from the studio"
  const otherTemplates = Object.keys(TEMPLATE_META)
    .filter((k) => k !== slug)
    .slice(0, 3)
    .map((k) => ({
      slug: k,
      meta: TEMPLATE_META[k],
      info: t(`templateDetails.${k}`, { returnObjects: true })
    }));

  return (
    <div className="min-h-screen pt-28 pb-20">
      <SEOHead
        title={`${templateInfo.name} ${t('detailPage.metaTitleSuffix') || '— Framer Template by Spark Studio'}`}
        description={templateInfo.headline}
        image={meta.image}
        jsonLd={productJsonLd}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-8">
          <Link to={homeLink} className="hover:text-white transition-colors">
            {t('detailPage.breadcrumbHome') || 'Home'}
          </Link>
          <span>/</span>
          <a href={templatesLink} className="hover:text-white transition-colors">
            {t('detailPage.breadcrumbTemplates') || 'Templates'}
          </a>
          <span>/</span>
          <span className="text-white font-medium">{templateInfo.name}</span>
        </div>

        {/* Back Button */}
        <a
          href={templatesLink}
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('detailPage.allTemplatesBack') || (currentLang === 'de' ? '← Alle Vorlagen' : currentLang === 'es' ? '← Todas las plantillas' : currentLang === 'fr' ? '← Tous les templates' : '← All templates')}</span>
        </a>

        {/* Header Hero Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          <div className="lg:col-span-7">
            <span className="inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4">
              {templateInfo.category}
            </span>

            {/* H1 Tag for SEO Requirement */}
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-6 font-heading">
              {templateInfo.name}
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 font-normal leading-relaxed mb-8">
              {templateInfo.headline}
            </p>

            {/* Quick Specs Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400 mb-10">
              <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
                {t('detailPage.builtNatively') || 'Built natively in Framer'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
                {t('detailPage.fullyResponsive') || 'Fully responsive'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
                {t('detailPage.cmsReady') || 'CMS-ready'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                {t('detailPage.coreWebVitals') || '90+ Core Web Vitals'}
              </span>
            </div>

            {/* Purchase & Action Box */}
            <div className="p-6 rounded-[20px] bg-[#1b1826] border border-white/10 backdrop-blur-md">
              <div className="flex items-baseline justify-between mb-6 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono text-[#8b87a0] uppercase tracking-wider block mb-1">
                    {t('detailPage.templateLicense') || 'Template License'}
                  </span>
                  <span className="text-3xl font-extrabold text-[#f7f6fb] font-mono">
                    {localizedPrice}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8e97f7] bg-[#8e97f7]/10 px-3 py-1 rounded-full border border-[#8e97f7]/20">
                    <Check className="w-3 h-3" />
                    {t('detailPage.instantRemix') || 'Instant 1-Click Remix'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={meta.buyUrl}
                  onClick={(e) => handleLemonCheckout(e, meta.buyUrl)}
                  className="lemonsqueezy-button w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white transition-all shadow-lg hover:opacity-90 active:scale-[0.99]"
                  style={{
                    background: 'linear-gradient(120deg, rgb(108, 79, 232) 0%, rgb(255, 106, 69) 100%)'
                  }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {t('detailPage.purchaseBtn', { price: localizedPrice }) || (currentLang === 'de' ? `Vorlage kaufen — ${localizedPrice}`
                      : currentLang === 'es' ? `Comprar plantilla — ${localizedPrice}`
                      : currentLang === 'fr' ? `Acheter le template — ${localizedPrice}`
                      : `Purchase Template — ${localizedPrice}`)}
                  </span>
                </a>

                {meta.demoUrl && (
                  <a
                    href={meta.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-[#f7f6fb] bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 transition-colors"
                  >
                    <span>{t('detailPage.liveDemo') || 'Live Demo'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Hero Showcase Image */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/40 shadow-2xl relative aspect-[4/3] group">
              <img
                src={mainImage}
                alt={`${templateInfo.name} — Framer Template Showcase`}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/assets/template1.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Gallery thumbnails */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {meta.gallery?.map((imgUrl, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-white/[0.08] bg-zinc-950 aspect-[16/10]">
                  <img
                    src={imgUrl}
                    alt={`Preview thumbnail ${i + 1}`}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.src = '/assets/template2.png';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Detailed Content Tabs & Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-white/[0.08]">
          
          {/* Main Description & Features */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Overview */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-3">
                {templateInfo.overviewTitle || 'OVERVIEW'}
              </span>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
                {templateInfo.overview}
              </p>
            </div>

            {/* Features (H2) */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 font-heading">
                {templateInfo.featuresTitle}
              </h2>
              <div className="space-y-4">
                {templateInfo.features?.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-900/30 border border-white/[0.05]"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-zinc-300 leading-relaxed font-normal">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included (H2) */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 font-heading">
                {templateInfo.includedTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {templateInfo.included?.map((inc, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/20 border border-white/[0.05]"
                  >
                    <FileText className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-zinc-300 leading-relaxed">
                      {inc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic CMS Collections (H2) */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 font-heading">
                {templateInfo.cmsTitle}
              </h2>
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] flex items-start gap-4">
                <Database className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                <div>
                  <h3 className="text-base font-bold text-white mb-1 font-heading">
                    {t('detailPage.structuredCmsTitle') || 'Structured CMS Architecture'}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {templateInfo.cmsDesc}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Sticky Sidebar Details */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              
              {/* Custom build banner */}
              <div className="p-6 rounded-[20px] bg-[#1b1826] border border-white/10">
                <span className="text-xs font-mono uppercase tracking-[0.05em] text-[#8e97f7] font-bold block mb-2">
                  {t('detailPage.customBuildsEyebrow') || 'CUSTOM BUILDS'}
                </span>
                <h3 className="text-xl font-bold text-[#f7f6fb] mb-2 font-heading">
                  {t('detailPage.customBuildsTitle') || 'Want this tailored to your brand?'}
                </h3>
                <p className="text-xs text-[#8b87a0] leading-relaxed mb-6">
                  {t('detailPage.customBuildsDesc') || 'We customize any template — or design and build your site from scratch — with the same production standard. Turnaround: 3 to 5 business days.'}
                </p>
                <a
                  href={`mailto:sparkstudio0@outlook.com?subject=Custom%20Build%20Inquiry%20-%20${encodeURIComponent(templateInfo.name)}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-[#f7f6fb] border border-white/20 hover:border-white/40 hover:bg-white/[0.04] transition-all"
                >
                  <span>{t('detailPage.startCustomBuild') || 'Start a custom build →'}</span>
                </a>
              </div>

              {/* License & Support terms */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-3 text-xs text-zinc-400">
                <div className="flex items-center gap-2 text-zinc-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t('detailPage.licenseIncluded') || 'Commercial License Included'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {t('detailPage.licenseDesc') || 'Single production site deployment per license. 100% code-free visual canvas editing.'}
                </p>
                <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>{t('detailPage.support') || 'Support'}</span>
                  <span>sparkstudio0@outlook.com</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* More from the studio (H2) */}
        <div className="pt-24 border-t border-white/[0.08] mt-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                {t('detailPage.studioCatalog') || 'STUDIO CATALOG'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white font-heading">
                {t('detailPage.moreFromStudio') || 'More from the studio'}
              </h2>
            </div>
            <a
              href={templatesLink}
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              {t('detailPage.allTemplatesLink') || 'All templates →'}
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherTemplates.map((item) => (
              <div
                key={item.slug}
                className="group rounded-2xl bg-zinc-900/40 border border-white/[0.08] hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <Link
                    to={currentLang === 'en' ? `/templates/${item.slug}` : `/${currentLang}/templates/${item.slug}`}
                    className="block aspect-[16/10] overflow-hidden bg-zinc-950"
                  >
                    <img
                      src={item.meta.image}
                      alt={item.info?.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/assets/template1.png';
                      }}
                    />
                  </Link>
                  <div className="p-5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                      {item.info?.category}
                    </span>
                    <h3 className="text-lg font-bold text-white font-heading mb-1">
                      {item.info?.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {item.info?.headline}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-white">
                    {currentLang === 'de' ? item.meta.priceDe 
                      : currentLang === 'es' ? item.meta.priceEs 
                      : currentLang === 'fr' ? item.meta.priceFr 
                      : item.meta.price}
                  </span>
                  <Link
                    to={currentLang === 'en' ? `/templates/${item.slug}` : `/${currentLang}/templates/${item.slug}`}
                    className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                  >
                    {t('detailPage.viewLink') || 'View →'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
