'use client';

import { useState } from 'react';
import HeroBanner from '@/components/HeroBanner';
import AboutSection from '@/components/AboutSection';
import SponsorsSection from '@/components/SponsorsSection';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';
import ContactModal from '@/components/ContactModal';

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <HeroBanner />
      <AboutSection />
      <SponsorsSection onOpenContact={() => setIsContactModalOpen(true)} />
      <Footer />
      <FloatingContact />
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
}
