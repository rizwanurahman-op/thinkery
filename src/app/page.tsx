// ✅ SERVER COMPONENT — No 'use client' here
// This file is server-rendered so Google can index all content
import { HeroSection } from './_sections/hero-section';
import { AboutSection } from './_sections/about-section';
import { DifferenceSection } from './_sections/difference-section';
import { OfferingsSection } from './_sections/offerings-section';
import { GallerySection } from './_sections/gallery-section';
import { AudienceSection } from './_sections/audience-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <DifferenceSection />
      <OfferingsSection />
      <GallerySection />
      <AudienceSection />
    </>
  );
}
