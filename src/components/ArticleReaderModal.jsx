import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBlog, RichArticleContent } from '../context/BlogContext';
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react';

export const ArticleReaderModal = () => {
  const { lang, t } = useLanguage();
  const { selectedArticle, setSelectedArticle, setCurrentView, posts, openArticle, getCategoryBadge } = useBlog();

  if (!selectedArticle) return null;

  const handleBackToBlog = () => {
    setSelectedArticle(null);
    setCurrentView('blog');
    window.location.hash = 'blog-page';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Up to 30 posts in history
  const historyPosts = posts.slice(0, 30);
  const currentIndex = historyPosts.findIndex((p) => p.id === selectedArticle.id);

  // Previous and Next posts in history
  const prevPost = currentIndex > 0 ? historyPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < historyPosts.length - 1 ? historyPosts[currentIndex + 1] : null;

  const navigateToPrev = () => {
    if (prevPost) {
      openArticle(prevPost);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToNext = () => {
    if (nextPost) {
      openArticle(nextPost);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full pt-20 sm:pt-24 pb-20 animate-fade-in">
      <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Layout: Left (Clean empty space), Center (Main Content), Right (History up to 30 posts) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
          
          {/* Column 1: Clean empty space on the left */}
          <div className="hidden lg:block lg:col-span-2 xl:col-span-2" aria-hidden="true"></div>

          {/* Column 2: Center main article content */}
          <article className="lg:col-span-7 xl:col-span-7 w-full max-w-4xl mx-auto">
            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getCategoryBadge(selectedArticle.category, t).color}`}>
                {getCategoryBadge(selectedArticle.category, t).label}
              </span>
              <span className="text-xs font-semibold text-[#5C6B62] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C59A47]" />
                {selectedArticle.readTime} {t.blog.minRead}
              </span>
              <span className="text-xs text-[#5C6B62]">•</span>
              <span className="text-xs font-semibold text-[#5C6B62] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C59A47]" />
                {selectedArticle.date}
              </span>
            </div>

            {/* Article Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1E14] tracking-tight leading-[1.15] mb-6">
              {selectedArticle.title[lang] || selectedArticle.title.es}
            </h1>

            {/* Author bar */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#DFD5C4] mb-8 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#153A26] border border-[#C59A47] overflow-hidden shrink-0 flex items-center justify-center text-white">
                <img src="/assets/logo-emblem.jpg" alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0B1E14]">
                  {selectedArticle.author}
                </p>
                <p className="text-[11px] text-[#5C6B62]">
                  {lang === 'es' ? 'Revisión Notarial y Seguridad Jurídica Inmobiliaria' : 'Notarial Review & Real Estate Legal Security'}
                </p>
              </div>
            </div>

            {/* Large Cover Image */}
            <div className="rounded-3xl overflow-hidden shadow-xl mb-8 h-72 sm:h-96 md:h-[440px] w-full">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title[lang] || selectedArticle.title.es}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Highlighted Excerpt Quote */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border-l-4 border-[#C59A47] shadow-sm mb-8">
              <p className="text-base sm:text-lg text-[#153A26] font-serif italic font-medium leading-relaxed">
                "{selectedArticle.excerpt[lang] || selectedArticle.excerpt.es}"
              </p>
            </div>

            {/* Rich Formatted Markdown Content */}
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#DFD5C4] shadow-luxury mb-10">
              <RichArticleContent
                content={selectedArticle.content[lang] || selectedArticle.content.es}
              />
            </div>

            {/* Bottom Pagination: Advance & Retreat between posts */}
            <div className="pt-6 border-t border-[#DFD5C4]/70">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Previous Post */}
                {prevPost ? (
                  <button
                    type="button"
                    onClick={navigateToPrev}
                    className="flex items-center gap-3.5 p-4 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#DFD5C4] hover:border-[#C59A47] text-left transition-all shadow-sm hover:shadow group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#153A26] text-[#E3B86C] flex items-center justify-center shrink-0 group-hover:-translate-x-1 transition-transform">
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-[#5C6B62] uppercase tracking-wider block">
                        {lang === 'es' ? '← Anterior' : '← Previous'}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-[#0B1E14] group-hover:text-[#153A26] line-clamp-1 transition-colors">
                        {prevPost.title[lang] || prevPost.title.es}
                      </p>
                    </div>
                  </button>
                ) : (
                  <div className="hidden sm:block"></div>
                )}

                {/* Next Post */}
                {nextPost ? (
                  <button
                    type="button"
                    onClick={navigateToNext}
                    className="flex items-center justify-end gap-3.5 p-4 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#DFD5C4] hover:border-[#C59A47] text-right transition-all shadow-sm hover:shadow group cursor-pointer sm:col-start-2"
                  >
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-[#5C6B62] uppercase tracking-wider block">
                        {lang === 'es' ? 'Siguiente →' : 'Next →'}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-[#0B1E14] group-hover:text-[#153A26] line-clamp-1 transition-colors">
                        {nextPost.title[lang] || nextPost.title.es}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#153A26] text-[#E3B86C] flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                ) : null}
              </div>
            </div>
          </article>

          {/* Column 3: Right sidebar with up to 30 posts history and "Ver todo" action */}
          <aside className="lg:col-span-3 xl:col-span-3 w-full">
            <div className="sticky top-24 bg-white rounded-3xl border border-[#DFD5C4] p-5 shadow-sm">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#DFD5C4]/70">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0B1E14]">
                    {lang === 'es' ? 'Historial de Artículos' : 'Article History'}
                  </h3>
                  <span className="text-[11px] text-[#5C6B62]">
                    {Math.min(posts.length, 30)} {lang === 'es' ? 'publicaciones' : 'posts'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleBackToBlog}
                  className="text-xs font-bold text-[#153A26] hover:text-[#C59A47] flex items-center gap-1 transition-colors group cursor-pointer"
                  title={lang === 'es' ? 'Ver todos los artículos en la pantalla de blog' : 'View all articles in blog page'}
                >
                  <span>{lang === 'es' ? 'Ver todo' : 'View all'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C59A47] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Scrollable list of max 30 posts */}
              <div className="space-y-2.5 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
                {historyPosts.map((post) => {
                  const isCurrent = post.id === selectedArticle.id;
                  return (
                    <div
                      key={post.id}
                      onClick={() => {
                        if (!isCurrent) {
                          openArticle(post);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`p-2.5 rounded-2xl border transition-all flex gap-3 items-start group ${
                        isCurrent
                          ? 'bg-[#153A26]/5 border-[#153A26]/30 shadow-xs cursor-default'
                          : 'bg-white hover:bg-[#FAF7F2] border-[#DFD5C4]/60 hover:border-[#C59A47] shadow-xs cursor-pointer'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#DFD5C4]/60 relative bg-stone-100">
                        <img
                          src={post.image}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] text-[#5C6B62] font-semibold flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5 text-[#C59A47]" />
                            {post.date}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#153A26] text-[#E3B86C]">
                              {lang === 'es' ? 'Actual' : 'Current'}
                            </span>
                          )}
                        </div>
                        <h4
                          className={`text-xs font-bold line-clamp-2 leading-snug transition-colors ${
                            isCurrent ? 'text-[#153A26]' : 'text-[#0B1E14] group-hover:text-[#153A26]'
                          }`}
                        >
                          {post.title[lang] || post.title.es}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom "Ver todos los artículos" button */}
              <div className="pt-4 mt-3.5 border-t border-[#DFD5C4]/70">
                <button
                  type="button"
                  onClick={handleBackToBlog}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#153A26] hover:bg-[#0B1E14] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow cursor-pointer"
                >
                  <span>{t.blog.viewAll}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C59A47]" />
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};
