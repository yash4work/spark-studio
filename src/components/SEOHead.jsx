import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://www.thesparkstudio.digital';
const SUPPORTED_LANGS = ['en', 'de', 'es', 'fr'];

export default function SEOHead({ 
  title, 
  description, 
  image = '/assets/spark-studio-og-image.jpg', 
  type = 'website',
  jsonLd = null 
}) {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title;
    }

    // 2. Helper to set or create meta tag
    const setMeta = (attr, val, content) => {
      if (!attr || !val) return;
      try {
        let el = document.querySelector(`meta[${attr}="${val}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(attr, val);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content || '');
      } catch (err) {
        // Fallback safely if querySelector has special characters
        const metas = Array.from(document.querySelectorAll('meta'));
        let el = metas.find(m => m.getAttribute(attr) === val);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(attr, val);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content || '');
      }
    };

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    if (title) {
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }

    setMeta('name', 'twitter:card', 'summary_large_image');

    const fullImageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;
    setMeta('property', 'og:image', fullImageUrl);
    setMeta('name', 'twitter:image', fullImageUrl);

    const fullCanonical = `${BASE_URL}${location.pathname}`;
    setMeta('property', 'og:url', fullCanonical);
    setMeta('name', 'twitter:url', fullCanonical);
    setMeta('property', 'og:type', type);

    // 3. Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullCanonical);

    // 4. Update html lang attribute
    const currentLang = i18n.language ? i18n.language.slice(0, 2) : 'en';
    document.documentElement.lang = currentLang;

    // 5. Update dynamic hreflang alternate tags
    // Strip language prefix to find canonical base route
    let barePath = location.pathname;
    for (const l of ['de', 'es', 'fr']) {
      if (barePath.startsWith(`/${l}/`)) {
        barePath = barePath.substring(3);
        break;
      } else if (barePath === `/${l}`) {
        barePath = '/';
        break;
      }
    }

    // Helper to get localized URL
    const getLocalizedUrl = (langCode) => {
      if (langCode === 'en') {
        return `${BASE_URL}${barePath === '' ? '/' : barePath}`;
      }
      const suffix = barePath === '/' ? '' : barePath;
      return `${BASE_URL}/${langCode}${suffix}`;
    };

    // Upsert hreflang links
    const setHreflang = (langCode, href) => {
      let link = document.querySelector(`link[rel="alternate"][hreflang="${langCode}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', langCode);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    SUPPORTED_LANGS.forEach((lang) => {
      setHreflang(lang, getLocalizedUrl(lang));
    });
    setHreflang('x-default', getLocalizedUrl('en'));

    // 6. Inject JSON-LD script if provided
    const scriptId = 'custom-jsonld';
    let scriptEl = document.getElementById(scriptId);
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [title, description, image, type, jsonLd, location.pathname, i18n.language]);

  return null;
}
