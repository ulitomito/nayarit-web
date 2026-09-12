import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Landmark, ScrollText, BarChart3, CreditCard, Key } from 'lucide-react';

export const BentoServices = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: ShieldCheck,
      badge: t.bento.c1Badge,
      title: t.bento.c1Title,
      desc: t.bento.c1Desc,
      highlight: true
    },
    {
      icon: Landmark,
      badge: t.bento.c2Badge,
      title: t.bento.c2Title,
      desc: t.bento.c2Desc,
      highlight: false
    },
    {
      icon: ScrollText,
      badge: t.bento.c3Badge,
      title: t.bento.c3Title,
      desc: t.bento.c3Desc,
      highlight: false
    },
    {
      icon: BarChart3,
      badge: t.bento.c4Badge,
      title: t.bento.c4Title,
      desc: t.bento.c4Desc,
      highlight: false
    },
    {
      icon: CreditCard,
      badge: t.bento.c5Badge,
      title: t.bento.c5Title,
      desc: t.bento.c5Desc,
      highlight: false
    },
    {
      icon: Key,
      badge: t.bento.c6Badge,
      title: t.bento.c6Title,
      desc: t.bento.c6Desc,
      highlight: false
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#153A26]/10 text-[#153A26] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59A47]" />
            <span>{t.bento.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1E14] tracking-tight">
            {t.bento.title}
          </h2>
          <p className="text-sm sm:text-base text-[#5C6B62] mt-2">
            {t.bento.subtitle}
          </p>
        </div>

        {/* Bento Grid: 6 clean cards without repetitive buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            if (srv.highlight) {
              return (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-[#153A26] to-[#0B1E14] text-white rounded-3xl p-8 shadow-luxury border border-[#C59A47]/40 flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl transition-all"
                >
                  <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#C59A47]/10 rounded-full blur-2xl"></div>

                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#E3B86C] text-[#0B1E14] flex items-center justify-center mb-6 shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-[#E3B86C] uppercase tracking-wider">
                      {srv.badge}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white mt-1 mb-3">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 shadow-luxury border border-[#DFD5C4] flex flex-col justify-between hover:border-[#C59A47] hover:shadow-xl transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#DFD5C4] text-[#153A26] flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-[#C59A47] uppercase tracking-wider">
                    {srv.badge}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#0B1E14] mt-1 mb-3">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-[#5C6B62] leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
