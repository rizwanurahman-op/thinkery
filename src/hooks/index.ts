'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export function useInView(options?: IntersectionObserverInit) {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(element);
                }
            },
            { threshold: 0.1, ...options }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [options]);

    return { ref, isInView };
}

export function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const updateScrollDirection = () => {
            const currentScrollY = window.scrollY;
            const direction = currentScrollY > lastScrollY ? 'down' : 'up';
            if (
                direction !== scrollDirection &&
                (currentScrollY - lastScrollY > 10 || currentScrollY - lastScrollY < -10)
            ) {
                setScrollDirection(direction);
            }
            setScrollY(currentScrollY);
            lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
        };

        window.addEventListener('scroll', updateScrollDirection);
        return () => window.removeEventListener('scroll', updateScrollDirection);
    }, [scrollDirection]);

    return { scrollDirection, scrollY };
}

export function useActiveSection(sectionIds: string[]) {
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.3 }
        );

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [sectionIds]);

    return activeSection;
}

export function useParallax(speed: number = 0.5) {
    const [offset, setOffset] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const scrollPercent = rect.top / window.innerHeight;
        setOffset(scrollPercent * speed * 100);
    }, [speed]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return { ref, offset };
}
