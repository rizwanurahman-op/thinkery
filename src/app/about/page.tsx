import type { Metadata } from 'next';
import { AboutContent } from './about-content';

export const metadata: Metadata = {
    title: 'About Us',
    description:
        'Learn about Thinkery — a calm, modern café in Calicut built for thinkers, creators, and professionals. Our vision, story, and values.',
    keywords: [
        'About Thinkery café',
        'Café story Calicut',
        'Modern café Calicut',
        'Quiet café culture',
    ],
};

export default function AboutPage() {
    return <AboutContent />;
}
