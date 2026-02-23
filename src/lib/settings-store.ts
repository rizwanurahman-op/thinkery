import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SETTINGS_PATH = join(process.cwd(), 'src', 'data', 'settings.json');

// ─── Offerings Section Config ───

export interface OfferingsCardConfig {
    sectionLabel: string;  // e.g. "The Brew Bar"
    title: string;         // e.g. "Liquid Inspiration"
    categoryIds: string[]; // explicit category IDs assigned to this card
    maxItems: number;      // max items shown from those categories
}

export interface OfferingsSectionConfig {
    badge: string;         // top label, e.g. "Savor the Moment"
    heading: string;       // e.g. "Simple. Fresh."
    headingItalic: string; // italic accent, e.g. "Comforting."
    quote: string;         // bottom CTA
    beverageCard: OfferingsCardConfig;
    foodCard: OfferingsCardConfig;
}

// ─── Page Images ───
// Images used in specific page sections (hero, about, work-and-meet, etc.)
// url: Cloudinary CDN URL (or local /images/ fallback if not yet uploaded)
// publicId: Cloudinary publicId — used for deletion/replacement (empty = local fallback)

export interface PageImage {
    url: string;
    publicId: string;
    alt: string;
}

export interface PageImages {
    /** Hero section — desktop right panel + mobile background */
    heroMain: PageImage;
    /** Homepage About section — tall main portrait image */
    aboutBig: PageImage;
    /** Homepage About section — small overlay card image */
    aboutSmall: PageImage;
    /** About page StorySection — tall arch portrait image */
    aboutPageMain: PageImage;
    /** Work & Meet page — tall arch portrait image */
    workAndMeetMain: PageImage;
}

// ─── Gallery Image ───

export interface GalleryImage {
    url: string;       // Cloudinary secure URL
    publicId: string;  // Cloudinary publicId — needed for deletion/replacement
    label: string;     // Caption shown on the card, e.g. "The Entrance"
    alt: string;       // Screen-reader / SEO alt text
}

// ─── Full Site Settings ───

export interface SiteSettings {
    showPrices: boolean;
    offeringsSection: OfferingsSectionConfig;
    galleryImages: GalleryImage[]; // 4 slots for The Interiors section
    pageImages: PageImages;         // Section-level images manageable from admin
}

// Default page images — use static /images/ paths as fallback
// When admin uploads via Cloudinary, url + publicId get updated in settings.json
const DEFAULT_PAGE_IMAGES: PageImages = {
    heroMain: {
        url: '/images/shop-interior.jpg',
        publicId: '',
        alt: 'Thinkery Café interior — sophisticated olive and cream design with brass accents',
    },
    aboutBig: {
        url: '/images/cafe-interior-2.jpg',
        publicId: '',
        alt: 'Premium Thinkery workspace — calm café interior in Calicut',
    },
    aboutSmall: {
        url: '/images/shop-interior.jpg',
        publicId: '',
        alt: 'Calm corner for reading at Thinkery Café',
    },
    aboutPageMain: {
        url: '/images/cafe-interior-2.jpg',
        publicId: '',
        alt: 'The Thinkery Journey — café interior in Calicut',
    },
    workAndMeetMain: {
        url: '/images/workspace.jpg',
        publicId: '',
        alt: 'Premium Thinkery workspace in Calicut',
    },
};

const DEFAULT_SETTINGS: SiteSettings = {
    showPrices: true,
    offeringsSection: {
        badge: 'Savor the Moment',
        heading: 'Simple. Fresh.',
        headingItalic: 'Comforting.',
        quote: 'Fuel for your best ideas.',
        beverageCard: {
            sectionLabel: 'The Brew Bar',
            title: 'Liquid Inspiration',
            categoryIds: ['hot-beverages', 'cold-beverages'],
            maxItems: 5,
        },
        foodCard: {
            sectionLabel: 'The Kitchen',
            title: 'Nourishment',
            categoryIds: ['snacks'],
            maxItems: 4,
        },
    },
    galleryImages: [
        { url: '', publicId: '', label: 'The Entrance', alt: 'Thinkery Café minimal archway entrance in Calicut' },
        { url: '', publicId: '', label: 'Main Lounge', alt: 'Green-inspired minimal interior seating at Thinkery Café' },
        { url: '', publicId: '', label: 'The Bar', alt: 'Coffee bar and brewing station at Thinkery Café' },
        { url: '', publicId: '', label: 'Workspace', alt: 'Workspace area with power outlets at Thinkery Café Calicut' },
    ],
    pageImages: DEFAULT_PAGE_IMAGES,
};

// Migrate old categoryCount → categoryIds using position-based fallback
function migrateCard(
    saved: Record<string, unknown>,
    defaultCard: OfferingsCardConfig,
    allCategoryIds: string[],
    otherCardIds: string[],
): OfferingsCardConfig {
    // If new format already present, use it
    if (Array.isArray(saved.categoryIds)) {
        return { ...defaultCard, ...saved, categoryIds: saved.categoryIds as string[] };
    }
    // Migrate from old categoryCount: take the first N categories not claimed by the other card
    const count = typeof saved.categoryCount === 'number' ? saved.categoryCount : 2;
    const available = allCategoryIds.filter((id) => !otherCardIds.includes(id));
    const migrated = available.slice(0, count);
    return {
        ...defaultCard,
        ...saved,
        categoryIds: migrated.length > 0 ? migrated : defaultCard.categoryIds,
    };
}

export function readSettings(): SiteSettings {
    if (!existsSync(SETTINGS_PATH)) {
        writeFileSync(SETTINGS_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
        return DEFAULT_SETTINGS;
    }
    try {
        const raw = readFileSync(SETTINGS_PATH, 'utf-8');
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const section = (parsed.offeringsSection ?? {}) as Record<string, unknown>;
        const bevRaw = (section.beverageCard ?? {}) as Record<string, unknown>;
        const foodRaw = (section.foodCard ?? {}) as Record<string, unknown>;

        // We need a list of all category IDs for migration; use defaults as fallback
        const defaultBevIds = DEFAULT_SETTINGS.offeringsSection.beverageCard.categoryIds;
        const defaultFoodIds = DEFAULT_SETTINGS.offeringsSection.foodCard.categoryIds;
        const allDefaultIds = [...defaultBevIds, ...defaultFoodIds];

        const foodIds = Array.isArray(foodRaw.categoryIds)
            ? (foodRaw.categoryIds as string[])
            : defaultFoodIds;
        const bevCard = migrateCard(bevRaw, DEFAULT_SETTINGS.offeringsSection.beverageCard, allDefaultIds, foodIds);
        const bevIds = bevCard.categoryIds;
        const foodCard = migrateCard(foodRaw, DEFAULT_SETTINGS.offeringsSection.foodCard, allDefaultIds, bevIds);

        // Merge saved pageImages with defaults (so new fields added in future are still populated)
        const savedPageImages = (parsed.pageImages ?? {}) as Record<string, unknown>;
        const mergedPageImages: PageImages = {
            heroMain: { ...DEFAULT_PAGE_IMAGES.heroMain, ...(savedPageImages.heroMain as object ?? {}) },
            aboutBig: { ...DEFAULT_PAGE_IMAGES.aboutBig, ...(savedPageImages.aboutBig as object ?? {}) },
            aboutSmall: { ...DEFAULT_PAGE_IMAGES.aboutSmall, ...(savedPageImages.aboutSmall as object ?? {}) },
            aboutPageMain: { ...DEFAULT_PAGE_IMAGES.aboutPageMain, ...(savedPageImages.aboutPageMain as object ?? {}) },
            workAndMeetMain: { ...DEFAULT_PAGE_IMAGES.workAndMeetMain, ...(savedPageImages.workAndMeetMain as object ?? {}) },
        };

        return {
            ...DEFAULT_SETTINGS,
            ...parsed,
            offeringsSection: {
                ...DEFAULT_SETTINGS.offeringsSection,
                ...section,
                beverageCard: bevCard,
                foodCard: foodCard,
            },
            // Migrate: if galleryImages missing, fall back to defaults (empty URLs = use static fallbacks)
            galleryImages: Array.isArray(parsed.galleryImages)
                ? (parsed.galleryImages as GalleryImage[])
                : DEFAULT_SETTINGS.galleryImages,
            pageImages: mergedPageImages,
        } as SiteSettings;
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export function writeSettings(updates: Partial<SiteSettings>): SiteSettings {
    const current = readSettings();
    const next: SiteSettings = {
        ...current,
        ...updates,
        offeringsSection: updates.offeringsSection
            ? {
                ...current.offeringsSection,
                ...updates.offeringsSection,
                beverageCard: {
                    ...current.offeringsSection.beverageCard,
                    ...(updates.offeringsSection.beverageCard ?? {}),
                },
                foodCard: {
                    ...current.offeringsSection.foodCard,
                    ...(updates.offeringsSection.foodCard ?? {}),
                },
            }
            : current.offeringsSection,
    };
    writeFileSync(SETTINGS_PATH, JSON.stringify(next, null, 2), 'utf-8');
    return next;
}
