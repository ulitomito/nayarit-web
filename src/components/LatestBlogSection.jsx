import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBlog } from '../context/BlogContext';
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles, PlusCircle, Edit3, Trash2 } from 'lucide-react';

export const LatestBlogSection = () => {
  const { lang, t } = useLanguage();
  const {
    posts,
    openArticle,
    navigateToBlog,
    getCategoryBadge,
    isAdmin,
    setIsAdmin,
    setShowPostModal,
    setEditingPost,
    deletePost,
  } = useBlog();

  // Show only the 3 latest posts on the landing page
  const latestPosts = posts.slice(0, 3);

  return (
    <section id="blog" className="py-20 sm:py-24 bg-[#FAF7F2] border-t border-[#DFD5C4] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#153A26]/10 text-[#153A26] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C59A47]" />
              <span>{t.blog.latestBadge}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1E14] tracking-tight leading-tight">
              {t.blog.latestTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#5C6B62] mt-2 leading-relaxed">
              {t.blog.latestSubtitle}
            </p>
          </div>

          {/* Quick Access to Dedicated Blog Page */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={navigateToBlog}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white hover:bg-[#EFE7DA] border border-[#C59A47]/60 hover:border-[#C59A47] text-[#153A26] text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#C59A47]" />
              <span>{t.blog.exploreAllBtn}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#153A26]/10 text-[11px] font-extrabold text-[#153A26]">
                {posts.length}
              </span>
              <ArrowRight className="w-4 h-4 text-[#C59A47] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 3 Latest Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {latestPosts.map((post) => {
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

                {/* Article Card Content */}
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
      </div>
    </section>
  );
};
