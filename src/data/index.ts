import { NavItem, MenuItem, Feature, ContactInfo } from '@/types';

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

export const MENU_ITEMS: MenuItem[] = [
    // Hot Beverages
    {
        id: 'hb-1',
        name: 'Signature Chai',
        description: 'Our house-blend tea with handpicked spices and fresh milk',
        price: '120',
        category: 'hot-beverages',
        badge: 'Signature',
        image: '/images/menu/chai-cup.jpg',
    },
    {
        id: 'hb-2',
        name: 'Premium Espresso',
        description: 'Rich, aromatic single-origin espresso shot',
        price: '140',
        category: 'hot-beverages',
        image: '/images/menu/espresso.jpg',
    },
    {
        id: 'hb-3',
        name: 'Cappuccino',
        description: 'Velvety steamed milk with a perfect espresso base',
        price: '160',
        category: 'hot-beverages',
        image: '/images/menu/cappuccino.jpg',
    },
    {
        id: 'hb-4',
        name: 'Café Latte',
        description: 'Smooth espresso blended with creamy steamed milk',
        price: '180',
        category: 'hot-beverages',
        image: '/images/menu/latte-art.jpg',
    },
    {
        id: 'hb-5',
        name: 'Hot Chocolate',
        description: 'Rich Belgian cocoa with steamed milk and cream',
        price: '210',
        category: 'hot-beverages',
        image: '/images/menu/hot-chocolate.jpg',
    },
    {
        id: 'hb-6',
        name: 'Green Tea',
        description: 'Premium Japanese green tea, light and refreshing',
        price: '110',
        category: 'hot-beverages',
        image: '/images/menu/green-tea.jpg',
    },
    // Cold Beverages
    {
        id: 'cb-1',
        name: 'Iced Americano',
        description: 'Double shot espresso over ice with chilled water',
        price: '150',
        category: 'cold-beverages',
        badge: 'Popular',
        image: '/images/menu/americano.jpg',
    },
    {
        id: 'cb-2',
        name: 'Fresh Fruit Juices',
        description: 'Seasonal fresh-pressed juices — orange, watermelon, or mixed fruit',
        price: '160',
        category: 'cold-beverages',
        image: '/images/menu/juice.jpg',
    },
    {
        id: 'cb-3',
        name: 'Classic Milkshake',
        description: 'Thick, creamy milkshakes in chocolate, vanilla, or strawberry',
        price: '190',
        category: 'cold-beverages',
        image: '/images/menu/milkshake.jpg',
    },
    {
        id: 'cb-4',
        name: 'Cold Brew',
        description: 'Slow-steeped for 18 hours for a smooth, bold flavor',
        price: '180',
        category: 'cold-beverages',
        badge: 'New',
        image: '/images/menu/cold-brew-real.jpg',
    },
    {
        id: 'cb-5',
        name: 'Iced Matcha Latte',
        description: 'Ceremonial grade matcha whisked with chilled oat milk',
        price: '220',
        category: 'cold-beverages',
        badge: 'New',
        image: '/images/menu/matcha-iced.jpg',
    },
    {
        id: 'cb-6',
        name: 'Mint Lemonade',
        description: 'Sparkling lemonade with fresh mint and a hint of ginger',
        price: '140',
        category: 'cold-beverages',
        image: '/images/menu/lemonade.jpg',
    },
    // Snacks
    {
        id: 'sn-1',
        name: 'Classic Chicken Wrap',
        description: 'Grilled chicken, fresh greens, and our house sauce in a soft tortilla',
        price: '180',
        category: 'snacks',
        badge: 'Best Seller',
        image: '/images/menu/chicken-wrap.jpg',
    },
    {
        id: 'sn-2',
        name: 'Smash Burger',
        description: 'Double smashed patties with melted cheese and pickles',
        price: '240',
        category: 'snacks',
        image: '/images/menu/burger.jpg',
    },
    {
        id: 'sn-3',
        name: 'Loaded Fries',
        description: 'Crispy fries topped with cheese sauce, jalapeños, and herbs',
        price: '160',
        category: 'snacks',
        image: '/images/menu/fries.jpg',
    },
    {
        id: 'sn-4',
        name: 'Crispy Cutlets',
        description: 'Golden-fried vegetable or chicken cutlets with dipping sauce',
        price: '120',
        category: 'snacks',
        image: '/images/menu/cutlets.jpg',
    },
    {
        id: 'sn-5',
        name: 'Paneer Wrap',
        description: 'Spiced paneer with crunchy veggies in a whole wheat wrap',
        price: '170',
        category: 'snacks',
        image: '/images/menu/paneer-wrap.jpg',
    },
    {
        id: 'sn-6',
        name: 'Club Sandwich',
        description: 'Triple-layered with grilled chicken, egg, lettuce, and toast',
        price: '220',
        category: 'snacks',
        image: '/images/menu/sandwich.jpg',
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
