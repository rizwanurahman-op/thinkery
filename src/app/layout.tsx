import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/providers/app-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://thinkerycafe.in'),
  title: {
    default: 'Thinkery – A Calm Café Space in Calicut',
    template: '%s | Thinkery Café, Calicut',
  },
  description:
    'Thinkery is a modern, work-friendly café in Calicut designed for focused work, meetings, and meaningful conversations. Premium coffee, refreshing beverages, and light comfort food in a calm, green-inspired setting.',
  keywords: [
    'Café in Calicut',
    'Best café in Calicut',
    'Work-friendly café in Calicut',
    'Quiet café for meetings',
    'Coffee shop near me',
    'Study café in Calicut',
    'Meeting café in Calicut',
    'Remote work café Calicut',
    'Calm café Kerala',
    'Thinkery café',
  ],
  authors: [{ name: 'Thinkery Café' }],
  creator: 'Thinkery Café',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://thinkerycafe.in',
    siteName: 'Thinkery Café',
    title: 'Thinkery – A Calm Café Space in Calicut | Where Minds Meet',
    description:
      'A thoughtfully designed café for work, meetings, and meaningful conversations. Premium coffee, refreshing beverages, and light comfort food.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Thinkery Café - A Calm Café Space in Calicut',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thinkery – A Calm Café Space in Calicut',
    description:
      'A thoughtfully designed café for work, meetings, and meaningful conversations.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

// Local Business Schema Markup
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: 'Thinkery Café',
  description:
    'A calm, work-friendly café in Calicut for focused work, meetings, and meaningful conversations.',
  url: 'https://thinkerycafe.in',
  telephone: '+91-XXXXX-XXXXX',
  email: 'hello@thinkerycafe.in',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calicut',
    addressLocality: 'Calicut',
    addressRegion: 'Kerala',
    postalCode: '673001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 11.258,
    longitude: 75.78,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '09:00',
    closes: '22:00',
  },
  servesCuisine: ['Coffee', 'Tea', 'Snacks', 'Light Bites'],
  priceRange: '₹₹',
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Power Outlets', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Quiet Environment', value: true },
  ],
  image: '/og-image.jpg',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased bg-warm-50 text-olive-900 min-h-screen flex flex-col">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
