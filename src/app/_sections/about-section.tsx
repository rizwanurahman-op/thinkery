'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { TextReveal } from '@/components/ui/text-reveal';
import { ArrowRight, Coffee, Leaf } from 'lucide-react';

export function AboutSection() {
    return (
        <Section id="about" className="py-24 md:py-32 relative overflow-hidden bg-cream-50">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto px-4">

                {/* Visual Side */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-olive-50 rounded-full blur-3xl -z-10" aria-hidden="true" />

                    <div className="relative rounded-t-full rounded-b-[3rem] overflow-hidden shadow-2xl aspect-[3.5/5] border-[8px] border-white">
                        <OptimizedImage
                            src="/images/cafe-interior-2.jpg"
                            alt="Premium Thinkery workspace — calm café interior in Calicut"
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-[2s] ease-in-out"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-olive-950/40 via-transparent to-transparent" />
                    </div>

                    {/* Floating Coffee Icon */}
                    <div className="absolute -top-12 -right-8 w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center animate-bounce-slow hidden lg:flex border border-olive-50" aria-hidden="true">
                        <Coffee className="w-8 h-8 text-gold-500" />
                    </div>

                    {/* Floating Detail Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="absolute -bottom-6 -right-4 w-40 md:-bottom-12 md:-right-12 md:w-64 aspect-square bg-cream-50 rounded-3xl p-3 shadow-2xl shadow-olive-900/10 z-20"
                    >
                        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-olive-100 group">
                            <OptimizedImage
                                src="/images/shop-interior.jpg"
                                alt="Calm corner for reading at Thinkery Café"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <p className="text-[10px] uppercase tracking-widest font-medium opacity-80 mb-1">Ambiance</p>
                                <p className="font-serif text-lg leading-tight">Designed for <br />Mindfulness</p>
                            </div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-olive-500 rounded-full flex items-center justify-center text-white shadow-lg" aria-hidden="true">
                            <Leaf className="w-4 h-4" />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Side: Text Content */}
                <div className="relative">
                    <TextReveal as="div" className="inline-flex items-center gap-2 mb-8">
                        <span className="w-8 h-px bg-olive-300" aria-hidden="true" />
                        <span className="text-olive-500 font-medium tracking-[0.2em] text-xs uppercase">Since 2026</span>
                    </TextReveal>

                    <TextReveal as="h2" delay={0.1} className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-olive-900 leading-[1.15] mb-6 md:mb-8">
                        More than just <br />
                        <span className="italic text-olive-600 relative inline-block">
                            coffee.
                            <svg className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-gold-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </span>
                    </TextReveal>

                    <div className="space-y-6 text-lg text-olive-800/80 font-light leading-relaxed mb-10">
                        <TextReveal as="p" delay={0.2}>
                            Thinkery is a modern café in Calicut built for <strong className="font-medium text-olive-900">thinkers, creators, professionals,</strong> and anyone seeking a peaceful environment.
                        </TextReveal>
                        <TextReveal as="p" delay={0.3}>
                            More than just coffee and snacks, we offer a <span className="italic text-olive-700">calm space</span> for small meetings, focused work, and quality time.
                        </TextReveal>
                        <TextReveal as="p" delay={0.4}>
                            Whether you&apos;re a startup founder, remote employee, student, or simply looking for a quiet break — <strong className="font-medium text-olive-900">Thinkery welcomes you.</strong>
                        </TextReveal>
                    </div>

                    <TextReveal as="div" delay={0.5} className="flex flex-wrap items-center gap-6">
                        <Button
                            asChild
                            size="lg"
                            className="bg-olive-800 text-cream-50 rounded-full px-8 py-7 text-base hover:bg-olive-900 transition-all duration-300 shadow-xl shadow-olive-900/10 hover:shadow-2xl hover:-translate-y-1 group"
                        >
                            <Link href="/about">
                                Our Story
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                            </Link>
                        </Button>

                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-3" aria-hidden="true">
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-olive-100 flex items-center justify-center text-xs font-bold text-olive-700">T</div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-warm-100 flex items-center justify-center text-xs font-bold text-warm-700">C</div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-olive-200 flex items-center justify-center text-xs font-bold text-olive-800">M</div>
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-olive-900">Community</p>
                                <p className="text-olive-600/70 text-xs">Join our calm space</p>
                            </div>
                        </div>
                    </TextReveal>
                </div>
            </div>
        </Section>
    );
}
