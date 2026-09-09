import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, ArrowUp, Phone } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';

const WHATSAPP_LINK = 'https://wa.me/message/GWFSILZHUOI3K1';
const PHONE_NUMBER = '+523111187229';
const PHONE_DISPLAY = '+52 (311) 118-7229';

export const Footer = () => {
  const { lang, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1E14] text-white py-12 border-t border-[#C59A47]/30 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          {/* Brand */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl border-2 border-[#C59A47] bg-white shadow-md overflow-hidden shrink-0 flex items-center justify-center p-0.5">
              <img
                src="/assets/logo-emblem.jpg"
                alt="Nayarit Real Estate"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white block leading-tight">
                NAYARIT REAL ESTATE
              </span>
              <span className="text-xs text-[#E3B86C] tracking-[0.2em] uppercase block font-semibold">
                Certeza y Tradición Inmobiliaria
              </span>
            </div>
          </div>

          {/* Socials & WhatsApp */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/nayaritrealestate"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title="Instagram @nayaritrealestate"
            >
              <InstagramIcon className="w-5 h-5 text-pink-400" />
            </a>

            <a
              href="https://www.facebook.com/share/19YAKkiXxy/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title="Facebook Nayarit Real Estate"
            >
              <FacebookIcon className="w-5 h-5 text-blue-400" />
            </a>

            <a
              href={`tel:${PHONE_NUMBER}`}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              title="Llamar"
            >
              <Phone className="w-3.5 h-3.5 text-[#E3B86C]" />
              <span>{PHONE_DISPLAY}</span>
            </a>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {t.footer.rights}
          </p>
          <p className="text-[11px] text-white/50 max-w-md">
            {t.footer.disclaimer}
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 text-white/70 hover:text-[#E3B86C] transition-colors"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
