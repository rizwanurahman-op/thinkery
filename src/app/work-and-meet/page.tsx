import type { Metadata } from 'next';
import { WorkAndMeetContent } from './work-content';

export const metadata: Metadata = {
    title: 'Work & Meet — Remote Work Café in Calicut',
    description:
        'Looking for a peaceful café to work in Calicut? Thinkery offers comfortable seating, power sockets, high-speed WiFi, and a calm atmosphere — ideal for remote work, freelancers, startup meetings, and small discussions.',
    keywords: [
        'Work-friendly café in Calicut',
        'Remote work café Calicut',
        'Freelancer café Calicut',
        'Startup meeting space Calicut',
        'Study café in Calicut',
        'Quiet café for meetings',
        'Best café for remote work in Calicut',
        'Meeting café in Calicut',
        'Coworking café Calicut',
        'Work café Kozhikode',
    ],
    // ✅ Canonical URL for this page
    alternates: {
        canonical: 'https://thinkerycafe.in/work-and-meet',
    },
    openGraph: {
        title: 'Work & Meet — Remote Work Café in Calicut | Thinkery',
        description: 'High-speed WiFi, power outlets, quiet environment — the perfect café for remote work and meetings in Calicut, Kerala.',
        url: 'https://thinkerycafe.in/work-and-meet',
        images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Thinkery Café Work Space in Calicut' }],
    },
};

export default function WorkAndMeetPage() {
    return <WorkAndMeetContent />;
}
