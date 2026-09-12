import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TrendingUp, ShieldCheck } from 'lucide-react';

const WHATSAPP_PHONE = '523111187229';

export const Hero = () => {
  const { lang, t } = useLanguage();
  const heroWhatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(
    lang === 'es'
      ? '¡Hola Nayarit Real Estate! Me gustaría recibir asesoría inmobiliaria para invertir con certeza legal en Nayarit.'
      : 'Hello Nayarit Real Estate! I would like to receive real estate guidance on investing with legal certainty in Nayarit.'
  )}`;

  return (
    <section id="hero" className="relative min-h-[90vh] pt-28 sm:pt-36 pb-16 flex items-center justify-center overflow-hidden">
      {/* Immersive Nayarit Ocean, Valley & Nature Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
          alt="Nayarit Real Estate - Costa, Valles y Capital"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E14] via-[#0B1E14]/65 to-[#0B1E14]/40"></div>
        <div className="absolute inset-0 huichol-pattern-dark opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Short, Punchy Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-md">
          {t.hero.title1}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E3B86C] via-[#FAF7F2] to-[#C59A47] italic">
            {t.hero.title2}
          </span>
        </h1>

        {/* 1-Sentence Subtitle */}
        <p className="max-w-2xl text-base sm:text-xl text-white/90 font-normal leading-relaxed mb-10 text-balance">
          {t.hero.subtitle}
        </p>

        {/* Giant Apple-Style Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <a
            href={heroWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-2xl hover:shadow-green-500/25 transition-all transform hover:scale-105 cursor-pointer"
          >
            <i className="fa-brands fa-whatsapp text-2xl"></i>
            <span>{t.hero.whatsappCta}</span>
          </a>

          <a
            href="#plusvalia"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold text-base flex items-center justify-center gap-2 transition-all transform hover:scale-105"
          >
            <TrendingUp className="w-5 h-5 text-[#E3B86C]" />
            <span>{t.hero.simulatorCta}</span>
          </a>
        </div>

        {/* 3 Quick Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#E3B86C]">{t.hero.stat1Number}</p>
            <p className="text-xs text-white/80 font-medium mt-0.5">{t.hero.stat1Label}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#E3B86C]">{t.hero.stat2Number}</p>
            <p className="text-xs text-white/80 font-medium mt-0.5">{t.hero.stat2Label}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#E3B86C]">{t.hero.stat3Number}</p>
            <p className="text-xs text-white/80 font-medium mt-0.5">{t.hero.stat3Label}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
