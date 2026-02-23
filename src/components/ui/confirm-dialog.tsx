'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    variant = 'danger',
    isLoading = false,
}: ConfirmDialogProps) {
    // Prevent scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Dialog Wrapper */}
                    <motion.div
                        initial={{ opacity: 0, y: '100%', scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: '100%', scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full sm:max-w-[440px] md:max-w-[480px] bg-olive-900 border border-olive-700/30 shadow-2xl rounded-t-[2rem] sm:rounded-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[85vh]"
                    >
                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto overscroll-contain px-6 pt-10 pb-4">
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${variant === 'danger' ? 'bg-red-500/10 text-red-500 shadow-inner' :
                                    variant === 'warning' ? 'bg-amber-500/10 text-amber-500 shadow-inner' :
                                        'bg-gold-500/10 text-gold-500 shadow-inner'
                                    }`}>
                                    <AlertTriangle className="w-8 h-8" />
                                </div>

                                <h3 className="text-2xl font-serif text-cream-50 mb-3 tracking-tight">{title}</h3>
                                <p className="text-olive-400 text-sm sm:text-base leading-relaxed max-w-[320px] mx-auto">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Actions — Stick to bottom */}
                        <div className="p-6 bg-olive-900/50 backdrop-blur-sm border-t border-olive-800/20 mt-auto flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 order-2 sm:order-1 px-4 py-3.5 bg-white/5 hover:bg-white/10 text-cream-100/80 hover:text-cream-50 text-sm font-semibold rounded-xl transition-all border border-white/10 hover:border-white/20 active:scale-[0.98] disabled:opacity-50"
                            >

                                {cancelLabel}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`flex-1 order-1 sm:order-2 px-4 py-3.5 text-white text-sm font-bold rounded-xl transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' :
                                    variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' :
                                        'bg-gold-500 hover:bg-gold-400 shadow-gold-500/20'
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : null}
                                {confirmLabel}
                            </button>
                        </div>

                        {/* Close button (top right) */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-olive-500 hover:text-cream-50 transition-colors rounded-full hover:bg-olive-800/50"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

