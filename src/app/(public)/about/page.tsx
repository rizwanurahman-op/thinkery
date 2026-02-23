import type { Metadata } from 'next';
import { AboutContent } from './about-content';
import { readSettings } from '@/lib/settings-store';

export const revalidate = 60;

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
    // ✅ Canonical URL for this page
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

export default function AboutPage() {
    const { pageImages } = readSettings();
    return <AboutContent mainImage={pageImages.aboutPageMain} />;
}

