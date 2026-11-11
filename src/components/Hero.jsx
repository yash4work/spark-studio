import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MagneticButton, ScrambleText } from '../lib/framer-effects';
import LiquidGradientShader from './LiquidGradientShader';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#15131f]">
      
      {/* =========================================================================
          EXACT FRAMER FULL-WIDTH HERO GLOW & LIQUID AURORA SHADER (.framer-euz5iv)
          ========================================================================= */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0"
        aria-hidden="true"
      >
        {/* Layer 1: Ambient Mesh Radial Gradient Fallback */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'radial-gradient(60% 60% at 75% 20%, rgba(108, 79, 232, 0.8) 0%, rgba(75, 59, 190, 0.5) 35%, rgba(21, 19, 31, 0) 75%), radial-gradient(50% 50% at 20% 30%, rgba(59, 130, 246, 0.25) 0%, rgba(21, 19, 31, 0) 70%)'
          }}
        />

        {/* Layer 2: The Liquid Aurora WebGL Shader covering the FULL SCREEN (100% width) */}
        <LiquidGradientShader 
          className="absolute inset-0 w-full h-full opacity-85"
          fallbackImage="/assets/hero-shader.png"
          mouseEnabled={true}
        />

        {/* Layer 3: Glow Side Overlay (Framers .framer-w52f8q) */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(90deg, rgba(21, 19, 31, 0.82) 0%, rgba(21, 19, 31, 0.45) 55%, rgba(21, 19, 31, 0.05) 100%)'
          }}
        />

        {/* Layer 4: Glow Fade Overlay with seamless 100% bottom blend (Eliminating Image 4 seam) */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(rgba(21, 19, 31, 0.2) 0%, rgba(21, 19, 31, 0.4) 40%, rgba(21, 19, 31, 0.75) 75%, #15131f 100%)'
          }}
        />
      </div>

      {/* =========================================================================
          HERO CONTENT (EXACT LEFT ALIGNMENT & 1440PX CONTAINER)
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-36 sm:pt-44 flex flex-col items-start gap-7">
        
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.05em] text-[#8e97f7]">
            {t('hero.eyebrow') || 'PREMIUM FRAMER TEMPLATES & CUSTOM WEB DESIGN'}
          </p>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-4xl sm:text-6xl md:text-[64px] font-extrabold text-[#f7f6fb] tracking-[-0.03em] leading-[1.05] max-w-[840px]"
        >
          {t('hero.title') || 'High-Performance Framer Websites & Templates Engineered to Scale.'}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-base sm:text-[17px] md:text-lg text-[#8b87a0] max-w-[620px] font-normal leading-[1.75] tracking-[-0.02em]"
        >
          {t('hero.description') || 'Spark Studio designs high-performance Framer templates and custom websites for ambitious startups, creative studios, and modern businesses — visually editable, code-free, and built with 90+ PageSpeed scores out of the box.'}
        </motion.p>

        {/* CTA Buttons with Magnetic Physics (Exact match to Image 1: Explore templates / Hire us for custom work) */}
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
              <span>{t('hero.exploreCta') || 'Explore templates'}</span>
            </a>
          </MagneticButton>

          {/* Secondary CTA */}
          <MagneticButton>
            <a
              href="#contact"
              className="framer-btn-secondary px-8 py-3.5 rounded-[40px] text-[15px] cursor-pointer"
            >
              <span>{t('hero.customCta') || 'Hire us for custom work'}</span>
            </a>
          </MagneticButton>
        </motion.div>

      </div>

      {/* Stats Row with Horizontal Divider Line across width (Exact Match to Image 1) */}
      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-16 pb-16 sm:pb-20">
        <div className="border-t border-white/10 w-full mb-8" />

        <div className="flex flex-wrap items-center gap-8 sm:gap-12">
          {/* Stat 1 */}
          <div className="flex flex-col items-start pr-8 sm:pr-12 border-r border-white/10">
            <span className="text-3xl sm:text-[44px] font-extrabold text-[#f7f6fb] font-heading leading-none mb-1">
              <ScrambleText text={t('hero.stat1Val') || '90+'} />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.05em] text-[#8b87a0]">
              {t('hero.stat1Label') || 'Core Web Vitals'}
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-start pr-8 sm:pr-12 border-r border-white/10">
            <span className="text-3xl sm:text-[44px] font-extrabold text-[#f7f6fb] font-heading leading-none mb-1">
              <ScrambleText text={t('hero.stat2Val') || '0'} />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.05em] text-[#8b87a0]">
              {t('hero.stat2Label') || 'Code required'}
            </span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-start">
            <span className="text-3xl sm:text-[44px] font-extrabold text-[#f7f6fb] font-heading leading-none mb-1">
              <ScrambleText text={t('hero.stat3Val') || '1-click'} />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.05em] text-[#8b87a0]">
              {t('hero.stat3Label') || 'Framer remix'}
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
