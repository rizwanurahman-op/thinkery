// ─── Public Types ───

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    shortDesc?: string;    // Short accent shown on homepage offerings section, e.g. "Loose Leaf • Blends"
    price?: string;
    categoryId: string;
    image?: string;        // Cloudinary secure URL (https://res.cloudinary.com/...)
    imagePublicId?: string; // Cloudinary public ID — needed for deletion
    badge?: string;
    isActive: boolean;
    sortOrder: number;
}

export interface MenuCategoryItem {
    id: string;
    label: string;
    icon: string;
    sortOrder: number;
}

export interface MenuData {
    categories: MenuCategoryItem[];
    items: MenuItem[];
}

// ─── Legacy compat ───
export type MenuCategory = string;

// ─── Navigation ───

export interface NavItem {
    label: string;
    href: string;
}

// ─── Features ───

export interface Feature {
    icon: string;
    title: string;
    description: string;
}

// ─── Testimonials ───

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    avatar?: string;
}

// ─── Contact ───

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

// ─── SEO ───

export interface SEOProps {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
}

// ─── Admin Auth ───

export interface AdminLoginRequest {
    password: string;
}

export interface AdminLoginResponse {
    success: boolean;
    message: string;
}

// ─── API Responses ───

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}
