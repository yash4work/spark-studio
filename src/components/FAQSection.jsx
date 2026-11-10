import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_ITEMS = [
  {
    q: 'What platforms and technologies do you specialize in?',
    a: 'We specialize in modern web engineering and visual development: Next.js, React, Tailwind CSS, TypeScript, Framer, and Webflow. We match the optimal stack to your project—whether you need a scalable full-stack web application or an easily editable visual CMS.'
  },
  {
    q: 'Can you build custom software, web applications, and marketing websites?',
    a: 'Yes. We build custom web applications, SaaS dashboards, and client portals in Next.js and React, alongside high-converting marketing websites and design systems in Framer and Webflow.'
  },
  {
    q: 'Do you convert Figma designs to production code?',
    a: 'Yes. We translate Figma design systems 1:1 into interactive, production-ready React/Next.js code or Framer/Webflow pages with fluid micro-interactions, responsive breakpoints, and zero layout shift.'
  },
  {
    q: 'What is the typical turnaround time?',
    a: 'Template customizations and speed optimizations are completed in 3 to 5 business days. Custom websites and full web applications take 2 to 4 weeks depending on scope.'
  },
  {
    q: 'How do we get started?',
    a: 'Email your project brief directly to sparkstudio0@outlook.com or submit the contact form below. We review your requirements and respond within 24 hours with a fixed quote and start date.'
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
      className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-20 sm:py-28 relative flex flex-col md:flex-row items-start justify-between gap-12 md:gap-20 border-t border-white/10"
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
        <p className="text-sm md:text-base text-[#8b87a0] font-normal leading-relaxed">
          Everything you need to know about our custom software development, custom websites, Framer builds, and engagement models.
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
                    <div className="pt-4 text-sm md:text-base text-[#8b87a0] font-normal leading-relaxed">
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
