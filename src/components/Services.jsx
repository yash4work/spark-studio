import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { MagneticButton, TiltCard } from '../lib/framer-effects';

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Discover',
    desc: 'A short call to understand your goals, audience and scope — followed by a clear proposal.'
  },
  {
    num: '02',
    title: 'Design',
    desc: 'Moodboard, key screens and a design system, reviewed together before anything is built.'
  },
  {
    num: '03',
    title: 'Build',
    desc: 'A native Framer build with CMS, motion and responsive breakpoints hand-tuned for every device.'
  },
  {
    num: '04',
    title: 'Launch',
    desc: 'Domain, SEO, analytics and a handover walkthrough so your team can edit with confidence.'
  }
];

const SERVICES_LIST = [
  {
    num: '01',
    title: 'Template Customization ($499 – $899)',
    desc: 'Brand typography, color palette, logo swap, content migration, custom section additions, responsive breakpoint audit. Turnaround: 3–5 days.'
  },
  {
    num: '02',
    title: 'Bespoke Framer Website Development ($2,500 – $6,000+)',
    desc: 'Custom UI/UX design, native Framer component build, fluid animations, dynamic CMS architecture, Core Web Vitals optimization. Turnaround: 2–3 weeks.'
  },
  {
    num: '03',
    title: 'Figma to Framer Conversion ($1,500 – $3,500)',
    desc: '1:1 pixel-perfect translation of your Figma files into interactive, production-ready Framer pages with interactive components. Turnaround: 7–10 days.'
  },
  {
    num: '04',
    title: 'Framer Speed Boost / Performance ($350 – $600)',
    desc: 'Font weight consolidation, image compression, script deferral, and layout shift fixes to guarantee 90+ mobile PageSpeed scores. Turnaround: 24–48 hours.'
  }
];

export default function Services() {
  const { t } = useTranslation();
  const rawSteps = t('services.processSteps', { returnObjects: true });
  const stepsList = Array.isArray(rawSteps) && rawSteps.length > 0 ? rawSteps : PROCESS_STEPS;

  const rawServices = t('services.items', { returnObjects: true });
  const servicesList = Array.isArray(rawServices) && rawServices.length > 0
    ? rawServices.map((s, idx) => ({
        num: s.num || `0${idx + 1}`,
        title: s.price ? `${s.title} (${s.price})` : s.title,
        desc: s.turnaround ? `${s.desc} ${s.turnaround}.` : s.desc
      }))
    : SERVICES_LIST;

  return (
    <section 
      id="services" 
      className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28 relative flex flex-col gap-14 sm:gap-16 border-t border-white/10"
    >
      {/* =========================================================================
          PART 1: HOW WE WORK (4 PROCESS STEPS)
          ========================================================================= */}
      <div className="w-full flex flex-col gap-8">
        <p className="font-mono text-xs uppercase tracking-[0.05em] text-[#8e97f7]">
          {t('services.processEyebrow', { defaultValue: 'HOW WE WORK' })}
        </p>

        {/* 4 Steps Grid (.framer-1oa197) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {stepsList.map((step) => (
            <div
              key={step.num}
              className="flex flex-col items-start gap-2.5"
            >
              <span className="font-heading font-extrabold text-3xl sm:text-[32px] text-[#8e97f7] leading-none mb-1">
                {step.num}
              </span>
              <h3 className="font-heading font-semibold text-lg text-[#f7f6fb] leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-[#8b87a0] font-normal leading-[1.6]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PART 2: CUSTOM BUILDS (OFFERING & 4 SERVICE CARDS WITH 3D TILT + SPOTLIGHT)
          ========================================================================= */}
      <div className="w-full flex flex-col gap-10 pt-8 border-t border-white/10">
        
        {/* Head: Title on left, Description on right (Exact Framer .framer-n89iux) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="flex flex-col items-start gap-2 max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.05em] text-[#8e97f7]">
              {t('services.eyebrow', { defaultValue: 'CUSTOM BUILDS' })}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-[38px] font-semibold text-[#f7f6fb] font-heading tracking-[-0.02em] leading-tight">
              {t('services.title', { defaultValue: 'Framer Development & Template Customization Studio' })}
            </h2>
          </div>

          <p className="text-sm sm:text-[14.5px] text-[#8b87a0] font-normal leading-relaxed max-w-md">
            {t('services.desc', { defaultValue: 'Whether you need a custom Framer website built from scratch, pixel-perfect Figma to Framer development, or full brand customization of any official Framer marketplace template, Spark Studio delivers production-grade web experiences engineered for 95+ PageSpeed scores.' })}
          </p>
        </div>

        {/* 4 Service Cards Grid (2x2 with 3D Tilt and Cursor Spotlight) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicesList.map((service) => (
            <TiltCard
              key={service.num}
              className="framer-service-card p-8 rounded-2xl bg-[#1b1826] border border-white/10 flex flex-col justify-between gap-6 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-[#8e97f7]">
                  {service.num}
                </span>
                <span className="service-arrow text-sm text-[#8b87a0]">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                <h3 className="font-heading font-semibold text-xl text-[#f7f6fb] leading-snug group-hover:text-[#8e97f7] transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-[#8b87a0] font-normal leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Bottom Action Bar in Framer: We reply within 24 hours + Start a project button with magnetic pull */}
        <div className="flex items-center justify-between pt-2">
          <span className="font-mono text-xs text-[#8b87a0]">
            {t('services.replyNotice') || 'We reply within 24 hours'}
          </span>
          <MagneticButton>
            <a
              href="#contact"
              className="framer-btn-primary px-6 py-2.5 rounded-full text-xs font-semibold text-white cursor-pointer shadow-md"
            >
              <span>{t('services.cta') || 'Start a project →'}</span>
            </a>
          </MagneticButton>
        </div>

      </div>
    </section>
  );
}
