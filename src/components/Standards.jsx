import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const STANDARDS_LIST = [
  {
    num: '01',
    title: '95+ Core Web Vitals',
    desc: 'Optimized DOM structures, lightweight scripts, and auto-compressed assets for lightning-fast load times and strong Google ranking signals.'
  },
  {
    num: '02',
    title: 'Visual CMS & Code Agility',
    desc: 'Framer and Webflow for visual marketing velocity; Next.js and React 19 for custom software scalability.'
  },
  {
    num: '03',
    title: 'Modular scalable architecture',
    desc: 'Add dozens of case studies, posts, properties, or products in seconds, with automatically formatted dynamic pages and filters.'
  },
  {
    num: '04',
    title: 'Precision responsive breakpoints',
    desc: 'Every layout hand-tuned across desktop, tablet, and mobile breakpoints for seamless readability and zero layout shift.'
  },
  {
    num: '05',
    title: 'Design token & style guide architecture',
    desc: 'Organized component libraries with fluid variants, design tokens, and reusable style variables matching production standards 1:1.'
  },
  {
    num: '06',
    title: 'AEO & modern SEO, built in',
    desc: 'Pre-configured semantic HTML hierarchy, JSON-LD schema, customizable OpenGraph metadata, and clean heading trees.'
  }
];

export default function Standards() {
  const { t } = useTranslation();

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
        {STANDARDS_LIST.map((std) => (
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
