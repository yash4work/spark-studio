import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagneticButton } from '../lib/framer-effects';

const languages = [
  { code: 'en', label: 'English', short: 'EN', flag: '/flags/en.svg' },
  { code: 'de', label: 'Deutsch', short: 'DE', flag: '/flags/de.svg' },
  { code: 'es', label: 'Español', short: 'ES', flag: '/flags/es.svg' },
  { code: 'fr', label: 'Français', short: 'FR', flag: '/flags/fr.svg' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = i18n.language ? i18n.language.slice(0, 2) : 'en';
  const currentLangObj = languages.find((l) => l.code === currentLang) || languages[0];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNavPath = (hash) => {
    const isHomePage = location.pathname === '/' || ['/de', '/es', '/fr'].includes(location.pathname);
    if (isHomePage) {
      return hash;
    }
    const prefix = currentLang === 'en' ? '' : `/${currentLang}`;
    return `${prefix || '/'}${hash}`;
  };

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    setLangDropdownOpen(false);
    setMobileMenuOpen(false);

    const path = location.pathname;
    let pathWithoutLang = path;
    for (const l of ['de', 'es', 'fr']) {
      if (path.startsWith(`/${l}/`)) {
        pathWithoutLang = path.substring(3);
        break;
      } else if (path === `/${l}`) {
        pathWithoutLang = '/';
        break;
      }
    }

    if (code === 'en') {
      navigate(pathWithoutLang || '/');
    } else {
      const cleanPath = pathWithoutLang === '/' ? '' : pathWithoutLang;
      navigate(`/${code}${cleanPath}`);
    }
  };

  const navItems = [
    { label: t('nav.projects') || 'Projects', href: getNavPath('#projects') },
    { label: t('nav.services') || 'Services', href: getNavPath('#services') },
    { label: t('nav.standards') || 'Standards', href: getNavPath('#standards') },
    { label: t('nav.about') || 'About', href: getNavPath('#about') },
    { label: t('nav.faq') || 'FAQ', href: getNavPath('#faq') },
    { label: t('nav.contact') || 'Contact', href: getNavPath('#contact') },
  ];

  return (
    <header 
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        scrolled 
          ? 'top-3 px-4 sm:px-6 pointer-events-none' 
          : 'top-0 px-6 sm:px-10 lg:px-14 xl:px-16 pointer-events-auto'
      }`}
    >
      <div 
        className={`mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          scrolled
            ? 'max-w-[1360px] pointer-events-auto rounded-full py-2.5 px-6 sm:px-8 bg-[#15131f]/85 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
            : 'max-w-[1680px] w-full py-6 bg-transparent border-none'
        }`}
      >
        {/* Brand Logo & Name */}
        <Link 
          to={currentLang === 'en' ? '/' : `/${currentLang}`}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-7 h-7 flex items-center justify-center">
            <img 
              src="/logo.svg" 
              alt="Spark Studio Logo" 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
            />
          </div>
          <span className="font-heading font-bold text-base tracking-tight text-[#f7f6fb]">
            Spark Studio
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="framer-nav-link text-[14px] md:text-[16px] text-[#8b87a0] hover:text-[#f7f6fb] px-3 py-1.5 font-medium transition-colors cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Action: Language Switcher & CTA */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Circular Flag Language Dropdown (Exact Match to Image 0) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="framer-btn-secondary flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-[#f7f6fb] border border-white/25 hover:border-white/50 transition-colors cursor-pointer"
              aria-label="Select Language"
            >
              <div className="w-[18px] h-[18px] rounded-full overflow-hidden border border-white/20 shrink-0">
                <img 
                  src={currentLangObj.flag} 
                  alt={currentLangObj.code} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="uppercase font-semibold tracking-wide">{currentLang}</span>
              <ChevronDown className={`w-3 h-3 text-[#8b87a0] transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {langDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#1b1826]/95 border border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-2 z-50 backdrop-blur-2xl flex flex-col gap-1"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                        currentLang === lang.code
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-[#8b87a0] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-[20px] h-[20px] rounded-full overflow-hidden border border-white/20 shrink-0">
                          <img 
                            src={lang.flag} 
                            alt={lang.code} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium">{lang.label}</span>
                      </div>
                      <span className="font-mono text-xs text-[#8b87a0] uppercase">{lang.short}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA Button */}
          <MagneticButton>
            <a
              href={getNavPath('#contact')}
              className="framer-btn-secondary px-5 py-2 rounded-full text-[13.5px] font-semibold text-[#f7f6fb] border border-white/25 hover:border-white/60 transition-all cursor-pointer"
            >
              <span>Start a project →</span>
            </a>
          </MagneticButton>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="p-2 rounded-full text-[#8b87a0] hover:text-white bg-white/5 border border-white/10"
            aria-label="Language"
          >
            <div className="w-4 h-4 rounded-full overflow-hidden border border-white/20">
              <img src={currentLangObj.flag} alt={currentLangObj.code} className="w-full h-full object-cover" />
            </div>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-[#8b87a0] hover:text-white bg-white/5 border border-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 max-w-[1440px] mx-auto rounded-2xl bg-[#1b1826]/95 border border-white/10 backdrop-blur-2xl p-5 shadow-2xl pointer-events-auto"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 pb-4 border-b border-white/10">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border ${
                      currentLang === lang.code
                        ? 'border-white/30 bg-white/10 text-white font-semibold'
                        : 'border-white/5 bg-white/[0.02] text-[#8b87a0] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full overflow-hidden border border-white/20">
                        <img src={lang.flag} alt={lang.code} className="w-full h-full object-cover" />
                      </div>
                      <span>{lang.label}</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#8e97f7]">{lang.short}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-[#8b87a0] hover:text-white font-medium hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="pt-2">
                <a
                  href={getNavPath('#contact')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="framer-btn-primary w-full py-2.5 rounded-full text-xs font-semibold text-white shadow-lg"
                >
                  <span>Start a project →</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
