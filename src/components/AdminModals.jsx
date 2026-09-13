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
    </>
  );
};
