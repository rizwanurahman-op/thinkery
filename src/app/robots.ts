import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // Block admin, API, and Next.js internals from being indexed
                disallow: ['/admin/', '/admin/login', '/api/', '/_next/'],
            },
        ],
        sitemap: 'https://thinkerycafe.in/sitemap.xml',
        host: 'https://thinkerycafe.in',
    };
}
