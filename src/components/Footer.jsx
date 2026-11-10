import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t border-white/10 bg-[#15131f] text-[#8b87a0] relative overflow-hidden">
      <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-12 sm:pt-16 pb-8 flex flex-col gap-10 sm:gap-14">
        
        {/* Massive 184px Wordmark matching Framer Footer Wordmark */}
        <div className="w-full overflow-hidden select-none py-2 sm:py-4">
          <h2 
            className="font-heading font-extrabold text-[13vw] md:text-[170px] lg:text-[184px] leading-none tracking-[-0.04em] text-[#f7f6fb]/[0.25] text-center whitespace-nowrap uppercase"
            style={{
              fontFamily: '"Bricolage Grotesque", sans-serif'
            }}
          >
            SPARK STUDIO
          </h2>
        </div>

        {/* Middle Row: Tagline on Left, Social Links on Right */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
          <p className="text-sm md:text-base text-[#8b87a0] max-w-xl font-normal leading-relaxed">
            {t('footer.tagline') || 'High-performance Framer templates and custom websites, built for ambitious brands worldwide.'}
          </p>

          <div className="flex items-center gap-6">
            <a
              href="mailto:hello@thesparkstudio.digital"
              className="text-sm md:text-base font-medium text-[#8b87a0] hover:text-[#f7f6fb] transition-colors hidden sm:inline"
            >
              hello@thesparkstudio.digital
            </a>
            <a
              href="https://www.linkedin.com/company/sparkstudio0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-sm md:text-base font-medium text-[#8b87a0] hover:text-[#f7f6fb] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://teams.microsoft.com/l/chat/0/0?users=hello@thesparkstudio.digital"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Microsoft Teams"
              className="text-sm md:text-base font-medium text-[#8b87a0] hover:text-[#f7f6fb] transition-colors"
            >
              Teams
            </a>
            <a
              href="https://sparkstudio0.slack.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Slack"
              className="text-sm md:text-base font-medium text-[#8b87a0] hover:text-[#f7f6fb] transition-colors"
            >
              Slack
            </a>
          </div>
        </div>

        {/* Bottom Row: Copyright on Left, Built with Framer badge on Right */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#8b87a0]">
          <div>
            © 2026 Spark Studio. All rights reserved.
          </div>
          <div>
            Built with native Framer layers · Optimized for Core Web Vitals
          </div>
        </div>

      </div>
    </footer>
  );
}
