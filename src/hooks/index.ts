'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export function useInView(options?: IntersectionObserverInit) {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    // ✅ Stable refs for options to avoid infinite re-render loop
    const thresholdRef = useRef(options?.threshold ?? 0.1);
    const rootMarginRef = useRef(options?.rootMargin ?? '0px');

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
            { threshold: thresholdRef.current, rootMargin: rootMarginRef.current }
        );

        observer.observe(element);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // ✅ Empty deps — options are captured via stable refs above

    return { ref, isInView };
}

export function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
    const [scrollY, setScrollY] = useState(0);
    // ✅ Track direction via ref to avoid stale closures — no re-render needed for comparison
    const lastScrollYRef = useRef(0);
    const scrollDirectionRef = useRef<'up' | 'down'>('up');
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const updateScrollDirection = () => {
            const currentScrollY = window.scrollY;
            const direction = currentScrollY > lastScrollYRef.current ? 'down' : 'up';

            // ✅ Compare against ref (not stale state) to detect real direction changes
            if (
                direction !== scrollDirectionRef.current &&
                Math.abs(currentScrollY - lastScrollYRef.current) > 10
            ) {
                scrollDirectionRef.current = direction;
                setScrollDirection(direction);
            }

            setScrollY(currentScrollY);
            lastScrollYRef.current = currentScrollY > 0 ? currentScrollY : 0;
            rafRef.current = null;
        };

        // ✅ Throttle with requestAnimationFrame — fires max once per frame (~60fps)
        const handleScroll = () => {
            if (rafRef.current !== null) return;
            rafRef.current = requestAnimationFrame(updateScrollDirection);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, []); // ✅ Empty deps — direction tracked via ref, no stale closure

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // ✅ sectionIds is stable at mount — no need to re-run

    return activeSection;
}

export function useParallax(speed: number = 0.5) {
    const [offset, setOffset] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);

    const handleScroll = useCallback(() => {
        if (rafRef.current !== null) return;
        rafRef.current = requestAnimationFrame(() => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const scrollPercent = rect.top / window.innerHeight;
            setOffset(scrollPercent * speed * 100);
            rafRef.current = null;
        });
    }, [speed]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [handleScroll]);

    return { ref, offset };
}
