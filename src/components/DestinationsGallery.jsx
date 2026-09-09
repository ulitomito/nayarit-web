import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, ChevronLeft, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';

const WHATSAPP_LINK = 'https://wa.me/message/GWFSILZHUOI3K1';

export const DestinationsGallery = () => {
  const { lang, t } = useLanguage();
  const scrollRef = useRef(null);

  const destinations = [
    {
      id: 'tepic',
      name: t.destinations.p1Name,
      desc: t.destinations.p1Desc,
      tag: lang === 'es' ? 'Capital & Centro Financiero' : 'State Capital & Urban Hub',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'mita',
      name: t.destinations.p2Name,
      desc: t.destinations.p2Desc,
      tag: lang === 'es' ? 'Exclusividad & Lujo' : 'World-Class Exclusivity',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'sayulita',
      name: t.destinations.p3Name,
      desc: t.destinations.p3Desc,
      tag: lang === 'es' ? 'Pueblo Mágico & Surf' : 'Magical Town & Surf',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'sanpancho',
      name: t.destinations.p4Name,
      desc: t.destinations.p4Desc,
      tag: lang === 'es' ? 'Santuario Ecológico' : 'Eco-Sanctuary',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'litibu',
      name: t.destinations.p5Name,
      desc: t.destinations.p5Desc,
      tag: lang === 'es' ? 'Playa Virgen & Privacidad' : 'Untouched & Secluded',
      image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'compostela',
      name: t.destinations.p6Name,
      desc: t.destinations.p6Desc,
      tag: lang === 'es' ? 'Pueblo Mágico & Costa Canuva' : 'Colonial Town & Canuva',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'nuevo',
      name: t.destinations.p7Name,
      desc: t.destinations.p7Desc,
      tag: lang === 'es' ? 'Marinas & Canales' : 'Yacht Marinas',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    }
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="destinos" className="py-20 bg-[#FAF7F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#153A26]/10 text-[#153A26] text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#C59A47]" />
            <span>{t.destinations.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1E14] tracking-tight">
            {t.destinations.title}
          </h2>
          <p className="text-sm sm:text-base text-[#5C6B62] mt-2 max-w-xl">
            {t.destinations.subtitle}
          </p>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-11 h-11 rounded-full bg-white border border-[#DFD5C4] shadow-sm hover:bg-[#EFE7DA] text-[#0B1E14] flex items-center justify-center transition-all"
            aria-label="Scroll anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-11 h-11 rounded-full bg-white border border-[#DFD5C4] shadow-sm hover:bg-[#EFE7DA] text-[#0B1E14] flex items-center justify-center transition-all"
            aria-label="Scroll siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-4 sm:px-8 max-w-7xl mx-auto pb-6 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 snap-start bg-white rounded-3xl overflow-hidden shadow-luxury border border-[#DFD5C4] flex flex-col group transition-all duration-300 hover:shadow-luxury-hover"
          >
            <div className="relative h-72 overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E14]/85 via-[#0B1E14]/30 to-transparent"></div>

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#E3B86C] text-xs font-semibold">
                  {dest.tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-serif text-2xl font-bold mb-1">
                  {dest.name}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                  {dest.desc}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white flex items-center justify-between border-t border-[#DFD5C4]/60">
              <span className="text-xs font-semibold text-[#153A26]">
                Nayarit, México
              </span>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
