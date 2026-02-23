import { NavItem, Feature, ContactInfo } from '@/types';

export const NAV_ITEMS: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Menu', href: '/menu' },
    { label: 'Work & Meet', href: '/work-and-meet' },
    { label: 'Contact', href: '/contact' },
];

export const FEATURES: Feature[] = [
    {
        icon: '🤫',
        title: 'Quiet Environment',
        description: 'A productivity-friendly space free from the noise and chaos of typical cafés.',
    },
    {
        icon: '🪑',
        title: 'Comfortable Seating',
        description: 'Thoughtfully designed seating for work sessions, discussions, and relaxed stays.',
    },
    {
        icon: '📶',
        title: 'High-Speed WiFi',
        description: 'Reliable, fast internet connectivity for all your work and streaming needs.',
    },
    {
        icon: '🌿',
        title: 'Green Interiors',
        description: 'Minimal, nature-inspired interior design that calms the mind and sparks creativity.',
    },
    {
        icon: '⏰',
        title: 'Stay Longer',
        description: 'We encourage longer, relaxed stays. No rush, no pressure — just think.',
    },
    {
        icon: '🔌',
        title: 'Power Sockets',
        description: 'Conveniently placed charging points so your devices never run out of power.',
    },
];

export const CONTACT_INFO: ContactInfo = {
    address: 'Thinkery Café, Calicut, Kerala, India',
    phone: '+91 XXXXX XXXXX',
    email: 'hello@thinkerycafe.in',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.174!2d75.780!3d11.258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDE1JzI4LjgiTiA3NcKwNDYnNDguMCJF!5e0!3m2!1sen!2sin!4v1234567890',
    openHours: {
        days: 'Monday – Sunday',
        time: '9:00 AM – 10:00 PM',
    },
};

export const AUDIENCE = [
    {
        icon: '💼',
        title: 'Corporate Professionals',
        description: 'A quiet alternative to office cafeterias for meetings and focused work.',
    },
    {
        icon: '🏠',
        title: 'Remote Workers',
        description: 'Reliable WiFi, power outlets, and a calm ambiance — your ideal remote office.',
    },
    {
        icon: '🤝',
        title: 'Small Business Meetings',
        description: 'An informal yet professional setting for productive discussions.',
    },
    {
        icon: '📚',
        title: 'Students & Planners',
        description: 'A focused space for studying, planning, and creative work.',
    },
    {
        icon: '🧘',
        title: 'Individuals Seeking Calm',
        description: 'Step away from the noise. Find your moment of peace over a cup of coffee.',
    },
];

export const WORK_FEATURES = [
    {
        icon: '🪑',
        title: 'Comfortable Seating',
        description: 'Ergonomic chairs and tables designed for long work sessions.',
    },
    {
        icon: '🔌',
        title: 'Power Sockets',
        description: 'Conveniently placed charging points at every seat.',
    },
    {
        icon: '📶',
        title: 'High-Speed WiFi',
        description: 'Fast, reliable internet for video calls, uploads, and browsing.',
    },
    {
        icon: '🤫',
        title: 'Calm Atmosphere',
        description: 'A quiet, distraction-free environment that boosts productivity.',
    },
];

export const WORK_AUDIENCE = [
    { icon: '💻', label: 'Remote Work' },
    { icon: '✍️', label: 'Freelancers' },
    { icon: '🚀', label: 'Startup Meetings' },
    { icon: '🤝', label: 'Small Discussions' },
];
