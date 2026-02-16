'use client';

import { useInView } from '@/hooks';
import { cn } from '@/lib/utils';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    fullWidth?: boolean;
}

export function Section({ children, className, id, fullWidth = false }: SectionProps) {
    const { ref, isInView } = useInView();

    return (
        <section
            id={id}
            ref={ref}
            className={cn(
                'py-20 md:py-28 transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                className
            )}
        >
            {fullWidth ? (
                children
            ) : (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
            )}
        </section>
    );
}

interface SectionHeaderProps {
    label?: string;
    title: string;
    description?: string;
    centered?: boolean;
    className?: string;
}

export function SectionHeader({
    label,
    title,
    description,
    centered = true,
    className,
}: SectionHeaderProps) {
    return (
        <div
            className={cn(
                'max-w-2xl mb-12 md:mb-16 relative',
                centered && 'mx-auto text-center',
                className
            )}
        >
            {label && (
                <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="h-px w-8 bg-olive-200 hidden md:block"></span>
                    <p className="text-olive-600 text-xs md:text-sm uppercase tracking-[0.2em] font-medium">
                        {label}
                    </p>
                    <span className="h-px w-8 bg-olive-200 hidden md:block"></span>
                </div>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-olive-900 leading-[1.15] mb-6 relative inline-block">
                {title}
                {/* Decorative underline */}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-olive-300 to-sage-300 rounded-full opacity-60"></span>
            </h2>
            {description && (
                <p className="text-olive-700/80 text-base md:text-lg leading-relaxed max-w-lg mx-auto font-light">
                    {description}
                </p>
            )}
        </div>
    );
}

interface PageHeroProps {
    title: string;
    subtitle?: string;
    label?: string;
    backgroundImage?: string;
}

export function PageHero({ title, subtitle, label, backgroundImage }: PageHeroProps) {
    return (
        <div className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-olive-100 via-cream-50 to-warm-50" />

            {/* Decorative arch shapes */}
            <div className="absolute top-0 left-1/4 w-48 h-64 bg-olive-200/30 arch-shape -translate-y-1/2" />
            <div className="absolute top-0 right-1/4 w-32 h-48 bg-sage-200/20 arch-shape -translate-y-1/3" />

            {/* Decorative lines */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-olive-300/50 to-transparent" />

            {/* Content */}
            <div className="relative z-10 text-center px-4 pt-32 pb-16 md:pt-40 md:pb-20">
                {label && (
                    <p className="text-olive-600 text-sm uppercase tracking-[0.2em] font-medium mb-4 animate-fade-in">
                        {label}
                    </p>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-olive-900 leading-tight mb-4 animate-reveal-up">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-warm-600 text-lg md:text-xl max-w-xl mx-auto animate-reveal-up" style={{ animationDelay: '0.2s' }}>
                        {subtitle}
                    </p>
                )}

                {/* Leaf divider */}
                <div className="mt-8 flex items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="w-12 h-px bg-olive-300" />
                    <span className="text-olive-400 text-lg">🌿</span>
                    <div className="w-12 h-px bg-olive-300" />
                </div>
            </div>
        </div>
    );
}

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    index?: number;
}

export function FeatureCard({ icon, title, description, index = 0 }: FeatureCardProps) {
    const { ref, isInView } = useInView();

    return (
        <div
            ref={ref}
            className={cn(
                'group relative p-6 md:p-8 rounded-3xl bg-white border border-olive-100/50 hover:border-olive-200 transition-all duration-500 hover:shadow-2xl hover:shadow-olive-900/5 hover:-translate-y-1 overflow-hidden',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cream-50/50 via-transparent to-olive-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-olive-50 flex items-center justify-center text-2xl mb-6 group-hover:bg-olive-100 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    {icon}
                </div>
                <h3 className="font-serif text-xl font-semibold text-olive-900 mb-3 group-hover:text-olive-700 transition-colors">
                    {title}
                </h3>
                <p className="text-olive-700/70 text-sm md:text-base leading-relaxed font-light">
                    {description}
                </p>
            </div>

            {/* Decorative Corner Icon */}
            <div className="absolute -bottom-4 -right-4 text-olive-100 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 rotate-12">
                <span className="text-8xl">{icon}</span>
            </div>
        </div>
    );
}
