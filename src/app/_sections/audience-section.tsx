'use client';

import { Section } from '@/components/ui/section';
import { TextReveal } from '@/components/ui/text-reveal';
import { Briefcase, Laptop, Users, BookOpen, Sun } from 'lucide-react';

export function AudienceSection() {
    return (
        <Section className="bg-olive-900 text-cream-50 py-32 rounded-t-[4rem] -mt-12 relative z-10 overflow-hidden">
            {/* Subtle Noise Texture — CSS only */}
            <div className="absolute inset-0 bg-fluted opacity-[0.03] pointer-events-none" aria-hidden="true" />
            <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" aria-hidden="true" />

            {/* Atmospheric Glow — CSS animations instead of Framer Motion Infinity */}
            <div
                className="absolute top-0 right-0 w-[800px] h-[800px] bg-olive-800/20 blur-[120px] rounded-full pointer-events-none animate-blob-slow"
                aria-hidden="true"
            />
            <div
                className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cream-900/5 blur-[100px] rounded-full pointer-events-none animate-blob-slow-delayed"
                aria-hidden="true"
            />

            <div className="max-w-[90rem] mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="h-px w-12 bg-cream-500/50" aria-hidden="true" />
                            <TextReveal as="span" className="text-cream-200/80 font-medium tracking-[0.25em] text-xs uppercase">Curated Audience</TextReveal>
                        </div>
                        <TextReveal as="h2" delay={0.1} className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-cream-50 leading-[0.9] tracking-tight">
                            A Space for <br />
                            <span className="italic text-cream-200">Deep Work.</span>
                        </TextReveal>
                    </div>

                    <TextReveal as="p" delay={0.3} className="text-olive-200/60 text-lg md:text-xl font-light max-w-md leading-relaxed md:text-right border-l md:border-l-0 md:border-r border-olive-800 pl-6 md:pl-0 md:pr-6">
                        Whether you&apos;re here to focus, collaborate, or simply exhale — we&apos;ve designed this environment for you.
                    </TextReveal>
                </div>

                {/* Bento Grid */}
                <div className="grid md:grid-cols-12 gap-6">

                    {/* Corporate (Large Card) */}
                    <TextReveal as="div" delay={0.2} className="md:col-span-7 group relative bg-white/[0.05] backdrop-blur-md border border-white/10 p-10 md:p-14 rounded-[3rem] overflow-hidden hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 shadow-2xl shadow-black/20">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-cream-500/5 blur-[80px] rounded-full group-hover:bg-cream-500/10 transition-colors duration-700" aria-hidden="true" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
                            <div className="w-20 h-20 rounded-full bg-olive-800/80 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                                <Briefcase className="w-8 h-8 text-cream-100" strokeWidth={1.5} aria-hidden="true" />
                            </div>
                            <div>
                                <h3 className="text-3xl md:text-4xl font-serif text-cream-50 mb-3">Corporate Professionals</h3>
                                <p className="text-cream-100/70 text-lg font-light">A quiet, dignified alternative to office cafeterias.</p>
                            </div>
                        </div>
                    </TextReveal>

                    {/* Remote Workers */}
                    <TextReveal as="div" delay={0.3} className="md:col-span-5 group relative bg-gradient-to-br from-olive-800/30 to-olive-900/30 backdrop-blur-md border border-white/10 p-10 md:p-14 rounded-[3rem] overflow-hidden hover:border-cream-500/30 transition-all duration-500 shadow-2xl shadow-black/20">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-12">
                                <div className="w-16 h-16 rounded-full bg-olive-500/20 border border-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                                    <Laptop className="w-7 h-7 text-olive-100" strokeWidth={1.5} aria-hidden="true" />
                                </div>
                                <span className="px-4 py-1 rounded-full border border-olive-500/30 text-olive-300 text-xs uppercase tracking-widest bg-olive-900/40">WiFi 6E</span>
                            </div>
                            <h3 className="text-3xl font-serif text-cream-50 mb-3">Remote Workers</h3>
                            <p className="text-olive-200/70 font-light">Your ideal remote office with reliable power &amp; ambiance.</p>
                        </div>
                    </TextReveal>

                    {/* Founders & Teams */}
                    <TextReveal as="div" delay={0.4} className="md:col-span-4 group relative bg-white/[0.03] backdrop-blur-sm border border-white/5 p-10 rounded-[3rem] overflow-hidden hover:bg-white/[0.05] transition-colors duration-500">
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-full bg-olive-900/50 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Users className="w-6 h-6 text-olive-100" strokeWidth={1.5} aria-hidden="true" />
                            </div>
                            <h3 className="text-2xl font-serif text-cream-50 mb-3">Founders &amp; Teams</h3>
                            <p className="text-olive-200/70 font-light">Informal yet professional.</p>
                        </div>
                    </TextReveal>

                    {/* Deep Focus */}
                    <TextReveal as="div" delay={0.45} className="md:col-span-4 group relative bg-white/[0.03] backdrop-blur-sm border border-white/5 p-10 rounded-[3rem] overflow-hidden hover:bg-white/[0.05] transition-colors duration-500">
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-full bg-olive-900/50 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                <BookOpen className="w-6 h-6 text-olive-100" strokeWidth={1.5} aria-hidden="true" />
                            </div>
                            <h3 className="text-2xl font-serif text-cream-50 mb-3">Deep Focus</h3>
                            <p className="text-olive-200/70 font-light">For studying and planning.</p>
                        </div>
                    </TextReveal>

                    {/* Seekers of Calm */}
                    <TextReveal as="div" delay={0.5} className="md:col-span-4 group relative bg-gradient-to-br from-olive-800/40 to-olive-900/40 backdrop-blur-sm border border-white/5 p-10 rounded-[3rem] overflow-hidden hover:from-olive-800/50 hover:to-olive-900/50 transition-colors duration-500">
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Sun className="w-6 h-6 text-cream-50" strokeWidth={1.5} aria-hidden="true" />
                            </div>
                            <h3 className="text-2xl font-serif text-cream-50 mb-3">Seekers of Calm</h3>
                            <p className="text-olive-200/70 font-light">Find your moment of peace.</p>
                        </div>
                    </TextReveal>
                </div>
            </div>
        </Section>
    );
}
