import type { Metadata } from 'next';
import { HeroSection } from './_sections/hero-section';
import { AboutSection } from './_sections/about-section';
import { DifferenceSection } from './_sections/difference-section';
import { OfferingsSection } from './_sections/offerings-section';
import { GallerySection } from './_sections/gallery-section';
import { AudienceSection } from './_sections/audience-section';
import { getPublicMenuData } from '@/lib/menu-store';
import { readSettingsLive } from '@/lib/settings-store';

// No ISR caching — always reads live from Redis so admin changes appear immediately
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [menuData, settings] = await Promise.all([
    getPublicMenuData(),
    readSettingsLive(),
  ]);

  const { categories, items } = menuData;
  const { showPrices, offeringsSection, galleryImages, pageImages } = settings;

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
