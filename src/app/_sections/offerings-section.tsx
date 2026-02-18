'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { TextReveal } from '@/components/ui/text-reveal';
import { Coffee, Zap } from 'lucide-react';

export function OfferingsSection() {
    return (
        <Section className="py-32 relative overflow-hidden bg-cream-50">
            {/* Texture — CSS only, no external URL */}
            <div className="absolute inset-0 bg-fluted opacity-20 pointer-events-none" aria-hidden="true" />

            {/* Ambient glow — CSS animation */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-olive-100/30 blur-[120px] rounded-full pointer-events-none animate-blob-slow"
                aria-hidden="true"
            />

            <div className="relative z-10 max-w-5xl mx-auto px-4">

                {/* Section Header */}
                <div className="text-center mb-16 md:mb-24">
                    <TextReveal as="span" className="text-olive-600/80 font-medium tracking-[0.3em] text-xs uppercase mb-6 block">Savor the Moment</TextReveal>
                    <TextReveal as="h2" delay={0.1} className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-olive-900 leading-tight mb-6 relative inline-block">
                        Simple. Fresh.<br />
                        <span className="italic text-olive-500">Comforting.</span>
                        <motion.span
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -top-6 -right-8 text-4xl"
                            aria-hidden="true"
                        >✨</motion.span>
                    </TextReveal>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-olive-300 to-transparent mx-auto mt-8" aria-hidden="true" />
                </div>

                {/* Menu Cards */}
                <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">

                    {/* BEVERAGES CARD (Span 7) */}
                    <TextReveal as="div" delay={0.2} className="md:col-span-7 group relative bg-white border border-cream-100 p-8 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-olive-900/5 transition-transform duration-500 hover:-translate-y-2 hover:shadow-olive-900/10">
                        <span className="absolute top-6 right-6 md:top-10 md:right-10 text-6xl md:text-8xl lg:text-9xl font-serif text-olive-900/10 select-none pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12" aria-hidden="true">01</span>

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-10 md:mb-14">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-olive-900 text-cream-50 flex items-center justify-center shadow-lg shadow-olive-900/20">
                                    <Coffee className="w-7 h-7 md:w-9 md:h-9" aria-hidden="true" />
                                </div>
                                <div>
                                    <span className="text-olive-500 font-medium tracking-widest text-xs uppercase mb-2 block">The Brew Bar</span>
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-olive-900 leading-none">Liquid Inspiration</h3>
                                </div>
                            </div>

                            <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
                                {[
                                    { name: 'Signature Tea', price: '₹120', desc: 'Loose Leaf • Blends' },
                                    { name: 'Premium Coffee', price: '₹140', desc: 'Espresso • Pour-over' },
                                    { name: 'Fresh Juices', price: '₹160', desc: 'No Sugar • Cold Pressed' },
                                    { name: 'Milkshakes', price: '₹180', desc: 'Thick • Creamy' },
                                    { name: 'Iced Drinks', price: '₹150', desc: 'Summer Refreshers' },
                                ].map((item) => (
                                    <div key={item.name} className="space-y-1 group/item cursor-pointer">
                                        <div className="flex justify-between items-baseline border-b border-olive-100 pb-2 transition-colors group-hover/item:border-olive-400">
                                            <span className="font-medium text-lg text-olive-900">{item.name}</span>
                                            <span className="text-olive-500 font-serif">{item.price}</span>
                                        </div>
                                        <p className="text-xs text-olive-400 uppercase tracking-widest">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TextReveal>

                    {/* FOOD CARD (Span 5) */}
                    <TextReveal as="div" delay={0.3} className="md:col-span-5 group relative bg-olive-950 overflow-hidden p-8 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-olive-900/10 transition-transform duration-500 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-olive-800/20 to-transparent pointer-events-none" aria-hidden="true" />
                        <span className="absolute top-6 right-6 md:top-10 md:right-10 text-6xl md:text-8xl lg:text-9xl font-serif text-white/5 select-none pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12" aria-hidden="true">02</span>

                        <div className="relative z-10">
                            <div className="flex flex-col gap-6 mb-10 md:mb-14">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-olive-800/50 text-cream-50 border border-olive-700 flex items-center justify-center shadow-lg shadow-black/20">
                                    <Zap className="w-7 h-7 md:w-9 md:h-9" aria-hidden="true" />
                                </div>
                                <div>
                                    <span className="text-olive-400/80 font-medium tracking-widest text-xs uppercase mb-2 block">The Kitchen</span>
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-cream-50 leading-none">Nourishment</h3>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {[
                                    { name: 'Gourmet Wraps', price: '₹190', desc: 'Freshly Grilled • Chicken / Paneer' },
                                    { name: 'Burgers', price: '₹220', desc: 'Juicy Patty • Classic / Veg' },
                                    { name: 'Loaded Fries', price: '₹180', desc: 'Seasoned • Cheese / Sauces' },
                                    { name: 'Cutlets & Snacks', price: '₹90', desc: 'Crispy • Light Bites' },
                                ].map((item) => (
                                    <div key={item.name} className="space-y-1 group/item cursor-pointer">
                                        <div className="flex justify-between items-baseline border-b border-olive-700 pb-2 transition-colors group-hover/item:border-cream-50">
                                            <span className="font-medium text-lg text-cream-50">{item.name}</span>
                                            <span className="text-olive-300 font-serif">{item.price}</span>
                                        </div>
                                        <p className="text-xs text-olive-400 uppercase tracking-widest">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TextReveal>
                </div>

                {/* Bottom CTA */}
                <TextReveal as="div" delay={0.4} className="text-center mt-16 md:mt-24">
                    <p className="text-olive-500 font-serif italic text-xl md:text-2xl mb-8">&ldquo;Fuel for your best ideas.&rdquo;</p>
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
