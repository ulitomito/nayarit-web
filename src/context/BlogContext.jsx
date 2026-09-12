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

// Rich article content renderer that formats headings, numbered lists, bullet lists, and paragraphs
export const RichArticleContent = ({ content }) => {
  if (!content) return null;

  const rawBlocks = content.trim().split(/\n\s*\n/);

  return (
    <div className="space-y-6 text-[#2C3531]">
      {rawBlocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 3: ### Heading
        if (trimmed.startsWith('### ')) {
          const headingText = trimmed.replace(/^###\s+/, '');
          return (
            <div key={bIdx} className="pt-6 pb-2 border-b border-[#DFD5C4]/60">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1E14] tracking-tight flex items-center gap-3">
                <span className="w-2 h-7 bg-[#C59A47] rounded-full shrink-0"></span>
                <span>{headingText}</span>
              </h3>
            </div>
          );
        }

        // Heading 2: ## Heading
        if (trimmed.startsWith('## ')) {
          const headingText = trimmed.replace(/^##\s+/, '');
          return (
            <div key={bIdx} className="pt-7 pb-2 border-b-2 border-[#C59A47]/40">
              <h2 className="font-serif text-2.5xl sm:text-3xl font-bold text-[#0B1E14] tracking-tight flex items-center gap-3">
                <span className="w-2.5 h-8 bg-[#153A26] rounded-full shrink-0"></span>
                <span>{headingText}</span>
              </h2>
            </div>
          );
        }

        // Check if block contains list items (numbered 1. or bullet *)
        const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
        const isNumberedList = lines.every((line) => /^\d+\.\s+/.test(line));
        const isBulletList = lines.every((line) => /^\*\s+/.test(line));

        if (isNumberedList) {
          return (
            <div key={bIdx} className="space-y-3 my-5">
              {lines.map((line, lIdx) => {
                const match = line.match(/^(\d+)\.\s+(.*)$/);
                const num = match ? match[1] : lIdx + 1;
                const text = match ? match[2] : line;
                return (
                  <div
                    key={lIdx}
                    className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#DFD5C4] shadow-sm hover:border-[#C59A47]/60 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-xl bg-[#153A26] text-[#E3B86C] font-serif font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {num}
                    </span>
                    <div className="text-sm sm:text-base text-[#2C3531] leading-relaxed">
                      {formatInline(text)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        if (isBulletList) {
          return (
            <div key={bIdx} className="space-y-2.5 my-4">
              {lines.map((line, lIdx) => {
                const text = line.replace(/^\*\s+/, '');
                return (
                  <div
                    key={lIdx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4]/70"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#C59A47] shrink-0 mt-2"></span>
                    <div className="text-sm sm:text-base text-[#2C3531] leading-relaxed">
                      {formatInline(text)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={bIdx} className="text-base sm:text-lg leading-relaxed text-[#2C3531]">
            {formatInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
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

  // Current view: 'landing' or 'blog'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
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
          setCurrentView('blog');
          window.location.hash = 'blog-page';
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Check initial hash
    if (window.location.hash === '#admin') {
      if (!isAdmin) {
        setShowLoginModal(true);
      } else {
        setCurrentView('blog');
        window.location.hash = 'blog-page';
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
    setSelectedArticle(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeArticle = () => {
    setSelectedArticle(null);
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
    if (editingPost) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingPost.id
            ? {
                ...p,
                ...postData,
                title: { es: postData.titleEs, en: postData.titleEn || postData.titleEs },
                excerpt: { es: postData.excerptEs, en: postData.excerptEn || postData.excerptEs },
                content: { es: postData.contentEs, en: postData.contentEn || postData.contentEs },
              }
            : p
        )
      );
    } else {
      const newPost = {
        id: `post-${Date.now()}`,
        category: postData.category,
        date: new Date().toISOString().split('T')[0],
        readTime: postData.readTime || 4,
        author: 'Equipo Legal Nayarit Real Estate',
        image: postData.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        title: { es: postData.titleEs, en: postData.titleEn || postData.titleEs },
        excerpt: { es: postData.excerptEs, en: postData.excerptEn || postData.excerptEs },
        content: { es: postData.contentEs, en: postData.contentEn || postData.contentEs },
      };
      setPosts((prev) => [newPost, ...prev]);
    }
    setShowPostModal(false);
    setEditingPost(null);
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
        currentView,
        setCurrentView,
        navigateToBlog,
        navigateToLanding,
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
