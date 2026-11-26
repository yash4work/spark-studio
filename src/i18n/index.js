import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const SUPPORTED_LANGUAGES = ['en', 'de', 'es', 'fr'];

// Each language is its own small chunk, downloaded only when that language is used.
// (Before, all 4 translation files were bundled into the main script.)
const localeLoaders = import.meta.glob('./locales/*.json', { import: 'default' });

const lazyLocaleBackend = {
  type: 'backend',
  init() {},
  read(language, _namespace, callback) {
    const load = localeLoaders[`./locales/${language}.json`];
    if (!load) return callback(new Error('Unknown language: ' + language), false);
    load().then((data) => callback(null, data), (err) => callback(err, false));
  },
};

const initialLanguage =
  typeof location === 'undefined' ? 'en' : location.pathname.match(/^\/(de|es|fr)(?:\/|$)/)?.[1] || 'en';

// Resolves once the current page's language is loaded. main.jsx waits for this
// before hydrating, so the first client render matches the pre-rendered HTML.
export const i18nReady = i18n
  .use(lazyLocaleBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: initialLanguage,
    // All 4 locale files have identical keys (checked by `npm test`), so no
    // English fallback is needed - and none is downloaded on de/es/fr pages.
    fallbackLng: false,
    supportedLngs: SUPPORTED_LANGUAGES,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      // On a language switch, keep showing the old language until the new
      // file arrives instead of suspending the whole page.
      useSuspense: false,
    },
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
  });

export default i18n;
