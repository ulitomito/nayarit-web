import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBlog, RichArticleContent } from '../context/BlogContext';
import { RichTextEditor } from './RichTextEditor';
import {
  FileText,
  MapPin,
  Phone,
  Settings,
  PlusCircle,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  LogOut,
  Search,
  Check,
  Save,
  Database,
  Globe,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  AlertCircle,
  ArrowLeft,
  Upload,
  ImagePlus,
  AlertTriangle,
  CheckCircle2,
  Info,
  X
} from 'lucide-react';

/**
 * Automatically compresses user-uploaded images via HTML5 Canvas
 * so high-resolution mobile photos don't overflow localStorage or slow down rendering.
 */
const compressImageFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo seleccionado no es una imagen válida'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1600;
        const maxHeight = 1200;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high efficiency JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('No se pudo decodificar la imagen'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(file);
  });
};

const COUNTRY_CODES = [
  { id: 'MX', dialCode: '52', flag: '🇲🇽', label: 'México (+52)' },
  { id: 'US', dialCode: '1', flag: '🇺🇸', label: 'Estados Unidos (+1)' },
  { id: 'CA', dialCode: '1', flag: '🇨🇦', label: 'Canadá (+1)' },
  { id: 'ES', dialCode: '34', flag: '🇪🇸', label: 'España (+34)' },
  { id: 'CO', dialCode: '57', flag: '🇨🇴', label: 'Colombia (+57)' },
  { id: 'AR', dialCode: '54', flag: '🇦🇷', label: 'Argentina (+54)' },
  { id: 'CL', dialCode: '56', flag: '🇨🇱', label: 'Chile (+56)' },
  { id: 'GB', dialCode: '44', flag: '🇬🇧', label: 'Reino Unido (+44)' },
  { id: 'FR', dialCode: '33', flag: '🇫🇷', label: 'Francia (+33)' },
  { id: 'DE', dialCode: '49', flag: '🇩🇪', label: 'Alemania (+49)' },
  { id: 'IT', dialCode: '39', flag: '🇮🇹', label: 'Italia (+39)' }
];

const parseInitialPhone = (fullPhone = '') => {
  const digits = String(fullPhone).replace(/\D/g, '');
  if (digits.startsWith('52') && digits.length >= 12) {
    return { countryId: 'MX', phone10: digits.slice(2, 12) };
  }
  if (digits.startsWith('34') && digits.length >= 11) {
    return { countryId: 'ES', phone10: digits.slice(2, 11) };
  }
  if (digits.startsWith('57') && digits.length >= 12) {
    return { countryId: 'CO', phone10: digits.slice(2, 12) };
  }
  if (digits.startsWith('1') && digits.length >= 11) {
    return { countryId: 'US', phone10: digits.slice(1, 11) };
  }
  if (digits.length >= 10) {
    return { countryId: 'MX', phone10: digits.slice(-10) };
  }
  return { countryId: 'MX', phone10: digits };
};

const formatHumanPhone = (dialCode, digits10) => {
  if (!digits10) return '';
  const clean = digits10.replace(/\D/g, '');
  if (clean.length < 10) {
    return `+${dialCode} ${clean}`;
  }
  const part1 = clean.slice(0, 3);
  const part2 = clean.slice(3, 6);
  const part3 = clean.slice(6, 10);
  return `+${dialCode} (${part1}) ${part2}-${part3}`;
};

export const AdminDashboard = () => {
  const { lang, t } = useLanguage();
  const {
    posts,
    savePost,
    destinations,
    updateDestination,
    contactInfo,
    updateContactInfo,
    setIsAdmin,
    setShowPostModal,
    setEditingPost,
    deletePost,
    openArticle,
    navigateToLanding,
    navigateToBlog,
    handleAdminLogout,
    getCategoryBadge
  } = useBlog();

  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'destinations' | 'contact'
  const [postSearch, setPostSearch] = useState('');
  const [postCategoryFilter, setPostCategoryFilter] = useState('all');
  const [postStatusFilter, setPostStatusFilter] = useState('all'); // 'all' | 'published' | 'draft'

  // Cover image upload / compression state
  const fileInputRef = useRef(null);
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' | 'url'
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

  // English completeness modal & notifications
  const [englishWarningModal, setEnglishWarningModal] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Article inspection and dedicated editing state
  const [viewingPost, setViewingPost] = useState(null); // When set, renders the dedicated article screen instead of table
  const [isEditMode, setIsEditMode] = useState(false); // false: reader view first, true: edit mode
  const [articleLangTab, setArticleLangTab] = useState('es'); // 'es' | 'en'
  const [articleSavedToast, setArticleSavedToast] = useState(false);
  const [articleFormData, setArticleFormData] = useState({
    id: null,
    status: 'published',
    titleEs: '',
    titleEn: '',
    category: 'legal',
    readTime: 4,
    image: '',
    excerptEs: '',
    excerptEn: '',
    contentEs: '',
    contentEn: ''
  });

  // Check if English translation is sufficiently filled (title + content body)
  const checkEnglishCompleteness = (data) => {
    const title = (data?.titleEn || '').trim();
    const rawContent = (data?.contentEn || '').replace(/<[^>]*>/g, '').trim();
    return Boolean(title.length > 0 && rawContent.length > 10);
  };

  const handleOpenArticleDetail = (post) => {
    setEditingPost(post);
    setViewingPost(post);
    setIsEditMode(false); // First show the article in full reading view!
    setArticleLangTab('es');
    setImageInputMode(post.image && post.image.startsWith('http') ? 'url' : 'upload');
    setImageUploadError('');
    setArticleFormData({
      id: post.id,
      status: post.status || 'published',
      titleEs: post.title?.es || post.title || '',
      titleEn: post.title?.en || '',
      category: post.category || 'legal',
      readTime: post.readTime || 4,
      image: post.image || '',
      excerptEs: post.excerpt?.es || post.excerpt || '',
      excerptEn: post.excerpt?.en || '',
      contentEs: post.content?.es || post.content || '',
      contentEn: post.content?.en || '',
    });
  };

  const handleStartNewArticle = () => {
    setEditingPost(null);
    const newPlaceholder = {
      isNew: true,
      id: null,
      status: 'draft',
      title: { es: 'Nuevo Artículo', en: 'New Article' },
      category: 'legal',
      readTime: 4,
      image: '',
      excerpt: { es: '', en: '' },
      content: { es: '', en: '' },
      date: new Date().toISOString().split('T')[0],
      author: 'Lic. Uli NRE | Notarial & Legal Counsel'
    };
    setViewingPost(newPlaceholder);
    setIsEditMode(true); // For a brand new article, start directly in edit mode
    setArticleLangTab('es');
    setImageInputMode('upload');
    setImageUploadError('');
    setArticleFormData({
      id: null,
      status: 'draft',
      titleEs: '',
      titleEn: '',
      category: 'legal',
      readTime: 4,
      image: '',
      excerptEs: '',
      excerptEn: '',
      contentEs: '',
      contentEn: ''
    });
  };

  // Process and compress image file (from input or drag-and-drop)
  const processImageFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageUploadError('Por favor selecciona o arrastra una imagen válida (JPG, PNG o WEBP).');
      return;
    }
    setImageUploadError('');
    setIsCompressingImage(true);
    try {
      const optimizedDataUrl = await compressImageFile(file);
      setArticleFormData((prev) => ({ ...prev, image: optimizedDataUrl }));
    } catch (err) {
      console.error(err);
      setImageUploadError(err.message || 'Error al procesar la imagen');
    } finally {
      setIsCompressingImage(false);
    }
  };

  // Upload image handler with automatic resizing & compression
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    if (e.target) e.target.value = '';
  };

  // Drag and drop handlers for image
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);
  };

  const handleDropImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Save as draft (always allowed, does not require English)
  const handleSaveDraft = (e) => {
    if (e) e.preventDefault();
    const payload = {
      ...articleFormData,
      id: viewingPost?.id || articleFormData.id,
      status: 'draft',
    };
    const saved = savePost(payload);

    if (saved) {
      setViewingPost(saved);
      setEditingPost(saved);
      setArticleFormData({
        id: saved.id,
        status: 'draft',
        titleEs: saved.title?.es || saved.title || '',
        titleEn: saved.title?.en || '',
        category: saved.category || 'legal',
        readTime: saved.readTime || 4,
        image: saved.image || '',
        excerptEs: saved.excerpt?.es || saved.excerpt || '',
        excerptEn: saved.excerpt?.en || '',
        contentEs: saved.content?.es || saved.content || '',
        contentEn: saved.content?.en || '',
      });
    }
    setEnglishWarningModal(false);
    setIsEditMode(false); // Return to reading mode
    setSaveSuccessMessage('Guardado como Borrador. Recuerda completar la versión en inglés para poder publicarlo.');
    setArticleSavedToast(true);
    setTimeout(() => setArticleSavedToast(false), 4000);
  };

  // Save and publish (requires English translation)
  const handleSaveAndPublish = (e) => {
    if (e) e.preventDefault();

    // Check English completeness
    const hasEnglish = checkEnglishCompleteness(articleFormData);
    if (!hasEnglish) {
      // Prompt user with modal and prevent publishing
      setEnglishWarningModal(true);
      return;
    }

    const payload = {
      ...articleFormData,
      id: viewingPost?.id || articleFormData.id,
      status: 'published',
    };
    const saved = savePost(payload);

    if (saved) {
      setViewingPost(saved);
      setEditingPost(saved);
      setArticleFormData({
        id: saved.id,
        status: 'published',
        titleEs: saved.title?.es || saved.title || '',
        titleEn: saved.title?.en || '',
        category: saved.category || 'legal',
        readTime: saved.readTime || 4,
        image: saved.image || '',
        excerptEs: saved.excerpt?.es || saved.excerpt || '',
        excerptEn: saved.excerpt?.en || '',
        contentEs: saved.content?.es || saved.content || '',
        contentEn: saved.content?.en || '',
      });
    }
    setEnglishWarningModal(false);
    setIsEditMode(false); // Return to reading mode
    setSaveSuccessMessage('¡Artículo publicado con éxito en Español e Inglés!');
    setArticleSavedToast(true);
    setTimeout(() => setArticleSavedToast(false), 4000);
  };

  const handleSaveArticle = handleSaveAndPublish;

  // Contact form local state
  const [contactForm, setContactForm] = useState(contactInfo);
  const [contactSaved, setContactSaved] = useState(false);

  // Phone input states: country selector + exact 10 digits
  const initialPhoneData = parseInitialPhone(contactInfo?.whatsappPhone || '523111187229');
  const [selectedCountryId, setSelectedCountryId] = useState(initialPhoneData.countryId);
  const [phoneDigits, setPhoneDigits] = useState(initialPhoneData.phone10);
  const [phoneError, setPhoneError] = useState('');

  const currentCountry = COUNTRY_CODES.find((c) => c.id === selectedCountryId) || COUNTRY_CODES[0];

  const handlePhoneKeyDown = (e) => {
    // Disallow 'e', 'E', '+', '-', '.', ',', and spaces
    if (['e', 'E', '+', '-', '.', ',', ' '].includes(e.key)) {
      e.preventDefault();
      return;
    }
    // Allow navigation and editing control keys
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];
    if (allowedKeys.includes(e.key)) {
      return;
    }
    // Allow keyboard shortcuts (Ctrl/Cmd + C, V, A, X, Z)
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    // Disallow any non-digit character
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }
    // Limit strictly to 10 digits unless text is highlighted to be replaced
    if (phoneDigits.length >= 10 && e.target.selectionStart === e.target.selectionEnd) {
      e.preventDefault();
      return;
    }
  };

  const handlePhoneChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneDigits(onlyDigits);
    if (onlyDigits.length === 10) {
      setPhoneError('');
    }
  };

  const handlePhonePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text') || '';
    const onlyDigits = pasted.replace(/\D/g, '').slice(0, 10);
    setPhoneDigits(onlyDigits);
    if (onlyDigits.length === 10) {
      setPhoneError('');
    }
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (phoneDigits.length < 10) {
      setPhoneError(`Debes ingresar exactamente 10 dígitos (actualmente tienes ${phoneDigits.length}).`);
      return;
    }
    setPhoneError('');

    const fullWhatsappPhone = `${currentCountry.dialCode}${phoneDigits}`;
    const autoPhoneDisplay = formatHumanPhone(currentCountry.dialCode, phoneDigits);

    const updatedData = {
      ...contactForm,
      whatsappPhone: fullWhatsappPhone,
      phoneDisplay: autoPhoneDisplay
    };

    updateContactInfo(updatedData);
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 3000);
  };

  // Destination edit state
  const [editingDestId, setEditingDestId] = useState(null);
  const [destForm, setDestForm] = useState({ image: '', tagEs: '', tagEn: '' });
  const [destSaved, setDestSaved] = useState(false);

  const handleStartEditDest = (dest) => {
    setEditingDestId(dest.id);
    setDestForm({
      image: dest.image,
      tagEs: dest.tag?.es || dest.tag,
      tagEn: dest.tag?.en || dest.tag
    });
  };

  const handleSaveDest = (id) => {
    updateDestination(id, {
      image: destForm.image,
      tag: { es: destForm.tagEs, en: destForm.tagEn }
    });
    setEditingDestId(null);
    setDestSaved(true);
    setTimeout(() => setDestSaved(false), 3000);
  };

  const filteredPosts = posts.filter((p) => {
    const matchCat = postCategoryFilter === 'all' || p.category === postCategoryFilter;
    const matchStatus =
      postStatusFilter === 'all' ||
      (postStatusFilter === 'draft' ? p.status === 'draft' : p.status !== 'draft');
    const title = (p.title[lang] || p.title.es || '').toLowerCase();
    const matchSearch = !postSearch || title.includes(postSearch.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#0B1E14] flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDEBAR (Sticky, Corporate Luxury Design) */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#0B1E14] text-white flex flex-col justify-between shrink-0 shadow-2xl z-30">
        <div>
          {/* Brand Identity Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#C59A47] overflow-hidden shrink-0 shadow-sm">
              <img src="/assets/logo-emblem.jpg" alt="Nayarit Real Estate" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm tracking-wide text-white leading-tight">
                NAYARIT REAL ESTATE
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-bold text-[#E3B86C] uppercase tracking-wider">
                  CMS Administrador
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 py-2 text-[10px] font-bold text-white/50 uppercase tracking-widest">
              Gestión de Contenido
            </p>

            <button
              type="button"
              onClick={() => {
                setActiveTab('posts');
                setViewingPost(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'posts'
                  ? 'bg-[#153A26] text-[#E3B86C] shadow-md border border-[#C59A47]/30'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#C59A47]" />
                <span>Artículos del Blog</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/40 text-white/90">
                {posts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('destinations')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'destinations'
                  ? 'bg-[#153A26] text-[#E3B86C] shadow-md border border-[#C59A47]/30'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#C59A47]" />
                <span>Galería de Destinos</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/40 text-white/90">
                {destinations.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-[#153A26] text-[#E3B86C] shadow-md border border-[#C59A47]/30'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Phone className="w-4 h-4 text-[#C59A47]" />
              <span>Contacto y Redes</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleAdminLogout}
            className="w-full py-2.5 px-3.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-red-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#DFD5C4] px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="min-w-0 max-w-xl">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B1E14] truncate">
              {activeTab === 'posts' && (
                viewingPost 
                  ? (viewingPost.isNew ? 'Redactar Nuevo Artículo' : isEditMode ? 'Modo Edición' : (viewingPost.title?.es || viewingPost.title))
                  : 'Gestión de Artículos del Blog'
              )}
              {activeTab === 'destinations' && 'Galería de Destinos Inmobiliarios'}
              {activeTab === 'contact' && 'Información de Contacto y Redes Sociales'}
            </h2>
            <p className="text-xs text-[#5C6B62] mt-0.5 truncate">
              {activeTab === 'posts' && (
                viewingPost
                  ? (isEditMode ? 'Edita los campos y presiona "Guardar Cambios" para aplicar.' : 'Vista de lectura. Haz clic en "Modo Edición" para modificar este artículo.')
                  : 'Publica, edita o elimina artículos con formato bilingüe y Markdown.'
              )}
              {activeTab === 'destinations' && 'Personaliza imágenes y etiquetas de los 7 destinos clave en Nayarit.'}
              {activeTab === 'contact' && 'Actualiza el WhatsApp, teléfono de oficina y redes oficiales de NRE.'}
            </p>
          </div>

          {/* Quick Action in Header */}
          <div className="flex items-center gap-3">
            {activeTab === 'posts' && !viewingPost && (
              <button
                type="button"
                onClick={handleStartNewArticle}
                className="px-4 py-2.5 rounded-xl bg-[#153A26] hover:bg-[#0B1E14] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm hover:shadow cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#C59A47]" />
                <span>Nuevo Artículo</span>
              </button>
            )}

            {activeTab === 'posts' && viewingPost && (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setViewingPost(null)}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#DFD5C4]/60 text-xs font-bold text-[#153A26] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver</span>
                </button>

                {!isEditMode ? (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    className="px-4 py-2 rounded-xl bg-[#153A26] hover:bg-[#0B1E14] text-[#E3B86C] text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#C59A47]" />
                    <span>Modo Edición</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#DFD5C4] border border-[#DFD5C4] text-xs font-bold text-[#153A26] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                      title="Guardar como borrador"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#C59A47]" />
                      <span>Guardar Borrador</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAndPublish}
                      className="px-4 py-2 rounded-xl bg-[#153A26] hover:bg-[#0B1E14] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                      title="Guardar y publicar (requiere inglés)"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C59A47]" />
                      <span>Publicar</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
          
          {/* TAB 1: ARTÍCULOS DEL BLOG (LISTA) */}
          {activeTab === 'posts' && !viewingPost && (
            <div className="space-y-6 animate-fade-in">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#DFD5C4] shadow-xs">
                  <span className="text-[11px] font-bold text-[#5C6B62] uppercase tracking-wider block">
                    Total Artículos
                  </span>
                  <p className="font-serif text-3xl font-extrabold text-[#0B1E14] mt-1">
                    {posts.length}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Publicados
                  </span>
                  <p className="font-serif text-3xl font-extrabold text-emerald-700 mt-1">
                    {posts.filter((p) => p.status !== 'draft').length}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Borradores
                  </span>
                  <p className="font-serif text-3xl font-extrabold text-amber-600 mt-1">
                    {posts.filter((p) => p.status === 'draft').length}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#DFD5C4] shadow-xs">
                  <span className="text-[11px] font-bold text-[#5C6B62] uppercase tracking-wider block">
                    Certeza Notarial
                  </span>
                  <p className="font-serif text-3xl font-extrabold text-[#153A26] mt-1">
                    {posts.filter((p) => p.category === 'legal').length}
                  </p>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="p-4 rounded-2xl bg-white border border-[#DFD5C4] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-[#5C6B62] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                    placeholder="Buscar artículos..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs text-[#0B1E14] focus:ring-1 focus:ring-[#C59A47]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-bold text-[#5C6B62]">Estado:</label>
                    <select
                      value={postStatusFilter}
                      onChange={(e) => setPostStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs font-semibold text-[#0B1E14]"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="published">🟢 Publicados</option>
                      <option value="draft">🟡 Borradores</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-bold text-[#5C6B62]">Categoría:</label>
                    <select
                      value={postCategoryFilter}
                      onChange={(e) => setPostCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs font-semibold text-[#0B1E14]"
                    >
                      <option value="all">Todas las categorías</option>
                      <option value="legal">Certeza Notarial</option>
                      <option value="foreigners">Fideicomisos</option>
                      <option value="investment">Plusvalía</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Articles Table */}
              <div className="bg-white rounded-3xl border border-[#DFD5C4] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#DFD5C4] text-[#5C6B62] uppercase text-[10px] font-bold">
                      <tr>
                        <th className="py-3.5 px-4">Artículo</th>
                        <th className="py-3.5 px-4">Categoría</th>
                        <th className="py-3.5 px-4">Fecha</th>
                        <th className="py-3.5 px-4">Lectura</th>
                        <th className="py-3.5 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DFD5C4]/60">
                      {filteredPosts.map((post) => {
                        const badge = getCategoryBadge(post.category, t);
                        return (
                          <tr key={post.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <div
                                onClick={() => handleOpenArticleDetail(post)}
                                className="flex items-center gap-3 cursor-pointer group/title"
                              >
                                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#DFD5C4]/60 bg-stone-100 group-hover/title:scale-105 transition-transform">
                                  <img src={post.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0 max-w-md">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <p className="font-serif font-bold text-xs text-[#0B1E14] group-hover/title:text-[#153A26] line-clamp-1 transition-colors">
                                      {post.title.es}
                                    </p>
                                    {post.status === 'draft' ? (
                                      <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0 inline-flex items-center gap-1">
                                        <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                                        Borrador
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0 inline-flex items-center gap-1">
                                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                        Publicado
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#5C6B62] line-clamp-1 italic">
                                    {post.title.en || 'Sin traducción'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badge.color}`}>
                                {badge.label}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[#5C6B62] font-semibold whitespace-nowrap">
                              {post.date}
                            </td>
                            <td className="py-3.5 px-4 text-[#5C6B62] whitespace-nowrap">
                              {post.readTime} min
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenArticleDetail(post)}
                                  className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#153A26] text-[#153A26] hover:text-[#E3B86C] border border-[#DFD5C4] hover:border-[#153A26] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                  title="Ver y editar artículo"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Editar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deletePost(post.id)}
                                  className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                                  title="Eliminar artículo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* DEDICATED ARTICLE INSPECTION & FULL-SCREEN EDITOR */}
          {activeTab === 'posts' && viewingPost && (
            <div className="space-y-6 animate-fade-in">
              {/* Top Navigation & Action Strip */}
              <div className="bg-white rounded-3xl border border-[#DFD5C4] p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setViewingPost(null)}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#DFD5C4]/60 text-xs font-bold text-[#153A26] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver a la lista</span>
                  </button>

                  <div className="h-5 w-px bg-[#DFD5C4]"></div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isEditMode 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}>
                    {isEditMode ? '✏️ Modo Edición Activo' : '👀 Vista del Artículo'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {!isEditMode ? (
                    <>
                      {/* Language Switcher for Preview */}
                      <div className="flex items-center rounded-xl bg-[#FAF7F2] p-1 border border-[#DFD5C4]">
                        <button
                          type="button"
                          onClick={() => setArticleLangTab('es')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            articleLangTab === 'es' ? 'bg-[#153A26] text-white shadow-xs' : 'text-[#5C6B62] hover:text-[#0B1E14]'
                          }`}
                        >
                          🇲🇽 ES
                        </button>
                        <button
                          type="button"
                          onClick={() => setArticleLangTab('en')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            articleLangTab === 'en' ? 'bg-[#153A26] text-white shadow-xs' : 'text-[#5C6B62] hover:text-[#0B1E14]'
                          }`}
                        >
                          🇺🇸 EN
                        </button>
                      </div>

                      {/* Primary Button to enter Edit Mode */}
                      <button
                        type="button"
                        onClick={() => setIsEditMode(true)}
                        className="px-5 py-2 rounded-xl bg-[#153A26] hover:bg-[#0B1E14] text-[#E3B86C] text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 text-[#C59A47]" />
                        <span>Activar Modo Edición</span>
                      </button>

                      {viewingPost.id && (
                        <button
                          type="button"
                          onClick={() => {
                            deletePost(viewingPost.id);
                            setViewingPost(null);
                          }}
                          className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                          title="Eliminar artículo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Edit mode action buttons */}
                      <button
                        type="button"
                        onClick={() => setIsEditMode(false)}
                        className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#DFD5C4]/50 text-xs font-bold text-[#5C6B62] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-[#C59A47]" />
                        <span>Vista Lectura</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#DFD5C4] border border-[#DFD5C4] text-xs font-bold text-[#153A26] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                        title="Guardar como borrador (no público)"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#C59A47]" />
                        <span>Guardar Borrador</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveAndPublish}
                        className="px-4 py-2 rounded-xl bg-[#153A26] hover:bg-[#0B1E14] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                        title="Publicar en el blog (requiere inglés)"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#C59A47]" />
                        <span>Guardar y Publicar</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {articleSavedToast && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMessage || '¡Cambios guardados con éxito en la base de datos!'}</span>
                </div>
              )}

              {/* 1. VISTA DE LECTURA (DEFAULT / INITIAL STATE) */}
              {!isEditMode && (
                <div className="bg-white rounded-3xl border border-[#DFD5C4] p-6 sm:p-10 shadow-xs max-w-4xl mx-auto space-y-6">
                  
                  {/* Draft Alert Banner if applicable */}
                  {viewingPost.status === 'draft' && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                          <p className="font-bold">Artículo en estado Borrador</p>
                          <p className="text-[11px] text-amber-800">
                            Este artículo no está visible al público. Para publicarlo, entra en "Modo Edición" y completa los campos en inglés.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditMode(true);
                          setArticleLangTab('en');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#153A26] hover:bg-[#0B1E14] text-[#E3B86C] font-bold text-xs shrink-0 transition-colors cursor-pointer"
                      >
                        Completar Inglés →
                      </button>
                    </div>
                  )}

                  {/* Category & Meta */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${getCategoryBadge(viewingPost.category, t).color}`}>
                      {getCategoryBadge(viewingPost.category, t).label}
                    </span>
                    {viewingPost.status === 'draft' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Borrador (No público)</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Publicado</span>
                      </span>
                    )}
                    <span className="text-xs font-semibold text-[#5C6B62] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C59A47]" />
                      {viewingPost.readTime} min de lectura
                    </span>
                    <span className="text-xs text-[#5C6B62]">•</span>
                    <span className="text-xs font-semibold text-[#5C6B62] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C59A47]" />
                      {viewingPost.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1E14] leading-tight">
                    {articleLangTab === 'es' ? (viewingPost.title?.es || viewingPost.title) : (viewingPost.title?.en || viewingPost.title?.es)}
                  </h1>

                  {/* Author Card */}
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#DFD5C4]/70">
                    <div className="w-10 h-10 rounded-xl bg-[#153A26] border border-[#C59A47] overflow-hidden shrink-0 flex items-center justify-center text-white">
                      <img src="/assets/logo-emblem.jpg" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0B1E14]">
                        {viewingPost.author || 'Lic. Uli NRE | Notarial & Legal Counsel'}
                      </p>
                      <p className="text-[11px] text-[#5C6B62]">
                        Revisión Notarial y Seguridad Jurídica Inmobiliaria en Nayarit
                      </p>
                    </div>
                  </div>

                  {/* Cover Image */}
                  {viewingPost.image && (
                    <div className="rounded-3xl overflow-hidden shadow-md max-h-96 w-full bg-stone-100">
                      <img
                        src={viewingPost.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Excerpt */}
                  {(viewingPost.excerpt?.es || viewingPost.excerpt?.en) && (
                    <div className="bg-[#FAF7F2] p-5 rounded-2xl border-l-4 border-[#C59A47]">
                      <p className="text-base text-[#153A26] font-serif italic leading-relaxed">
                        "{articleLangTab === 'es' ? (viewingPost.excerpt?.es || viewingPost.excerpt) : (viewingPost.excerpt?.en || viewingPost.excerpt?.es)}"
                      </p>
                    </div>
                  )}

                  {/* Formatted Markdown Content */}
                  <div className="pt-4 border-t border-[#DFD5C4]/60">
                    <RichArticleContent
                      content={articleLangTab === 'es' ? (viewingPost.content?.es || viewingPost.content) : (viewingPost.content?.en || viewingPost.content?.es)}
                    />
                  </div>

                  {/* Bottom CTA to activate edit mode */}
                  <div className="pt-8 border-t border-[#DFD5C4] flex justify-center">
                    <button
                      type="button"
                      onClick={() => setIsEditMode(true)}
                      className="px-8 py-3 rounded-2xl bg-[#153A26] hover:bg-[#0B1E14] text-[#E3B86C] text-sm font-bold transition-all flex items-center gap-2.5 shadow-md hover:scale-[1.01] cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4 text-[#C59A47]" />
                      <span>Activar Modo Edición de este Artículo</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. MODO EDICIÓN COMPLETO (FULL-SCREEN EDITOR) */}
              {isEditMode && (
                <form onSubmit={handleSaveAndPublish} className="space-y-6 max-w-5xl mx-auto">
                  <div className="bg-white rounded-3xl border border-[#DFD5C4] p-6 sm:p-8 shadow-xs space-y-6">
                    
                    {/* Top Tabs to switch language fields */}
                    <div className="flex items-center justify-between border-b border-[#DFD5C4] pb-4">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-[#0B1E14]">
                          Editor de Contenido
                        </h3>
                        <p className="text-xs text-[#5C6B62]">
                          Modifica los textos, imágenes y formato Markdown de tu publicación.
                        </p>
                      </div>

                      <div className="flex items-center rounded-xl bg-[#FAF7F2] p-1 border border-[#DFD5C4] gap-1">
                        <button
                          type="button"
                          onClick={() => setArticleLangTab('es')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            articleLangTab === 'es' ? 'bg-[#153A26] text-white shadow-xs' : 'text-[#5C6B62] hover:text-[#0B1E14]'
                          }`}
                        >
                          <span>🇲🇽 Español</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setArticleLangTab('en')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            articleLangTab === 'en' ? 'bg-[#153A26] text-white shadow-xs' : 'text-[#5C6B62] hover:text-[#0B1E14]'
                          }`}
                        >
                          <span>🇺🇸 Inglés</span>
                          {checkEnglishCompleteness(articleFormData) ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Traducción lista"></span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-200 text-amber-900" title="Requerido para publicar">
                              Falta
                            </span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* General Metadata Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0B1E14] mb-1.5">
                          Categoría del Artículo
                        </label>
                        <select
                          value={articleFormData.category}
                          onChange={(e) => setArticleFormData({ ...articleFormData, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs font-semibold text-[#0B1E14]"
                        >
                          <option value="legal">⚖️ Certeza Notarial</option>
                          <option value="foreigners">🏖️ Fideicomisos & Extranjeros</option>
                          <option value="investment">📈 Plusvalía & Inversión</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0B1E14] mb-1.5">
                          Tiempo Estimado de Lectura (minutos)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={articleFormData.readTime}
                          onChange={(e) => setArticleFormData({ ...articleFormData, readTime: parseInt(e.target.value) || 1 })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs font-semibold text-[#0B1E14]"
                          required
                        />
                      </div>
                    </div>

                    {/* Cover Image Upload & URL Selector */}
                    <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#DFD5C4] space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <label className="block text-xs font-bold text-[#0B1E14]">
                            Imagen de Portada
                          </label>
                          <p className="text-[11px] text-[#5C6B62]">
                            Sube una imagen desde tu dispositivo o ingresa un enlace web.
                          </p>
                        </div>

                        {/* Toggle Upload vs URL */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#DFD5C4] text-[11px] font-bold">
                          <button
                            type="button"
                            onClick={() => setImageInputMode('upload')}
                            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                              imageInputMode === 'upload' ? 'bg-[#153A26] text-white shadow-xs' : 'text-[#5C6B62] hover:text-[#0B1E14]'
                            }`}
                          >
                            <Upload className="w-3 h-3 text-[#C59A47]" />
                            <span>Subir Archivo</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageInputMode('url')}
                            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                              imageInputMode === 'url' ? 'bg-[#153A26] text-white shadow-xs' : 'text-[#5C6B62] hover:text-[#0B1E14]'
                            }`}
                          >
                            <ExternalLink className="w-3 h-3 text-[#C59A47]" />
                            <span>Ingresar URL</span>
                          </button>
                        </div>
                      </div>

                      {/* Current Image Preview if exists */}
                      {articleFormData.image && (
                        <div
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDropImage}
                          className={`relative rounded-2xl overflow-hidden border bg-stone-100 max-h-60 group shadow-xs transition-all ${
                            isDraggingImage ? 'border-[#153A26] ring-4 ring-[#153A26]/20' : 'border-[#DFD5C4]'
                          }`}
                        >
                          <img
                            src={articleFormData.image}
                            alt="Portada de publicación"
                            className="w-full h-52 object-cover"
                          />
                          {isDraggingImage && (
                            <div className="absolute inset-0 bg-[#153A26]/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-20 animate-fade-in">
                              <ImagePlus className="w-8 h-8 text-[#E3B86C] mb-2 animate-bounce" />
                              <p className="text-xs font-bold">¡Suelta la nueva foto aquí para reemplazarla!</p>
                            </div>
                          )}
                          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[#0B1E14] text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
                            >
                              <Upload className="w-3.5 h-3.5 text-[#C59A47]" />
                              <span>Cambiar Imagen</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setArticleFormData((prev) => ({ ...prev, image: '' }))}
                              className="p-1.5 rounded-xl bg-red-600/90 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer backdrop-blur-xs"
                              title="Eliminar imagen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] text-white font-medium flex items-center gap-1 z-10">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Imagen lista para la publicación</span>
                          </div>
                        </div>
                      )}

                      {/* Upload Dropzone */}
                      {imageInputMode === 'upload' && (
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          {!articleFormData.image && (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              onDragOver={handleDragOver}
                              onDragEnter={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDropImage}
                              className={`border-2 border-dashed p-7 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${
                                isDraggingImage
                                  ? 'border-[#153A26] bg-emerald-50/70 scale-[1.01] ring-4 ring-[#153A26]/10'
                                  : 'border-[#C59A47]/60 hover:border-[#C59A47] bg-white hover:bg-[#FAF7F2]'
                              }`}
                            >
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 transition-all ${
                                isDraggingImage ? 'bg-[#153A26] text-[#E3B86C] scale-110' : 'bg-[#153A26]/10 text-[#153A26] group-hover:scale-110'
                              }`}>
                                <ImagePlus className={`w-6 h-6 ${isDraggingImage ? 'text-[#E3B86C]' : 'text-[#C59A47]'}`} />
                              </div>
                              <p className="text-xs font-bold text-[#0B1E14]">
                                {isCompressingImage
                                  ? 'Optimizando imagen...'
                                  : isDraggingImage
                                  ? '¡Suelta la foto aquí para añadirla!'
                                  : 'Haz clic para subir una foto o arrástrala aquí'}
                              </p>
                              <p className="text-[11px] text-[#5C6B62] mt-1">
                                Formatos JPG, PNG o WEBP. Se optimizará automáticamente.
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* URL Input */}
                      {imageInputMode === 'url' && (
                        <div className="space-y-1.5">
                          <input
                            type="url"
                            value={articleFormData.image}
                            onChange={(e) => setArticleFormData({ ...articleFormData, image: e.target.value })}
                            placeholder="https://images.unsplash.com/... o enlace directo de la imagen"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DFD5C4] text-xs text-[#0B1E14] focus:ring-1 focus:ring-[#C59A47]"
                          />
                        </div>
                      )}

                      {imageUploadError && (
                        <p className="text-xs text-red-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{imageUploadError}</span>
                        </p>
                      )}
                    </div>

                    {/* Bilingual Titles */}
                    {articleLangTab === 'es' ? (
                      <div>
                        <label className="block text-xs font-bold text-[#0B1E14] mb-1.5 flex items-center justify-between">
                          <span>Título del Artículo (Español)</span>
                          <span className="text-[11px] text-[#5C6B62]">Idioma: Español</span>
                        </label>
                        <input
                          type="text"
                          value={articleFormData.titleEs}
                          onChange={(e) => setArticleFormData({ ...articleFormData, titleEs: e.target.value })}
                          placeholder="Ej. Fideicomisos en Nayarit: Cómo comprar inmuebles siendo extranjero..."
                          className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD5C4] text-sm font-serif font-bold text-[#0B1E14]"
                          required
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-[#0B1E14] mb-1.5 flex items-center justify-between">
                          <span>Article Title (English)</span>
                          <span className="text-[11px] text-[#5C6B62]">Language: English</span>
                        </label>
                        <input
                          type="text"
                          value={articleFormData.titleEn}
                          onChange={(e) => setArticleFormData({ ...articleFormData, titleEn: e.target.value })}
                          placeholder="E.g. Bank Trusts in Nayarit: How foreigners acquire real estate..."
                          className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#DFD5C4] text-sm font-serif font-bold text-[#0B1E14]"
                        />
                      </div>
                    )}

                    {/* Bilingual Excerpts */}
                    {articleLangTab === 'es' ? (
                      <div>
                        <label className="block text-xs font-bold text-[#0B1E14] mb-1.5">
                          Extracto / Resumen Introductorio (Español)
                        </label>
                        <textarea
                          rows={3}
                          value={articleFormData.excerptEs}
                          onChange={(e) => setArticleFormData({ ...articleFormData, excerptEs: e.target.value })}
                          placeholder="Breve resumen que atraiga al lector antes de ingresar al artículo..."
                          className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs text-[#0B1E14] resize-y"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-[#0B1E14] mb-1.5">
                          Excerpt / Introductory Summary (English)
                        </label>
                        <textarea
                          rows={3}
                          value={articleFormData.excerptEn}
                          onChange={(e) => setArticleFormData({ ...articleFormData, excerptEn: e.target.value })}
                          placeholder="Brief hook summarizing the core notarial or investment value..."
                          className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs text-[#0B1E14] resize-y"
                        />
                      </div>
                    )}

                    {/* Bilingual Visual Rich Text Editor */}
                    {articleLangTab === 'es' ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-[#0B1E14]">
                            Cuerpo del Artículo (Español)
                          </label>
                          <span className="text-[11px] text-[#5C6B62]">
                            Selecciona texto para aplicar negritas, estilos de títulos o listas.
                          </span>
                        </div>
                        <RichTextEditor
                          value={articleFormData.contentEs}
                          onChange={(newHtml) =>
                            setArticleFormData((prev) => ({ ...prev, contentEs: newHtml }))
                          }
                          placeholder="Redacta el contenido del artículo aquí..."
                          minHeight="380px"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-[#0B1E14]">
                            Article Body (English)
                          </label>
                          <span className="text-[11px] text-[#5C6B62]">
                            Highlight text to apply bold, headings, or lists.
                          </span>
                        </div>
                        <RichTextEditor
                          value={articleFormData.contentEn}
                          onChange={(newHtml) =>
                            setArticleFormData((prev) => ({ ...prev, contentEn: newHtml }))
                          }
                          placeholder="Type the article content here..."
                          minHeight="380px"
                        />
                      </div>
                    )}

                    {/* Bottom Action Footer */}
                    <div className="pt-4 border-t border-[#DFD5C4] flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditMode(false)}
                        className="px-4 py-2.5 rounded-xl border border-[#DFD5C4] text-xs font-bold text-[#5C6B62] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                      >
                        Cancelar Edición
                      </button>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsEditMode(false)}
                          className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#DFD5C4]/50 text-xs font-bold text-[#153A26] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C59A47]" />
                          <span>Previsualizar</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveDraft}
                          className="px-5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5 text-amber-600" />
                          <span>Guardar como Borrador</span>
                        </button>

                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-[#153A26] hover:bg-[#0B1E14] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm hover:shadow cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Guardar y Publicar</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </form>
              )}

              {/* Modal advertencia: Falta versión en inglés */}
              {englishWarningModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#DFD5C4] relative space-y-5 animate-scale-in">
                    <button
                      type="button"
                      onClick={() => setEnglishWarningModal(false)}
                      className="absolute top-5 right-5 p-2 rounded-full text-[#5C6B62] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                      title="Cerrar"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-bold text-[#0B1E14]">
                          Versión en inglés requerida
                        </h3>
                        <p className="text-xs text-[#5C6B62] mt-1 leading-relaxed">
                          Para mantener la calidad y el estándar bilingüe de la web, no es posible <strong>publicar abiertamente</strong> un artículo sin su título y contenido en inglés.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs text-[#0B1E14] space-y-2">
                      <div className="font-bold flex items-center gap-1.5 text-amber-800">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>¿Qué deseas hacer con esta publicación?</span>
                      </div>
                      <p className="text-[#5C6B62] leading-relaxed">
                        Puedes <strong>guardarlo como borrador</strong> para no perder tu avance y publicarlo más tarde, o ir a la pestaña de inglés para redactar la traducción ahora.
                      </p>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all cursor-pointer text-center"
                      >
                        Guardar como Borrador
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEnglishWarningModal(false);
                          setArticleLangTab('en');
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#153A26] hover:bg-[#0B1E14] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer"
                      >
                        <span>Completar Inglés →</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DESTINOS */}
          {activeTab === 'destinations' && (
            <div className="space-y-6 animate-fade-in">
              {destSaved && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Destino actualizado con éxito. Los cambios son visibles en la galería principal.</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest) => {
                  const isEditing = editingDestId === dest.id;
                  return (
                    <div
                      key={dest.id}
                      className="bg-white rounded-3xl overflow-hidden border border-[#DFD5C4] shadow-xs flex flex-col justify-between"
                    >
                      <div className="h-44 overflow-hidden relative group">
                        <img
                          src={isEditing ? destForm.image : dest.image}
                          alt={dest.name.es}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                            {dest.name.es}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-bold text-[#5C6B62] uppercase mb-1">
                                URL de Imagen:
                              </label>
                              <input
                                type="url"
                                value={destForm.image}
                                onChange={(e) => setDestForm({ ...destForm, image: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                                placeholder="https://images.unsplash.com/..."
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-[#5C6B62] uppercase mb-1">
                                Tag Descriptivo (ES):
                              </label>
                              <input
                                type="text"
                                value={destForm.tagEs}
                                onChange={(e) => setDestForm({ ...destForm, tagEs: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-[#5C6B62] uppercase mb-1">
                                Tag Descriptivo (EN):
                              </label>
                              <input
                                type="text"
                                value={destForm.tagEn}
                                onChange={(e) => setDestForm({ ...destForm, tagEn: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                              />
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => handleSaveDest(dest.id)}
                                className="flex-1 py-1.5 rounded-xl bg-[#153A26] text-white text-xs font-bold hover:bg-[#0B1E14]"
                              >
                                Guardar
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingDestId(null)}
                                className="py-1.5 px-3 rounded-xl border border-[#DFD5C4] text-xs font-bold text-[#5C6B62]"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#153A26]/10 text-[#153A26] text-[10px] font-bold mb-2">
                              {dest.tag?.es || dest.tag}
                            </span>
                            <h4 className="font-serif font-bold text-base text-[#0B1E14] mb-1">
                              {dest.name.es} / {dest.name.en}
                            </h4>
                            <p className="text-xs text-[#5C6B62] line-clamp-2">
                              {dest.desc?.es || dest.desc}
                            </p>
                          </div>
                        )}

                        {!isEditing && (
                          <div className="pt-4 mt-4 border-t border-[#DFD5C4]/60 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleStartEditDest(dest)}
                              className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#DFD5C4]/50 text-xs font-bold text-[#153A26] flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#C59A47]" />
                              <span>Cambiar Imagen / Tag</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CONTACTO Y REDES */}
          {activeTab === 'contact' && (
            <div className="max-w-2xl bg-white rounded-3xl border border-[#DFD5C4] p-6 sm:p-8 shadow-xs animate-fade-in space-y-6">
              {contactSaved && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Datos de contacto actualizados correctamente. Ya están en vigor en la web.</span>
                </div>
              )}

              <form onSubmit={handleSaveContact} className="space-y-4">
                {/* Selector de código de país con bandera + 10 dígitos numéricos estrictos */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#0B1E14]">
                      Número de WhatsApp & Teléfono
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          phoneDigits.length === 10
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {phoneDigits.length} / 10 dígitos
                      </span>
                      {phoneDigits.length === 10 && (
                        <span className="text-xs font-bold text-emerald-600">✓ Listo</span>
                      )}
                    </div>
                  </div>

                  <div className="flex rounded-2xl border border-[#DFD5C4] overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-[#C59A47] focus-within:border-[#C59A47] transition-all">
                    {/* Selector de país con bandera */}
                    <div className="relative border-r border-[#DFD5C4] bg-[#FAF7F2] shrink-0">
                      <select
                        value={selectedCountryId}
                        onChange={(e) => setSelectedCountryId(e.target.value)}
                        className="h-full py-3 pl-3.5 pr-8 bg-transparent text-xs font-bold text-[#0B1E14] cursor-pointer appearance-none outline-none"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.flag} +{c.dialCode} ({c.label.split(' ')[0]})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[#5C6B62]">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Input de 10 dígitos estrictos: no 'e', no letras, solo números */}
                    <input
                      type="text"
                      inputMode="numeric"
                      value={phoneDigits}
                      onKeyDown={handlePhoneKeyDown}
                      onChange={handlePhoneChange}
                      onPaste={handlePhonePaste}
                      placeholder="3111187227"
                      maxLength={10}
                      className="flex-1 px-4 py-3 text-sm font-mono tracking-wider text-[#0B1E14] bg-white outline-none placeholder:text-stone-300"
                      required
                    />
                  </div>

                  {phoneError ? (
                    <p className="text-xs font-bold text-red-600 mt-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{phoneError}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-[#5C6B62] mt-1.5">
                      {phoneDigits.length < 10
                        ? `Ingresa los 10 dígitos locales de tu línea telefónica (faltan ${10 - phoneDigits.length}).`
                        : 'Número completo validado con éxito.'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1E14] mb-1">
                    Correo Electrónico de Contacto
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="contacto@nayaritrealestate.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1E14] mb-1">
                    Enlace de Instagram Oficial
                  </label>
                  <input
                    type="url"
                    value={contactForm.instagramUrl}
                    onChange={(e) => setContactForm({ ...contactForm, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1E14] mb-1">
                    Enlace de Facebook Oficial
                  </label>
                  <input
                    type="url"
                    value={contactForm.facebookUrl}
                    onChange={(e) => setContactForm({ ...contactForm, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-[#DFD5C4] flex justify-end">
                  <button
                    type="submit"
                    disabled={phoneDigits.length < 10}
                    className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                      phoneDigits.length < 10
                        ? 'bg-[#153A26]/50 cursor-not-allowed opacity-60'
                        : 'bg-[#153A26] hover:bg-[#0B1E14] cursor-pointer'
                    }`}
                  >
                    <Save className="w-3.5 h-3.5 text-[#C59A47]" />
                    <span>Guardar Cambios de Contacto</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
