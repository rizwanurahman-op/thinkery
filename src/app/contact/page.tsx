import type { Metadata } from 'next';
import { ContactContent } from './contact-content';

export const metadata: Metadata = {
    title: 'Contact & Visit Us',
    description:
        'Visit Thinkery Café in Calicut. Find our location, open hours, phone number, and get directions. Open Monday to Sunday.',
    keywords: [
        'Thinkery café location',
        'Café in Calicut address',
        'Coffee shop near me Calicut',
        'Thinkery contact',
        'Café directions Calicut',
    ],
};

export default function ContactPage() {
    return <ContactContent />;
}
