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
  // Saved articles with fallback to localStorage and backend fetch
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

  // Fetch posts from backend API / database on mount for all visitors (including incognito)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPostsFromApi = async () => {
      try {
        setIsLoadingPosts(true);
        const res = await fetch('/api/posts.php?t=' + Date.now());
        if (res.ok) {
          const serverPosts = await res.json();
          if (Array.isArray(serverPosts) && serverPosts.length > 0 && isMounted) {
            setPosts(serverPosts);
            try {
              localStorage.setItem('nayarit_blog_posts', JSON.stringify(serverPosts));
            } catch (storageErr) {
              console.warn('Could not cache server posts to localStorage', storageErr);
            }
          }
        }
      } catch (err) {
        console.warn('API /api/posts.php unavailable, using local cache/fallbacks:', err);
      } finally {
        if (isMounted) setIsLoadingPosts(false);
      }
    };

    fetchPostsFromApi();
    return () => {
      isMounted = false;
    };
  }, []);

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

  // Fetch destinations from backend API / database on mount for all visitors
  useEffect(() => {
    let isMounted = true;
    const fetchDestinationsFromApi = async () => {
      try {
        const res = await fetch('/api/destinations.php?t=' + Date.now());
        if (res.ok) {
          const serverDests = await res.json();
          if (Array.isArray(serverDests) && serverDests.length > 0 && isMounted) {
            setDestinations(serverDests);
            try {
              localStorage.setItem('nayarit_destinations', JSON.stringify(serverDests));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn('API /api/destinations.php unavailable, using local cache:', err);
      }
    };

    fetchDestinationsFromApi();
    return () => {
      isMounted = false;
    };
  }, []);

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

  // Helper to detect if current URL is targeting the admin/aura workspace
  const isAuraRoute = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
    const hash = window.location.hash.toLowerCase();
    return path === '/aura' || hash === '#aura' || path === '/admin' || hash === '#admin';
  };

  // Current view: 'landing', 'blog', or 'admin'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      if (isAuraRoute()) {
        const authenticated = sessionStorage.getItem('nayarit_is_admin') === 'true';
        return authenticated ? 'admin' : 'landing';
      }
      const hash = window.location.hash;
      if (hash === '#blog-page' || hash === '#articulos') return 'blog';
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

  // Sync with URL changes (supports /aura clean pathname, popstate, and hash)
  useEffect(() => {
    const handleRouteSync = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.toLowerCase();

      if (path === '/aura' || hash === '#aura' || path === '/admin' || hash === '#admin') {
        if (!isAdmin) {
          setShowLoginModal(true);
        } else {
          setCurrentView('admin');
          // Standardize URL to clean /aura without #
          if (window.location.hash === '#aura' || window.location.hash === '#admin' || path === '/admin') {
            window.history.replaceState(null, '', '/aura');
          }
        }
      } else if (hash === '#blog-page' || hash === '#articulos') {
        setCurrentView('blog');
      }
    };

    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);

    // Initial check on mount
    handleRouteSync();

    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, [isAdmin]);

  // Cross-tab synchronization: when another tab updates localStorage, sync state across all tabs in real time!
  useEffect(() => {
    const handleStorageSync = (e) => {
      if (e.key === 'nayarit_blog_posts' && e.newValue) {
        try {
          const freshPosts = JSON.parse(e.newValue);
          if (Array.isArray(freshPosts)) {
            setPosts(freshPosts);
          }
        } catch (err) {
          console.error('Error syncing posts across tabs', err);
        }
      }
      if (e.key === 'nayarit_destinations' && e.newValue) {
        try {
          const freshDest = JSON.parse(e.newValue);
          if (Array.isArray(freshDest)) {
            setDestinations(freshDest);
          }
        } catch (err) {
          console.error('Error syncing destinations across tabs', err);
        }
      }
      if (e.key === 'nayarit_contact_info' && e.newValue) {
        try {
          const freshContact = JSON.parse(e.newValue);
          if (freshContact) {
            setContactInfo(freshContact);
          }
        } catch (err) {
          console.error('Error syncing contact across tabs', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

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
    window.history.replaceState(null, '', '/aura');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setSelectedArticle(null);
    setCurrentView('landing');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('nayarit_is_admin');
      window.history.replaceState(null, '', '/');
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToLanding = (targetSection = 'hero') => {
    setSelectedArticle(null);
    setCurrentView('landing');
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/');
    }
    if (targetSection) {
      window.location.hash = targetSection;
      setTimeout(() => {
        const el = document.getElementById(targetSection);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else {
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
    let updatedDest = null;
    setDestinations((prev) => {
      const next = prev.map((d) => {
        if (d.id === id) {
          updatedDest = { ...d, ...updatedFields };
          return updatedDest;
        }
        return d;
      });
      try {
        localStorage.setItem('nayarit_destinations', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // Asynchronously send to /api/destinations.php to persist in the server / database
    fetch('/api/destinations.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updatedFields }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Destination synced with server/database:', data);
        if (data?.destination) {
          setDestinations((curr) =>
            curr.map((d) => (d.id === id ? { ...d, ...data.destination } : d))
          );
        }
      })
      .catch((err) => {
        console.error('Error syncing destination to server database:', err);
      });
  };

  const updateContactInfo = (newInfo) => {
    setContactInfo((prev) => ({ ...prev, ...newInfo }));
  };

  const deletePost = (postId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
      setPosts((prev) => {
        const next = prev.filter((p) => p.id !== postId);
        try {
          localStorage.setItem('nayarit_blog_posts', JSON.stringify(next));
        } catch (e) {}
        return next;
      });
      if (selectedArticle && selectedArticle.id === postId) {
        setSelectedArticle(null);
      }

      // Persist deletion to backend database / server
      fetch('/api/posts.php?id=' + encodeURIComponent(postId), {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Post deleted from server/database:', data);
        })
        .catch((err) => {
          console.error('Error deleting post from server:', err);
        });
    }
  };

  const savePost = (postData) => {
    const targetId = postData.id || editingPost?.id;
    let savedArticle = null;

    if (targetId) {
      setPosts((prev) => {
        const next = prev.map((p) => {
          if (p.id === targetId) {
            savedArticle = {
              ...p,
              status: postData.status !== undefined ? postData.status : (p.status || 'draft'),
              category: postData.category || p.category,
              readTime: postData.readTime || p.readTime,
              image: postData.image || p.image,
              author: postData.author || p.author,
              title: {
                es: postData.titleEs !== undefined ? postData.titleEs : (p.title?.es || (typeof p.title === 'string' ? p.title : '')),
                en: postData.titleEn !== undefined ? postData.titleEn : (p.title?.en || ''),
              },
              excerpt: {
                es: postData.excerptEs !== undefined ? postData.excerptEs : (p.excerpt?.es || (typeof p.excerpt === 'string' ? p.excerpt : '')),
                en: postData.excerptEn !== undefined ? postData.excerptEn : (p.excerpt?.en || ''),
              },
              content: {
                es: postData.contentEs !== undefined ? postData.contentEs : (p.content?.es || (typeof p.content === 'string' ? p.content : '')),
                en: postData.contentEn !== undefined ? postData.contentEn : (p.content?.en || ''),
              },
            };
            return savedArticle;
          }
          return p;
        });

        try {
          localStorage.setItem('nayarit_blog_posts', JSON.stringify(next));
        } catch (err) {
          console.error('Synchronous save error', err);
        }
        return next;
      });
    } else {
      savedArticle = {
        id: `post-${Date.now()}`,
        status: postData.status || 'draft',
        category: postData.category || 'legal',
        date: new Date().toISOString().split('T')[0],
        readTime: postData.readTime || 4,
        author: postData.author || 'Lic. Uli NRE | Notarial & Legal Counsel',
        image: postData.image || '',
        title: { es: postData.titleEs || '', en: postData.titleEn || '' },
        excerpt: { es: postData.excerptEs || '', en: postData.excerptEn || '' },
        content: { es: postData.contentEs || '', en: postData.contentEn || '' },
      };

      setPosts((prev) => {
        const next = [savedArticle, ...prev];
        try {
          localStorage.setItem('nayarit_blog_posts', JSON.stringify(next));
        } catch (err) {
          console.error('Synchronous save error', err);
        }
        return next;
      });
    }

    if (savedArticle) {
      setEditingPost(savedArticle);
      setSelectedArticle((prev) => (prev && prev.id === savedArticle.id ? savedArticle : prev));

      // Asynchronously send to /api/posts.php so it is stored permanently in MySQL DB & server
      fetch('/api/posts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedArticle),
      })
        .then((res) => res.json())
        .then((resData) => {
          console.log('Post saved to database and server:', resData);
          if (resData?.post) {
            // Update with any canonical server fields
            setPosts((curr) =>
              curr.map((p) => (p.id === resData.post.id ? { ...p, ...resData.post } : p))
            );
          }
        })
        .catch((err) => {
          console.error('Error saving post to server database:', err);
        });
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
          color: 'bg-[#1C1408] text-[#FFD470] border border-[#C59A47]/80 shadow-md',
        };
      default:
        return {
          label: category,
          color: 'bg-[#0B1E14] text-white border border-white/20 shadow-md',
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
        handleAdminLogout,
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
