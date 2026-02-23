'use client';

import { motion } from 'framer-motion';

/** Tiny client island — just the bouncing ✨ emoji animation */
export function AnimatedEmoji({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={className}
            aria-hidden="true"
        >
            {children}
        </motion.span>
    );
}
