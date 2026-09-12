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
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

function MainContent() {
  const { currentView, selectedArticle } = useBlog();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A211D]">
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
