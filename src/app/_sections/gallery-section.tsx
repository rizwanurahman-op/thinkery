'use client';

import { Section } from '@/components/ui/section';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { TextReveal } from '@/components/ui/text-reveal';

export function GallerySection() {
    return (
        <Section className="py-0 relative bg-cream-50 overflow-hidden">
            {/* Texture — CSS only, no external URL */}
            <div className="absolute inset-0 bg-fluted opacity-20 pointer-events-none" aria-hidden="true" />

            <div className="relative w-full">

                {/* Editorial Header */}
                <div className="relative z-20 max-w-[90rem] mx-auto px-6 pt-24 pb-12 md:pt-32 md:pb-20 grid md:grid-cols-12 gap-8 md:gap-12 items-end">
                    <div className="md:col-span-7">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="h-px w-8 bg-olive-400" aria-hidden="true" />
                            <TextReveal as="span" className="text-olive-600 font-medium tracking-[0.2em] text-xs uppercase">The Interiors</TextReveal>
                        </div>
                        <TextReveal as="h2" delay={0.1} className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-olive-900 leading-[0.9] tracking-tight">
                            Designed for <br />
                            <span className="italic text-olive-500 ml-4 md:ml-12">Clarity.</span>
                        </TextReveal>
                    </div>
                    <div className="md:col-span-5 md:pb-4">
                        <TextReveal as="p" delay={0.3} className="text-lg md:text-xl text-olive-800/80 font-light leading-relaxed max-w-md ml-auto border-l border-olive-200 pl-6">
                            A peek into our minimal, green-inspired interiors — thoughtfully crafted for calm, comfort, and conversation.
                        </TextReveal>
                    </div>
                </div>

                {/* Mosaic Image Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 w-full px-4 md:px-0 pb-20">

                    {/* 1. Tall Feature (Entrance) */}
                    <TextReveal as="div" delay={0.2} className="md:col-span-4 md:row-span-2 relative h-[50vh] md:h-auto min-h-[500px] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-olive-900/20">
                        <OptimizedImage
                            src="/images/gallery-4.jpg"
                            alt="Thinkery Café minimal archway entrance in Calicut"
                            fill
                            className="object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 transition-opacity duration-700" />
                        <div className="absolute top-8 left-8 z-20">
                            <span className="inline-block text-white text-xs font-bold tracking-[0.2em] uppercase border border-white/30 bg-white/10 px-4 py-2 rounded-full backdrop-blur-xl shadow-lg">
                                The Entrance
                            </span>
                        </div>
                    </TextReveal>

                    {/* 2. Wide Feature (Lounge) */}
                    <TextReveal as="div" delay={0.3} className="md:col-span-8 relative h-[35vh] md:h-[45vh] min-h-[300px] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-olive-900/20">
                        <OptimizedImage
                            src="/images/gallery-1.jpg"
                            alt="Green-inspired minimal interior seating at Thinkery Café"
                            fill
                            className="object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 66vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                        <div className="absolute bottom-8 left-8 z-20">
                            <span className="inline-block text-white text-xs font-bold tracking-[0.2em] uppercase border border-white/30 bg-white/10 px-4 py-2 rounded-full backdrop-blur-xl shadow-lg">
                                Main Lounge
                            </span>
                        </div>
                    </TextReveal>

                    {/* 3. Medium (Counter/Detail) */}
                    <TextReveal as="div" delay={0.4} className="md:col-span-4 relative h-[30vh] md:h-[40vh] min-h-[250px] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-olive-900/20">
                        <OptimizedImage
                            src="/images/gallery-2.jpg"
                            alt="Coffee bar and brewing station at Thinkery Café"
                            fill
                            className="object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                        <div className="absolute bottom-8 left-8 z-20">
                            <span className="inline-block text-white text-xs font-bold tracking-[0.2em] uppercase border border-white/30 bg-white/10 px-4 py-2 rounded-full backdrop-blur-xl shadow-lg">
                                The Bar
                            </span>
                        </div>
                    </TextReveal>

                    {/* 4. Medium (Workspace) */}
                    <TextReveal as="div" delay={0.5} className="md:col-span-4 relative h-[30vh] md:h-[40vh] min-h-[250px] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-olive-900/20">
                        <OptimizedImage
                            src="/images/gallery-3.jpg"
                            alt="Workspace area with power outlets at Thinkery Café Calicut"
                            fill
                            className="object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                        <div className="absolute bottom-8 left-8 z-20">
                            <span className="inline-block text-white text-xs font-bold tracking-[0.2em] uppercase border border-white/30 bg-white/10 px-4 py-2 rounded-full backdrop-blur-xl shadow-lg">
                                Workspace
                            </span>
                        </div>
                    </TextReveal>
                </div>
            </div>
        </Section>
    );
}
