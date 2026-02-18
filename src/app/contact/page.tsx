import type { Metadata } from 'next';
import { ContactContent } from './contact-content';

export const metadata: Metadata = {
    title: 'Contact & Visit Us',
    description:
        'Visit Thinkery Café in Calicut, Kerala. Find our location, open hours, and get directions. Open Monday to Sunday, 9 AM – 10 PM.',
    keywords: [
        'Thinkery café location',
        'Café in Calicut address',
        'Coffee shop near me Calicut',
        'Thinkery contact',
        'Café directions Calicut',
        'Café Kozhikode location',
    ],
    // ✅ Canonical URL for this page
    alternates: {
        canonical: 'https://thinkerycafe.in/contact',
    },
    openGraph: {
        title: 'Contact & Visit Us | Thinkery Café, Calicut',
        description: 'Find Thinkery Café in Calicut, Kerala. Open 7 days a week, 9 AM to 10 PM.',
        url: 'https://thinkerycafe.in/contact',
        images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Thinkery Café Location in Calicut' }],
    },
};

export default function ContactPage() {
    return <ContactContent />;
}
