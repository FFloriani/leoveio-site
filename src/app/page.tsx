import HeroBanner from '@/components/HeroBanner';
import SponsorsSection from '@/components/SponsorsSection';
import SocialFeed from '@/components/SocialFeed';
import FloatingContact from '@/components/FloatingContact';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <SponsorsSection />
      <SocialFeed />
      <FloatingContact />
    </>
  );
}
