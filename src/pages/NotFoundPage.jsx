import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';

export default function NotFoundPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentLang = i18n.language || 'en';
  const homePrefix = currentLang === 'en' ? '' : `/${currentLang}`;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center pt-36 pb-24">
      <SEOHead
        title={t('notFound.title', { defaultValue: '404 - Page Not Found — The Spark Studio' })}
        description={t('notFound.desc', { defaultValue: 'The requested page could not be found.' })}
        canonicalUrl={`https://www.thesparkstudio.digital${location.pathname}`}
        noindex={true}
      />
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-[#8e97f7] mb-6">
        <span>404 ERROR</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-[#f7f6fb] tracking-tight mb-4">
        {t('notFound.heading', { defaultValue: 'Page Not Found' })}
      </h1>
      <p className="text-sm md:text-base text-[#8b87a0] max-w-md mx-auto mb-8 leading-relaxed">
        {t('notFound.message', { defaultValue: 'The page you are looking for does not exist or has been moved.' })}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to={homePrefix || '/'}
          className="px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
        >
          {t('notFound.returnHome', { defaultValue: 'Return to Studio Home' })}
        </Link>
        <Link
          to={`${homePrefix}/blog`}
          className="px-6 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/15 font-semibold text-sm transition-all"
        >
          {t('notFound.exploreBlog', { defaultValue: 'Explore Articles' })}
        </Link>
      </div>
    </div>
  );
}
