'use client';

import { Section } from '@/components/ui/section';
import { TextReveal } from '@/components/ui/text-reveal';
import { Wifi, Clock, Leaf, Armchair, BatteryCharging } from 'lucide-react';

export function DifferenceSection() {
    return (
        <Section className="py-32 relative overflow-hidden bg-cream-100">
            {/* Premium Fluted Texture Background — CSS only, no external URL */}
            <div className="absolute inset-0 bg-fluted opacity-30 pointer-events-none" aria-hidden="true" />

            {/* Ambient gradient — CSS animation instead of Framer Motion Infinity */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-olive-50/50 to-transparent -z-10 animate-blob-slow"
                aria-hidden="true"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto px-4">
                    <TextReveal as="span" className="text-olive-600 font-medium tracking-[0.2em] text-[10px] md:text-xs uppercase mb-4 block">The Thinkery Standard</TextReveal>
                    <TextReveal as="h2" delay={0.1} className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-olive-900 tracking-tight mb-6 leading-[1.1]">
                        Not a noisy hangout. <br className="hidden md:block" />
                        <span className="italic text-olive-500 font-normal">A place for clarity.</span>
                    </TextReveal>
                    <TextReveal delay={0.2} className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mt-8 text-lg font-light text-olive-800/80">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-olive-500" aria-hidden="true" />
                            <span>Quiet Environment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-olive-500" aria-hidden="true" />
                            <span>Focus-Friendly</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-olive-500" aria-hidden="true" />
                            <span>Minimal Design</span>
                        </div>
                    </TextReveal>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[minmax(180px,auto)]">

                    {/* 1. QUIET (Span 7) */}
                    <TextReveal as="div" delay={0.2} className="md:col-span-7 md:row-span-2 rounded-[2rem] md:rounded-[2.5rem] bg-[#2C3318] text-cream-50 p-8 md:p-14 flex flex-col justify-between relative overflow-hidden group hover:ring-1 hover:ring-inset hover:ring-white/10 shadow-2xl shadow-olive-900/10">
                        <div className="relative z-20">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-8 md:mb-10 shadow-2xl">
                                <span className="text-2xl md:text-3xl" role="img" aria-label="Quiet">🤫</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-serif font-medium mb-6 leading-tight">Quiet by<br />Design.</h3>
                            <div className="space-y-4 max-w-md">
                                <p className="text-olive-100/80 text-lg font-light leading-relaxed">
                                    Acoustically treated interiors and a culture of respect.
                                </p>
                                <div className="flex items-center gap-3 text-sm font-medium text-olive-300">
                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">No loud music</span>
                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Sound absorbing</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-30 pointer-events-none" aria-hidden="true">
                            <div className="absolute inset-0 bg-gradient-to-l from-[#2C3318] to-transparent z-10" />
                            <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_11px)]" />
                        </div>
                    </TextReveal>

                    {/* 2. GREENERY (Span 5) */}
                    <TextReveal as="div" delay={0.3} className="md:col-span-5 md:row-span-1 rounded-[2.5rem] bg-[#E6E8D8] p-10 relative overflow-hidden group shadow-xl shadow-olive-900/5">
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <h3 className="text-2xl font-serif font-medium text-olive-900">Biophilic<br />Interiors</h3>
                                <Leaf className="w-8 h-8 text-olive-700" aria-hidden="true" />
                            </div>
                            <p className="text-olive-800/70 mt-4 font-light">Living plants and natural light to reduce stress and boost creativity.</p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 text-olive-600/10 rotate-12 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700" aria-hidden="true">
                            <Leaf className="w-48 h-48" />
                        </div>
                    </TextReveal>

                    {/* 3. WIFI (Span 5) */}
                    <TextReveal as="div" delay={0.4} className="md:col-span-5 md:row-span-1 rounded-[2.5rem] bg-white border border-olive-100 p-8 flex items-center justify-between group hover:shadow-2xl hover:shadow-olive-900/5 transition-shadow duration-500">
                        <div>
                            <h3 className="text-xl font-serif font-medium text-olive-900 mb-1">Gigabit WiFi</h3>
                            <p className="text-olive-600/60 text-sm">Fiber-optic speed.</p>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-olive-50 flex items-center justify-center group-hover:bg-olive-900 group-hover:text-white transition-all duration-300">
                            <Wifi className="w-6 h-6" aria-hidden="true" />
                        </div>
                    </TextReveal>

                    {/* 4. COMFORT (Span 12) */}
                    <TextReveal as="div" delay={0.5} className="md:col-span-12 rounded-[2.5rem] bg-white border border-olive-100 p-10 md:p-14 flex flex-col md:flex-row items-center gap-12 group hover:shadow-2xl hover:shadow-olive-900/5 transition-shadow duration-500">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px w-12 bg-olive-200" aria-hidden="true" />
                                <span className="text-olive-500 text-xs font-bold uppercase tracking-widest">Workspace Ready</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-serif font-medium text-olive-900 mb-6">Ergonomics meets Aesthetic.</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <h4 className="font-medium text-olive-900 flex items-center gap-2">
                                        <Armchair className="w-4 h-4 text-olive-500" aria-hidden="true" /> Premium Seating
                                    </h4>
                                    <p className="text-sm text-olive-600/70">Designed for long hours.</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-medium text-olive-900 flex items-center gap-2">
                                        <BatteryCharging className="w-4 h-4 text-olive-500" aria-hidden="true" /> Power Everywhere
                                    </h4>
                                    <p className="text-sm text-olive-600/70">Sockets at every table.</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 bg-warm-50/50 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-warm-100/50 relative overflow-hidden mt-8 md:mt-0">
                            <div className="absolute top-0 right-0 p-4 opacity-20" aria-hidden="true">
                                <Clock className="w-20 h-20 md:w-24 md:h-24 text-olive-900" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-5xl md:text-6xl font-serif font-medium text-olive-900 mb-2">4hr+</p>
                                <p className="text-olive-600 font-medium text-sm md:text-base">Average Stay Time</p>
                                <p className="text-xs text-olive-500/60 mt-2">We encourage longer,<br />relaxed stays.</p>
                            </div>
                        </div>
                    </TextReveal>
                </div>
            </div>
        </Section>
    );
}
