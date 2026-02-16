import Link from 'next/link';
import { NAV_ITEMS, CONTACT_INFO } from '@/data';
import { Separator } from '@/components/ui/separator';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-olive-950 text-cream-100 border-t border-olive-900 relative overflow-hidden">
            {/* Background Texture & Watermark */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 text-[15rem] font-serif font-bold text-cream-50/[0.015] pointer-events-none select-none whitespace-nowrap hidden lg:block">
                THINKERY
            </div>
            {/* Pre-footer CTA - Warm Invitation */}
            <div className="bg-cream-100 py-24 relative overflow-hidden">
                {/* Fluted Texture Overlay */}
                <div className="absolute inset-0 bg-fluted opacity-10 pointer-events-none" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <span className="w-8 h-px bg-olive-400"></span>
                        <span className="text-olive-600/80 text-xs md:text-sm uppercase tracking-[0.3em] font-medium">
                            Come by anytime
                        </span>
                        <span className="w-8 h-px bg-olive-400"></span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-olive-900 mb-6 leading-[1.1]">
                        Step into a space designed for <br className="hidden md:block" />
                        <span className="italic text-olive-600">focus</span> and <span className="italic text-olive-600">refreshment.</span>
                    </h2>

                    <p className="text-olive-800/70 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
                        Thinkery — Where ideas begin.
                    </p>

                    <Link
                        href="/contact"
                        className="group inline-flex items-center gap-3 bg-olive-900 text-cream-50 px-10 py-5 rounded-full text-lg font-medium hover:bg-olive-800 transition-all duration-300 hover:-translate-y-1 shadow-2xl shadow-olive-900/10"
                    >
                        Visit Us
                        <svg
                            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Footer Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-cream-50 flex items-center justify-center shadow-lg shadow-cream-50/10">
                                <span className="text-olive-900 text-lg font-bold font-serif">T</span>
                            </div>
                            <span className="text-2xl font-serif font-medium text-cream-50 tracking-wide">
                                Thinkery
                            </span>
                        </div>
                        <p className="text-cream-200/60 text-sm leading-relaxed mb-8 font-light">
                            A calm café space in Calicut for work, meetings, and meaningful
                            conversations. More than just coffee — a place for clarity.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {['Instagram', 'Facebook', 'Twitter'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    aria-label={social}
                                    className="w-10 h-10 rounded-full bg-cream-50/5 border border-white/5 flex items-center justify-center hover:bg-cream-50 hover:text-olive-900 text-cream-100 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <span className="text-xs font-medium uppercase tracking-wider">
                                        {social[0]}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-cream-50 font-medium font-serif mb-6 text-lg">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {NAV_ITEMS.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-olive-300 hover:text-cream-50 transition-colors duration-200 text-sm"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-cream-50 font-medium font-serif mb-6 text-lg">
                            Contact
                        </h3>
                        <ul className="space-y-3 text-sm text-olive-300">
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">📍</span>
                                <span>{CONTACT_INFO.address}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>📞</span>
                                <span>{CONTACT_INFO.phone}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>✉️</span>
                                <span>{CONTACT_INFO.email}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h3 className="text-cream-50 font-medium font-serif mb-6 text-lg">
                            Open Hours
                        </h3>
                        <p className="text-cream-200/60 text-sm mb-2 font-light">{CONTACT_INFO.openHours.days}</p>
                        <p className="text-cream-100 text-xl font-serif tracking-wide border-b border-white/10 pb-4 inline-block mb-4">
                            {CONTACT_INFO.openHours.time}
                        </p>
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 backdrop-blur-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-12 h-12 bg-cream-500/10 rounded-full blur-xl group-hover:bg-cream-500/20 transition-colors" />
                            <p className="text-cream-200/80 text-xs leading-relaxed relative z-10">
                                🌿 Best café for remote work in Calicut. Perfect for meetings, study sessions, and quiet breaks.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-olive-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-olive-400 text-xs">
                            © {currentYear} Thinkery Café, Calicut. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-olive-400">
                            <a href="#" className="hover:text-olive-200 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-olive-200 transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
