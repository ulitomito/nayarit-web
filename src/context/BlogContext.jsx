import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialBlogPosts } from '../data/initialBlogPosts';

const BlogContext = createContext();

export const ADMIN_PASSWORD = 'nre2026';
export const WHATSAPP_PHONE = '523111187229';

// Inline Markdown formatter (bold **text**, etc.)
export const formatInline = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-[#0B1E14]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

import { markdownToHtml } from '../components/RichTextEditor';

// Rich article content renderer that formats headings, numbered lists, bullet lists, bold text and paragraphs
export const RichArticleContent = ({ content }) => {
  if (!content) return null;

  const html = markdownToHtml(content);

  return (
    <div
      className="article-rich-body space-y-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const initialDestinations = [
  {
    id: 'tepic',
    name: { es: 'Tepic', en: 'Tepic' },
    desc: { es: 'Capital del Estado, modernización y alta plusvalía urbana.', en: 'State Capital, modernization, and urban appreciation.' },
    tag: { es: 'Capital & Centro Financiero', en: 'State Capital & Urban Hub' },
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'mita',
    name: { es: 'Punta de Mita', en: 'Punta de Mita' },
    desc: { es: 'Península exclusiva, resorts de ultra lujo y campos de golf.', en: 'Exclusive peninsula, ultra-luxury resorts, and championship golf.' },
    tag: { es: 'Exclusividad & Lujo', en: 'World-Class Exclusivity' },
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sayulita',
    name: { es: 'Sayulita', en: 'Sayulita' },
    desc: { es: 'Pueblo Mágico cosmopolita, surf de clase mundial y alta rentabilidad vacacional.', en: 'Cosmopolitan Magical Town, surf culture, and top rental yields.' },
    tag: { es: 'Pueblo Mágico & Surf', en: 'Magical Town & Surf' },
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sanpancho',
    name: { es: 'San Pancho', en: 'San Pancho' },
    desc: { es: 'La capital cultural de la Riviera, polo ecuestre y arquitectura sustentable.', en: 'Cultural capital of the Riviera, polo club, and eco-architecture.' },
    tag: { es: 'Santuario Ecológico', en: 'Eco-Sanctuary' },
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'litibu',
    name: { es: 'Litibú & Higuera Blanca', en: 'Litibú & Higuera Blanca' },
    desc: { es: 'Playas vírgenes, privacidad absoluta y desarrollo de baja densidad.', en: 'Pristine beaches, tranquil privacy, and sustainable low-density growth.' },
    tag: { es: 'Playa Virgen & Privacidad', en: 'Untouched & Secluded' },
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'compostela',
    name: { es: 'Compostela & Costa Canuva', en: 'Compostela & Costa Canuva' },
    desc: { es: 'Historia colonial, tradición cafetalera y la nueva joya de la costa.', en: 'Colonial heritage, coffee traditions, and emerging master-planned coast.' },
    tag: { es: 'Pueblo Mágico & Costa Canuva', en: 'Colonial Town & Canuva' },
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'nuevo',
    name: { es: 'Nuevo Nayarit', en: 'Nuevo Nayarit' },
    desc: { es: 'Canales náuticos, marinas, condominios frente al mar e infraestructura de primer nivel.', en: 'Navigable canals, yacht marinas, and premier beachfront luxury.' },
    tag: { es: 'Infraestructura & Marinas', en: 'Marinas & Modern Living' },
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  }
];

export const initialContactInfo = {
  whatsappPhone: '523111187229',
  phoneDisplay: '+52 (311) 118-7229',
  email: 'contacto@nayaritrealestate.com',
  instagramUrl: 'https://instagram.com/nayaritrealestate',
  facebookUrl: 'https://facebook.com/nayaritrealestate',
  address: 'Bahía de Banderas & Tepic, Nayarit, México'
};

export const BlogProvider = ({ children }) => {
  // Saved articles in localStorage
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('nayarit_blog_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialBlogPosts;
      }
    }
    return initialBlogPosts;
  });

  // Destinations data in state with persistence
  const [destinations, setDestinations] = useState(() => {
    const saved = localStorage.getItem('nayarit_destinations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialDestinations;
      }
    }
    return initialDestinations;
  });

  // Contact info data in state with persistence
  const [contactInfo, setContactInfo] = useState(() => {
    const saved = localStorage.getItem('nayarit_contact_info');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialContactInfo;
      }
    }
    return initialContactInfo;
  });

  // Current view: 'landing', 'blog', or 'admin'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#blog-page' || hash === '#articulos') return 'blog';
      if (hash === '#admin') return 'admin';
    }
    return 'landing';
  });

  // Active article selected for full-screen reading
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Admin authentication state with session persistence
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('nayarit_is_admin') === 'true';
    }
    return false;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin Post editing modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      sessionStorage.setItem('nayarit_is_admin', 'true');
    } else {
      sessionStorage.removeItem('nayarit_is_admin');
    }
  }, [isAdmin]);

  // Persist destinations
  useEffect(() => {
    try {
      localStorage.setItem('nayarit_destinations', JSON.stringify(destinations));
    } catch (e) {
      console.error('Error saving destinations', e);
    }
  }, [destinations]);

  // Persist contact info
  useEffect(() => {
    try {
      localStorage.setItem('nayarit_contact_info', JSON.stringify(contactInfo));
    } catch (e) {
      console.error('Error saving contact info', e);
    }
  }, [contactInfo]);

  // Sync with window.location.hash for routing and #admin trigger
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#blog-page' || hash === '#articulos') {
        setCurrentView('blog');
      } else if (hash === '#admin') {
        if (!isAdmin) {
          setShowLoginModal(true);
        } else {
          setCurrentView('admin');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Check initial hash
    if (window.location.hash === '#admin') {
      if (!isAdmin) {
        setShowLoginModal(true);
      } else {
        setCurrentView('admin');
      }
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdmin]);

  // Persist posts
  useEffect(() => {
    try {
      localStorage.setItem('nayarit_blog_posts', JSON.stringify(posts));
    } catch (e) {
      console.error('Error saving posts to localStorage', e);
    }
  }, [posts]);

  // Navigation helpers
  const navigateToBlog = () => {
    setSelectedArticle(null);
    setCurrentView('blog');
    window.location.hash = 'blog-page';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    setSelectedArticle(null);
    setCurrentView('admin');
    window.location.hash = 'admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLanding = (targetSection = 'hero') => {
    setSelectedArticle(null);
    setCurrentView('landing');
    if (targetSection) {
      window.location.hash = targetSection;
      setTimeout(() => {
        const el = document.getElementById(targetSection);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const openArticle = (post) => {
    if (!post) return;
    const freshPost = posts.find((p) => p.id === post.id) || post;
    setSelectedArticle(freshPost);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  const updateDestination = (id, updatedFields) => {
    setDestinations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedFields } : d))
    );
  };

  const updateContactInfo = (newInfo) => {
    setContactInfo((prev) => ({ ...prev, ...newInfo }));
  };

  const deletePost = (postId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      if (selectedArticle && selectedArticle.id === postId) {
        setSelectedArticle(null);
      }
    }
  };

  const savePost = (postData) => {
    const targetId = postData.id || editingPost?.id;
    let savedArticle = null;

    if (targetId) {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === targetId) {
            savedArticle = {
              ...p,
              category: postData.category || p.category,
              readTime: postData.readTime || p.readTime,
              image: postData.image || p.image,
              author: postData.author || p.author,
              title: {
                es: postData.titleEs !== undefined ? postData.titleEs : (p.title?.es || p.title),
                en: postData.titleEn !== undefined ? postData.titleEn : (p.title?.en || p.title?.es || p.title),
              },
              excerpt: {
                es: postData.excerptEs !== undefined ? postData.excerptEs : (p.excerpt?.es || p.excerpt),
                en: postData.excerptEn !== undefined ? postData.excerptEn : (p.excerpt?.en || p.excerpt?.es || p.excerpt),
              },
              content: {
                es: postData.contentEs !== undefined ? postData.contentEs : (p.content?.es || p.content),
                en: postData.contentEn !== undefined ? postData.contentEn : (p.content?.en || p.content?.es || p.content),
              },
            };
            return savedArticle;
          }
          return p;
        })
      );
    } else {
      savedArticle = {
        id: `post-${Date.now()}`,
        category: postData.category || 'legal',
        date: new Date().toISOString().split('T')[0],
        readTime: postData.readTime || 4,
        author: postData.author || 'Equipo Legal Nayarit Real Estate',
        image: postData.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        title: { es: postData.titleEs, en: postData.titleEn || postData.titleEs },
        excerpt: { es: postData.excerptEs, en: postData.excerptEn || postData.excerptEs },
        content: { es: postData.contentEs, en: postData.contentEn || postData.contentEs },
      };
      setPosts((prev) => [savedArticle, ...prev]);
    }

    if (savedArticle) {
      setEditingPost(savedArticle);
      setSelectedArticle((prev) => (prev && prev.id === savedArticle.id ? savedArticle : prev));
    }

    setShowPostModal(false);
    return savedArticle;
  };

  const getCategoryBadge = (category, t) => {
    switch (category) {
      case 'legal':
        return {
          label: t ? t.blog.catLegal : 'Certeza Notarial',
          color: 'bg-[#153A26] text-[#E3B86C] border border-[#C59A47]/40',
        };
      case 'foreigners':
        return {
          label: t ? t.blog.catForeigners : 'Fideicomisos & Extranjeros',
          color: 'bg-[#0B1E14] text-white border border-white/20',
        };
      case 'investment':
        return {
          label: t ? t.blog.catInvestment : 'Plusvalía & Inversión',
          color: 'bg-[#C59A47]/20 text-[#8B6B23] border border-[#C59A47]/50',
        };
      default:
        return {
          label: category,
          color: 'bg-stone-100 text-stone-700',
        };
    }
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        setPosts,
        destinations,
        setDestinations,
        updateDestination,
        contactInfo,
        setContactInfo,
        updateContactInfo,
        currentView,
        setCurrentView,
        navigateToBlog,
        navigateToLanding,
        navigateToAdmin,
        selectedArticle,
        setSelectedArticle,
        openArticle,
        closeArticle,
        isAdmin,
        setIsAdmin,
        showLoginModal,
        setShowLoginModal,
        loginError,
        setLoginError,
        showPostModal,
        setShowPostModal,
        editingPost,
        setEditingPost,
        deletePost,
        savePost,
        getCategoryBadge,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
