'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
    yOffset?: number;
    as?: React.ElementType;
}

// ✅ Pre-built motion component map — defined OUTSIDE component to avoid recreation on every render
const MOTION_ELEMENTS = {
    div: motion.div,
    p: motion.p,
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    h4: motion.h4,
    h5: motion.h5,
    h6: motion.h6,
    span: motion.span,
    section: motion.section,
    article: motion.article,
    blockquote: motion.blockquote,
    ul: motion.ul,
    li: motion.li,
} as const;

type MotionElementKey = keyof typeof MOTION_ELEMENTS;

export function TextReveal({
    children,
    className,
    delay = 0,
    duration = 0.65,
    threshold = 0.1,
    once = true,
    yOffset = 22,
    as: Component = 'div',
}: TextRevealProps) {
    // ✅ Respect user's accessibility preference — no animation if they prefer reduced motion
    const prefersReducedMotion = useReducedMotion();

    // ✅ Resolve the correct motion component from the pre-built map
    const MotionComponent = (
        typeof Component === 'string' && Component in MOTION_ELEMENTS
            ? MOTION_ELEMENTS[Component as MotionElementKey]
            : motion.div
    ) as React.ElementType;

    // ✅ If user prefers reduced motion, render a plain element with no animation
    if (prefersReducedMotion) {
        const Tag = Component as React.ElementType;
        return <Tag className={cn(className)}>{children}</Tag>;
    }

    return (
        <MotionComponent
            className={cn(className)}
            // ✅ SEO note: content IS in the DOM (Google reads it), just visually offset.
            // whileInView is the correct Framer Motion pattern for scroll animations.
            // It animates IN when the element enters the viewport, and stays visible after.
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, amount: threshold }}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </MotionComponent>
    );
}
