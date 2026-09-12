import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const WHATSAPP_PHONE = '523111187229';
const AUTO_PLAY_INTERVAL = 10000; // 10 seconds

export const DestinationsGallery = () => {
  const { lang, t } = useLanguage();
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isProgrammaticScroll = useRef(false);

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

  // Scroll to a specific card smoothly
  const scrollToSlide = useCallback((index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const targetCard = container.children[index];
    if (targetCard) {
      isProgrammaticScroll.current = true;
      if (index === 0) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const paddingLeft = parseInt(window.getComputedStyle(container).paddingLeft, 10) || 0;
        container.scrollTo({
          left: targetCard.offsetLeft - paddingLeft,
          behavior: 'smooth',
        });
      }
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 650);
    }
  }, []);

  // Move to next slide (loops back to index 0 after the last slide)
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % destinations.length;
      scrollToSlide(next);
      return next;
    });
  }, [destinations.length, scrollToSlide]);

  // Move to previous slide
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev - 1 + destinations.length) % destinations.length;
      scrollToSlide(next);
      return next;
    });
  }, [destinations.length, scrollToSlide]);

  // Select slide directly from dots
  const handleSelectSlide = (index) => {
    setCurrentIndex(index);
    scrollToSlide(index);
  };

  // 10-Second Auto-play Timer (loops back to 0 when finished, pauses on hover)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Sync currentIndex if user scrolls or swipes manually
  const handleManualScroll = () => {
    if (isProgrammaticScroll.current || !scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const paddingLeft = parseInt(window.getComputedStyle(container).paddingLeft, 10) || 0;

    let closestIdx = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const distance = Math.abs(child.offsetLeft - paddingLeft - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    if (closestIdx !== currentIndex) {
      setCurrentIndex(closestIdx);
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

        {/* Slide Counter + Arrows */}
        <div className="flex items-center gap-4 self-start md:self-auto">
          {/* Active slide counter */}
          <div className="flex items-center gap-1.5 text-xs font-bold bg-white px-3.5 py-2 rounded-full border border-[#DFD5C4] shadow-sm">
            <span className="text-[#C59A47] font-serif text-sm">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-[#5C6B62]/50">/</span>
            <span className="text-[#5C6B62]">
              {String(destinations.length).padStart(2, '0')}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="w-11 h-11 rounded-full bg-white border border-[#DFD5C4] shadow-sm hover:bg-[#EFE7DA] text-[#0B1E14] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Destino anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-white border border-[#DFD5C4] shadow-sm hover:bg-[#EFE7DA] text-[#0B1E14] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Destino siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Auto-advancing Carousel Container (Pauses on hover so user can read) */}
      <div
        ref={scrollRef}
        onScroll={handleManualScroll}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-6 overflow-x-auto px-4 sm:px-8 max-w-7xl mx-auto pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {destinations.map((dest, idx) => (
          <div
            key={dest.id}
            className={`w-[300px] sm:w-[360px] md:w-[400px] shrink-0 snap-start bg-white rounded-3xl overflow-hidden shadow-luxury border transition-all duration-500 flex flex-col group hover:shadow-luxury-hover ${
              currentIndex === idx
                ? 'border-[#C59A47] ring-2 ring-[#C59A47]/25'
                : 'border-[#DFD5C4]'
            }`}
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
                href={`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(
                  lang === 'es'
                    ? `¡Hola Nayarit Real Estate! Me interesa recibir información y opciones de inversión en ${dest.name}.`
                    : `Hello Nayarit Real Estate! I would like to receive information and investment options in ${dest.name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Infinite Dots Navigation with 10s Timer Indicator */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {destinations.map((dest, idx) => (
          <button
            key={dest.id}
            type="button"
            onClick={() => handleSelectSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx
                ? 'w-8 bg-[#C59A47] shadow-sm'
                : 'w-2.5 bg-[#DFD5C4] hover:bg-[#C59A47]/60'
            }`}
            aria-label={`Ir a ${dest.name}`}
            title={dest.name}
          />
        ))}
      </div>
    </section>
  );
};

