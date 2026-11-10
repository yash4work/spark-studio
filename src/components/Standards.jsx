import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const STANDARDS_LIST = [
  {
    num: '01',
    title: '90+ Core Web Vitals',
    desc: 'Optimized DOM structure, lightweight scripts and auto-compressed WebP images for instant load times and strong Google ranking signals.'
  },
  {
    num: '02',
    title: '100% visual editing, zero code',
    desc: "Modify colors, swap typography, update imagery and rearrange sections through Framer's intuitive native interface."
  },
  {
    num: '03',
    title: 'Modular dynamic CMS',
    desc: 'Add dozens of case studies, posts, properties or products in seconds, with automatically formatted detail pages and category filters.'
  },
  {
    num: '04',
    title: 'Precision responsive breakpoints',
    desc: 'Every layout hand-tuned across desktop (1440px), tablet (810px) and mobile (390px) for seamless readability.'
  },
  {
    num: '05',
    title: 'Companion Figma source systems',
    desc: 'Organized Figma files with auto-layouts and reusable style variables matching the Framer build 1:1.'
  },
  {
    num: '06',
    title: 'AEO & modern SEO, built in',
    desc: 'Pre-configured semantic HTML hierarchy, customizable OpenGraph metadata and clean structured heading trees.'
  }
];

export default function Standards() {
  const { t } = useTranslation();
  const rawStandards = t('standards.items', { returnObjects: true });
  const standardsList = Array.isArray(rawStandards) && rawStandards.length > 0 ? rawStandards : STANDARDS_LIST;

  return (
    <section 
      id="standards" 
      className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-20 sm:py-28 relative"
    >
      {/* Head: Title on left, Subtitle on right (Exact Framer .framer-1deueaw) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-4">
        <h2 className="text-3xl sm:text-4xl md:text-[40px] font-semibold text-[#f7f6fb] font-heading tracking-[-0.02em] leading-tight max-w-xl">
          {t('standards.title') || 'Engineered without compromise'}
        </h2>
        
        <p className="text-sm md:text-base text-[#8b87a0] font-normal leading-relaxed max-w-md">
          {t('standards.subtitle') || 'Every template is held to the same production standard: enterprise-grade speed, rock-solid responsiveness, seamless customization.'}
        </p>
      </div>

      {/* Rows Container matching Framer .framer-11u7tcu & .framer-1qk6cf2 */}
      <div className="w-full flex flex-col border-t border-white/10">
        {standardsList.map((std) => (
          <div
            key={std.num}
            data-framer-name="Standard Row"
            className="framer-standard-row group w-full py-6 sm:py-7 border-b border-white/10 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 cursor-pointer"
          >
            {/* Std Num: width 80px */}
            <div data-framer-name="Std Num" className="w-20 flex-shrink-0">
              <p className="framer-std-num font-mono text-[13px] text-[#8e97f7] font-semibold">
                {std.num}
              </p>
            </div>

            {/* Std Title: width 320px */}
            <div data-framer-name="Std Title" className="w-full md:w-[320px] flex-shrink-0">
              <h3 className="framer-std-title font-heading text-lg font-semibold text-[#f7f6fb] leading-snug">
                {std.title}
              </h3>
            </div>

            {/* Std Description: flex-1 */}
            <p className="flex-1 text-[14px] md:text-base text-[#8b87a0] font-normal leading-relaxed">
              {std.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
