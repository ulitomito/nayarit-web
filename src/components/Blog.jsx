import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { initialBlogPosts } from '../data/initialBlogPosts';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Lock, 
  Unlock, 
  X, 
  MessageSquare, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const ADMIN_PASSWORD = 'nre2026';

export const Blog = () => {
  const { lang, t } = useLanguage();

  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('nre_blog_posts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialBlogPosts;
  });

  useEffect(() => {
    try {
      localStorage.setItem('nre_blog_posts', JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }, [posts]);

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [formData, setFormData] = useState({
    titleEs: '',
    titleEn: '',
    category: 'legal',
    author: 'Equipo Nayarit Real Estate',
    readTime: 4,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    excerptEs: '',
    excerptEn: '',
    contentEs: '',
    contentEn: ''
  });

  const resetForm = () => {
    setFormData({
      titleEs: '',
      titleEn: '',
      category: 'legal',
      author: 'Equipo Nayarit Real Estate',
      readTime: 4,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      excerptEs: '',
      excerptEn: '',
      contentEs: '',
      contentEn: ''
    });
    setEditingPost(null);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput('');
      setLoginError('');
    } else {
      setLoginError(lang === 'es' ? 'Contraseña incorrecta (nre2026)' : 'Wrong password (nre2026)');
    }
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      titleEs: post.title.es || '',
      titleEn: post.title.en || '',
      category: post.category || 'legal',
      author: post.author || '',
      readTime: post.readTime || 4,
      image: post.image || '',
      excerptEs: post.excerpt.es || '',
      excerptEn: post.excerpt.en || '',
      contentEs: post.content.es || '',
      contentEn: post.content.en || ''
    });
    setShowPostModal(true);
  };

  const handleSavePost = (e) => {
    e.preventDefault();
    if (!formData.titleEs || !formData.contentEs) return;

    if (editingPost) {
      const updated = posts.map((p) => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            category: formData.category,
            author: formData.author,
            readTime: Number(formData.readTime) || 4,
            image: formData.image,
            title: { es: formData.titleEs, en: formData.titleEn || formData.titleEs },
            excerpt: { es: formData.excerptEs || formData.titleEs, en: formData.excerptEn || formData.titleEn || formData.titleEs },
            content: { es: formData.contentEs, en: formData.contentEn || formData.contentEs }
          };
        }
        return p;
      });
      setPosts(updated);
    } else {
      const newPost = {
        id: `post-${Date.now()}`,
        category: formData.category,
        date: new Date().toISOString().split('T')[0],
        readTime: Number(formData.readTime) || 4,
        author: formData.author || 'Equipo Nayarit Real Estate',
        image: formData.image,
        title: { es: formData.titleEs, en: formData.titleEn || formData.titleEs },
        excerpt: { es: formData.excerptEs || formData.titleEs, en: formData.excerptEn || formData.titleEn || formData.titleEs },
        content: { es: formData.contentEs, en: formData.contentEn || formData.contentEs }
      };
      setPosts([newPost, ...posts]);
    }
    setShowPostModal(false);
    resetForm();
  };

  const handleDeletePost = (id) => {
    if (window.confirm(lang === 'es' ? '¿Eliminar este artículo?' : 'Delete article?')) {
      setPosts(posts.filter((p) => p.id !== id));
      if (selectedArticle?.id === id) setSelectedArticle(null);
    }
  };

  return (
    <section id="blog" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#153A26]/10 text-[#153A26] text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#C59A47]" />
              <span>{t.blog.badge}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1E14]">
              {t.blog.title}
            </h2>
            <p className="text-sm text-[#5C6B62] mt-1">
              {t.blog.subtitle}
            </p>
          </div>

          {/* Admin Mode Pill */}
          <div>
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { resetForm(); setShowPostModal(true); }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#153A26] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#E3B86C]" />
                  <span>Publicar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdmin(false)}
                  className="px-2.5 py-1.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE7DA] text-[#5C6B62] text-xs font-bold border border-[#DFD5C4]"
              >
                <Lock className="w-3.5 h-3.5 text-[#C59A47]" />
                <span>{t.blog.adminBtn}</span>
              </button>
            )}
          </div>
        </div>

        {/* Compact iOS Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedArticle(post)}
              className="bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#DFD5C4] shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between cursor-pointer group relative"
            >
              {isAdmin && (
                <div className="absolute top-3 right-3 z-10 flex gap-1 bg-black/70 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleOpenEditModal(post); }}
                    className="p-1 text-white hover:text-[#E3B86C]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                    className="p-1 text-red-400 hover:text-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="h-44 overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.title[lang]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] text-[#E3B86C] font-semibold">
                  {post.readTime} {t.blog.minRead}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0B1E14] group-hover:text-[#153A26] line-clamp-2 mb-2">
                    {post.title[lang]}
                  </h3>
                  <p className="text-xs text-[#5C6B62] line-clamp-2">
                    {post.excerpt[lang]}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#DFD5C4]/60 flex items-center justify-between text-xs font-bold text-[#153A26]">
                  <span>{t.blog.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#DFD5C4] relative max-h-[88vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF7F2] text-[#0B1E14] hover:bg-[#EFE7DA]"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-[#C59A47] uppercase tracking-wider">
              {selectedArticle.readTime} {t.blog.minRead} • Nayarit Real Estate
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1E14] mt-2 mb-4 leading-snug">
              {selectedArticle.title[lang]}
            </h2>

            <div className="rounded-2xl overflow-hidden mb-6 h-56">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title[lang]}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-sm text-[#1A211D] leading-relaxed space-y-3 font-normal">
              {selectedArticle.content[lang]
                .trim()
                .split('\n\n')
                .map((block, i) => (
                  <p key={i}>{block.replace(/^###\s+/, '')}</p>
                ))}
            </div>

            <div className="pt-6 mt-6 border-t border-[#DFD5C4] flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                href={`https://wa.me/523221234567?text=${encodeURIComponent(
                  lang === 'es'
                    ? `Hola, leí su artículo "${selectedArticle.title.es}" y quisiera una asesoría sobre el tema.`
                    : `Hello, I read your article "${selectedArticle.title.en}" and would like guidance on this topic.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold text-[#5C6B62] hover:text-[#0B1E14]"
              >
                {t.blog.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#DFD5C4]">
            <h3 className="font-serif text-xl font-bold text-[#0B1E14] mb-2 text-center">
              Acceso Admin
            </h3>
            <p className="text-xs text-[#5C6B62] mb-4 text-center">
              Contraseña: <span className="font-mono font-bold text-[#153A26]">nre2026</span>
            </p>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-sm focus:ring-2 focus:ring-[#C59A47] focus:outline-none"
                autoFocus
              />
              {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[#DFD5C4] text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#153A26] text-white text-xs font-bold"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Post Create/Edit Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#DFD5C4] max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-bold text-[#0B1E14] mb-4">
              {editingPost ? 'Editar Artículo' : 'Publicar Nuevo Artículo'}
            </h3>
            <form onSubmit={handleSavePost} className="space-y-3">
              <input
                type="text"
                value={formData.titleEs}
                onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                placeholder="Título en Español"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                required
              />
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder="Título en Inglés (opcional)"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
              />
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="URL de imagen"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                required
              />
              <textarea
                rows={2}
                value={formData.excerptEs}
                onChange={(e) => setFormData({ ...formData, excerptEs: e.target.value })}
                placeholder="Breve resumen"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
              />
              <textarea
                rows={5}
                value={formData.contentEs}
                onChange={(e) => setFormData({ ...formData, contentEs: e.target.value })}
                placeholder="Contenido completo del artículo..."
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#DFD5C4] text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#153A26] text-white text-xs font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
