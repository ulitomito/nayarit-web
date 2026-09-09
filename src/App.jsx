import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DestinationsGallery } from './components/DestinationsGallery';
import { AppreciationSimulator } from './components/AppreciationSimulator';
import { BentoServices } from './components/BentoServices';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

function MainContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A211D]">
      <Header />
      <main className="flex-1">
        <Hero />
        <DestinationsGallery />
        <AppreciationSimulator />
        <BentoServices />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  );
}
