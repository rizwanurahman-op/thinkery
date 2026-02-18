'use client';

import { useState } from 'react';
import { MENU_ITEMS } from '@/data';
import { Coffee, UtensilsCrossed } from 'lucide-react';
import type { MenuCategory } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { TextReveal } from '@/components/ui/text-reveal';

const CATEGORIES = [
    { id: 'all' as const, label: 'All Items', icon: '✦' },
    { id: 'hot-beverages' as MenuCategory, label: 'Hot Beverages', icon: '☕' },
    { id: 'cold-beverages' as MenuCategory, label: 'Cold Beverages', icon: '🧊' },
    { id: 'snacks' as MenuCategory, label: 'Snacks & Light Bites', icon: '🍔' },
];

function MenuCard({
    name,
    description,
    price,
    badge,
    category,
    image,
    index,
}: {
    name: string;
    description: string;
    price?: string;
    badge?: string;
    category: string;
    image?: string;
    index: number;
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="group relative h-[450px] md:h-[500px] w-full max-w-[400px] mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-olive-900/30 transition-shadow duration-700 bg-olive-900"
        >
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                {image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 opacity-80"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Coffee className="w-16 h-16 text-white/10" />
                    </div>
                )}

                {/* Atmospheric Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-olive-950 via-olive-950/40 to-transparent opacity-90" />
            </div>

            {/* Floating Badge (Left) */}
            {badge && (
                <div className="absolute top-6 left-6 z-20">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-[0.2em] uppercase text-white shadow-lg">
                        {badge}
                    </span>
                </div>
            )}

            {/* Price Tag (Right) */}
            {price && (
                <div className="absolute top-6 right-6 z-20">
                    <span className="inline-flex items-center px-5 py-2 rounded-full bg-gold-500 text-white text-sm font-bold shadow-xl border border-gold-400">
                        ₹{price}
                    </span>
                </div>
            )}

            {/* Immersive Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end h-full">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    {/* Category Label */}
                    <div className="mb-1">
                        <span className="inline-block text-[10px] font-bold tracking-[0.25em] text-gold-300 uppercase opacity-80">
                            {category.replace('-', ' ')}
                        </span>
                    </div>

                    <h3 className="font-serif text-3xl text-white mb-4 leading-[1.1] drop-shadow-lg group-hover:text-gold-100 transition-colors">
                        {name}
                    </h3>

                    {/* Animated Divider */}
                    <div className="w-12 h-0.5 bg-gold-400/80 rounded-full mb-4 transition-all duration-700 ease-out group-hover:w-20" />

                    <p className="text-white/80 text-sm leading-relaxed font-light line-clamp-2 group-hover:text-white transition-colors">
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
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
            <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-olive-50/50 pt-32 pb-20">
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-noise" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    {/* Top Label */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-olive-900/10 bg-white/40 backdrop-blur-md shadow-sm">
                            <UtensilsCrossed className="w-3 h-3 text-olive-900" />
                            <span className="text-olive-900 text-[11px] uppercase tracking-[0.25em] font-bold">
                                Seasonal Menu
                            </span>
                        </div>
                    </motion.div>

                    {/* Main Title Block */}
                    <div className="relative mb-8">
                        <h1 className="leading-[0.9] text-olive-950 font-serif">
                            <TextReveal as="div" delay={0.1} className="overflow-hidden mb-2">
                                <span className="block text-2xl md:text-4xl font-light tracking-widest uppercase text-olive-600">
                                    Authentic
                                </span>
                            </TextReveal>
                            <TextReveal as="div" delay={0.2} className="overflow-hidden">
                                <span className="block text-[15vw] md:text-[8rem] lg:text-[10rem] font-medium tracking-tighter mix-blend-darken">
                                    CAFÉ MENU
                                </span>
                            </TextReveal>
                            <TextReveal as="div" delay={0.3} className="overflow-hidden -mt-2 md:-mt-6 lg:-mt-8">
                                <span className="block text-3xl md:text-6xl lg:text-7xl font-serif italic text-gold-500">
                                    in Calicut
                                </span>
                            </TextReveal>
                        </h1>
                    </div>

                    <TextReveal as="p" delay={0.4} className="text-olive-800/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12 px-4">
                        Explore our thoughtfully curated café menu featuring premium coffee, refreshing beverages, and light comfort food.
                    </TextReveal>
                </div>
            </section>

            {/* Category Filter - Sticky */}
            <div className="sticky top-[80px] z-40 -mt-12 mb-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="flex justify-center"
                    >
                        <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl shadow-olive-900/10 border border-white/50 ring-1 ring-olive-900/5 max-w-full overflow-hidden">
                            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-2 px-1 items-center">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className="relative shrink-0 snap-center px-6 py-3 rounded-full text-sm font-medium transition-colors duration-300"
                                    >
                                        {activeCategory === cat.id && (
                                            <motion.div
                                                layoutId="activeCategory"
                                                className="absolute inset-0 bg-olive-900 rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className={`relative z-10 flex items-center gap-2 ${activeCategory === cat.id ? 'text-white' : 'text-olive-800 hover:text-olive-900'}`}>
                                            <span className="text-base">{cat.icon}</span>
                                            {cat.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <section className="pb-32 lg:pb-48 relative z-20">
                <div className="container mx-auto px-4 max-w-7xl">
                    <motion.div
                        layout
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredItems.map((item, index) => (
                                <MenuCard
                                    key={item.id}
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                    badge={item.badge}
                                    category={item.category}
                                    image={item.image}
                                    index={index % 6} // Stagger in batches
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-olive-400 text-lg">Select a category to view items.</p>
                        </div>
                    )}

                    {/* Bottom Signature */}
                    <div className="mt-32 text-center px-4">
                        <TextReveal as="div" delay={0.2} className="inline-block relative p-8 md:p-12 rounded-[3rem] bg-olive-900 overflow-hidden group hover:scale-[1.02] transition-transform duration-500 shadow-2xl shadow-olive-900/20">
                            <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-400/20 rounded-full blur-3xl group-hover:bg-gold-400/30 transition-colors" />

                            <div className="relative z-10">
                                <div className="text-4xl mb-4">☕</div>
                                <h3 className="text-2xl font-serif text-cream-50 mb-2">Crafted with Patience</h3>
                                <p className="text-olive-200/80 text-sm tracking-wide max-w-md mx-auto">
                                    Every cup and plate is prepared fresh. Good things take time.
                                </p>
                            </div>
                        </TextReveal>
                    </div>
                </div>
            </section>
        </div>
    );
}
