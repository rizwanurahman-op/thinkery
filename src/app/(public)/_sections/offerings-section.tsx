// ✅ SERVER COMPONENT — receives live data from homepage (page.tsx)
// No 'use client' needed — zero client JS for this section

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { TextReveal } from '@/components/ui/text-reveal';
import { Coffee, Zap } from 'lucide-react';
import type { MenuItem, MenuCategoryItem } from '@/types';
import type { OfferingsSectionConfig } from '@/lib/settings-store';
import { AnimatedEmoji } from './animated-emoji';

// ─── Props ───

export interface OfferingsSectionProps {
    categories: MenuCategoryItem[];
    items: MenuItem[];
    showPrices: boolean;
    offeringsSection: OfferingsSectionConfig;
}

// ─── Helpers ───

// No splitCategories — we use explicit categoryIds from settings

function getCategoryItems(
    items: MenuItem[],
    categoryIds: string[],
    limit: number,
): MenuItem[] {
    return items
        .filter((item) => categoryIds.includes(item.categoryId))
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .slice(0, limit);
}

// ─── Item Row ───

function ItemRow({
    item,
    showPrices,
    light,
}: {
    item: MenuItem;
    showPrices: boolean;
    light: boolean;
}) {
    // shortDesc is the crisp "Keyword • Keyword" accent line (set per item in admin)
    // fallback: trim the full description to ~40 chars
    const accent = item.shortDesc
        ? item.shortDesc
        : item.description.length > 40
            ? item.description.slice(0, 40).trimEnd() + '…'
            : item.description;

    return (
        <div className="space-y-1 group/item cursor-pointer">
            <div
                className={`flex justify-between items-baseline border-b pb-2 transition-colors ${light
                    ? 'border-olive-100 group-hover/item:border-olive-400'
                    : 'border-olive-700 group-hover/item:border-cream-50'
                    }`}
            >
                <span className={`font-medium text-lg ${light ? 'text-olive-900' : 'text-cream-50'}`}>
                    {item.name}
                </span>
                {showPrices && item.price && (
                    <span className={`font-serif shrink-0 ml-3 ${light ? 'text-olive-500' : 'text-olive-300'}`}>
                        ₹{item.price}
                    </span>
                )}
            </div>
            <p className="text-[11px] sm:text-xs text-olive-400 uppercase tracking-widest mt-1.5 line-clamp-1 break-words leading-relaxed" title={accent}>
                {accent}
            </p>
        </div>
    );
}

// ─── Main Export ───

export function OfferingsSection({
    items,
    showPrices,
    offeringsSection: cfg,
    categories: _categories,
}: OfferingsSectionProps) {
    const beverageItems = getCategoryItems(items, cfg.beverageCard.categoryIds, cfg.beverageCard.maxItems);
    const foodItems = getCategoryItems(items, cfg.foodCard.categoryIds, cfg.foodCard.maxItems);

    return (
        <Section className="pt-20 pb-8 md:pt-28 md:pb-8 relative overflow-hidden bg-cream-50">
            {/* Texture */}
            <div className="absolute inset-0 bg-fluted opacity-20 pointer-events-none" aria-hidden="true" />

            {/* Ambient glow */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-olive-100/30 blur-[120px] rounded-full pointer-events-none animate-blob-slow"
                aria-hidden="true"
            />

            <div className="relative z-10 max-w-5xl mx-auto px-4">

                {/* ── Section Header ── */}
                <div className="text-center mb-16 md:mb-24">
                    <TextReveal as="span" className="text-olive-600/80 font-medium tracking-[0.3em] text-xs uppercase mb-6 block">
                        {cfg.badge}
                    </TextReveal>
                    <TextReveal
                        as="h2"
                        delay={0.1}
                        className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-olive-900 leading-tight mb-6 relative inline-block"
                    >
                        {cfg.heading}<br />
                        <span className="italic text-olive-500">{cfg.headingItalic}</span>
                        <AnimatedEmoji className="absolute -top-6 -right-8 text-4xl">✨</AnimatedEmoji>
                    </TextReveal>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-olive-300 to-transparent mx-auto mt-8" aria-hidden="true" />
                </div>

                {/* ── Menu Cards ── */}
                <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-start">

                    {/* BEVERAGES — light card (col-span-7) */}
                    <TextReveal
                        as="div"
                        delay={0.2}
                        className="lg:col-span-7 group relative bg-white border border-cream-100 p-8 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-olive-900/5 transition-transform duration-500 hover:-translate-y-2 hover:shadow-olive-900/10"
                    >
                        <span
                            className="absolute top-6 right-6 md:top-10 md:right-10 text-6xl md:text-8xl lg:text-9xl font-serif text-olive-900/10 select-none pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12"
                            aria-hidden="true"
                        >01</span>

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-10 md:mb-14">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-olive-900 text-cream-50 flex items-center justify-center shadow-lg shadow-olive-900/20">
                                    <Coffee className="w-7 h-7 md:w-9 md:h-9" aria-hidden="true" />
                                </div>
                                <div>
                                    <span className="text-olive-500 font-medium tracking-widest text-xs uppercase mb-2 block">
                                        {cfg.beverageCard.sectionLabel}
                                    </span>
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-olive-900 leading-none">
                                        {cfg.beverageCard.title}
                                    </h3>
                                </div>
                            </div>

                            {beverageItems.length > 0 ? (
                                <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
                                    {beverageItems.map((item) => (
                                        <ItemRow key={item.id} item={item} showPrices={showPrices} light={true} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-olive-400 text-sm italic">No beverage items yet.</p>
                            )}
                        </div>
                    </TextReveal>

                    {/* FOOD — dark card (col-span-5) */}
                    <TextReveal
                        as="div"
                        delay={0.3}
                        className="lg:col-span-5 group relative bg-olive-950 overflow-hidden p-8 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-olive-900/10 transition-transform duration-500 hover:-translate-y-2"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-olive-800/20 to-transparent pointer-events-none" aria-hidden="true" />
                        <span
                            className="absolute top-6 right-6 md:top-10 md:right-10 text-6xl md:text-8xl lg:text-9xl font-serif text-white/5 select-none pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12"
                            aria-hidden="true"
                        >02</span>

                        <div className="relative z-10">
                            <div className="flex flex-col gap-6 mb-10 md:mb-14">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-olive-800/50 text-cream-50 border border-olive-700 flex items-center justify-center shadow-lg shadow-black/20">
                                    <Zap className="w-7 h-7 md:w-9 md:h-9" aria-hidden="true" />
                                </div>
                                <div>
                                    <span className="text-olive-400/80 font-medium tracking-widest text-xs uppercase mb-2 block">
                                        {cfg.foodCard.sectionLabel}
                                    </span>
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-cream-50 leading-none">
                                        {cfg.foodCard.title}
                                    </h3>
                                </div>
                            </div>

                            {foodItems.length > 0 ? (
                                <div className="space-y-8">
                                    {foodItems.map((item) => (
                                        <ItemRow key={item.id} item={item} showPrices={showPrices} light={false} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-olive-400 text-sm italic">No food items yet.</p>
                            )}
                        </div>
                    </TextReveal>
                </div>

                {/* ── Bottom CTA ── */}
                <TextReveal as="div" delay={0.4} className="text-center mt-12">
                    <p className="text-olive-500 font-serif italic text-xl md:text-2xl mb-6 md:mb-8">
                        &ldquo;{cfg.quote}&rdquo;
                    </p>
                    <Button
                        asChild
                        variant="outline"
                        className="rounded-full px-8 py-6 border-olive-200 text-olive-800 hover:bg-olive-50 hover:text-olive-900 transition-all duration-300"
                    >
                        <Link href="/menu">Explore Full Menu</Link>
                    </Button>
                </TextReveal>
            </div>
        </Section>
    );
}
