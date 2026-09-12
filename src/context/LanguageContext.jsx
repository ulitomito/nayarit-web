import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  es: {
    nav: {
      home: 'Inicio',
      destinations: 'Destinos',
      simulator: 'Plusvalía',
      services: 'Certeza Legal',
      blog: 'Blog',
      contact: 'Contacto',
      whatsappBtn: 'WhatsApp',
      slogan: 'Certeza y Tradición Inmobiliaria'
    },
    hero: {
      badge: 'Certeza y Tradición Inmobiliaria',
      title1: 'Tu patrimonio en Nayarit con',
      title2: 'certeza legal absoluta.',
      subtitle: 'Intermediación inmobiliaria, fideicomisos para extranjeros, avalúos, hipotecas y rentas en la costa, valles, sierra y la capital de Nayarit.',
      whatsappCta: 'Escribir a WhatsApp',
      simulatorCta: 'Simular Plusvalía',
      stat1Number: '100%',
      stat1Label: 'Certeza Notarial',
      stat2Number: '+16%',
      stat2Label: 'Plusvalía Anual Estimada',
      stat3Number: 'Nayarit',
      stat3Label: 'Costa, Sierra y Capital'
    },
    destinations: {
      badge: 'El Paraíso de Nayarit',
      title: 'Vive e invierte en lo mejor de Nayarit',
      subtitle: 'Desde el dinamismo de la capital hasta la serenidad del Pacífico y la sierra.',
      askZone: 'Consultar esta zona',
      p1Name: 'Tepic (Capital)',
      p1Desc: 'Centro financiero, clima fresco al pie del Cerro de San Juan y alta plusvalía residencial.',
      p2Name: 'Punta de Mita',
      p2Desc: 'Exclusividad mundial, atardeceres dorados y aguas cristalinas.',
      p3Name: 'Sayulita',
      p3Desc: 'Cultura bohemia, surf internacional y energía cosmopolita.',
      p4Name: 'San Pancho',
      p4Desc: 'Santuario cultural y ecológico entre la selva viva y el mar.',
      p5Name: 'Litibú & Higuera Blanca',
      p5Desc: 'Playas vírgenes, privacidad total y naturaleza intacta.',
      p6Name: 'Compostela & Canuva',
      p6Desc: 'Historia colonial, cafetales, ecoturismo y desarrollos boutique.',
      p7Name: 'Nuevo Nayarit',
      p7Desc: 'Marinas náuticas, canales navegables y confort familiar.'
    },
    simulator: {
      badge: 'Inversión Inteligente',
      title: 'Simulador de Plusvalía Inmobiliaria',
      subtitle: 'Analiza el crecimiento histórico y proyección estimada de tu patrimonio en el estado de Nayarit.',
      period5: '5 Años (+85%)',
      period10: '10 Años (+245%)',
      period20: '20 Años (+690%)',
      sliderLabel: 'Inversión estimada:',
      projectedValue: 'Valor proyectado:',
      capitalAppreciation: 'Apreciación estimada:',
      estimatedRentalIncome: 'Ingresos estimados por rentas:',
      estimatedValuePill: 'valor estimado',
      capitalGainLabel: 'Ganancia de capital',
      cumulativeRentalLabel: 'Flujo estimado acumulado',
      growthSimulated: 'Crecimiento Simulado',
      totalEstimatedReturn: 'Total Retorno Estimado',
      yearsWord: 'Años',
      barBase: 'Base',
      barAppreciation: 'Plusvalía',
      barRentals: 'Rentas',
      tipInitial: 'Capital Inicial',
      tipAppreciation: 'Plusvalía Inmueble',
      tipRentals: 'Rentas Generadas',
      disclaimer: '* Aviso importante: Esta es una simulación estimada calculada con fines ilustrativos y de referencia histórica. Los rendimientos reales pueden variar de acuerdo con la ubicación exacta, tipo de propiedad, demanda y condiciones del mercado. No representa una oferta o garantía financiera vinculante.'
    },
    bento: {
      badge: 'Lo Que Hacemos Por Ti',
      title: 'Soluciones Inmobiliarias Claras',
      subtitle: 'Protegemos tu patrimonio de principio a fin con rigor jurídico y comercial.',
      c1Badge: 'Blindaje Notarial',
      c1Title: 'Certeza Jurídica Notarial',
      c1Desc: 'Auditoría rigurosa de títulos en el RPP, libertad de gravámenes y cero riesgos agrarios o ejidales.',
      c2Badge: 'Art. 27 Constitucional',
      c2Title: 'Fideicomisos para Extranjeros',
      c2Desc: 'Trámite integral de Fideicomiso Bancario en Zona Restringida (Art. 27 Constitucional) y permisos ante la SRE.',
      c3Badge: 'Operación Segura',
      c3Title: 'Compraventas & Comercialización',
      c3Desc: 'Intermediación segura, contratos de promesa blindados y acompañamiento personalizado hasta la firma notarial.',
      c4Badge: 'Valuación Certificada',
      c4Title: 'Avalúos Inmobiliarios y Dictamen de Valor',
      c4Desc: 'Peritajes comerciales certificados y análisis comparativos de mercado para fijar precios reales y justos.',
      c5Badge: 'Créditos Bancarios',
      c5Title: 'Hipotecas y Financiamiento',
      c5Desc: 'Asesoría y gestión con los mejores bancos nacionales y opciones de financiamiento privado.',
      c6Badge: 'Pólizas Jurídicas',
      c6Title: 'Rentas Residenciales & Comerciales',
      c6Desc: 'Arrendamientos protegidos con pólizas jurídicas y estricta investigación para tranquilidad de las partes.'
    },
    blog: {
      badge: 'Conocimiento Valioso',
      title: 'Blog & Guías Clave',
      subtitle: 'Información clara y transparente para comprar, vender e invertir seguro en Nayarit.',
      latestBadge: 'Lo Más Reciente',
      latestTitle: 'Últimos Artículos del Blog',
      latestSubtitle: 'Análisis jurídico, certeza notarial y consejos de inversión en Nayarit.',
      exploreAllBtn: 'Explorar Todo el Blog',
      goToBlogPage: 'Ir a la Pantalla Especial del Blog',
      goToLanding: 'Volver al Inicio',
      blogHeroTitle: 'Blog Inmobiliario & Guías Notariales',
      blogHeroSubtitle: 'Todo lo que necesitas saber para comprar, vender e invertir con absoluta certeza legal en Nayarit.',
      showingArticles: 'artículos disponibles',
      noResults: 'No se encontraron artículos con ese criterio.',
      clearSearch: 'Limpiar búsqueda',
      readMore: 'Leer Artículo',
      minRead: 'min de lectura',
      viewAll: 'Ver Todos los Artículos',
      viewAllSubtitle: 'Explora todas nuestras guías jurídicas, fiscales y de inversión en Nayarit',
      backToBlog: 'Volver al blog',
      backToHome: 'Volver al Inicio',
      recommended: 'Artículos Recomendados',
      searchPlaceholder: 'Buscar artículos o temas jurídicos...',
      allCategories: 'Todos',
      catLegal: 'Certeza Notarial',
      catForeigners: 'Fideicomisos & Extranjeros',
      catInvestment: 'Inversión & Plusvalía',
      consultWhatsapp: 'Consultar sobre este artículo por WhatsApp',
      adminModalTitle: 'Publicar Artículo',
      adminPassPrompt: 'Ingresa la contraseña de administrador:',
      close: 'Cerrar'
    },
    contact: {
      badge: 'Atención Inmediata',
      title: 'Contacto Directo',
      subtitle: 'Estamos listos para orientarte con honestidad y respaldo legal.',
      whatsappBigBtn: 'Chatear por WhatsApp',
      callBigBtn: 'Llamar al +52 (311) 118-7229',
      formTitle: 'Déjanos tus datos',
      namePlaceholder: 'Nombre completo',
      phonePlaceholder: 'Teléfono o WhatsApp',
      msgPlaceholder: '¿En qué propiedad, zona o trámite legal requieres apoyo?',
      submitBtn: 'Enviar Mensaje',
      success: '¡Gracias! Hemos recibido tu mensaje y te contactaremos en breve.',
      socialTitle: 'Síguenos en nuestras redes oficiales:',
      heritageBadge: 'Identidad y Valores',
      heritageTitle: 'El Arte Wixárika y la Certeza Legal',
      heritageDesc: 'En Nayarit Real Estate honramos la cosmovisión huichol: la casa como santuario, el venado y el águila como guías de sabiduría, y el apretón de manos como el pacto supremo de honor y blindaje legal en cada trato.'
    },
    footer: {
      rights: 'Nayarit Real Estate. Certeza y Tradición Inmobiliaria.',
      disclaimer: 'Operaciones inmobiliarias formalizadas conforme a las leyes del Estado de Nayarit y de los Estados Unidos Mexicanos.'
    }
  },
  en: {
    nav: {
      home: 'Home',
      destinations: 'Destinations',
      simulator: 'Appreciation',
      services: 'Legal Certainty',
      blog: 'Blog',
      contact: 'Contact',
      whatsappBtn: 'WhatsApp',
      slogan: 'Certainty & Real Estate Tradition'
    },
    hero: {
      badge: 'Real Estate Certainty & Heritage',
      title1: 'Your real estate in Nayarit with',
      title2: 'absolute legal peace of mind.',
      subtitle: 'Real estate brokerage, foreign bank trusts (fideicomisos), certified appraisals, mortgages, and rentals across the coast, valleys, mountains, and capital city of Nayarit.',
      whatsappCta: 'Message on WhatsApp',
      simulatorCta: 'Simulate Appreciation',
      stat1Number: '100%',
      stat1Label: 'Notarial Security',
      stat2Number: '+16%',
      stat2Label: 'Estimated Annual Growth',
      stat3Number: 'Nayarit',
      stat3Label: 'Coast, Valleys & Capital'
    },
    destinations: {
      badge: 'Nayarit Wonders',
      title: 'Live and invest in the best of Nayarit',
      subtitle: 'From the bustling capital of Tepic to pristine Pacific beaches and lush mountains.',
      askZone: 'Inquire about this area',
      p1Name: 'Tepic (Capital City)',
      p1Desc: 'State financial & civic hub, fresh mountain breeze by Cerro de San Juan, and strong urban appreciation.',
      p2Name: 'Punta de Mita',
      p2Desc: 'World-renowned exclusivity, golden sunsets, and crystal-clear waters.',
      p3Name: 'Sayulita',
      p3Desc: 'Bohemian culture, international surf, and vibrant cosmopolitan lifestyle.',
      p4Name: 'San Pancho',
      p4Desc: 'Eco-cultural sanctuary nestled between lush rainforest and gentle ocean waves.',
      p5Name: 'Litibú & Higuera Blanca',
      p5Desc: 'Untouched beaches, absolute privacy, and pristine nature.',
      p6Name: 'Compostela & Canuva',
      p6Desc: 'Colonial heritage, mountain coffee plantations, and boutique coastal developments.',
      p7Name: 'Nuevo Nayarit',
      p7Desc: 'World-class yacht marinas, peaceful canals, and family comfort.'
    },
    simulator: {
      badge: 'Smart Wealth Growth',
      title: 'Real Estate Appreciation Simulator',
      subtitle: 'Analyze historical performance and estimated wealth growth throughout Nayarit.',
      period5: '5 Years (+85%)',
      period10: '10 Years (+245%)',
      period20: '20 Years (+690%)',
      sliderLabel: 'Estimated Investment:',
      projectedValue: 'Projected Value:',
      capitalAppreciation: 'Estimated Capital Growth:',
      estimatedRentalIncome: 'Estimated Rental Revenue:',
      estimatedValuePill: 'estimated value',
      capitalGainLabel: 'Capital gain',
      cumulativeRentalLabel: 'Cumulative rental flow',
      growthSimulated: 'Simulated Growth',
      totalEstimatedReturn: 'Total Estimated Return',
      yearsWord: 'Years',
      barBase: 'Principal',
      barAppreciation: 'Appreciation',
      barRentals: 'Rentals',
      tipInitial: 'Initial Investment',
      tipAppreciation: 'Property Appreciation',
      tipRentals: 'Rental Income Generated',
      disclaimer: '* Important Note: This is an estimated simulation calculated for informational and historical reference purposes only. Actual returns may vary depending on exact location, property type, demand, and market conditions. It does not constitute a binding financial guarantee.'
    },
    bento: {
      badge: 'What We Do For You',
      title: 'Clear Real Estate Solutions',
      subtitle: 'We safeguard your assets from start to finish with legal precision and market expertise.',
      c1Badge: 'Notarial Security',
      c1Title: 'Notarial Legal Certainty',
      c1Desc: 'Rigorous title audit at the Public Registry (RPP), clean liens, and zero ejidal land risks.',
      c2Badge: 'Article 27 Mexican Trust',
      c2Title: 'Bank Trusts for Foreigners',
      c2Desc: 'Comprehensive setup of Mexican Bank Trusts in the Restricted Zone (Article 27) and SRE permits.',
      c3Badge: 'Secure Transactions',
      c3Title: 'Sales & Brokerage',
      c3Desc: 'Safe closings, ironclad purchase agreements, and full representation through closing day.',
      c4Badge: 'Certified Appraisals',
      c4Title: 'Property Appraisals & Valuation',
      c4Desc: 'Certified appraisals and comparative market analyses to establish accurate, competitive valuations.',
      c5Badge: 'Bank Mortgages',
      c5Title: 'Mortgages & Financing',
      c5Desc: 'Expert guidance with top Mexican mortgage banks and private lending options.',
      c6Badge: 'Legal Lease Policies',
      c6Title: 'Residential & Commercial Rentals',
      c6Desc: 'Protected lease agreements backed by legal rental policies ensuring security for both parties.'
    },
    blog: {
      badge: 'Valuable Intelligence',
      title: 'Blog & Practical Guides',
      subtitle: 'Clear, transparent insights to buy, sell, and invest safely in Nayarit.',
      latestBadge: 'Latest Insights',
      latestTitle: 'Latest From Our Blog',
      latestSubtitle: 'Legal analysis, notarial certainty, and real estate investment insights in Nayarit.',
      exploreAllBtn: 'Explore Full Blog',
      goToBlogPage: 'Go to Dedicated Blog Page',
      goToLanding: 'Back to Landing Page',
      blogHeroTitle: 'Real Estate Blog & Legal Guides',
      blogHeroSubtitle: 'Everything you need to buy, sell, and invest with complete peace of mind in Nayarit.',
      showingArticles: 'articles available',
      noResults: 'No articles found matching your search criteria.',
      clearSearch: 'Clear search',
      readMore: 'Read Article',
      minRead: 'min read',
      viewAll: 'View All Articles',
      viewAllSubtitle: 'Explore all our legal, tax, and real estate investment guides for Nayarit',
      backToBlog: 'Back to blog',
      backToHome: 'Back to Home',
      recommended: 'Recommended Articles',
      searchPlaceholder: 'Search articles or legal topics...',
      allCategories: 'All',
      catLegal: 'Notarial Certainty',
      catForeigners: 'Bank Trusts & Foreigners',
      catInvestment: 'Appreciation & Investment',
      consultWhatsapp: 'Inquire about this article on WhatsApp',
      adminModalTitle: 'Publish Article',
      adminPassPrompt: 'Enter administrator password:',
      close: 'Close'
    },
    contact: {
      badge: 'Instant Response',
      title: 'Direct Contact',
      subtitle: 'We are ready to guide you with integrity and notarial certainty.',
      whatsappBigBtn: 'Chat on WhatsApp',
      callBigBtn: 'Call +52 (311) 118-7229',
      formTitle: 'Leave us your information',
      namePlaceholder: 'Full name',
      phonePlaceholder: 'Phone or WhatsApp',
      msgPlaceholder: 'What property, region, or legal service are you interested in?',
      submitBtn: 'Send Message',
      success: 'Thank you! We have received your message and will reach out promptly.',
      socialTitle: 'Follow us on our official social networks:',
      heritageBadge: 'Identity & Values',
      heritageTitle: 'Wixárika Art & Legal Certainty',
      heritageDesc: 'At Nayarit Real Estate we honor Wixárika wisdom: the house represents the family sanctuary, the deer and eagle symbolize vision and clarity, and the handshake stands as our sacred pledge of honor and legal protection in every closing.'
    },
    footer: {
      rights: 'Nayarit Real Estate. Real Estate Certainty & Heritage.',
      disclaimer: 'Real estate transactions formalized in strict compliance with the laws of Nayarit and Mexico.'
    }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('nre_language') || 'es';
  });

  const toggleLanguage = (newLang) => {
    const selected = newLang || (lang === 'es' ? 'en' : 'es');
    setLang(selected);
    localStorage.setItem('nre_language', selected);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang] || translations.es;

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
