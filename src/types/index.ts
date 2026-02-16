export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price?: string;
    category: MenuCategory;
    image?: string;
    badge?: string;
}

export type MenuCategory = 'hot-beverages' | 'cold-beverages' | 'snacks';

export interface NavItem {
    label: string;
    href: string;
}

export interface Feature {
    icon: string;
    title: string;
    description: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    avatar?: string;
}

export interface ContactInfo {
    address: string;
    phone: string;
    email: string;
    mapUrl: string;
    openHours: {
        days: string;
        time: string;
    };
}

export interface SEOProps {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
}
