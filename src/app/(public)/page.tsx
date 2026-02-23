// ✅ SERVER COMPONENT — No 'use client' here
// This file is server-rendered so Google can index all content
import { HeroSection } from './_sections/hero-section';
import { AboutSection } from './_sections/about-section';
import { DifferenceSection } from './_sections/difference-section';
import { OfferingsSection } from './_sections/offerings-section';
import { GallerySection } from './_sections/gallery-section';
import { AudienceSection } from './_sections/audience-section';
import { getPublicMenuData } from '@/lib/menu-store';
import { readSettings } from '@/lib/settings-store';

// ISR: revalidate every 60 seconds so any admin menu change shows up quickly
export const revalidate = 60;

export default function HomePage() {
  const { categories, items } = getPublicMenuData();
  const { showPrices, offeringsSection, galleryImages, pageImages } = readSettings();

  return (
    <>
      <HeroSection heroImage={pageImages.heroMain} />
      <AboutSection bigImage={pageImages.aboutBig} smallImage={pageImages.aboutSmall} />
      <DifferenceSection />
      <OfferingsSection categories={categories} items={items} showPrices={showPrices} offeringsSection={offeringsSection} />
      <GallerySection galleryImages={galleryImages} />
      <AudienceSection />
    </>
  );
}


