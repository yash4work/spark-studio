import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import HomePage from './pages/HomePage';

const TemplateDetailPage = lazy(() => import('./pages/TemplateDetailPage'));

const VALID_SLUGS = [
  'mavric-estate',
  'aurelle-estates',
  'onyx-atelier',
  'vellum-edition',
  'halden-edition',
  'grain-form',
  'slowgrain',
  'terra',
  'sasso-architect',
  'tessovra',
];

// Language synchronizer & hash scroll restoration
function RouteManager() {
  const location = useLocation();
  const { i18n } = useTranslation();

  // Synchronize language based on URL prefix
  useEffect(() => {
    const path = location.pathname;
    let targetLang = 'en';

    if (path.startsWith('/de')) {
      targetLang = 'de';
    } else if (path.startsWith('/es')) {
      targetLang = 'es';
    } else if (path.startsWith('/fr')) {
      targetLang = 'fr';
    }

    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }
    document.documentElement.lang = targetLang;
  }, [location.pathname, i18n]);

  // Handle smooth hash scrolling or top scrolling
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return null;
}

// Route handler allowing direct /:slug template access with fallback
function SlugRouteHandler() {
  const { slug } = useParams();
  if (VALID_SLUGS.includes(slug)) {
    return <TemplateDetailPage />;
  }
  return <Navigate to="/" replace />;
}

// Localized slug handler allowing direct /:lang/:slug template access
function LocalizedSlugRouteHandler() {
  const { lang, slug } = useParams();
  if (VALID_SLUGS.includes(slug)) {
    return <TemplateDetailPage />;
  }
  return <Navigate to={`/${lang}`} replace />;
}

// Scroll Progress Bar component from Framer Spark Core
function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        transformOrigin: '0 50%',
        transform: `scaleX(${scrollProgress})`,
        background: 'linear-gradient(90deg, rgb(142, 151, 247), rgb(255, 106, 69))',
        zIndex: 9998,
        pointerEvents: 'none',
        transition: 'transform 0.1s ease-out'
      }}
    />
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#15131f] text-[#8b87a0] flex flex-col justify-between selection:bg-[#6c4fe8] selection:text-[#f7f6fb] relative">
      <CustomCursor />
      <ScrollProgressBar />
      <RouteManager />
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
          </div>
        }>
          <Routes>
            {/* English Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/templates/:slug" element={<TemplateDetailPage />} />
            <Route path="/:slug" element={<SlugRouteHandler />} />

            {/* German Routes */}
            <Route path="/de" element={<HomePage />} />
            <Route path="/de/templates/:slug" element={<TemplateDetailPage />} />
            <Route path="/de/:slug" element={<LocalizedSlugRouteHandler />} />

            {/* Spanish Routes */}
            <Route path="/es" element={<HomePage />} />
            <Route path="/es/templates/:slug" element={<TemplateDetailPage />} />
            <Route path="/es/:slug" element={<LocalizedSlugRouteHandler />} />

            {/* French Routes */}
            <Route path="/fr" element={<HomePage />} />
            <Route path="/fr/templates/:slug" element={<TemplateDetailPage />} />
            <Route path="/fr/:slug" element={<LocalizedSlugRouteHandler />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
