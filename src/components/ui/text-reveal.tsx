'use client';

import { motion, useInView, Variant } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface TextRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
    blur?: boolean;
    scale?: boolean;
    yOffset?: number;
    as?: React.ElementType;
    staggerChildren?: number;
    staggerDirection?: 1 | -1;
}

export function TextReveal({
    children,
    className,
    delay = 0,
    duration = 0.8,
    threshold = 0.2,
    once = true,
    blur = true,
    scale = false,
    yOffset = 20,
    as: Component = 'div',
    staggerChildren = 0.05,
    staggerDirection = 1,
}: TextRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount: threshold });

    const variants: { [key: string]: Variant } = {
        hidden: {
            opacity: 0,
            y: yOffset,
            scale: scale ? 0.95 : 1,
            filter: blur ? 'blur(8px)' : 'blur(0px)',
            transition: {
                duration: duration,
                ease: [0.22, 1, 0.36, 1],
            }
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: duration,
                delay: delay,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: staggerChildren,
                staggerDirection: staggerDirection,
            }
        },
    };

    const MotionComponent = useMemo(() => {
        if (typeof Component === 'string' && (motion as any)[Component]) {
            return (motion as any)[Component];
        }
        return motion(Component as any);
    }, [Component]);

    return (
        <MotionComponent
            ref={ref}
            className={cn(className)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
        >
            {children}
        </MotionComponent>
    );
}
