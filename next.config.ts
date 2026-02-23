import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  reactCompiler: true,

  // ✅ Image optimization — WebP/AVIF conversion, automatic resizing, lazy loading
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // Responsive image sizes for srcset generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ✅ Enable gzip/brotli compression
  compress: true,

  // ✅ App Router client-side route cache (staleTimes)
  // Development: 0 → Ctrl+R always shows fresh layout/page changes immediately.
  // Production:  30/180 → navigating between pages uses cached prefetches for speed.
  //              next.config is evaluated at server start; NODE_ENV is correct in both envs.
  experimental: {
    staleTimes: {
      dynamic: isDev ? 0 : 30,   // dynamic routes: dev=always fresh, prod=30s cache
      static: 30,                 // minimum allowed; static routes cache for 30s in all envs
    },
  },

  // ✅ Security & performance headers
  async headers() {
    return [
      {
        // Security headers for all routes
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Next.js static chunks (JS/CSS bundles)
        // Production: filenames include content hashes → safe to cache forever (immutable)
        // Development: filenames change on every build → must NOT cache or Ctrl+R
        //              shows stale code. no-store forces the browser to always refetch.
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: isDev
              ? 'no-store'
              : 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Public images — long cache is fine (content rarely changes, filenames are stable)
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;

