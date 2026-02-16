import type { Metadata } from 'next';
import { MenuContent } from './menu-content';

export const metadata: Metadata = {
    title: 'Café Menu in Calicut',
    description:
        'Explore Thinkery\'s thoughtfully curated café menu featuring premium coffee, signature tea, refreshing beverages, wraps, burgers, loaded fries, and light comfort food in Calicut.',
    keywords: [
        'Café menu Calicut',
        'Coffee shop menu Calicut',
        'Best coffee in Calicut',
        'Café food Calicut',
        'Beverages Calicut café',
    ],
};

export default function MenuPage() {
    return <MenuContent />;
}
