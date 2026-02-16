'use client';

import { useState } from 'react';
import { PageHero, Section } from '@/components/ui/section';
import { Badge } from '@/components/ui/badge';
import { MENU_ITEMS } from '@/data';
import { useInView } from '@/hooks';
import { Coffee, Snowflake, UtensilsCrossed } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import type { MenuCategory } from '@/types';

const CATEGORIES = [
    { id: 'all' as const, label: 'All Items', icon: '✦' },
    { id: 'hot-beverages' as MenuCategory, label: 'Hot Beverages', icon: '☕' },
    { id: 'cold-beverages' as MenuCategory, label: 'Cold Beverages', icon: '🧊' },
    { id: 'snacks' as MenuCategory, label: 'Snacks & Light Bites', icon: '🍔' },
];

function MenuCard({
    name,
    description,
    badge,
    category,
    image,
    index,
}: {
    name: string;
    description: string;
    badge?: string;
    category: string;
    image?: string;
    index: number;
}) {
    const { ref, isInView } = useInView();

    return (
        <div
            ref={ref}
            className={`group relative h-[500px] w-full max-w-[400px] mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 ease-out hover:shadow-olive-900/30 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
            style={{ transitionDelay: `${(index % 3) * 150}ms` }}
        >
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 bg-olive-900">
                {image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 opacity-90"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Coffee className="w-16 h-16 text-white/20" />
                    </div>
                )}

                {/* Atmospheric Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-olive-950 via-olive-950/60 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-olive-900/20 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-0" />
            </div>

            {/* Floating Badge */}
            {badge && (
                <div className="absolute top-6 right-6 z-20">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-[0.2em] uppercase text-white shadow-lg">
                        {badge}
                    </span>
                </div>
            )}

            {/* Immersive Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end h-full">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    {/* Category Label - appearing on hover */}
                    <div className="overflow-hidden h-0 group-hover:h-6 transition-all duration-500 mb-1 opacity-0 group-hover:opacity-100">
                        <span className="inline-block text-[10px] font-bold tracking-[0.25em] text-gold-300 uppercase">
                            {category.replace('-', ' ')}
                        </span>
                    </div>

                    <h3 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-[1.1] drop-shadow-lg group-hover:text-gold-100 transition-colors">
                        {name}
                    </h3>

                    {/* Animated Divider */}
                    <div className="w-12 h-1 bg-gold-400/80 rounded-full mb-4 transition-all duration-700 ease-out group-hover:w-24 group-hover:bg-white/40" />

                    <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light line-clamp-3 group-hover:text-white transition-colors">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function MenuContent() {
    const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all');

    const filteredItems =
        activeCategory === 'all'
            ? MENU_ITEMS
            : MENU_ITEMS.filter((item) => item.category === activeCategory);

    return (
        <div className="bg-cream-50 min-h-screen">
            {/* Ultra-Premium Poster Hero */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-olive-50/50 pt-32 pb-20">
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-[url('/images/noise.png')] bg-repeat" />

                {/* Animated Gradient Meshes */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-bl from-olive-200/30 to-transparent rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gold-200/20 rounded-full blur-[80px]" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    {/* Top Label */}
                    <div className="mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-olive-900/10 bg-white/40 backdrop-blur-md shadow-sm">
                            <UtensilsCrossed className="w-3 h-3 text-olive-900" />
                            <span className="text-olive-900 text-[11px] uppercase tracking-[0.25em] font-bold">
                                Seasonal Menu
                            </span>
                        </div>
                    </div>

                    {/* Main Title Block */}
                    <div className="relative mb-8">
                        <h1 className="leading-[0.9] text-olive-950 font-serif">
                            <div className="overflow-hidden">
                                <span className="block text-3xl md:text-5xl font-light tracking-widest uppercase mb-4 animate-reveal-up opacity-0 text-olive-600" style={{ animationDelay: '0.2s' }}>
                                    Authentic
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <span className="block text-[12vw] md:text-[8rem] lg:text-[10rem] font-medium tracking-tighter mix-blend-darken animate-reveal-up opacity-0 break-words" style={{ animationDelay: '0.4s' }}>
                                    CAFÉ MENU
                                </span>
                            </div>
                            <div className="overflow-hidden -mt-2 md:-mt-6 lg:-mt-8">
                                <span className="block text-4xl md:text-6xl lg:text-7xl font-serif italic text-gold-500 animate-reveal-up opacity-0" style={{ animationDelay: '0.6s' }}>
                                    in Calicut
                                </span>
                            </div>
                        </h1>
                    </div>

                    <p className="text-olive-800/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12 animate-fade-in opacity-0 px-4" style={{ animationDelay: '0.8s' }}>
                        Explore our thoughtfully curated café menu featuring premium coffee, refreshing beverages, and light comfort food.
                    </p>
                </div>
            </section>

            {/* Category Filter - Fixed/Sticky Navigation for all devices */}
            <div className="sticky top-[70px] md:top-[90px] z-50 -mt-10 mb-12 lg:-mt-16 lg:mb-20">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        {/* The Glass Capsule */}
                        <div className="flex items-center gap-2 p-1.5 rounded-[2.5rem] bg-white/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(84,96,50,0.15)] border border-white/50 ring-1 ring-olive-900/5 max-w-full overflow-hidden">
                            {/* Inner Scrollable Area for Mobile */}
                            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-2 px-2 py-1 items-center">
                                {CATEGORIES.map((cat, index) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`relative shrink-0 snap-center px-5 py-2.5 rounded-full text-xs md:text-sm tracking-wide font-semibold transition-all duration-500 overflow-hidden ${activeCategory === cat.id
                                            ? 'text-white shadow-lg'
                                            : 'text-olive-800 hover:bg-olive-50'
                                            }`}
                                    >
                                        {/* Background Layer */}
                                        <div className={`absolute inset-0 bg-olive-900 transition-transform duration-500 ease-out ${activeCategory === cat.id ? 'translate-y-0 scale-100' : 'translate-y-full scale-95'}`} />

                                        <span className="relative z-10 flex items-center gap-2">
                                            <span className="text-sm md:text-base">{cat.icon}</span>
                                            {cat.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Section className="pb-32 lg:pb-48 relative z-20">
                {/* Menu Grid - Premium Cards */}
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {filteredItems.map((item, index) => (
                            <MenuCard
                                key={item.id}
                                name={item.name}
                                description={item.description}
                                badge={item.badge}
                                category={item.category}
                                image={item.image}
                                index={index}
                            />
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-olive-400 text-lg">Select a category to view items.</p>
                        </div>
                    )}
                </div>

                {/* Bottom Signature */}
                <div className="mt-32 text-center animate-fade-in px-4">
                    <div className="inline-block relative p-8 md:p-12 rounded-[3rem] bg-olive-900 overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay" />
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-400/20 rounded-full blur-3xl group-hover:bg-gold-400/30 transition-colors" />

                        <div className="relative z-10">
                            <div className="text-4xl mb-4 animate-bounce-slow">☕</div>
                            <h3 className="text-2xl font-serif text-cream-50 mb-2">Crafted with Patience</h3>
                            <p className="text-olive-200/80 text-sm tracking-wide max-w-md mx-auto">
                                Every cup and plate is prepared fresh. Good things take time.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}
