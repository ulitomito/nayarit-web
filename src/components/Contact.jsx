import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, MessageSquare, ShieldCheck, HeartHandshake } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';

const PHONE_NUMBER = '+523111187229';
const PHONE_DISPLAY = '+52 (311) 118-7229';

export const Contact = () => {
  const { lang, t } = useLanguage();
  const whatsappUrl = `https://api.whatsapp.com/send?phone=523111187229&text=${encodeURIComponent(
    lang === 'es'
      ? '¡Hola Nayarit Real Estate! Me gustaría ponerme en contacto con un asesor para recibir orientación inmobiliaria.'
      : 'Hello Nayarit Real Estate! I would like to get in touch with an advisor for real estate guidance.'
  )}`;

  return (
    <section id="contacto" className="py-20 bg-[#FAF7F2] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#153A26]/10 text-[#153A26] text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-[#C59A47]" />
            <span>{t.contact.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1E14] tracking-tight">
            {t.contact.title}
          </h2>
          <p className="text-sm sm:text-base text-[#5C6B62] mt-2">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Big Touch Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Giant WhatsApp Button Card */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-8 rounded-3xl bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-between group cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-3">
                {lang === 'es' ? 'Respuesta Inmediata' : 'Instant Response'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                {t.contact.whatsappBigBtn}
              </h3>
              <p className="text-xs text-white/90 mt-1 font-medium">
                {PHONE_DISPLAY}
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 ml-4 group-hover:scale-110 transition-transform">
              <i className="fa-brands fa-whatsapp text-4xl text-white"></i>
            </div>
          </a>

          {/* Giant Direct Phone Call Card */}
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="p-8 rounded-3xl bg-[#153A26] hover:bg-[#0B1E14] text-white shadow-xl border border-[#C59A47]/40 flex items-center justify-between group transition-all transform hover:scale-[1.02]"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E3B86C] bg-white/10 px-3 py-1 rounded-full inline-block mb-3">
                {lang === 'es' ? 'Llamada Directa' : 'Direct Call'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                {PHONE_DISPLAY}
              </h3>
              <p className="text-xs text-white/80 mt-1">
                {lang === 'es' ? 'Atención telefónica de lunes a sábado' : 'Phone consultation Mon through Sat'}
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 ml-4 group-hover:scale-110 transition-transform">
              <Phone className="w-8 h-8 text-[#E3B86C]" />
            </div>
          </a>
        </div>

        {/* Social Media Links: Instagram (@nayaritrealestate) and Facebook (Nayarit Real Estate) */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5C6B62] mb-4">
            {t.contact.socialTitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://instagram.com/nayaritrealestate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white hover:bg-[#FAF7F2] text-[#0B1E14] font-bold text-sm border border-[#DFD5C4] shadow-sm hover:shadow-md transition-all group"
            >
              <InstagramIcon className="w-6 h-6 text-pink-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block text-xs text-[#5C6B62]">Instagram</span>
                <span className="font-bold text-sm">@nayaritrealestate</span>
              </div>
            </a>

            <a
              href="https://www.facebook.com/share/19YAKkiXxy/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white hover:bg-[#FAF7F2] text-[#0B1E14] font-bold text-sm border border-[#DFD5C4] shadow-sm hover:shadow-md transition-all group"
            >
              <FacebookIcon className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block text-xs text-[#5C6B62]">Facebook</span>
                <span className="font-bold text-sm">Nayarit Real Estate</span>
              </div>
            </a>
          </div>
        </div>

        {/* Brand Heritage Card: Placed at the very bottom of the scroll with enlarged prominent logo */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#C59A47]/40 shadow-luxury flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-5/12 flex justify-center shrink-0">
            <div className="p-5 sm:p-6 bg-[#FAF7F2] rounded-3xl border border-[#C59A47]/50 shadow-md w-full max-w-sm">
              <img
                src="/assets/logo-full.jpg"
                alt="Nayarit Real Estate - Certeza y Tradición Inmobiliaria"
                className="w-full h-auto object-contain rounded-xl shadow-sm"
              />
            </div>
          </div>

          <div className="w-full md:w-7/12 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C59A47]/15 text-[#0B1E14] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#C59A47]" />
              <span>{t.contact.heritageBadge}</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1E14] leading-tight">
              {t.contact.heritageTitle}
            </h3>

            <p className="text-sm sm:text-base text-[#5C6B62] leading-relaxed">
              {t.contact.heritageDesc}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-[#153A26]">
              <span className="bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#DFD5C4]">
                {lang === 'es' ? '🤝 Trato de Honor' : '🤝 Deal of Honor'}
              </span>
              <span className="bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#DFD5C4]">
                {lang === 'es' ? '⚖️ Blindaje Notarial' : '⚖️ Notarial Shielding'}
              </span>
              <span className="bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#DFD5C4]">
                {lang === 'es' ? '🌿 Orgullo Nayarita' : '🌿 Nayarit Pride'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
