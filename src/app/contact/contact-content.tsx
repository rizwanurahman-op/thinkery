'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/ui/section';
import { CONTACT_INFO } from '@/data';
import { useInView } from '@/hooks';
import { MapPin, Phone, Mail, Clock, ExternalLink, ArrowRight, Instagram, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ContactHeroSection() {
    return (
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-olive-50/50 pt-32 pb-20">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-[url('/images/noise.png')] bg-repeat" />

            {/* Animated Gradient Meshes */}
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
                                Connect with
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <span className="block text-[12vw] md:text-[8rem] lg:text-[10rem] font-medium tracking-tighter mix-blend-darken animate-reveal-up opacity-0 break-words" style={{ animationDelay: '0.4s' }}>
                                THINKERY
                            </span>
                        </div>
                        <div className="overflow-hidden -mt-2 md:-mt-4 lg:-mt-8">
                            <span className="block text-4xl md:text-6xl lg:text-7xl font-serif italic text-gold-500 animate-reveal-up opacity-0" style={{ animationDelay: '0.6s' }}>
                                in Calicut
                            </span>
                        </div>
                    </h1>
                </div>

                <p className="text-olive-800/80 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed mb-16 animate-fade-in opacity-0 px-4" style={{ animationDelay: '0.8s' }}>
                    A space for <strong className="font-medium text-olive-900">conversation</strong>, <strong className="font-medium text-olive-900">collaboration</strong>, and <strong className="font-medium text-olive-900">coffee</strong>.
                </p>

                {/* Scroll Indicator */}
                <div className="animate-fade-in opacity-0" style={{ animationDelay: '1s' }}>
                    <div className="w-[1px] h-24 bg-gradient-to-b from-olive-300 to-transparent mx-auto relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-olive-900 animate-scroll-down" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function LocationSection() {
    const { ref, isInView } = useInView();

    return (
        <Section className="py-24 lg:py-40 relative z-20 -mt-20 overflow-hidden">
            <div ref={ref} className="container mx-auto px-4">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* Content Column */}
                    <div className={`lg:col-span-5 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <div className="mb-8 inline-block">
                            <span className="text-gold-600 font-serif italic text-2xl">Find Us</span>
                        </div>

                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-olive-950 leading-[1.05] mb-8">
                            Visit our <br />
                            <span className="text-olive-500">sanctuary.</span>
                        </h2>

                        <div className="h-px w-24 bg-gold-400 mb-12" />

                        {/* Contact Details Grid */}
                        <div className="space-y-8">
                            <div className="group flex items-start gap-6 p-6 rounded-3xl bg-white border border-olive-100 shadow-sm hover:border-gold-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                                <div className="w-12 h-12 rounded-full bg-cream-100 flex items-center justify-center text-olive-600 group-hover:bg-olive-900 group-hover:text-gold-300 transition-colors duration-500 shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-serif text-olive-900 mb-2">Address</h4>
                                    <p className="text-olive-700/80 font-light leading-relaxed">
                                        {CONTACT_INFO.address}
                                        <br />
                                        <span className="text-sm text-olive-400 font-medium tracking-wider uppercase mt-2 block">Kerala, India</span>
                                    </p>
                                    <a
                                        href={CONTACT_INFO.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-gold-600 text-sm font-bold tracking-wide mt-4 hover:gap-3 transition-all"
                                    >
                                        Get Directions <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            <div className="group flex items-start gap-6 p-6 rounded-3xl bg-white border border-olive-100 shadow-sm hover:border-gold-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                                <div className="w-12 h-12 rounded-full bg-cream-100 flex items-center justify-center text-olive-600 group-hover:bg-olive-900 group-hover:text-gold-300 transition-colors duration-500 shrink-0">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-serif text-olive-900 mb-2">Opening Hours</h4>
                                    <p className="text-olive-700/80 font-light mb-1">
                                        {CONTACT_INFO.openHours.days}
                                    </p>
                                    <p className="text-xl text-olive-900 font-medium">
                                        {CONTACT_INFO.openHours.time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Visual Column */}
                    <div className={`lg:col-span-7 relative transition-all duration-1000 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        {/* Decorative Blob */}
                        <div className="absolute -top-20 -right-20 w-[120%] h-[120%] bg-olive-50 rounded-full blur-3xl -z-10" />

                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-white aspect-square lg:aspect-[4/3] group">
                            <iframe
                                src={CONTACT_INFO.mapUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '100%' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Thinkery Café Location"
                                className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700"
                            />

                            {/* Overlay Card */}
                            <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
                                <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-olive-500 font-bold mb-1">Status</p>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <p className="text-lg font-serif text-olive-900">Open Now</p>
                                        </div>
                                    </div>
                                    <div className="h-10 w-px bg-olive-100" />
                                    <div className="text-right">
                                        <p className="text-xs uppercase tracking-widest text-olive-500 font-bold mb-1">Walk-ins</p>
                                        <p className="text-lg font-serif text-olive-900">Welcome</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Section>
    );
}

function ContactGridSection() {
    const { ref, isInView } = useInView();

    return (
        <Section className="bg-olive-950 py-24 lg:py-32 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-olive-900/40 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div ref={ref} className="container mx-auto px-4 relative z-10">
                <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-bold block mb-4">
                        Any Questions?
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-cream-50 leading-tight">
                        We&apos;re here to <span className="italic text-gold-500">help.</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {[
                        {
                            icon: Phone,
                            label: 'Call Us',
                            value: CONTACT_INFO.phone,
                            action: `tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`,
                            cta: 'Call Now',
                            desc: 'Mon-Sun, 9am - 10pm'
                        },
                        {
                            icon: Mail,
                            label: 'Email Us',
                            value: CONTACT_INFO.email,
                            action: `mailto:${CONTACT_INFO.email}`,
                            cta: 'Send Message',
                            desc: 'We typically reply within 2 hours.'
                        },
                        {
                            icon: Instagram,
                            label: 'Follow Us',
                            value: '@thinkery_calicut',
                            action: 'https://instagram.com',
                            cta: 'Follow Profile',
                            desc: 'See our daily snaps & updates.'
                        }
                    ].map((item, index) => (
                        <Link
                            key={item.label}
                            href={item.action}
                            className={`group p-8 lg:p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gold-500/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 backdrop-blur-sm flex flex-col items-center text-center ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-olive-800 to-olive-900 border border-white/10 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg">
                                <item.icon className="w-7 h-7" />
                            </div>

                            <h3 className="text-2xl font-serif text-cream-50 mb-2 group-hover:text-white transition-colors">{item.label}</h3>
                            <p className="text-white/60 text-sm mb-6">{item.desc}</p>

                            <div className="mt-auto">
                                <span className="text-lg text-white font-medium border-b border-gold-500/30 pb-1 group-hover:border-gold-500 transition-all">
                                    {item.value}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Section>
    );
}

function FAQSection() {
    const { ref, isInView } = useInView();

    return (
        <Section className="py-24 lg:py-32 bg-cream-50 overflow-hidden">
            <div ref={ref} className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className={`flex items-center gap-4 mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                    <div className="h-px flex-1 bg-olive-200" />
                    <h3 className="text-2xl md:text-3xl font-serif text-olive-900 text-center px-4">Common Questions</h3>
                    <div className="h-px flex-1 bg-olive-200" />
                </div>

                {/* Questions Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        { q: 'Is there parking available?', a: 'Yes, we have dedicated parking spots for cars and bikes right in front.' },
                        { q: 'Can I book a table?', a: 'We accept reservations for groups of 4+. For smaller groups, walk-ins are welcome!' },
                        { q: 'Do you have WiFi?', a: 'Absolutely. We offer high-speed fiber internet free for all our guests.' },
                        { q: 'Is the food Halal?', a: 'Yes, all our food is prepared using 100% Halal certified ingredients.' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className={`p-8 rounded-[2rem] bg-white border border-olive-100 hover:border-gold-200 hover:shadow-lg transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <h4 className="text-lg font-serif text-olive-900 mb-3">{item.q}</h4>
                            <p className="text-olive-700/80 font-light leading-relaxed text-sm">
                                {item.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}


export function ContactContent() {
    return (
        <div className="w-full overflow-x-hidden bg-cream-50">
            <ContactHeroSection />
            <LocationSection />
            <ContactGridSection />
            <FAQSection />
        </div>
    );
}
