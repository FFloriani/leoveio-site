'use client';

import { useState } from 'react';
import HeroBanner from '@/components/HeroBanner';
import AboutSection from '@/components/AboutSection';
import SponsorsSection from '@/components/SponsorsSection';
import SocialFeed from '@/components/SocialFeed';
import FloatingContact from '@/components/FloatingContact';
import ContactModal from '@/components/ContactModal';

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <HeroBanner />
      <AboutSection />
      <SponsorsSection onOpenContact={() => setIsContactModalOpen(true)} />
      <SocialFeed />
      <FloatingContact />
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
}
