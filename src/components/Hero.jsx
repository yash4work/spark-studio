import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MagneticButton, ScrambleText } from '../lib/framer-effects';
import LiquidGradientShader from './LiquidGradientShader';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#15131f]">
      
      {/* =========================================================================
          INTERACTIVE WEBGL2 LIQUID GRADIENT SHADER BACKGROUND
          ========================================================================= */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden select-none z-0"
        aria-hidden="true"
      >
        {/* Real-time Interactive WebGL2 Liquid Gradient Shader */}
        <LiquidGradientShader 
          className="w-full h-full absolute inset-0"
          mouseEnabled={true}
        />

        {/* Glow Side & Dark Vignette Overlay so typography stays sharp and readable */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(21, 19, 31, 0.85) 0%, rgba(21, 19, 31, 0.5) 45%, rgba(21, 19, 31, 0.1) 100%)'
          }}
        />

        {/* Glow Fade Overlay with seamless bottom blend */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background: 'linear-gradient(rgba(21, 19, 31, 0.15) 0%, rgba(21, 19, 31, 0.35) 40%, rgba(21, 19, 31, 0.75) 75%, #15131f 100%)'
          }}
        />
      </div>

      {/* =========================================================================
          HERO CONTENT (EXACT LEFT ALIGNMENT & 1440PX CONTAINER)
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-36 sm:pt-44 flex flex-col items-start gap-7">
        
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.05em] text-[#8e97f7]">
            {t('hero.eyebrow') || 'WEBSITES · CUSTOM SOFTWARE · FRAMER & REACT ENGINEERING'}
          </p>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-4xl sm:text-6xl md:text-[64px] font-extrabold text-[#f7f6fb] tracking-[-0.03em] leading-[1.05] max-w-[760px]"
        >
          {t('hero.title') || 'Websites & custom software engineered to scale.'}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-base sm:text-[17px] text-[#8b87a0] max-w-[580px] font-normal leading-[1.75] tracking-[-0.02em]"
        >
          {t('hero.description') || 'Spark Studio designs and builds high-performance websites, custom SaaS platforms, and bespoke digital experiences using Next.js, React, Webflow, and Framer — visually stunning, code-free for your marketing team, and built with 90+ PageSpeed scores out of the box.'}
        </motion.p>

        {/* CTA Buttons with Magnetic Physics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          {/* Primary CTA */}
          <MagneticButton>
            <a
              href="#projects"
              className="framer-btn-primary px-8 py-3.5 rounded-[40px] text-[15px] cursor-pointer"
            >
              <span>Explore our work</span>
            </a>
          </MagneticButton>

          {/* Secondary CTA */}
          <MagneticButton>
            <a
              href="#contact"
              className="framer-btn-secondary px-8 py-3.5 rounded-[40px] text-[15px] cursor-pointer"
            >
              <span>Hire us for custom builds</span>
            </a>
          </MagneticButton>
        </motion.div>

      </div>

      {/* Stats Row with Horizontal Divider Line across width */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-16 sm:pb-20">
        <div className="border-t border-white/10 w-full mb-8" />

        <div className="flex flex-wrap items-center gap-8 sm:gap-12">
          {/* Stat 1 */}
          <div className="flex flex-col items-start pr-8 sm:pr-12 border-r border-white/10">
            <span className="text-3xl sm:text-[44px] font-extrabold text-[#f7f6fb] font-heading leading-none mb-1">
              <ScrambleText text={t('hero.stat1Val') || '95+'} />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.05em] text-[#8b87a0]">
              {t('hero.stat1Label') || 'Core Web Vitals'}
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-start pr-8 sm:pr-12 border-r border-white/10">
            <span className="text-3xl sm:text-[44px] font-extrabold text-[#f7f6fb] font-heading leading-none mb-1">
              <ScrambleText text={t('hero.stat2Val') || '100%'} />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.05em] text-[#8b87a0]">
              {t('hero.stat2Label') || 'Production Ready'}
            </span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-start">
            <span className="text-3xl sm:text-[44px] font-extrabold text-[#f7f6fb] font-heading leading-none mb-1">
              <ScrambleText text={t('hero.stat3Val') || 'Multi-Stack'} />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.05em] text-[#8b87a0]">
              {t('hero.stat3Label') || 'Next.js · React · Framer · Webflow'}
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
