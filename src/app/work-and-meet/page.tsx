import type { Metadata } from 'next';
import { WorkAndMeetContent } from './work-content';

export const metadata: Metadata = {
    title: 'Work-Friendly Café in Calicut',
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
    ],
};

export default function WorkAndMeetPage() {
    return <WorkAndMeetContent />;
}
