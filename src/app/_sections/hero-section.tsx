'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { TextReveal } from '@/components/ui/text-reveal';
import { ArrowRight, Coffee, Leaf } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-cream-50">
            {/* Background Gradient - Desktop Only */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-gradient-to-br from-wall via-cream-50 to-accent-sage/20 hidden lg:block"
            />

            {/* Decorative Blobs — CSS animations instead of JS Infinity loops */}
            <div
                className="absolute top-20 left-10 w-96 h-96 bg-olive-200/10 rounded-full blur-[100px] hidden lg:block animate-blob-slow"
                aria-hidden="true"
            />
            <div
                className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent-sage/20 rounded-full blur-[120px] hidden lg:block animate-blob-slow-delayed"
                aria-hidden="true"
            />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage:
                        'linear-gradient(#546032 1px, transparent 1px), linear-gradient(to right, #546032 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
                aria-hidden="true"
            />

            {/* Mobile Background Image */}
            <div className="absolute inset-0 lg:hidden animate-fade-in">
                <OptimizedImage
                    src="/images/shop-interior.jpg"
                    alt="Thinkery Café interior — calm, minimal, green-inspired workspace in Calicut"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60" />
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 to-transparent" />
                <div className="absolute -bottom-1 left-0 right-0 h-16 bg-cream-50 rounded-t-[3rem] z-20" />
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 lg:pb-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left — Text Content (SSR-friendly, no JS needed for text) */}
                    <div className="max-w-xl">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full pl-2 pr-4 py-1.5 mb-8 lg:bg-olive-100/50 lg:border-olive-200 lg:backdrop-blur-sm shadow-xl shadow-black/5"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cream-200 lg:bg-gold-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cream-100 lg:bg-gold-500" />
                            </span>
                            <span className="text-white text-[10px] md:text-xs font-medium tracking-[0.15em] uppercase lg:text-olive-800">
                                Now Open in Calicut
                            </span>
                        </motion.div>

                        {/* H1 — Critical for SEO */}
                        <TextReveal
                            as="h1"
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-cream-50 lg:text-olive-900 leading-[1.05] mb-6 drop-shadow-lg lg:drop-shadow-none"
                        >
                            A Calm Café
                            <br />
                            Space in Calicut
                            <span className="block text-cream-200 lg:text-olive-500 text-2xl sm:text-3xl md:text-4xl mt-4 font-normal italic font-serif">
                                Where Minds Meet.
                            </span>
                        </TextReveal>

                        {/* Subtext */}
                        <TextReveal
                            as="p"
                            delay={0.2}
                            className="text-cream-100/90 lg:text-warm-600 text-lg md:text-xl leading-relaxed mb-10 max-w-lg font-medium lg:font-normal drop-shadow-sm lg:drop-shadow-none"
                        >
                            A thoughtfully designed café for work, meetings, and meaningful conversations.
                        </TextReveal>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                            className="flex flex-wrap gap-4"
                        >
                            <Button
                                asChild
                                size="lg"
                                className="bg-cream-50 text-olive-900 hover:bg-white lg:bg-olive-700 lg:hover:bg-olive-800 lg:text-white rounded-full px-8 py-6 text-base shadow-xl lg:shadow-olive-700/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
                            >
                                <Link href="/contact">
                                    Visit Us
                                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="rounded-full px-8 py-6 text-base border-white text-white bg-white/5 hover:bg-white/20 lg:border-olive-300 lg:text-olive-700 lg:bg-transparent lg:hover:bg-olive-50 lg:hover:border-olive-400 transition-all duration-300 backdrop-blur-sm"
                            >
                                <Link href="/menu">View Menu</Link>
                            </Button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-wrap items-center gap-6 md:gap-8 mt-12"
                        >
                            <div>
                                <p className="text-2xl md:text-3xl font-serif font-medium text-cream-50 lg:text-olive-800">50+</p>
                                <p className="text-cream-200/80 lg:text-olive-600/70 text-[10px] md:text-xs uppercase tracking-widest mt-1">Menu Items</p>
                            </div>
                            <div className="w-px h-10 bg-white/20 lg:bg-olive-200" aria-hidden="true" />
                            <div>
                                <p className="text-2xl md:text-3xl font-serif font-medium text-cream-50 lg:text-olive-800">100%</p>
                                <p className="text-cream-200/80 lg:text-olive-600/70 text-[10px] md:text-xs uppercase tracking-widest mt-1">WiFi Uptime</p>
                            </div>
                            <div className="w-px h-10 bg-white/20 lg:bg-olive-200" aria-hidden="true" />
                            <div>
                                <p className="text-2xl md:text-3xl font-serif font-medium text-cream-50 lg:text-olive-800">7</p>
                                <p className="text-cream-200/80 lg:text-olive-600/70 text-[10px] md:text-xs uppercase tracking-widest mt-1">Days Open</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right — Hero Image (Desktop) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-olive-900/10 aspect-[4/5] lg:aspect-[3/4]">
                            <OptimizedImage
                                src="/images/shop-interior.jpg"
                                alt="Thinkery Café interior — sophisticated olive and cream design with brass accents"
                                priority
                                sizes="(max-width: 1024px) 0vw, 50vw"
                                className="object-cover hover:scale-105 transition-transform duration-[1.5s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-olive-900/30 via-transparent to-transparent" />

                            {/* Floating card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gold-500/90 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold-500/20">
                                        <Coffee className="w-5 h-5 text-cream-50" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="text-olive-900 font-medium text-sm">Premium Coffee &amp; More</p>
                                        <p className="text-olive-600 text-xs">Signature teas, fresh juices, comfort food</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-olive-200 rounded-2xl -z-10" aria-hidden="true" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-olive-100/50 rounded-2xl -z-10" aria-hidden="true" />

                        {/* Floating badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6, delay: 1, type: 'spring' }}
                            className="absolute -top-3 -left-3 bg-cream-50 rounded-2xl shadow-lg p-3"
                        >
                            <div className="flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-olive-600" aria-hidden="true" />
                                <span className="text-olive-800 text-xs font-medium">Minimal &amp; Green</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom fade — Desktop Only */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-warm-50 to-transparent hidden lg:block" aria-hidden="true" />
        </section>
    );
}
