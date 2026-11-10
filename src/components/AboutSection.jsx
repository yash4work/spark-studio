import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section 
      id="about" 
      className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28 relative flex flex-col md:flex-row items-start justify-between gap-10 md:gap-16 border-t border-white/10"
    >
      {/* Left Column (.framer-196thwl: flex-1) */}
      <div className="flex-1 flex flex-col items-start gap-4">
        <motion.p 
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-mono text-xs uppercase tracking-[0.05em] text-[#8e97f7]"
        >
          {t('about.eyebrow', { defaultValue: 'ABOUT SPARK STUDIO' })}
        </motion.p>
        
        <motion.h3 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-2xl sm:text-3xl md:text-[34px] font-medium text-[#f7f6fb] font-heading leading-tight tracking-[-0.02em]"
        >
          {t('about.title', { defaultValue: 'Websites and digital software shouldn’t look like generic cookie-cutter clones.' })}
        </motion.h3>
      </div>

      {/* Right Column (.framer-h4m70h: flex-[1.2]) */}
      <div className="flex-[1.2] flex flex-col items-start gap-5">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-sm sm:text-[15px] text-[#8b87a0] font-normal leading-[1.65]"
        >
          {t('about.p1', { defaultValue: 'Spark Studio is a modern design & software engineering studio crafting high-caliber custom websites, web applications, and Framer/Webflow platforms — for founders, creative agencies, and ambitious businesses across every industry, from high-growth SaaS platforms to luxury hospitality and editorial flagships.' })}
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-sm sm:text-[15px] text-[#8b87a0] font-normal leading-[1.65]"
        >
          {t('about.p2', { defaultValue: 'We bridge the gap between visual agility and software engineering. Whether engineering a bespoke Next.js web application, deploying a conversion-driven Webflow site, or crafting an editorial Framer experience, our standards remain uncompromising: 90+ PageSpeed scores, clean modular architectures, and fluid micro-interactions.' })}
        </motion.p>
      </div>
    </section>
  );
}
