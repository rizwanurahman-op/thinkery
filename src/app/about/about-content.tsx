'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Coffee, Leaf, Users, Heart, Star, Clock, MapPin } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { useInView } from '@/hooks';
import { Button } from '@/components/ui/button';

const VALUES = [
    {
        icon: '🎯',
        title: 'Focus',
        description: 'Creating an environment that supports deep work and clear thinking.',
        gradient: 'from-olive-900 to-olive-800'
    },
    {
        icon: '✨',
        title: 'Quality',
        description: 'Premium beverages, fresh food, and thoughtful service in every detail.',
        gradient: 'from-olive-800 to-olive-700'
    },
    {
        icon: '🧹',
        title: 'Simplicity',
        description: 'Minimal design, clean spaces, and an uncluttered experience.',
        gradient: 'from-olive-700 to-olive-600'
    },
    {
        icon: '🪑',
        title: 'Comfort',
        description: 'Furniture and ambiance designed for long, relaxed stays.',
        gradient: 'from-olive-600 to-olive-500'
    },
    {
        icon: '🤝',
        title: 'Community',
        description: 'Building a community of thinkers, creators, and professionals.',
        gradient: 'from-olive-500 to-olive-400'
    },
];

function StorySection() {
    const { ref, isInView } = useInView();

    return (
        <Section className="py-24 lg:py-40 relative z-20 -mt-20 overflow-hidden">
            <div ref={ref} className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Visual Side (Arch Image - Similar to Work Page) */}
                    <div className={`relative order-2 lg:order-1 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        {/* Decorative Circle Behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-olive-50 rounded-full blur-3xl -z-10" />

                        <div className="relative rounded-t-[10rem] rounded-b-[3rem] overflow-hidden shadow-2xl aspect-[3.5/5] border-[8px] border-white group">
                            <Image
                                src="/images/cafe-interior-2.jpg"
                                alt="The Thinkery Journey"
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-[2s] ease-in-out"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-olive-950/40 via-transparent to-transparent" />

                            {/* Floating Stats Card */}
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-lg border border-white/50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-olive-500 font-bold mb-1">Established</p>
                                            <p className="text-3xl font-serif text-olive-900 leading-none">2026</p>
                                        </div>
                                        <div className="h-10 w-px bg-olive-100" />
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-olive-500 font-bold mb-1">Waitlist</p>
                                            <p className="text-3xl font-serif text-olive-900 leading-none">500+</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Element - Leaf Icon */}
                        <div className="absolute -top-12 -left-8 w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center animate-bounce-slow hidden lg:flex border border-olive-50">
                            <Leaf className="w-8 h-8 text-olive-600" />
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className={`order-1 lg:order-2 transition-all duration-1000 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <div className="mb-6 inline-block">
                            <span className="text-gold-600 font-serif italic text-2xl">The Origin</span>
                        </div>

                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-olive-950 leading-[1.05] mb-8">
                            Built for <br />
                            <span className="text-olive-500">thinkers &</span> <br />
                            dreamers.
                        </h2>

                        <div className="h-px w-24 bg-gold-400 mb-8" />

                        <div className="space-y-6 text-olive-900/80 font-light leading-relaxed text-lg md:text-xl mb-12">
                            <p>
                                In today&apos;s fast-moving world, finding a quiet place to think or work is difficult. Homes are distracting, and most cafés are crowded and loud.
                            </p>
                            <p>
                                <strong className="text-olive-950 font-medium border-b-2 border-gold-300">Thinkery</strong> was created to bridge this gap — a café that supports productivity, meaningful conversations, and calm experiences.
                            </p>
                        </div>

                        {/* Elegant Timeline List */}
                        <div className="mb-12 space-y-6">
                            {[
                                { title: 'The Idea', desc: 'Born from a need for a calm, work-friendly space.', icon: '💡' },
                                { title: 'The Design', desc: 'Inspired by minimal Scandinavian aesthetics.', icon: '🎨' },
                                { title: 'The Launch', desc: 'Opening our doors to Calicut\'s creators.', icon: '🚀' },
                            ].map((item, idx) => (
                                <div key={item.title} className="flex items-start gap-4 group cursor-default p-4 rounded-2xl hover:bg-olive-50 transition-colors duration-300">
                                    <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-serif text-olive-900 font-medium mb-1 group-hover:text-olive-700 transition-colors">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-olive-600/70 font-light">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}

function VisionSection() {
    const { ref, isInView } = useInView();

    return (
        <Section className="bg-olive-950 py-24 lg:py-32 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-olive-900/40 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

            <div ref={ref} className={`mb-16 md:mb-24 text-center max-w-3xl mx-auto px-4 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                <div className="inline-block mb-4">
                    <span className="py-1 px-3 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-[10px] uppercase tracking-[0.2em] font-bold backdrop-blur-sm">
                        Our Vision
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-cream-50 leading-tight mb-6">
                    A Café Culture That <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-500 italic">Values Excellence.</span>
                </h2>
                <p className="text-white/60 text-lg font-light leading-relaxed">
                    Our goal is to grow Thinkery into a trusted and scalable brand that promotes focus, quality, and community.
                </p>
            </div>

            {/* Grid - Dark Premium Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto px-4 relative z-10">
                {VALUES.map((value, index) => (
                    <div
                        key={value.title}
                        className={`group p-8 lg:p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gold-500/30 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(234,179,8,0.1)] hover:-translate-y-1 backdrop-blur-sm ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                        ${index === 0 || index === 4 ? 'lg:col-span-2' : ''}
                        `}
                        style={{ transitionDelay: `${index * 150}ms` }}
                    >
                        <div className="flex flex-col h-full justify-between min-h-[250px]">
                            {/* Icon Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${value.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                    {value.icon}
                                </div>
                                <span className="text-white/10 font-serif text-4xl group-hover:text-gold-500/20 transition-colors duration-500 select-none">
                                    0{index + 1}
                                </span>
                            </div>

                            {/* Text Content */}
                            <div>
                                <h3 className="text-2xl md:text-3xl font-serif text-cream-50 mb-4 group-hover:text-white transition-colors">
                                    {value.title}
                                </h3>
                                <p className="text-white/60 text-base md:text-lg leading-relaxed font-light group-hover:text-white/80 transition-colors max-w-lg">
                                    {value.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}

function QuoteSection() {
    const { ref, isInView } = useInView();

    return (
        <Section className="py-24 lg:py-32 overflow-hidden bg-cream-50">
            <div className="container mx-auto px-4">
                <div ref={ref} className={`relative max-w-5xl mx-auto text-center px-4 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

                    {/* Floating Texture Behind */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-5 mix-blend-multiply pointer-events-none bg-[url('/images/noise.png')] bg-repeat" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-olive-50 border border-olive-100 mb-12">
                            <span className="text-olive-600 text-[10px] uppercase tracking-[0.2em] font-bold">Philosophy</span>
                        </div>

                        <blockquote className="text-4xl md:text-6xl lg:text-8xl font-serif text-olive-950 leading-[0.95] mb-16 tracking-tighter">
                            &ldquo;Good ideas need <br />
                            <span className="italic text-gold-600">good environments.&rdquo;</span>
                        </blockquote>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <Button
                                asChild
                                size="lg"
                                className="bg-olive-900 text-white hover:bg-olive-800 rounded-full px-10 py-7 text-sm tracking-wide shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <Link href="/menu">
                                    Explore Menu
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="bg-transparent border-olive-200 text-olive-900 hover:bg-olive-50 rounded-full px-10 py-7 text-sm tracking-wide"
                            >
                                <Link href="/contact">
                                    Visit Us
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-20 flex justify-center opacity-40">
                            <div className="h-24 w-px bg-gradient-to-b from-olive-400 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}

export function AboutContent() {
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
                                    The Thinkery
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                {/* Responsive max width to prevent text overflow on mobile */}
                                <span className="block text-[12vw] md:text-[8rem] lg:text-[10rem] font-medium tracking-tighter mix-blend-darken animate-reveal-up opacity-0 break-words" style={{ animationDelay: '0.4s' }}>
                                    STORY
                                </span>
                            </div>
                            <div className="overflow-hidden -mt-2 md:-mt-4 lg:-mt-8">
                                <span className="block text-4xl md:text-6xl lg:text-7xl font-serif italic text-gold-500 animate-reveal-up opacity-0" style={{ animationDelay: '0.6s' }}>
                                    & Vision
                                </span>
                            </div>
                        </h1>
                    </div>

                    <p className="text-olive-800/80 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed mb-16 animate-fade-in opacity-0 px-4" style={{ animationDelay: '0.8s' }}>
                        In a world that never slows down, we created a sanctuary that does. <br className="hidden md:block" />
                        A place where <strong className="font-medium text-olive-900">focus</strong> meets <strong className="font-medium text-olive-900">community</strong>.
                    </p>

                    {/* Scroll Indicator */}
                    <div className="animate-fade-in opacity-0" style={{ animationDelay: '1s' }}>
                        <div className="w-[1px] h-24 bg-gradient-to-b from-olive-300 to-transparent mx-auto relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-olive-900 animate-scroll-down" />
                        </div>
                    </div>
                </div>
            </section>

            <StorySection />
            <VisionSection />
            <QuoteSection />
        </div>
    );
}
