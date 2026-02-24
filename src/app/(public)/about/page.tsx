import type { Metadata } from 'next';
import { AboutContent } from './about-content';
import { readSettingsLive } from '@/lib/settings-store';

// No ISR caching — always reads live from Redis so admin changes appear immediately
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'About Us — Our Story & Vision',
    description:
        'Learn about Thinkery — a calm, modern café in Calicut built for thinkers, creators, and professionals. Our vision, story, and values.',
    keywords: [
        'About Thinkery café',
        'Café story Calicut',
        'Modern café Calicut',
        'Quiet café culture',
        'Thinkery vision',
        'Café founders Calicut',
    ],
    alternates: {
        canonical: 'https://thinkerycafe.in/about',
    },
    openGraph: {
        type: 'website',
        title: 'About Thinkery Café — Our Story & Vision',
        description: 'Built for thinkers, creators, and professionals. Discover the story behind Thinkery Café in Calicut, Kerala.',
        url: 'https://thinkerycafe.in/about',
        images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'About Thinkery Café — Calicut' }],
    },
};

export default async function AboutPage() {
    const { pageImages } = await readSettingsLive();
    return <AboutContent mainImage={pageImages.aboutPageMain} />;
}
