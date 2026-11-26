import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Database 
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { initLemonSqueezy, handleLemonCheckout, preloadLemonSqueezy, loadLemonSqueezy } from '../lib/lemonsqueezy';
import { trackEvent } from '../lib/analytics';
import { getTemplateStorageUrl } from '../lib/supabase';
import { templateSrc, templateSrcSet } from '../lib/images';
import { ORG_REF } from '../data/organization';

const galleryDescriptions = {
  '/assets/template1.png': 'Tablet displaying an editorial website on a woodworking bench',
  '/assets/template2.png': 'Dark architecture portfolio displayed on a desktop monitor and laptop',
  '/assets/template3.png': 'Two screens showing a furniture storefront and product catalog',
  '/assets/template4.png': 'Tablet showing a property website among stone and wood samples'
};

function thumbnail(url, width) {
  if (url.startsWith('https://framerusercontent.com/')) return url + '?scale-down-to=' + (width <= 192 ? 512 : 1024);
  return url.replace(/\.(png|webp)$/, '-' + width + '.webp');
}

const TEMPLATE_META = {
  'ai-saas': {
    isCustom: true,
    price: 'Custom Build',
    priceDe: 'Individuelle Entwicklung',
    priceEs: 'Desarrollo a medida',
    priceFr: 'Développement sur mesure',
    numericPrice: '2490.00',
    demoUrl: 'https://showcase-r5.vercel.app/',
    buyUrl: null,
    image: '/templates/ai-saas.webp',
    gallery: ['/templates/ai-saas.webp', '/assets/template1.png', '/assets/template2.png']
  },
  'luxury-restaurant': {
    isCustom: true,
    price: 'Custom Build',
    priceDe: 'Individuelle Entwicklung',
    priceEs: 'Desarrollo a medida',
    priceFr: 'Développement sur mesure',
    numericPrice: '1890.00',
    demoUrl: 'https://showcase-r4.vercel.app/',
    buyUrl: null,
    image: '/templates/restaurant.webp',
    gallery: ['/templates/restaurant.webp', '/assets/template2.png', '/assets/template3.png']
  },
  'premium-healthcare': {
    isCustom: true,
    price: 'Custom Build',
    priceDe: 'Individuelle Entwicklung',
    priceEs: 'Desarrollo a medida',
    priceFr: 'Développement sur mesure',
    numericPrice: '1990.00',
    demoUrl: 'https://showcase-r6.vercel.app/',
    buyUrl: null,
    image: '/templates/healthcare.webp',
    gallery: ['/templates/healthcare.webp', '/assets/template3.png', '/assets/template4.png']
  },
  'mavric-estate': {
    price: 'Free',
    priceDe: 'Kostenlos',
    priceEs: 'Gratis',
    priceFr: 'Gratuit',
    numericPrice: '0.00',
    demoUrl: 'https://mavric-estate.framer.website/',
    buyUrl: null,
    remixUrl: 'https://framer.link/a7rXdZO?duplicateType=siteTemplate&via=thesparkstudio',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/mavric-estate/',
    image: '/templates/mavric-estate.webp',
    gallery: ['/templates/mavric-estate.webp', '/assets/template1.png', '/assets/template2.png']
  },
  'aurelle-estates': {
    price: '$99',
    priceDe: '99 USD',
    priceEs: '99 USD',
    priceFr: '99 USD',
    numericPrice: '99.00',
    demoUrl: 'https://wandering-variations-344785.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/c111b344-dc0c-4931-aa46-55f1d0dc49c8?embed=1',
    remixUrl: 'https://framer.link/P1YdVXM?duplicateType=siteTemplate&via=thesparkstudio',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/aurelle-estates/',
    image: '/templates/aurelle-estates.webp',
    gallery: ['/templates/aurelle-estates.webp', '/assets/template2.png', '/assets/template3.png']
  },
  'onyx-atelier': {
    price: 'Free',
    priceDe: 'Kostenlos',
    priceEs: 'Gratis',
    priceFr: 'Gratuit',
    numericPrice: '0.00',
    demoUrl: 'https://oynx-atelier.framer.ai/',
    buyUrl: null,
    remixUrl: 'https://framer.com/projects/new?duplicate=JEVoQhQwQzyQ3Bm1MmTB&duplicateType=siteTemplate&via=thesparkstudio',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/onyx-atelier/',
    image: '/templates/onyx-atelier.webp',
    gallery: ['/templates/onyx-atelier.webp', '/assets/template3.png', '/assets/template4.png']
  },
  'vellum-edition': {
    price: 'Free',
    priceDe: 'Kostenlos',
    priceEs: 'Gratis',
    priceFr: 'Gratuit',
    numericPrice: '0.00',
    demoUrl: 'https://unlimited-mind-018782.framer.app/',
    buyUrl: null,
    remixUrl: 'https://framer.link/gnmQCXS?duplicateType=siteTemplate&via=thesparkstudio',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/vellum-edition/',
    image: '/templates/vellum-edition.webp',
    gallery: ['/templates/vellum-edition.webp', '/assets/template4.png', '/assets/template1.png']
  },
  'halden-edition': {
    price: 'Free',
    priceDe: 'Kostenlos',
    priceEs: 'Gratis',
    priceFr: 'Gratuit',
    numericPrice: '0.00',
    demoUrl: 'https://past-network-244230.framer.app/',
    buyUrl: null,
    remixUrl: 'https://framer.com/projects/new?duplicate=9E30JFnUiTHbMaHTtUrj&duplicateType=siteTemplate&via=thesparkstudio',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/halden-edition/',
    image: '/templates/halden-edition.webp',
    gallery: ['/templates/halden-edition.webp', '/assets/template2.png', '/assets/template4.png']
  },
  'grain-form': {
    price: 'Free',
    priceDe: 'Kostenlos',
    priceEs: 'Gratis',
    priceFr: 'Gratuit',
    numericPrice: '0.00',
    demoUrl: 'https://mindful-account-986092.framer.app/',
    buyUrl: null,
    remixUrl: 'https://framer.com/projects/new?duplicate=1dnNbY4wtemEHRvd6o8j&duplicateType=siteTemplate&via=thesparkstudio',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/grain-form/',
    image: '/templates/grain-form.webp',
    gallery: ['/templates/grain-form.webp', '/assets/template1.png', '/assets/template3.png']
  },
  'slowgrain': {
    price: 'Free',
    priceDe: 'Kostenlos',
    priceEs: 'Gratis',
    priceFr: 'Gratuit',
    numericPrice: '0.00',
    demoUrl: 'https://prosperous-statuses-272584.framer.app/',
    buyUrl: null,
    remixUrl: 'https://framer.com/remix/52YnIzlJOEXddxCP5O1n?duplicateType=siteTemplate&via=thesparkstudio',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/slowgrain/',
    image: '/templates/slowgrain.webp',
    gallery: ['/templates/slowgrain.webp', '/assets/template3.png', '/assets/template2.png']
  },
  'terra': {
    price: 'Free',
    priceDe: 'Kostenlos',
    priceEs: 'Gratis',
    priceFr: 'Gratuit',
    numericPrice: '0.00',
    demoUrl: 'https://vibrant-checkbox-000943.framer.app/',
    buyUrl: null,
    remixUrl: 'https://framer.com/remix/5khLh82TJAgBeWttovCI?duplicateType=siteTemplate&via=thesparkstudio',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/terra/',
    image: 'https://framerusercontent.com/images/H2DMerPuJWTvVUiihF3BX14Wdo.png',
    gallery: ['https://framerusercontent.com/images/H2DMerPuJWTvVUiihF3BX14Wdo.png', '/assets/template1.png', '/assets/template2.png']
  },
  'sasso-architect': {
    price: 'Free',
    priceDe: 'Kostenlos',
    priceEs: 'Gratis',
    priceFr: 'Gratuit',
    numericPrice: '0.00',
    demoUrl: 'https://small-bookings-302943.framer.app/',
    buyUrl: null,
    remixUrl: 'https://framer.com/projects/new?duplicate=Nx2FW4YFoqGsURIKQjbh&duplicateType=siteTemplate&via=thesparkstudio',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/sasso-architect/',
    image: 'https://framerusercontent.com/images/vXQOoXIJexVdw0e3emiEMLvyOds.png',
    gallery: ['https://framerusercontent.com/images/vXQOoXIJexVdw0e3emiEMLvyOds.png', '/assets/template2.png', '/assets/template3.png']
  },
  'tessovra': {
    price: '$89',
    priceDe: '89 USD',
    priceEs: '89 USD',
    priceFr: '89 USD',
    numericPrice: '89.00',
    demoUrl: 'https://hilarious-variations-838642.framer.app/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/02daec5f-f201-48aa-8636-d120270b5adc?embed=1',
    remixUrl: 'https://framer.link/F4RmFtN?duplicateType=siteTemplate&via=thesparkstudio',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/tessovra/',
    image: 'https://framerusercontent.com/images/3KolCsLSc048U4flMKf2dXWo.png',
    gallery: ['https://framerusercontent.com/images/3KolCsLSc048U4flMKf2dXWo.png', '/assets/template1.png', '/assets/template3.png']
  },
  'onyx-atelier-pro': {
    price: '$129',
    priceDe: '129 USD',
    priceEs: '129 USD',
    priceFr: '129 USD',
    numericPrice: '129.00',
    demoUrl: 'https://onyx-atelier-pro.framer.website/',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/f296bbd4-31b1-4b7b-acd2-d3dc7b6cec1c?embed=1',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/onyx-atelier-pro/',
    image: '/templates/onyx-atelier-pro.webp',
    // cover + two real screenshots of the live preview
    gallery: ['/templates/onyx-atelier-pro.webp', '/templates/onyx-atelier-pro-shot-1.webp', '/templates/onyx-atelier-pro-shot-2.webp']
  },
  'lume-field': {
    price: 'Free',
    priceDe: 'Kostenlos',
    priceEs: 'Gratis',
    priceFr: 'Gratuit',
    numericPrice: '0.00',
    demoUrl: 'https://tiny-monstera-197989.framer.app/',
    buyUrl: null,
    remixUrl: 'https://framer.link/IM60cyF?duplicateType=siteTemplate&via=thesparkstudio',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/lume-field/',
    image: '/templates/lume-field.webp',
    // cover + two real screenshots of the live preview
    gallery: ['/templates/lume-field.webp', '/templates/lume-field-shot-1.webp', '/templates/lume-field-shot-2.webp']
  },
  'solum-edition': {
    price: 'Free',
    priceDe: 'Kostenlos',
    priceEs: 'Gratis',
    priceFr: 'Gratuit',
    numericPrice: '0.00',
    demoUrl: 'https://past-network-244230.framer.app/',
    buyUrl: null,
    remixUrl: 'https://framer.com/projects/new?duplicate=1mnKrTlVBZZj8WSbfpeZ&duplicateType=siteTemplate&via=thesparkstudio',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/solum-edition/',
    image: '/templates/solum-edition.webp',
    // cover + two real screenshots of the live preview
    gallery: ['/templates/solum-edition.webp', '/templates/solum-edition-shot-1.webp', '/templates/solum-edition-shot-2.webp']
  },
  'hearthflow': {
    price: 'Free',
    priceDe: 'Kostenlos',
    priceEs: 'Gratis',
    priceFr: 'Gratuit',
    numericPrice: '0.00',
    demoUrl: 'https://aqua-arrow-585437.framer.app/',
    buyUrl: null,
    remixUrl: 'https://framer.com/projects/new?duplicate=FQUCFqjqG91SJ0P6keOK&duplicateType=siteTemplate&via=thesparkstudio',
    marketplaceUrl: 'https://www.framer.com/marketplace/templates/hearthflow/',
    image: '/templates/hearthflow.webp',
    // cover + two real screenshots of the live preview
    gallery: ['/templates/hearthflow.webp', '/templates/hearthflow-shot-1.webp', '/templates/hearthflow-shot-2.webp']
  }
};

const TEMPLATE_ARTICLE_MAP = {
  'onyx-atelier': {
    slug: 'onyx-atelier-framer-architecture-template-review',
    badge: 'Architectural Teardown',
    title: 'Onyx Atelier: In-Depth Monograph & Lighting Review'
  },
  'slowgrain': {
    slug: 'slowgrain-solum-framer-architecture-template-free-review',
    badge: 'Free Template Review',
    title: 'SLOWGRAIN (Solum): 100% Free Architectural Portfolio Teardown'
  },
  'sasso-architect': {
    slug: 'sasso-architect-framer-template-review',
    badge: 'Boutique Firm Review',
    title: 'SASSO Architect: Monograph Flagship & Spatial Layout Teardown'
  },
  'aurelle-estates': {
    slug: 'aurelle-estates-framer-architecture-template-review',
    badge: 'Luxury Property Review',
    title: 'Aurelle Estates: Luxury Architecture & Property Teardown'
  },
  'vellum-edition': {
    slug: 'vellum-edition-framer-architecture-template-review',
    badge: 'Art-Book Review',
    title: 'Vellum Edition: Quiet Art-Book Monograph Teardown'
  },
  'mavric-estate': {
    slug: 'best-luxury-real-estate-framer-templates-for-brokers',
    badge: 'Broker Comparison Guide',
    title: 'Best Luxury Real Estate Framer Templates for Brokers (2026)'
  },
  'terra': {
    slug: 'top-10-framer-templates-for-architects-and-design-studios-2026',
    badge: 'Architect Buyer Guide',
    title: 'Top 10 Framer Templates for Architects & Design Studios (2026)'
  },
  'tessovra': {
    slug: 'top-10-framer-templates-for-architects-and-design-studios-2026',
    badge: 'Spatial Atelier Guide',
    title: 'Top 10 Framer Templates for Architects & Design Studios (2026)'
  },
  'halden-edition': {
    slug: 'top-10-framer-templates-for-architects-and-design-studios-2026',
    badge: 'Minimalist Architecture Guide',
    title: 'Top 10 Framer Templates for Architects & Design Studios (2026)'
  },
  'grain-form': {
    slug: 'top-10-framer-templates-for-architects-and-design-studios-2026',
    badge: 'Spatial Design Guide',
    title: 'Top 10 Framer Templates for Architects & Design Studios (2026)'
  }
};

export default function TemplateDetailPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language ? i18n.language.slice(0, 2) : 'en';
  const meta = TEMPLATE_META[slug];
  const templateInfo = t(`templateDetails.${slug}`, { returnObjects: true });

  const item = { item_id: slug, item_name: templateInfo?.name || slug, price: Number(meta?.numericPrice), quantity: 1 };

  useEffect(() => {
    window.scrollTo(0, 0);
    initLemonSqueezy();
    if (meta?.buyUrl) preloadLemonSqueezy(); // buying is likely here: fetch lemon.js when idle
    if (meta) {
      trackEvent('view_item', {
        items: [item], value: item.price, currency: 'USD'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!meta || !templateInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <SEOHead
          title={`${t('detailPage.notFoundTitle') || 'Template Not Found'} — The Spark Studio`}
          description={t('detailPage.notFoundDesc') || 'The requested template could not be located.'}
          noindex={true}
        />
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

  const canonicalTemplateUrl = `https://www.thesparkstudio.digital${currentLang === 'en' ? '' : `/${currentLang}`}/templates/${slug}`;

  // Product + Breadcrumb JSON-LD structured data for rich snippets & AI engines
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': meta.isCustom ? 'Service' : 'Product',
        '@id': `${canonicalTemplateUrl}#product`,
        'name': templateInfo.name,
        'description': templateInfo.headline,
        'image': meta.image.startsWith('http') ? meta.image : `https://www.thesparkstudio.digital${meta.image}`,
        'category': 'Software > Website Templates',
        'inLanguage': currentLang,
        'brand': {
          '@type': 'Brand',
          'name': 'The Spark Studio'
        },
        'offers': meta.isCustom ? undefined : {
          '@type': 'Offer',
          'price': meta.numericPrice,
          'priceCurrency': 'USD',
          'availability': 'https://schema.org/InStock',
          'url': canonicalTemplateUrl,
          'seller': ORG_REF
        }
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': t('detailPage.breadcrumbHome') || 'Home',
            'item': `https://www.thesparkstudio.digital${homeLink}`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': t('detailPage.breadcrumbTemplates') || 'Templates',
            'item': `https://www.thesparkstudio.digital${templatesLink}`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': templateInfo.name,
            'item': canonicalTemplateUrl
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
        title={`${templateInfo.name} — ${templateInfo.category}`}
        description={templateInfo.headline}
        image={meta.image}
        canonicalUrl={canonicalTemplateUrl}
        jsonLd={productJsonLd}
      />

      <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        
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
                    {meta.isCustom ? 'Build Format' : (t('detailPage.templateLicense') || 'Template License')}
                  </span>
                  <span className="text-3xl font-extrabold text-[#f7f6fb] font-mono">
                    {localizedPrice}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8e97f7] bg-[#8e97f7]/10 px-3 py-1 rounded-full border border-[#8e97f7]/20">
                    <Check className="w-3 h-3" />
                    {meta.isCustom
                      ? 'Full Codebase & Setup'
                      : meta.buyUrl
                        ? (t('detailPage.licenseIncluded') || 'Commercial License Included') // paid: bought, not remixed
                        : (t('detailPage.instantRemix') || 'Instant 1-Click Remix')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {meta.price === 'Free' && meta.remixUrl ? (
                  <a
                    href={meta.remixUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white transition-all shadow-lg hover:opacity-90 active:scale-[0.99] cursor-pointer"
                    style={{
                      background: 'linear-gradient(120deg, rgb(108, 79, 232) 0%, rgb(255, 106, 69) 100%)'
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {t('detailPage.remixFree') || 'Remix in Framer (Free) ↗'}
                    </span>
                  </a>
                ) : meta.buyUrl ? (
                  <a
                    href={meta.buyUrl}
                    onPointerEnter={loadLemonSqueezy}
                    onFocus={loadLemonSqueezy}
                    onClick={(e) => handleLemonCheckout(e, meta.buyUrl, item)}
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
                ) : (
                  <a
                    href={`mailto:hello@thesparkstudio.digital?subject=Custom%20Build%20Inquiry%20-%20${encodeURIComponent(templateInfo.name)}`}
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white transition-all shadow-lg hover:opacity-90 active:scale-[0.99]"
                    style={{
                      background: 'linear-gradient(120deg, rgb(108, 79, 232) 0%, rgb(255, 106, 69) 100%)'
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {meta.price === 'Free' ? 'Download Free Template' : 'Commission Similar Build →'}
                    </span>
                  </a>
                )}

                {meta.marketplaceUrl && (
                  <a
                    href={meta.marketplaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-[#f7f6fb] bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 transition-colors"
                  >
                    <span>Framer Marketplace</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}

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

            {/* Architectural Teardown Link Banner */}
            {TEMPLATE_ARTICLE_MAP[slug] && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-purple-500/5 to-transparent border border-purple-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block font-semibold">
                      {TEMPLATE_ARTICLE_MAP[slug].badge}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {TEMPLATE_ARTICLE_MAP[slug].title}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/blog/${TEMPLATE_ARTICLE_MAP[slug].slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-300 hover:text-white transition-colors shrink-0 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30"
                >
                  <span>Read Review</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

          </div>

          {/* Right Column: Hero Showcase Image */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/40 shadow-2xl relative aspect-[4/3] group">
              <img
                src={mainImage === meta.image ? templateSrc(mainImage) : mainImage}
                srcSet={mainImage === meta.image ? templateSrcSet(mainImage) : undefined}
                sizes="(min-width: 1024px) 40vw, 100vw"
                width="1024"
                height="768"
                loading="eager"
                fetchPriority="high"
                alt={`${templateInfo.name} — Framer Template Showcase`}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.removeAttribute('srcset');
                  if (e.currentTarget.getAttribute('src') !== meta.image) e.currentTarget.src = meta.image;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Gallery thumbnails */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {meta.gallery?.map((imgUrl, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-white/[0.08] bg-zinc-950 aspect-[16/10]">
                  <img
                    src={thumbnail(imgUrl, 192)}
                    srcSet={imgUrl.startsWith('https:') ? undefined : `${thumbnail(imgUrl, 192)} 192w, ${thumbnail(imgUrl, 384)} 384w`}
                    sizes="(max-width: 768px) 30vw, 160px"
                    loading="lazy"
                    width="192"
                    height="120"
                    alt={galleryDescriptions[imgUrl] || `${templateInfo.name} homepage preview`}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.removeAttribute('srcset');
                      if (e.currentTarget.getAttribute('src') !== imgUrl) e.currentTarget.src = imgUrl;
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
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-3">
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
                    <span className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal">
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
                  <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
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
                  href={`mailto:hello@thesparkstudio.digital?subject=Custom%20Build%20Inquiry%20-%20${encodeURIComponent(templateInfo.name)}`}
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
                <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>{t('detailPage.support') || 'Support'}</span>
                  <span>hello@thesparkstudio.digital</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* More from the studio (H2) */}
        <div className="pt-24 border-t border-white/[0.08] mt-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-1">
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
                      src={templateSrc(item.meta.image)}
                      srcSet={templateSrcSet(item.meta.image)}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      loading="lazy"
                      decoding="async"
                      width="768"
                      height="480"
                      alt={item.info?.name ? `${item.info.name} — Framer Template by The Spark Studio` : 'The Spark Studio Framer Template'}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.removeAttribute('srcset');
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
