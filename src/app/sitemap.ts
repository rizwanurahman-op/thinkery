import type { MetadataRoute } from 'next';

const BASE_URL = 'https://thinkerycafe.in';

// ✅ Static dates — prevents sitemap regenerating on every request (better caching)
// Update these dates when you make significant content changes
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: BASE_URL,
            lastModified: new Date('2026-02-18'),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date('2026-02-18'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/menu`,
            lastModified: new Date('2026-02-18'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/work-and-meet`,
            lastModified: new Date('2026-02-18'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date('2026-02-18'),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];
}
