import React, { useState } from 'react';
import { useBlog, ADMIN_PASSWORD } from '../context/BlogContext';
import { PlusCircle, ShieldCheck, LogOut, BookOpen } from 'lucide-react';

export const AdminModals = () => {
  const {
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
    savePost,
    navigateToBlog,
  } = useBlog();

  const [passwordInput, setPasswordInput] = useState('');
  const [formData, setFormData] = useState({
    titleEs: '',
    titleEn: '',
    category: 'legal',
    readTime: 4,
    image: '',
    excerptEs: '',
    excerptEn: '',
    contentEs: '',
    contentEn: '',
  });

  // When editingPost changes, pre-fill form
  React.useEffect(() => {
    if (editingPost) {
      setFormData({
        titleEs: editingPost.title?.es || '',
        titleEn: editingPost.title?.en || '',
        category: editingPost.category || 'legal',
        readTime: editingPost.readTime || 4,
        image: editingPost.image || '',
        excerptEs: editingPost.excerpt?.es || '',
        excerptEn: editingPost.excerpt?.en || '',
        contentEs: editingPost.content?.es || '',
        contentEn: editingPost.content?.en || '',
      });
    } else {
      setFormData({
        titleEs: '',
        titleEn: '',
        category: 'legal',
        readTime: 4,
        image: '',
        excerptEs: '',
        excerptEn: '',
        contentEs: '',
        contentEn: '',
      });
    }
  }, [editingPost, showPostModal]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput('');
      setLoginError('');
      // Navigate directly to the blog management screen
      navigateToBlog();
    } else {
      setLoginError('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  const handleSavePost = (e) => {
    e.preventDefault();
    savePost(formData);
  };

  return (
    <>
      {/* Secret Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-[#DFD5C4]">
            <h3 className="font-serif text-2xl font-bold text-[#0B1E14] mb-2 text-center">
              Acceso Administrador
            </h3>
            <p className="text-xs text-[#5C6B62] mb-5 text-center">
              Ingresa la contraseña para gestionar artículos:
            </p>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Contraseña de administrador"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-sm focus:ring-2 focus:ring-[#C59A47] focus:outline-none"
                autoFocus
              />
              {loginError && (
                <p className="text-xs text-red-600 font-medium text-center">{loginError}</p>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    window.location.hash = '';
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-[#DFD5C4] text-xs font-bold text-[#5C6B62] hover:bg-[#FAF7F2]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#153A26] text-white text-xs font-bold hover:bg-[#0B1E14] shadow-sm cursor-pointer"
                >
                  Acceder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Post Create/Edit Modal */}
      {showPostModal && isAdmin && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#DFD5C4] max-h-[92vh] overflow-y-auto">
            <h3 className="font-serif text-2xl font-bold text-[#0B1E14] mb-4">
              {editingPost ? 'Editar Artículo' : 'Publicar Nuevo Artículo'}
            </h3>
            <form onSubmit={handleSavePost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0B1E14] mb-1">Título (Español)</label>
                <input
                  type="text"
                  value={formData.titleEs}
                  onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                  placeholder="Ej. Guía para invertir con certeza..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs focus:ring-1 focus:ring-[#C59A47]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1E14] mb-1">Título (English)</label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Ej. Guide to investing safely..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs focus:ring-1 focus:ring-[#C59A47]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0B1E14] mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                  >
                    <option value="legal">Certeza Notarial (Legal)</option>
                    <option value="foreigners">Fideicomisos & Extranjeros</option>
                    <option value="investment">Plusvalía & Inversión</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B1E14] mb-1">Minutos de Lectura</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1E14] mb-1">URL de Imagen</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1E14] mb-1">Resumen (Español)</label>
                <textarea
                  rows={2}
                  value={formData.excerptEs}
                  onChange={(e) => setFormData({ ...formData, excerptEs: e.target.value })}
                  placeholder="Breve sinopsis del artículo..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1E14] mb-1">Contenido Markdown (Español)</label>
                <textarea
                  rows={6}
                  value={formData.contentEs}
                  onChange={(e) => setFormData({ ...formData, contentEs: e.target.value })}
                  placeholder="Usa ### para títulos y listas con 1. o *"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DFD5C4]">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#DFD5C4] text-xs font-bold text-[#5C6B62]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#153A26] text-white text-xs font-bold shadow-sm hover:bg-[#0B1E14] cursor-pointer"
                >
                  Guardar Artículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Persistent Admin Control Bar (Visible across the site when logged in) */}
      {isAdmin && (
        <aside
          aria-label="Barra de administración"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#153A26] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-2xl border border-[#C59A47] flex items-center gap-3 sm:gap-4 animate-fade-in text-xs max-w-[95vw]"
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold hidden md:inline">Admin Activo</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingPost(null);
              setShowPostModal(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#C59A47] hover:bg-[#B3873B] text-[#0B1E14] font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nuevo Post</span>
          </button>

          <button
            type="button"
            onClick={navigateToBlog}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C59A47]" />
            <span className="hidden sm:inline">Gestionar Blog</span>
            <span className="sm:hidden">Blog</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAdmin(false)}
            className="text-white/70 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 pl-1 text-xs underline"
            title="Cerrar sesión de administrador"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </aside>
      )}
    </>
  );
};
