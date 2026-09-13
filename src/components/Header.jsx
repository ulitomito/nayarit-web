import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBlog } from '../context/BlogContext';
import { Menu, X, ChevronDown, Check } from 'lucide-react';

const WHATSAPP_PHONE = '523111187229';

// Custom high-definition SVG flag components for perfect cross-platform rendering
const MexicoFlag = ({ className = 'w-5 h-3.5' }) => (
  <svg className={`${className} rounded-[2px] shadow-sm shrink-0 overflow-hidden inline-block`} viewBox="0 0 640 480">
    <path fill="#006847" d="M0 0h213.3v480H0z" />
    <path fill="#fff" d="M213.3 0h213.4v480H213.3z" />
    <path fill="#ce1126" d="M426.7 0H640v480H426.7z" />
    <circle cx="320" cy="240" r="38" fill="#a07d3b" opacity="0.9" />
    <path d="M312 225c2-4 8-6 16-2 4 2 6 6 6 11-3 7-10 10-16 11-4-1-8-3-10-7 0-5 2-9 4-13z" fill="#6d4f1d" />
    <path d="M305 248c8 8 22 8 30 0" stroke="#006847" strokeWidth="4" fill="none" />
  </svg>
);

const USFlag = ({ className = 'w-5 h-3.5' }) => (
  <svg className={`${className} rounded-[2px] shadow-sm shrink-0 overflow-hidden inline-block`} viewBox="0 0 640 480">
    <path fill="#bd3d44" d="M0 0h640v480H0z" />
    <path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 276.9h640M0 350.8h640M0 424.6h640" />
    <path fill="#192f5d" d="M0 0h256v258.5H0z" />
    <g fill="#fff">
      <circle cx="42" cy="35" r="7" />
      <circle cx="95" cy="35" r="7" />
      <circle cx="148" cy="35" r="7" />
      <circle cx="201" cy="35" r="7" />
      <circle cx="68" cy="75" r="7" />
      <circle cx="121" cy="75" r="7" />
      <circle cx="174" cy="75" r="7" />
      <circle cx="42" cy="115" r="7" />
      <circle cx="95" cy="115" r="7" />
      <circle cx="148" cy="115" r="7" />
      <circle cx="201" cy="115" r="7" />
      <circle cx="68" cy="155" r="7" />
      <circle cx="121" cy="155" r="7" />
      <circle cx="174" cy="155" r="7" />
      <circle cx="42" cy="195" r="7" />
      <circle cx="95" cy="195" r="7" />
      <circle cx="148" cy="195" r="7" />
      <circle cx="201" cy="195" r="7" />
    </g>
  </svg>
);

export const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const { currentView, selectedArticle, navigateToBlog, navigateToLanding } = useBlog();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef(null);

  const headerWhatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(
    lang === 'es'
      ? '¡Hola Nayarit Real Estate! Me gustaría ponerme en contacto con un asesor inmobiliario.'
      : 'Hello Nayarit Real Estate! I would like to speak with a real estate advisor.'
  )}`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '#hero', label: t.nav.home, key: 'home' },
    { href: '#destinos', label: t.nav.destinations, key: 'destinations' },
    { href: '#plusvalia', label: t.nav.simulator, key: 'simulator' },
    { href: '#servicios', label: t.nav.services, key: 'services' },
    { href: '#blog', label: t.nav.blog, key: 'blog' },
    { href: '#contacto', label: t.nav.contact, key: 'contact' },
  ];

  const handleNavLinkClick = (e, link) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (link.key === 'blog') {
      navigateToBlog();
      return;
    }

    const sectionId = link.href.replace('#', '');
    if (currentView === 'blog' || selectedArticle) {
      navigateToLanding(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = link.href;
      }
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (currentView === 'blog' || selectedArticle) {
      navigateToLanding('hero');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 overflow-x-clip transition-all duration-300">
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-xl shadow-md border-b border-[#DFD5C4] py-2'
            : 'bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#DFD5C4]/60 py-2.5 sm:py-3'
        }`}
      >
        <div className="w-full max-w-[1750px] mx-auto px-2 sm:px-4 lg:px-6 flex items-center justify-between gap-2">
          {/* Official Brand Logo - Sleek, Compact and Elegant */}
          <a
            href="#hero"
            onClick={handleLogoClick}
            className="flex min-w-0 flex-1 sm:flex-none items-center gap-2 sm:gap-3 group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-xl border border-[#C59A47] bg-white shadow-sm shrink-0">
              <img
                src="/assets/logo-emblem.jpg"
                alt="Nayarit Real Estate"
                className="w-9 h-9 sm:w-11 sm:h-11 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="min-w-0 flex flex-col justify-center">
              <span className="whitespace-nowrap font-serif text-[13px] max-[359px]:text-[11px] min-[390px]:text-sm sm:text-lg md:text-xl font-extrabold tracking-tight text-[#0B1E14] leading-none group-hover:text-[#153A26] transition-colors">
                NAYARIT REAL ESTATE
              </span>
              <span className="whitespace-nowrap text-[6px] max-[359px]:text-[5px] min-[390px]:text-[7px] sm:text-[9px] md:text-[10px] text-[#C59A47] font-bold tracking-[0.1em] sm:tracking-[0.2em] uppercase mt-1 leading-none">
                {t.nav.slogan}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {navLinks.map((link) => {
              const isBlogActive = link.key === 'blog' && (currentView === 'blog' || Boolean(selectedArticle));
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link)}
                  className={`text-sm font-semibold transition-colors relative py-1 group cursor-pointer ${
                    isBlogActive ? 'text-[#153A26] font-bold' : 'text-[#1A211D] hover:text-[#153A26]'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-[#C59A47] transition-all duration-300 ${
                      isBlogActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </a>
              );
            })}
          </nav>

          {/* Right Actions: Intuitive Flag Language Selector + WhatsApp Button */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3.5">
            {/* Intuitive Flag-based Language Selector Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-2 sm:gap-2 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#DFD5C4] hover:border-[#C59A47] shadow-sm text-xs font-semibold text-[#0B1E14] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C59A47]/40"
                aria-label={lang === 'es' ? 'Cambiar a idioma inglés o español' : 'Change language to English or Spanish'}
                aria-expanded={langMenuOpen}
              >
                {lang === 'es' ? (
                  <>
                    <MexicoFlag className="w-[18px] h-3 sm:w-5 sm:h-3.5" />
                    <span className="font-bold text-[11px] max-[359px]:hidden sm:text-xs">Español</span>
                  </>
                ) : (
                  <>
                    <USFlag className="w-[18px] h-3 sm:w-5 sm:h-3.5" />
                    <span className="font-bold text-[11px] max-[359px]:hidden sm:text-xs">English</span>
                  </>
                )}
                <ChevronDown
                  className={`w-3 h-3 max-[359px]:hidden sm:w-3.5 sm:h-3.5 text-[#5C6B62] transition-transform duration-200 ${
                    langMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Language Selection Dropdown Menu */}
              {langMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-[#DFD5C4] py-1.5 z-50 animate-fade-in">
                  <div className="px-3 py-1 text-[10px] font-bold text-[#5C6B62] uppercase tracking-wider border-b border-[#DFD5C4]/50 mb-1">
                    {lang === 'es' ? 'Idioma / Language' : 'Language / Idioma'}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLang('es');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      lang === 'es'
                        ? 'bg-[#FAF7F2] text-[#0B1E14] font-bold'
                        : 'text-[#5C6B62] hover:bg-[#FAF7F2] hover:text-[#0B1E14]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MexicoFlag className="w-5 h-3.5" />
                      <span>Español</span>
                    </div>
                    {lang === 'es' && <Check className="w-4 h-4 text-[#C59A47]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLang('en');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      lang === 'en'
                        ? 'bg-[#FAF7F2] text-[#0B1E14] font-bold'
                        : 'text-[#5C6B62] hover:bg-[#FAF7F2] hover:text-[#0B1E14]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <USFlag className="w-5 h-3.5" />
                      <span>English</span>
                    </div>
                    {lang === 'en' && <Check className="w-4 h-4 text-[#C59A47]" />}
                  </button>
                </div>
              )}
            </div>

            {/* WhatsApp Big Action Pill */}
            <a
              href={headerWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
            >
              <i className="fa-brands fa-whatsapp text-base"></i>
              <span className="hidden sm:inline">{t.nav.whatsappBtn}</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl text-[#0B1E14] hover:bg-black/5 transition-colors"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 px-4 py-4 bg-[#FAF7F2] border-t border-[#DFD5C4] shadow-2xl space-y-2 animate-fade-in">
            {/* Mobile Language Selector */}
            <div className="p-3 bg-white rounded-xl border border-[#DFD5C4] mb-3 shadow-sm">
              <p className="text-[11px] font-bold text-[#5C6B62] uppercase tracking-wider mb-2">
                {lang === 'es' ? 'Seleccionar Idioma' : 'Select Language'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLang('es');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    lang === 'es'
                      ? 'bg-[#0B1E14] text-white border-[#0B1E14] shadow-sm'
                      : 'bg-white text-[#5C6B62] border-[#DFD5C4] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <MexicoFlag className="w-4 h-3" />
                  <span>Español</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLang('en');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    lang === 'en'
                      ? 'bg-[#0B1E14] text-white border-[#0B1E14] shadow-sm'
                      : 'bg-white text-[#5C6B62] border-[#DFD5C4] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <USFlag className="w-4 h-3" />
                  <span>English</span>
                </button>
              </div>
            </div>

            {navLinks.map((link) => {
              const isBlogActive = link.key === 'blog' && (currentView === 'blog' || Boolean(selectedArticle));
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link)}
                  className={`block py-2 px-3 rounded-xl text-sm font-semibold transition-colors ${
                    isBlogActive
                      ? 'bg-[#153A26] text-white font-bold'
                      : 'text-[#0B1E14] hover:bg-[#EFE7DA]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="pt-2 border-t border-[#DFD5C4]">
              <a
                href={headerWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <i className="fa-brands fa-whatsapp text-base"></i>
                <span>WhatsApp (+52 311 118 7229)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
