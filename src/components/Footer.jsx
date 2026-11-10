import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { LinkedInIcon, TeamsIcon, SlackIcon, MailIcon } from './SocialIcons';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentLang = i18n.language ? i18n.language.slice(0, 2) : 'en';

  const homePrefix = currentLang === 'en' ? '/' : `/${currentLang}`;
  const getSectionHref = (hash) => {
    const isHome = location.pathname === '/' || location.pathname === `/${currentLang}` || location.pathname === `/${currentLang}/`;
    return isHome ? hash : `${homePrefix}${hash}`;
  };

  return (
    <footer className="w-full border-t border-white/10 bg-[#12101a] text-[#8b87a0] relative overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-12 sm:pt-16 pb-10 flex flex-col gap-12 sm:gap-16">
        
        {/* Massive Editorial Wordmark */}
        <div className="w-full overflow-hidden select-none py-2 sm:py-4 border-b border-white/5" aria-hidden="true">
          <h2 
            className="font-heading font-extrabold text-[13vw] md:text-[170px] lg:text-[184px] leading-none tracking-[-0.04em] text-[#f7f6fb]/[0.18] text-center whitespace-nowrap uppercase transition-colors duration-500 hover:text-[#f7f6fb]/[0.26]"
            style={{
              fontFamily: '"Bricolage Grotesque", sans-serif'
            }}
          >
            SPARK STUDIO
          </h2>
        </div>

        {/* Top Info Bar: Brand Tagline, Live Status, and Official Vector Social Icons */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div className="flex flex-col gap-2 max-w-xl">
            <p className="text-sm sm:text-base text-[#c3bfdb] font-normal leading-relaxed">
              {t('footer.tagline') || 'High-performance websites, custom software, and digital flagships engineered for ambitious brands worldwide.'}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs font-mono text-[#8b87a0]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-medium">
                {t('footer.statusAvailable') || 'Available for new client builds'}
              </span>
              <span className="text-white/20">·</span>
              <span>{t('footer.statusReplies') || 'Replies within 24h'}</span>
            </div>
          </div>

          {/* Official Vector Icon Bar (LinkedIn, Microsoft Teams, Slack, Email) */}
          <div className="flex items-center gap-3">
            {/* Email Icon */}
            <a
              href="mailto:hello@thesparkstudio.digital"
              aria-label="Direct Email"
              title="hello@thesparkstudio.digital"
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-[#8e97f7]/15 border border-white/10 hover:border-[#8e97f7]/50 text-[#8b87a0] hover:text-[#8e97f7] flex items-center justify-center transition-all duration-200 group shadow-sm"
            >
              <MailIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>

            {/* LinkedIn Official Vector */}
            <a
              href="https://www.linkedin.com/company/sparkstudio0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="Spark Studio on LinkedIn"
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-[#0A66C2]/15 border border-white/10 hover:border-[#0A66C2]/50 text-[#8b87a0] hover:text-[#0A66C2] flex items-center justify-center transition-all duration-200 group shadow-sm"
            >
              <LinkedInIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>

            {/* Microsoft Teams Official Vector */}
            <a
              href="https://teams.microsoft.com/l/chat/0/0?users=hello@thesparkstudio.digital"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Microsoft Teams"
              title="Chat with us on Microsoft Teams"
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-[#5059C9]/15 border border-white/10 hover:border-[#5059C9]/50 text-[#8b87a0] hover:text-[#7B83EB] flex items-center justify-center transition-all duration-200 group shadow-sm"
            >
              <TeamsIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>

            {/* Slack Official Vector */}
            <a
              href="https://sparkstudio0.slack.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Slack Workspace"
              title="Connect on Slack"
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-[#ECB22E]/15 border border-white/10 hover:border-[#ECB22E]/50 text-[#8b87a0] hover:text-[#ECB22E] flex items-center justify-center transition-all duration-200 group shadow-sm"
            >
              <SlackIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
          </div>
        </div>

        {/* 4-Column Structured Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 pt-2 text-sm">
          
          {/* Column 1: Studio */}
          <div className="flex flex-col gap-3.5">
            <h4 className="font-mono text-xs uppercase tracking-[0.08em] text-[#f7f6fb] font-semibold">
              {t('footer.colStudio') || 'Studio'}
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href={getSectionHref('#templates')} className="hover:text-[#f7f6fb] transition-colors">
                  {t('footer.links.projects') || 'Selected Work'}
                </a>
              </li>
              <li>
                <a href={getSectionHref('#services')} className="hover:text-[#f7f6fb] transition-colors">
                  {t('footer.links.services') || 'Services & Pricing'}
                </a>
              </li>
              <li>
                <a href={getSectionHref('#standards')} className="hover:text-[#f7f6fb] transition-colors">
                  {t('footer.links.standards') || 'Engineering Standards'}
                </a>
              </li>
              <li>
                <a href={getSectionHref('#about')} className="hover:text-[#f7f6fb] transition-colors">
                  {t('footer.links.about') || 'About Spark Studio'}
                </a>
              </li>
              <li>
                <a href={getSectionHref('#faq')} className="hover:text-[#f7f6fb] transition-colors">
                  {t('footer.links.faq') || 'FAQ & Process'}
                </a>
              </li>
              <li>
                <a href={getSectionHref('#contact')} className="text-[#8e97f7] hover:text-[#ff6a45] transition-colors inline-flex items-center gap-1 font-medium">
                  {t('footer.links.contact') || 'Start a Project'}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Capabilities / Services */}
          <div className="flex flex-col gap-3.5">
            <h4 className="font-mono text-xs uppercase tracking-[0.08em] text-[#f7f6fb] font-semibold">
              {t('footer.colServices') || 'Capabilities'}
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href={getSectionHref('#services')} className="hover:text-[#f7f6fb] transition-colors">
                  {t('footer.links.webDesign') || 'Custom Websites & CMS'}
                </a>
              </li>
              <li>
                <a href={getSectionHref('#services')} className="hover:text-[#f7f6fb] transition-colors">
                  {t('footer.links.customSoftware') || 'Custom Software & SaaS'}
                </a>
              </li>
              <li>
                <a href={getSectionHref('#services')} className="hover:text-[#f7f6fb] transition-colors">
                  {t('footer.links.figmaToCode') || 'Figma to Production Code'}
                </a>
              </li>
              <li>
                <a href={getSectionHref('#services')} className="hover:text-[#f7f6fb] transition-colors">
                  {t('footer.links.speedOpt') || 'Core Web Vitals Optimization'}
                </a>
              </li>
              <li>
                <a href={getSectionHref('#services')} className="hover:text-[#f7f6fb] transition-colors">
                  {t('footer.links.framerRebrand') || 'Template Customization'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Templates & Products */}
          <div className="flex flex-col gap-3.5">
            <h4 className="font-mono text-xs uppercase tracking-[0.08em] text-[#f7f6fb] font-semibold">
              {t('footer.colTemplates') || 'Templates & Bundles'}
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href={getSectionHref('#templates')} className="hover:text-[#f7f6fb] transition-colors">
                  {t('footer.links.allTemplates') || 'All Templates'}
                </a>
              </li>
              <li>
                <a href={getSectionHref('#bundles')} className="hover:text-[#f7f6fb] transition-colors">
                  {t('footer.links.theVault') || 'The Spark Vault'}
                </a>
              </li>
              <li>
                <a href={getSectionHref('#bundles')} className="hover:text-[#f7f6fb] transition-colors">
                  {t('footer.links.nichePacks') || 'Specialized Bundles'}
                </a>
              </li>
              <li>
                <a 
                  href="https://www.framer.com/@thesparkstudio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f7f6fb] transition-colors inline-flex items-center gap-1"
                >
                  <span>{t('footer.links.framerProfile') || 'Framer Marketplace Profile'}</span>
                  <ArrowUpRight className="w-3 h-3 text-white/40" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Inquiries & Reach */}
          <div className="flex flex-col gap-3.5">
            <h4 className="font-mono text-xs uppercase tracking-[0.08em] text-[#f7f6fb] font-semibold">
              {t('footer.colConnect') || 'Inquiries & Channels'}
            </h4>
            <div className="flex flex-col gap-2.5">
              <a 
                href="mailto:hello@thesparkstudio.digital" 
                className="text-[#f7f6fb] hover:text-[#8e97f7] transition-colors font-mono text-xs sm:text-sm break-all"
              >
                hello@thesparkstudio.digital
              </a>
              <p className="text-xs text-[#8b87a0] leading-relaxed pt-1">
                Mon – Fri · Global Remote<br />
                Replies guaranteed within 24 hours.
              </p>
              <div className="pt-2">
                <a
                  href={getSectionHref('#contact')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-[#f7f6fb] font-mono transition-all"
                >
                  <span>Schedule Consultation</span>
                  <ArrowUpRight className="w-3 h-3 text-[#8e97f7]" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Row: Copyright on Left, Accurate Tech Subtext on Right */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#8b87a0]">
          <div>
            {t('footer.rights') || '© 2026 Spark Studio. All rights reserved.'}
          </div>
          <div className="flex items-center gap-2 text-[#8b87a0]/80">
            <span>{t('footer.builtWith') || 'Engineered for 95+ Core Web Vitals · High-Conversion Web Architecture'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
