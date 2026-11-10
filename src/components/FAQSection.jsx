import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_ITEMS = [
  {
    q: 'Can you customize any Framer template?',
    a: 'Yes. We adapt and customize any official Framer marketplace template or third-party theme—adjusting brand palettes, typography, custom CMS fields, and third-party integrations.'
  },
  {
    q: 'What is the typical turnaround time?',
    a: 'Template customizations are completed in 3 to 5 business days. Bespoke website builds take 2 to 3 weeks depending on scope.'
  },
  {
    q: 'How do you optimize Framer site speed?',
    a: 'We eliminate render-blocking fonts, compress assets to AVIF/WebP, and streamline responsive breakpoint trees to consistently achieve 95+ scores on Google PageSpeed Insights.'
  },
  {
    q: 'How do we get started?',
    a: 'Email your project brief directly to sparkstudio0@outlook.com. We review your requirements and respond within 24 hours with a fixed quote and start date.'
  }
];

export default function FAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section 
      id="faq" 
      className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28 relative flex flex-col md:flex-row items-start justify-between gap-12 md:gap-20 border-t border-white/10"
    >
      {/* Head: Title on left */}
      <div className="w-full md:w-[320px] lg:w-[380px] flex-shrink-0 flex flex-col items-start gap-3">
        <motion.h2 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-3xl sm:text-4xl md:text-[38px] font-semibold text-[#f7f6fb] font-heading tracking-[-0.02em] leading-tight"
        >
          Frequently asked
        </motion.h2>
        <p className="text-sm text-[#8b87a0] font-normal leading-relaxed">
          Everything you need to know about our Framer templates, bespoke development, and customization services.
        </p>
      </div>

      {/* FAQ Accordion List on right */}
      <div className="flex-1 w-full divide-y divide-white/10 border-t border-b border-white/10">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-6 transition-colors">
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between text-left focus:outline-none group gap-4"
                aria-expanded={isOpen}
              >
                <span className="text-lg sm:text-[19px] font-semibold text-[#f7f6fb] font-heading group-hover:text-[#8e97f7] transition-colors leading-snug">
                  {item.q}
                </span>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                  isOpen 
                    ? 'bg-white/10 border-white/30 text-white' 
                    : 'bg-transparent border-white/20 text-[#8b87a0] group-hover:border-white/40 group-hover:text-white'
                }`}>
                  {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 text-sm sm:text-[15px] text-[#8b87a0] font-normal leading-relaxed">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
