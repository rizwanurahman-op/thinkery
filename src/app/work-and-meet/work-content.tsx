'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Section, SectionHeader, PageHero, FeatureCard } from '@/components/ui/section';
import { WORK_FEATURES, WORK_AUDIENCE } from '@/data';
import { useInView } from '@/hooks';
import { ArrowRight, Wifi, Zap, Armchair, Leaf, Coffee } from 'lucide-react';

function WorkHeroSection() {
    const { ref, isInView } = useInView();

    return (
        <Section className="py-24 lg:py-40 relative z-20 -mt-20 overflow-hidden">
            <div ref={ref} className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Visual Side (Arch Image) */}
                    <div className={`relative order-2 lg:order-1 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        {/* Decorative Circle Behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-olive-50 rounded-full blur-3xl -z-10" />

                        <div className="relative rounded-t-[10rem] rounded-b-[3rem] overflow-hidden shadow-2xl aspect-[3.5/5] border-[8px] border-white">
                            <Image
                                src="/images/workspace.jpg"
                                alt="Premium Thinkery workspace in Calicut"
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-[2s] ease-in-out"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-olive-950/40 via-transparent to-transparent" />

                            {/* Floating "Open" Tag */}
                            <div className="absolute bottom-8 left-0 right-0 text-center">
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-full shadow-lg">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-white text-xs font-bold tracking-[0.2em] uppercase">Open for Co-working</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Element - Coffee Icon */}
                        <div className="absolute -top-12 -right-8 w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center animate-bounce-slow hidden lg:flex border border-olive-50">
                            <Coffee className="w-8 h-8 text-gold-500" />
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className={`order-1 lg:order-2 transition-all duration-1000 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <div className="mb-6 inline-block">
                            <span className="text-gold-600 font-serif italic text-2xl">The Sanctuary</span>
                        </div>

                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-olive-950 leading-[1.05] mb-8">
                            Looking for a <br />
                            <span className="text-olive-500">peaceful café</span> <br />
                            in Calicut?
                        </h2>

                        <div className="h-px w-24 bg-gold-400 mb-8" />

                        <p className="text-xl md:text-2xl text-olive-900/80 font-light leading-relaxed mb-12">
                            Thinkery is a <strong className="text-olive-950 font-medium border-b-2 border-gold-300">productive workspace</strong> disguised as a cozy café.
                            Bring your laptop, ideas, or team — and let the calm fuel your best work.
                        </p>

                        {/* Elegant Feature List instead of Blocks */}
                        <div className="mb-12 space-y-4">
                            {[
                                { label: 'Comfortable Seating', icon: Armchair },
                                { label: 'Power Sockets', icon: Zap },
                                { label: 'High-Speed WiFi', icon: Wifi },
                                { label: 'Calm Atmosphere', icon: Leaf },
                            ].map((item, idx) => (
                                <div key={item.label} className="flex items-center gap-4 group cursor-default">
                                    <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-olive-600 group-hover:bg-gold-500 group-hover:text-white transition-colors duration-300">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-lg text-olive-800 font-serif group-hover:translate-x-2 transition-transform duration-300">
                                        {item.label}
                                    </span>
                                    <div className="flex-1 h-px bg-olive-100 group-hover:bg-gold-200 transition-colors duration-300" />
                                </div>
                            ))}
                        </div>

                        <Button
                            asChild
                            size="lg"
                            className="bg-olive-950 text-white hover:bg-gold-500 rounded-full px-12 py-8 text-sm tracking-[0.2em] uppercase font-bold shadow-2xl transition-all duration-500 hover:-translate-y-1 group border border-transparent hover:border-gold-400"
                        >
                            <Link href="/contact">
                                Reserve a Spot
                                <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>

                </div>
            </div>
        </Section>
    );
}

function FeaturesSection() {
    const { ref, isInView } = useInView();

    return (
        <Section className="bg-olive-950 py-24 lg:py-32 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-olive-900/40 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

            {/* Header */}
            <div ref={ref} className={`mb-16 md:mb-24 text-center max-w-3xl mx-auto px-4 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                <div className="inline-block mb-4">
                    <span className="py-1 px-3 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-[10px] uppercase tracking-[0.2em] font-bold backdrop-blur-sm">
                        Amenities
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-cream-50 leading-tight mb-6">
                    Everything you need to be <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-500 italic">productive.</span>
                </h2>
                <p className="text-white/60 text-lg font-light leading-relaxed">
                    Designed from the ground up to support focused work and meaningful meetings.
                </p>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto px-4 relative z-10">
                {WORK_FEATURES.map((feature, index) => (
                    <div
                        key={feature.title}
                        className={`group p-8 lg:p-10 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gold-500/30 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(234,179,8,0.1)] hover:-translate-y-1 backdrop-blur-sm ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                        style={{ transitionDelay: `${index * 150}ms` }}
                    >
                        <div className="flex flex-col h-full">
                            {/* Icon Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-olive-800/50 to-transparent border border-white/5 group-hover:border-gold-500/20 transition-colors duration-500">
                                    <div className="text-3xl text-gold-400 group-hover:text-gold-300 group-hover:scale-110 transition-transform duration-500">
                                        {feature.icon}
                                    </div>
                                </div>
                                <span className="text-white/20 font-serif text-4xl group-hover:text-gold-500/20 transition-colors duration-500 select-none">
                                    0{index + 1}
                                </span>
                            </div>

                            {/* Text Content */}
                            <div>
                                <h3 className="text-2xl font-serif text-cream-50 mb-3 group-hover:text-white transition-colors">
                                    {feature.title}
                                </h3>
                                <div className="h-px w-12 bg-white/10 mb-4 group-hover:w-full group-hover:bg-gold-500/30 transition-all duration-700 ease-out" />
                                <p className="text-white/60 text-base leading-relaxed font-light group-hover:text-white/80 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}

function IdealForSection() {
    const { ref, isInView } = useInView();

    return (
        <Section className="py-24 lg:py-32 overflow-hidden bg-cream-50">
            <div className="container mx-auto px-4">
                {/* Section Header - Left Aligned for Editorial Feel */}
                <div ref={ref} className={`mb-16 max-w-2xl transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                    <span className="text-olive-500 text-xs uppercase tracking-[0.3em] font-bold pl-1 block mb-4">
                        Curated For
                    </span>
                    <h2 className="text-4xl md:text-6xl font-serif text-olive-900 leading-[1.1] mb-6">
                        A space for every <br />
                        <span className="italic text-gold-600">mode of work.</span>
                    </h2>
                    <p className="text-olive-800/70 text-lg font-light max-w-lg">
                        From solo deep work to team meetings — Thinkery adapts to your rhythm.
                    </p>
                </div>

                {/* Accordion Grid */}
                <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[500px] transition-all duration-500">
                    {[
                        {
                            icon: '💻',
                            label: 'Remote Work',
                            desc: 'Find your flow state in our quiet corners designed for deep focus.',
                            bg: 'bg-olive-900',
                            text: 'text-cream-50',
                            accent: 'text-gold-400',
                            border: 'border-olive-800'
                        },
                        {
                            icon: '✍️',
                            label: 'Freelancers',
                            desc: 'A creative studio atmosphere to inspire your next big project.',
                            bg: 'bg-white',
                            text: 'text-olive-900',
                            accent: 'text-olive-500',
                            border: 'border-olive-100'
                        },
                        {
                            icon: '🚀',
                            label: 'Startups',
                            desc: 'The perfect launchpad for brainstorming sessions and strategy meets.',
                            bg: 'bg-gold-50',
                            text: 'text-olive-950',
                            accent: 'text-gold-600',
                            border: 'border-gold-100'
                        },
                        {
                            icon: '🤝',
                            label: 'Meetings',
                            desc: 'Impress clients or sync with your team in a professional setting.',
                            bg: 'bg-stone-100',
                            text: 'text-stone-900',
                            accent: 'text-restore-500',
                            border: 'border-stone-200'
                        },
                    ].map((item, index) => (
                        <div
                            key={item.label}
                            className={`group relative flex-1 lg:hover:flex-[1.5] flex flex-col justify-between p-8 rounded-[2rem] ${item.bg} ${item.border} border transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-2xl overflow-hidden min-h-[300px] lg:min-h-0`}
                        >
                            {/* Decorative Number */}
                            <span className={`absolute top-4 right-6 text-6xl font-serif font-bold opacity-10 ${item.text}`}>
                                0{index + 1}
                            </span>

                            {/* Top Content */}
                            <div className="relative z-10 transition-transform duration-500 group-hover:translate-y-2">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-6 bg-current opacity-10 ${item.text}`}>
                                    <span className="opacity-1000">{item.icon}</span>
                                </div>
                                <h3 className={`text-3xl font-serif mb-2 leading-none ${item.text}`}>
                                    {item.label}
                                </h3>
                                <div className={`h-0.5 w-8 opacity-30 mt-4 mb-4 group-hover:w-16 transition-all duration-700 ${item.text.replace('text-', 'bg-')}`} />
                            </div>

                            {/* Bottom Content (Description) */}
                            <div className="relative z-10">
                                <p className={`text-base font-light leading-relaxed opacity-0 lg:opacity-100 lg:max-h-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-700 ease-out delay-100 ${item.text}`}>
                                    {item.desc}
                                </p>
                                <div className={`lg:hidden text-sm opacity-80 mt-4 ${item.text}`}>
                                    {item.desc}
                                </div>

                                {/* Arrow Action */}
                                <div className={`absolute bottom-6 right-6 p-2 rounded-full border opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 ${item.text} ${item.border}`}>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}

function ProductivityCTA() {
    const { ref, isInView } = useInView();

    return (
        <Section className="bg-olive-900 text-olive-100 relative overflow-hidden py-24 lg:py-32">
            {/* Texture/Noise Overlay */}
            <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />

            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-olive-800/50 rounded-full blur-[100px] opacity-60 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-900/20 rounded-full blur-[80px] opacity-40 -translate-x-1/3 translate-y-1/3" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Gold Frame Container */}
                <div className="max-w-4xl mx-auto border border-gold-500/20 rounded-[3rem] p-8 md:p-12 lg:p-16 relative bg-olive-900/20 backdrop-blur-sm">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold-400 rounded-tl-3xl translate-x-[-1px] translate-y-[-1px]" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold-400 rounded-tr-3xl translate-x-[1px] translate-y-[-1px]" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold-400 rounded-bl-3xl translate-x-[-1px] translate-y-[1px]" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold-400 rounded-br-3xl translate-x-[1px] translate-y-[1px]" />

                    <div ref={ref} className={`text-center transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-olive-800 border border-olive-700 mb-8 shadow-inner">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                            <span className="text-gold-200 text-[10px] uppercase tracking-[0.2em] font-bold">Your Productivity Space</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-cream-50 leading-[1.05] mb-8">
                            A café designed for
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-400 italic mt-2 pb-2">productivity.</span>
                        </h2>

                        <p className="text-olive-200/80 text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
                            Stop searching for the best café for remote work in Calicut.
                            <br /><span className="text-white font-medium">You&apos;ve found it.</span>
                        </p>

                        <Button
                            asChild
                            size="lg"
                            className="bg-cream-50 text-olive-900 hover:bg-gold-400 hover:text-olive-950 rounded-full px-12 py-8 text-base tracking-widest uppercase font-bold shadow-2xl shadow-black/20 transition-all duration-300 hover:-translate-y-1"
                        >
                            <Link href="/contact">
                                Visit Thinkery Today
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Section>
    );
}

export function WorkAndMeetContent() {
    return (
        <div className="w-full overflow-x-hidden bg-cream-50">
            {/* Ultra-Premium Poster Hero */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-olive-50/50 pt-32 pb-20">
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-[url('/images/noise.png')] bg-repeat" />

                {/* Animated Gradient Meshes - Reduced size to prevent overflow spill */}
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-olive-200/30 to-transparent rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-gold-200/20 rounded-full blur-[80px]" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    {/* Top Label */}
                    <div className="mb-6 animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-olive-900/10 bg-white/40 backdrop-blur-md shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                            <span className="text-olive-900 text-[11px] uppercase tracking-[0.25em] font-bold">
                                Est. 2026 • Calicut
                            </span>
                        </div>
                    </div>

                    {/* Main Title Block */}
                    <div className="relative mb-10">
                        <h1 className="leading-[0.9] text-olive-950 font-serif">
                            <div className="overflow-hidden">
                                <span className="block text-3xl md:text-5xl lg:text-5xl font-light tracking-widest uppercase mb-4 animate-reveal-up opacity-0 text-olive-600" style={{ animationDelay: '0.2s' }}>
                                    Calicut&apos;s Premier
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                {/* Responsive max width to prevent text overflow on mobile */}
                                <span className="block text-[12vw] md:text-[8rem] lg:text-[10rem] font-medium tracking-tighter mix-blend-darken animate-reveal-up opacity-0 break-words" style={{ animationDelay: '0.4s' }}>
                                    WORK & MEET
                                </span>
                            </div>
                            <div className="overflow-hidden -mt-2 md:-mt-4 lg:-mt-8">
                                <span className="block text-4xl md:text-6xl lg:text-7xl font-serif italic text-gold-500 animate-reveal-up opacity-0" style={{ animationDelay: '0.6s' }}>
                                    Sanctuary
                                </span>
                            </div>
                        </h1>
                    </div>

                    <p className="text-olive-800/80 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed mb-16 animate-fade-in opacity-0 px-4" style={{ animationDelay: '0.8s' }}>
                        A curated space for <strong className="font-medium text-olive-900">focus</strong>, <strong className="font-medium text-olive-900">creativity</strong>, and <strong className="font-medium text-olive-900">connection</strong>.
                    </p>

                    {/* Scroll Indicator */}
                    <div className="animate-fade-in opacity-0" style={{ animationDelay: '1s' }}>
                        <div className="w-[1px] h-24 bg-gradient-to-b from-olive-300 to-transparent mx-auto relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-olive-900 animate-scroll-down" />
                        </div>
                    </div>
                </div >
            </section >

            <WorkHeroSection />
            <FeaturesSection />
            <IdealForSection />
            <ProductivityCTA />
        </div >
    );
}
