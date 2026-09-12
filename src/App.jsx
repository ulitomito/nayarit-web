import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { BlogProvider, useBlog } from './context/BlogContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DestinationsGallery } from './components/DestinationsGallery';
import { AppreciationSimulator } from './components/AppreciationSimulator';
import { BentoServices } from './components/BentoServices';
import { LatestBlogSection } from './components/LatestBlogSection';
import { BlogPage } from './components/BlogPage';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { AdminModals } from './components/AdminModals';
import { AdminDashboard } from './components/AdminDashboard';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

function MainContent() {
  const { currentView, selectedArticle, isAdmin, navigateToAdmin, handleAdminLogout } = useBlog();

  // If in admin view and authenticated, render full-screen Admin Dashboard
  if (isAdmin && currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#07130D]">
        <AdminDashboard />
        <AdminModals />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A211D]">
      {/* Discreet Admin Top Bar when logged in as admin browsing the public site */}
      {isAdmin && (
        <div className="bg-[#153A26] text-white text-xs font-semibold py-2 px-4 sm:px-6 flex items-center justify-between z-50 border-b border-[#C59A47]/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sesión de Administrador Activa</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={navigateToAdmin}
              className="bg-[#C59A47] hover:bg-[#B38938] text-[#0B1E14] px-3.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              Ir al Panel Admin →
            </button>
            <button
              onClick={handleAdminLogout}
              className="text-white/70 hover:text-white text-xs underline cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      <Header />
      <main className="flex-1">
        {selectedArticle ? (
          <ArticleReaderModal />
        ) : currentView === 'blog' ? (
          <BlogPage />
        ) : (
          <>
            <Hero />
            <DestinationsGallery />
            <AppreciationSimulator />
            <BentoServices />
            <LatestBlogSection />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      <FloatingWhatsApp />
      <AdminModals />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BlogProvider>
        <MainContent />
      </BlogProvider>
    </LanguageProvider>
  );
}
