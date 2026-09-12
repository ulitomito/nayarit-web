import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBlog } from '../context/BlogContext';
import { 
  Search, 
  X, 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  PlusCircle, 
  Edit3, 
  Trash2
} from 'lucide-react';

export const BlogPage = () => {
  const { lang, t } = useLanguage();
  const {
    posts,
    openArticle,
    getCategoryBadge,
    isAdmin,
    setIsAdmin,
    setShowPostModal,
    setEditingPost,
    deletePost,
  } = useBlog();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: t.blog.allCategories },
    { id: 'legal', label: t.blog.catLegal },
    { id: 'foreigners', label: t.blog.catForeigners },
    { id: 'investment', label: t.blog.catInvestment },
  ];

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCat = selectedCategory === 'all' || post.category === selectedCategory;
      const title = (post.title[lang] || post.title.es).toLowerCase();
      const excerpt = (post.excerpt[lang] || post.excerpt.es).toLowerCase();
      const content = (post.content[lang] || post.content.es).toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || title.includes(q) || excerpt.includes(q) || content.includes(q);
      return matchCat && matchSearch;
    });
  }, [posts, selectedCategory, searchQuery, lang]);

  return (
    <div className="w-full">
      {/* Editorial Hero Banner with top padding for fixed global Header */}
      <section className="pt-28 sm:pt-36 pb-14 bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#FAF7F2] border-b border-[#DFD5C4] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#153A26]/10 text-[#153A26] text-xs font-bold uppercase tracking-wider mb-4 border border-[#153A26]/15">
            <ShieldCheck className="w-4 h-4 text-[#C59A47]" />
            <span>{lang === 'es' ? 'Editorial Notarial & Seguridad Jurídica' : 'Notarial Editorial & Legal Security'}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#0B1E14] tracking-tight mb-4">
            {t.blog.blogHeroTitle}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#5C6B62] leading-relaxed mb-8">
            {t.blog.blogHeroSubtitle}
          </p>

          {/* Live Search & Filter Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C6B62]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.blog.searchPlaceholder}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-[#DFD5C4] text-sm text-[#0B1E14] placeholder-[#5C6B62]/60 focus:ring-2 focus:ring-[#C59A47] focus:outline-none shadow-md transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#5C6B62] hover:text-[#0B1E14]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count =
                  cat.id === 'all'
                    ? posts.length
                    : posts.filter((p) => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#153A26] text-white shadow-md'
                        : 'bg-white text-[#5C6B62] hover:text-[#0B1E14] border border-[#DFD5C4] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                        isActive ? 'bg-[#C59A47] text-[#0B1E14]' : 'bg-[#FAF7F2] text-[#5C6B62]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* All Posts Grid Section */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#DFD5C4]/60">
            <p className="text-xs sm:text-sm font-semibold text-[#5C6B62]">
              {filteredPosts.length} {t.blog.showingArticles}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-[#153A26] hover:underline"
              >
                {t.blog.clearSearch}
              </button>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#DFD5C4] p-8 max-w-lg mx-auto shadow-sm">
              <BookOpen className="w-12 h-12 text-[#C59A47] mx-auto mb-3 opacity-60" />
              <h3 className="font-serif text-xl font-bold text-[#0B1E14] mb-1">
                {t.blog.noResults}
              </h3>
              <p className="text-xs text-[#5C6B62] mb-4">
                {lang === 'es'
                  ? 'Intenta buscando con palabras clave como "fideicomiso", "predial", o "notaría".'
                  : 'Try searching with keywords like "trust", "taxes", or "notary".'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#153A26] text-white text-xs font-bold"
              >
                {t.blog.clearSearch}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPosts.map((post) => {
                const badge = getCategoryBadge(post.category, t);
                return (
                  <article
                    key={post.id}
                    onClick={() => openArticle(post)}
                    className="bg-white rounded-3xl overflow-hidden border border-[#DFD5C4] shadow-sm hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                  >
                    {/* Image Cover */}
                    <div className="h-56 overflow-hidden relative">
                      <img
                        src={post.image}
                        alt={post.title[lang] || post.title.es}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                      {/* Category Pill */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>

                      {/* Reading Time */}
                      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                        <Clock className="w-3 h-3 text-[#C59A47]" />
                        <span>{post.readTime} {t.blog.minRead}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#5C6B62] mb-3">
                          <Calendar className="w-3.5 h-3.5 text-[#C59A47]" />
                          <span>{post.date}</span>
                        </div>

                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B1E14] group-hover:text-[#153A26] transition-colors line-clamp-2 leading-snug mb-3">
                          {post.title[lang] || post.title.es}
                        </h3>

                        <p className="text-sm text-[#5C6B62] line-clamp-3 leading-relaxed">
                          {post.excerpt[lang] || post.excerpt.es}
                        </p>
                      </div>

                      {/* Card Footer & Admin Actions */}
                      <div className="pt-5 mt-6 border-t border-[#DFD5C4]/70 flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#153A26] group-hover:text-[#C59A47] transition-colors">
                          <span>{t.blog.readMore}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>

                        {isAdmin && (
                          <div
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPost(post);
                                setShowPostModal(true);
                              }}
                              className="p-1.5 rounded-lg text-[#5C6B62] hover:text-[#153A26] hover:bg-[#FAF7F2] transition-colors"
                              title="Editar"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deletePost(post.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
