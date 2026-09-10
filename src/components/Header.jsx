import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, ShieldCheck } from 'lucide-react';

const WHATSAPP_LINK = 'https://wa.me/message/GWFSILZHUOI3K1';

export const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: t.nav.home },
    { href: '#destinos', label: t.nav.destinations },
    { href: '#plusvalia', label: t.nav.simulator },
    { href: '#servicios', label: t.nav.services },
    { href: '#blog', label: t.nav.blog },
    { href: '#contacto', label: t.nav.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-xl shadow-md border-b border-[#DFD5C4] py-2 sm:py-2.5'
            : 'bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#DFD5C4]/60 py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Official Brand Logo - Significantly Larger and Clearly Legible */}
          <a href="#hero" className="flex items-center gap-3.5 sm:gap-4 group">
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#C59A47] bg-white shadow-md shrink-0">
              <img
                src="/assets/logo-emblem.jpg"
                alt="Nayarit Real Estate"
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-col justify-center">
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0B1E14] leading-none group-hover:text-[#153A26] transition-colors">
                NAYARIT
              </span>
              <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-[0.24em] text-[#C59A47] uppercase leading-tight mt-0.5">
                REAL ESTATE
              </span>
              <span className="text-[9px] sm:text-[11px] text-[#5C6B62] tracking-widest uppercase font-semibold mt-0.5 hidden sm:block">
                Certeza y Tradición Inmobiliaria
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[#1A211D] hover:text-[#153A26] transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C59A47] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Right Actions: Segmented Language Switcher + Big WhatsApp Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-black/5 rounded-full p-1 border border-black/10 shadow-inner">
              <button
                type="button"
                onClick={() => setLang('es')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === 'es'
                    ? 'bg-white text-[#0B1E14] shadow-sm'
                    : 'text-[#5C6B62] hover:text-[#0B1E14]'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-white text-[#0B1E14] shadow-sm'
                    : 'text-[#5C6B62] hover:text-[#0B1E14]'
                }`}
              >
                EN
              </button>
            </div>

            {/* WhatsApp Big Action Pill */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              <i className="fa-brands fa-whatsapp text-base"></i>
              <span className="hidden sm:inline">{t.nav.whatsappBtn}</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#0B1E14] hover:bg-black/5 transition-colors"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 px-4 py-4 bg-[#FAF7F2] border-t border-[#DFD5C4] shadow-2xl space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-[#0B1E14] hover:bg-[#EFE7DA]"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-[#DFD5C4]">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-sm"
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
