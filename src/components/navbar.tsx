'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { NAV_ITEMS } from '@/data';
import { useScrollDirection } from '@/hooks';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { scrollY } = useScrollDirection();
    const [isOpen, setIsOpen] = useState(false);
    const isScrolled = scrollY > 50;

    const isHome = pathname === '/';

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Smooth mobile navigation: close sheet first, then navigate
    const handleMobileNav = useCallback((href: string) => {
        // If already on this page, just close
        if (pathname === href) {
            setIsOpen(false);
            return;
        }

        // Close the sheet first
        setIsOpen(false);

        // Navigate after the sheet close animation settles
        setTimeout(() => {
            router.push(href);
        }, 350);
    }, [pathname, router]);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${!isScrolled
                ? 'bg-transparent py-6'
                : 'bg-cream-50/80 backdrop-blur-md border-b border-olive-900/5 shadow-sm py-3'
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md 
                            ${!isScrolled
                                ? (isHome ? 'bg-white/10 lg:bg-olive-900/5 backdrop-blur-md border border-white/20 lg:border-olive-900/10' : 'bg-olive-900/5 backdrop-blur-md border border-olive-900/10')
                                : 'bg-olive-900 text-cream-50 shadow-olive-900/20'}`}>
                            <span className={`text-lg font-bold font-serif ${!isScrolled
                                ? (isHome ? 'text-white lg:text-olive-900' : 'text-olive-900')
                                : 'text-cream-50'}`}>T</span>
                        </div>
                        <span className={`text-2xl font-serif font-medium tracking-tight transition-colors duration-300
                            ${!isScrolled
                                ? (isHome ? 'text-white lg:text-olive-900 drop-shadow-md lg:drop-shadow-none' : 'text-olive-900')
                                : 'text-olive-900'}`}>
                            Thinkery
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className={`hidden md:flex items-center gap-2 p-1.5 rounded-full border transition-all duration-300 shadow-sm
                        ${!isScrolled
                            ? 'bg-white/40 backdrop-blur-md border-white/40 lg:bg-white/60 lg:border-olive-900/10 lg:shadow-olive-900/5'
                            : 'bg-transparent border-transparent shadow-none'}`}>
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${pathname === item.href
                                    ? 'bg-olive-900 text-cream-50 shadow-md transform scale-105'
                                    : isScrolled
                                        ? 'text-olive-800 hover:bg-olive-900/5'
                                        : 'text-white lg:text-olive-800 hover:bg-white/20 lg:hover:bg-olive-900/5'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Button
                            asChild
                            className={`rounded-full px-7 py-6 text-base shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5
                                ${!isScrolled
                                    ? 'bg-white text-olive-900 hover:bg-cream-50'
                                    : 'bg-olive-900 text-cream-50 hover:bg-olive-800'}`}
                        >
                            <Link href="/contact">Visit Us</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <button
                                className={`p-2.5 rounded-full transition-all duration-300 ${!isScrolled
                                    ? (isHome ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md text-white' : 'bg-olive-900/5 hover:bg-olive-900/10 text-olive-900')
                                    : 'bg-olive-100 hover:bg-olive-200 text-olive-900'}`}
                                aria-label="Open menu"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            showCloseButton={false}
                            className="w-[85vw] sm:w-[400px] bg-cream-50/95 backdrop-blur-xl border-l border-white/50 p-0 overflow-hidden"
                        >
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 bg-fluted opacity-[0.03] pointer-events-none" />
                            <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />

                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                            <div className="flex flex-col h-full relative z-10">
                                {/* Mobile Logo */}
                                <div className="flex items-center justify-between p-8 border-b border-olive-900/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-olive-900 flex items-center justify-center shadow-lg shadow-olive-900/10">
                                            <span className="text-cream-50 text-lg font-bold font-serif">T</span>
                                        </div>
                                        <span className="text-2xl font-serif font-medium text-olive-900">
                                            Thinkery
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2.5 rounded-full hover:bg-olive-900/10 text-olive-900 transition-all duration-300 active:scale-90"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Mobile Nav Links */}
                                <div className="flex flex-col p-8 gap-3">
                                    {NAV_ITEMS.map((item, index) => (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: 50, scale: 0.95, filter: 'blur(4px)' }}
                                            animate={isOpen ? { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 0, x: 50, scale: 0.95, filter: 'blur(4px)' }}
                                            transition={{
                                                duration: 1.1,
                                                delay: 0.18 + index * 0.1,
                                                ease: [0.19, 1, 0.22, 1]
                                            }}
                                        >
                                            <button
                                                onClick={() => handleMobileNav(item.href)}
                                                className={`w-full text-left px-6 py-4 rounded-2xl text-xl font-serif transition-all duration-300 ${pathname === item.href
                                                    ? 'bg-olive-900 text-cream-50 shadow-lg shadow-olive-900/10 translate-x-2 font-semibold'
                                                    : 'text-olive-700 hover:bg-white/80 hover:shadow-md hover:translate-x-1 active:scale-[0.98]'
                                                    }`}
                                            >
                                                {item.label}
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Mobile CTA */}
                                <motion.div
                                    className="mt-auto p-8 border-t border-olive-900/5 bg-white/40 backdrop-blur-md"
                                    initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                                    animate={isOpen ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 30, filter: 'blur(4px)' }}
                                    transition={{ duration: 1.1, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
                                >
                                    <Button
                                        onClick={() => handleMobileNav('/contact')}
                                        className="w-full h-14 bg-olive-900 hover:bg-olive-800 text-cream-50 rounded-2xl text-lg font-medium shadow-xl shadow-olive-900/10 transition-transform active:scale-95"
                                    >
                                        Visit Us
                                    </Button>
                                    <p className="text-center text-olive-400 text-xs mt-6 uppercase tracking-widest font-medium">
                                        Calicut • Kerala
                                    </p>
                                </motion.div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </nav>
            </div>
        </header>
    );
}
