import type { Metadata } from 'next';
import { MenuContent } from './menu-content';

export const metadata: Metadata = {
    title: 'Café Menu',
    description:
        'Explore Thinkery\'s thoughtfully curated café menu featuring premium coffee, signature tea, refreshing beverages, wraps, burgers, loaded fries, and light comfort food in Calicut, Kerala.',
    keywords: [
        'Café menu Calicut',
        'Coffee shop menu Calicut',
        'Best coffee in Calicut',
        'Café food Calicut',
        'Beverages Calicut café',
        'Thinkery menu',
        'Café snacks Calicut',
    ],
    // ✅ Canonical URL for this page
    alternates: {
        canonical: 'https://thinkerycafe.in/menu',
    },
    openGraph: {
        title: 'Café Menu | Thinkery Café, Calicut',
        description: 'Premium coffee, signature teas, fresh juices, wraps, burgers and more — explore the full Thinkery Café menu.',
        url: 'https://thinkerycafe.in/menu',
        images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Thinkery Café Menu' }],
    },
};

export default function MenuPage() {
    return <MenuContent />;
}
