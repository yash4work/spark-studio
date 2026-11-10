import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { initLemonSqueezy, handleLemonCheckout } from '../lib/lemonsqueezy';
import { MagneticButton, TiltCard } from '../lib/framer-effects';

const VAULT_BUNDLES = [
  {
    id: 'pick-any-3',
    badge: 'FLEXIBLE CHOICE',
    isFeatured: false,
    title: 'Pick Any 3 Starter Pack',
    price: '$99',
    regularPrice: '/ Save up to $148 (60% OFF)',
    desc: 'Choose any 3 templates from our active catalog. Ideal for freelancers with upcoming client projects.',
    features: [
      'Any 3 production Framer templates',
      'Instant 1-click duplicate & remix links',
      'Companion Figma source files (.fig)',
      'Dynamic CMS archives & responsive UI',
      'Single production site per template'
    ],
    cta: 'Choose Any 3 — $99',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/964d9218-93b1-4110-a9cf-c2a897adc31b?embed=1'
  },
  {
    id: 'solo-vault',
    badge: 'MOST POPULAR · SAVE $313 (68% OFF)',
    isFeatured: true,
    title: 'Complete Studio Vault (Solo)',
    price: '$149',
    regularPrice: '/ $462 retail value',
    desc: 'Instant access to all 7 premium paid templates + Slowgrain. Complete high-status design vault for ambitious creators.',
    features: [
      'All 7 paid templates + Slowgrain (Free)',
      'Aurelle ($99) + Onyx ($79) + Tessovra ($69)',
      'Mavric ($69) + Halden ($59) + Grain & Form ($58)',
      'Vellum Edition ($29) included',
      'Full companion Figma UI kits & specs',
      'Commercial solo license per template'
    ],
    cta: 'Unlock Full Vault — $149',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/b482e2fd-0fa0-4433-9fc8-f91db20b9cf1?embed=1'
  },
  {
    id: 'agency-vault',
    badge: 'UNLIMITED CLIENT RIGHTS',
    isFeatured: false,
    title: 'Complete Studio Vault (Agency)',
    price: '$249',
    regularPrice: '/ $1,200+ commercial value',
    desc: 'Complete 8-template library with unlimited commercial licensing. Ship high-ticket client builds and keep 100% of fees.',
    features: [
      'All 7 paid templates + Slowgrain',
      'Unlimited commercial client deployments',
      'Keep 100% of client project revenue',
      'All companion Figma files & design assets',
      'Priority studio developer onboarding'
    ],
    cta: 'Get Agency Vault — $249',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/e4d03d2d-2408-4a55-92e4-84c50735f47d?embed=1'
  }
];

const NICHE_PACKS = [
  {
    id: 'real-estate-duo',
    tag: 'REAL ESTATE · SAVE $69',
    title: 'Luxury Real Estate Flagship Duo',
    price: '$99',
    regularPrice: '/ $168 regular value',
    desc: 'Aurelle Estates ($99) + Mavric Estate ($69). The definitive toolkit for luxury brokerages, property developers, and agents.',
    features: [
      'Aurelle Estates ($99) luxury residence template',
      'Mavric Estate ($69) agent & listing portal',
      'Complete dynamic CMS collections included',
      '100% visual editing with zero code required'
    ],
    cta: 'Get Real Estate Duo — $99',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/e3f375d8-3a4c-4d46-9b37-f5c27bfd6f98?embed=1'
  },
  {
    id: 'architecture-duo',
    tag: 'ARCHITECTURE · SAVE $39',
    title: 'Monograph Architecture Duo',
    price: '$69',
    regularPrice: '/ $108 regular value',
    desc: 'Onyx Atelier ($79) + Vellum Edition ($29). Engineered for architectural practices, spatial design studios, and monographs.',
    features: [
      'Onyx Atelier ($79) exhibition-style dark portfolio',
      'Vellum Edition ($29) quiet art-book monograph',
      'High-contrast layout systems and gallery grids',
      'Core Web Vitals 95+ speed out of the box'
    ],
    cta: 'Get Architecture Duo — $69',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/2daaa04b-a936-499a-abec-1d66c1c4f859?embed=1'
  },
  {
    id: 'artisan-suite',
    tag: 'COMMERCE & CRAFT · SAVE $67',
    title: 'Artisan Living & E-Commerce Suite',
    price: '$119',
    regularPrice: '/ $186 regular value',
    desc: 'TESSOVRA ($69) + Halden Edition ($59) + Grain & Form ($58) (+ Slowgrain Free). Curated for bespoke ateliers & boutiques.',
    features: [
      'TESSOVRA ($69) luxury flagship commerce layout',
      'Halden Edition ($59) collectible craft showcase',
      'Grain & Form ($58) artisan homeware catalog',
      'SLOWGRAIN museum-grade design tokens included'
    ],
    cta: 'Get Artisan Suite — $119',
    buyUrl: 'https://yashparmar.lemonsqueezy.com/checkout/buy/bc9f4aac-c012-4609-8b58-2781198aba64?embed=1'
  }
];

export default function BundlesSection() {
  const { t } = useTranslation();

  useEffect(() => {
    initLemonSqueezy();
  }, []);

  const rawVault = t('bundles.vaultList', { returnObjects: true });
  const vaultBundles = Array.isArray(rawVault) && rawVault.length > 0 ? rawVault : VAULT_BUNDLES;

  const rawNiche = t('bundles.nicheList', { returnObjects: true });
  const nichePacks = Array.isArray(rawNiche) && rawNiche.length > 0 ? rawNiche : NICHE_PACKS;

  return (
    <section 
      id="bundles" 
      className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-20 sm:py-28 relative flex flex-col gap-14 border-t border-white/10"
    >
      {/* Head: Title on left, Description on right */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col items-start gap-2 w-full lg:max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.05em] text-[#8e97f7]">
            {t('bundles.exclusiveEyebrow') || 'EXCLUSIVE BUNDLES & VAULT ACCESS'}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-[38px] font-semibold text-[#f7f6fb] font-heading tracking-[-0.02em] leading-tight">
            {t('bundles.exclusiveTitle') || 'Save up to 68% with curated template bundles.'}
          </h2>
        </div>

        <p className="text-sm md:text-base text-[#8b87a0] font-normal leading-relaxed w-full lg:max-w-md">
          {t('bundles.exclusiveDesc') || 'Production-ready Framer templates bundled for independent creators, studios, and agencies. 100% native, static collection as-is with immediate 1-click remix access.'}
        </p>
      </div>

      {/* Row 1: The 3 Main Vault Packs with 3D Tilt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {vaultBundles.map((bundle) => (
          <TiltCard 
            key={bundle.id}
            className={`p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 ${
              bundle.isFeatured
                ? 'bg-[#1b1826] border-2 border-[#8e97f7]/60 shadow-[0_0_40px_rgba(142,151,247,0.18)] relative'
                : 'bg-[#1b1826] border border-white/10 hover:border-[#8e97f7]/40 shadow-xl'
            }`}
          >
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider mb-4 ${
                bundle.isFeatured
                  ? 'bg-[#8e97f7]/20 border border-[#8e97f7]/40 text-white font-semibold'
                  : 'bg-white/[0.04] border border-white/10 text-[#8e97f7]'
              }`}>
                {bundle.badge}
              </span>

              <h3 className="text-xl font-bold text-[#f7f6fb] mb-2 font-heading leading-snug">
                {bundle.title}
              </h3>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#f7f6fb] font-mono">
                  {bundle.price}
                </span>
                <span className="text-xs text-[#8b87a0] font-mono">
                  {bundle.regularPrice}
                </span>
              </div>

              <p className="text-xs text-[#8b87a0] leading-relaxed mb-6 font-normal">
                {bundle.desc}
              </p>

              <ul className="space-y-2.5 mb-8 border-t border-white/10 pt-5">
                {bundle.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#8b87a0]">
                    <Check className="w-3.5 h-3.5 text-[#8e97f7] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <MagneticButton className="w-full">
              <a
                href={bundle.buyUrl}
                onClick={(e) => handleLemonCheckout(e, bundle.buyUrl)}
                className={`lemonsqueezy-button w-full py-3 rounded-full text-center text-xs font-semibold cursor-pointer block ${
                  bundle.isFeatured
                    ? 'framer-btn-primary shadow-[0_10px_25px_-5px_rgba(108,79,232,0.4)]'
                    : 'framer-btn-secondary border border-white/20 hover:border-white/50'
                }`}
              >
                {bundle.cta}
              </a>
            </MagneticButton>
          </TiltCard>
        ))}
      </div>

      {/* Row 2: Category-Wise Niche Packs (3 Cards with 3D Tilt) */}
      <div className="pt-8 border-t border-white/10 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h3 className="text-2xl font-heading font-semibold text-[#f7f6fb]">
            {t('bundles.nicheTitle') || 'Category-Wise Niche Packs'}
          </h3>
          <p className="font-mono text-xs uppercase tracking-[0.05em] text-[#8e97f7]">
            {t('bundles.nicheEyebrow') || 'TARGETED PAIRS FOR SPECIFIC INDUSTRIES'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {nichePacks.map((pack) => (
            <TiltCard 
              key={pack.id}
              className="p-8 rounded-2xl bg-[#1b1826] border border-white/10 hover:border-[#8e97f7]/40 flex flex-col justify-between gap-6 transition-all duration-300"
            >
              <div>
                <span className="text-[11px] font-mono text-[#8e97f7] uppercase tracking-wider block mb-2">
                  {pack.tag}
                </span>

                <h4 className="font-heading font-semibold text-lg text-[#f7f6fb] mb-2 leading-snug">
                  {pack.title}
                </h4>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-[#f7f6fb]">
                    {pack.price}
                  </span>
                  <span className="text-xs text-[#8b87a0] font-mono">
                    {pack.regularPrice}
                  </span>
                </div>

                <p className="text-xs text-[#8b87a0] leading-relaxed mb-6 font-normal">
                  {pack.desc}
                </p>

                <ul className="space-y-2.5 mb-8 border-t border-white/10 pt-5">
                  {pack.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#8b87a0]">
                      <Check className="w-3.5 h-3.5 text-[#8e97f7] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <MagneticButton className="w-full">
                <a
                  href={pack.buyUrl}
                  onClick={(e) => handleLemonCheckout(e, pack.buyUrl)}
                  className="lemonsqueezy-button framer-btn-secondary w-full py-2.5 rounded-full text-center text-xs font-semibold text-[#f7f6fb] border border-white/20 hover:border-white/40 cursor-pointer block"
                >
                  {pack.cta}
                </a>
              </MagneticButton>
            </TiltCard>
          ))}
        </div>
      </div>

    </section>
  );
}
