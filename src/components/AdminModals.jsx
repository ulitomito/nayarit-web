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
    navigateToAdmin,
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
      // Navigate directly to the dedicated Admin Dashboard
      navigateToAdmin();
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
              Ingresa la contraseña para entrar al Panel de Control:
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
                  className="flex-1 py-2.5 rounded-xl border border-[#DFD5C4] text-xs font-bold text-[#5C6B62] hover:bg-[#FAF7F2] cursor-pointer"
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
                <label className="block text-xs font-bold text-[#0B1E14] mb-1">Title (English)</label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="E.g. Due Diligence Guide..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs focus:ring-1 focus:ring-[#C59A47]"
                  required
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
                    <option value="legal">Certeza Notarial</option>
                    <option value="foreigners">Fideicomisos & Extranjeros</option>
                    <option value="investment">Plusvalía & Inversión</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B1E14] mb-1">Tiempo de Lectura (min)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 4 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1E14] mb-1">URL de Imagen de Portada</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                  required
                />
                {formData.image && (
                  <div className="mt-2 h-24 rounded-xl overflow-hidden border border-[#DFD5C4]/70">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1E14] mb-1">Extracto / Resumen (Español)</label>
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
                  className="px-4 py-2 rounded-xl border border-[#DFD5C4] text-xs font-bold text-[#5C6B62] cursor-pointer"
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
    </>
  );
};
