'use client';

import { useState } from 'react';
import { Section } from '@/components/ui/section';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { TextReveal } from '@/components/ui/text-reveal';
import { HorizontalMarquee } from '@/components/ui/horizontal-marquee';
import type { GalleryImage } from '@/lib/settings-store';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// ─── Static fallbacks (used when no Cloudinary images uploaded yet) ───────────
const STATIC_FALLBACKS: GalleryImage[] = [
    { url: '/images/gallery-4.jpg', publicId: '', label: 'The Entrance', alt: 'Thinkery Café minimal archway entrance in Calicut' },
    { url: '/images/gallery-1.jpg', publicId: '', label: 'Main Lounge', alt: 'Green-inspired minimal interior seating at Thinkery Café' },
    { url: '/images/gallery-2.jpg', publicId: '', label: 'The Bar', alt: 'Coffee bar and brewing station at Thinkery Café' },
    { url: '/images/gallery-3.jpg', publicId: '', label: 'Workspace', alt: 'Workspace area with power outlets at Thinkery Café Calicut' },
];

interface GallerySectionProps {
    galleryImages?: GalleryImage[];
}

// ─── Image slot component (deduplicates repetition) ──────────────────────────
function GallerySlotImage({
    image,
    sizes,
    priority = false,
    className = '',
    onClick,
}: {
    image: GalleryImage;
    sizes: string;
    priority?: boolean;
    className?: string;
    onClick?: (image: GalleryImage) => void;
}) {
    return (
        <div
            onClick={() => onClick?.(image)}
            className={`relative overflow-hidden group shadow-2xl shadow-olive-900/20 ${className} ${onClick ? 'cursor-pointer' : ''}`}
        >
            <OptimizedImage
                src={image.url}
                alt={image.alt || image.label}
                fill
                className="object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-108"
                sizes={sizes}
                priority={priority}
            />
            {/* Persistent Bottom Gradient for Title Legibility + Darker Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

            {/* Title and Description Text */}
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 z-20 flex flex-col justify-end pointer-events-none">
                {image.label && (
                    <div className="transform transition-transform duration-500">
                        <span className="inline-block text-white text-[11px] md:text-sm font-bold tracking-[0.2em] uppercase border border-white/30 bg-white/10 px-3.5 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                            {image.label}
                        </span>
                    </div>
                )}
                {image.alt && image.alt !== image.label && (
                    <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
                        <div className="overflow-hidden">
                            <div className="pt-3 md:pt-4">
                                <p className="text-white text-sm md:text-base font-light line-clamp-2 md:line-clamp-3 leading-relaxed border border-white/30 bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-2xl">
                                    {image.alt}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Adaptive gallery grid ────────────────────────────────────────────────────
//
// Layout rules:
//  1 image  → single full hero (2:1 ratio)
//  2 images → 50/50 columns
//  3 images → tall left + 2 stacked right
//  4 images → editorial mosaic: tall portrait left + wide top-right + 2 medium bottom-right  ← flagship
//  5+ images→ editorial mosaic (first 4) + horizontal scroll strip (rest)

function GalleryGrid({ images, onImageClick }: { images: GalleryImage[], onImageClick?: (img: GalleryImage) => void }) {
    const count = images.length;

    if (count === 0) return null;

    // ── 1 image ──
    if (count === 1) {
        return (
            <div className="w-full px-4 md:px-6 pb-20">
                <GallerySlotImage
                    image={images[0]}
                    sizes="100vw"
                    priority
                    onClick={onImageClick}
                    className="w-full rounded-[2.5rem] h-[50vh] md:h-[65vh] min-h-[300px]"
                />
            </div>
        );
    }

    // ── 2 images ──
    if (count === 2) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full px-4 md:px-6 pb-20">
                {images.map((img, i) => (
                    <GallerySlotImage
                        key={i}
                        image={img}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={i === 0}
                        onClick={onImageClick}
                        className="rounded-[2.5rem] h-[40vh] md:h-[55vh] min-h-[260px]"
                    />
                ))}
            </div>
        );
    }

    // ── 3 images ──
    if (count === 3) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full px-4 md:px-6 pb-20">
                {/* Left — tall */}
                <GallerySlotImage
                    image={images[0]}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    onClick={onImageClick}
                    className="md:row-span-2 rounded-[2.5rem] h-[45vh] md:h-auto min-h-[420px]"
                />
                {/* Right — 2 stacked */}
                {images.slice(1).map((img, i) => (
                    <GallerySlotImage
                        key={i}
                        image={img}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onClick={onImageClick}
                        className="rounded-[2.5rem] h-[32vh] md:h-[calc(50%-12px)] min-h-[200px]"
                    />
                ))}
            </div>
        );
    }

    // ── 4+ images: editorial mosaic ──
    const heroImages = images.slice(0, 4);
    const extraImages = images.slice(4);

    return (
        <div className="w-full pb-20 space-y-4 md:space-y-6">
            {/* Editorial mosaic — first 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 w-full px-4 md:px-0">

                {/* Slot 0 — tall portrait, spans 2 rows */}
                <TextReveal
                    as="div"
                    delay={0.2}
                    className="md:col-span-1 lg:col-span-4 lg:row-span-2 h-[50vh] md:h-auto min-h-[300px] lg:min-h-[500px] rounded-[2.5rem]"
                >
                    <GallerySlotImage
                        image={heroImages[0]}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority
                        onClick={onImageClick}
                        className="w-full h-full rounded-[2.5rem]"
                    />
                </TextReveal>

                {/* Slot 1 — wide top-right */}
                <TextReveal
                    as="div"
                    delay={0.3}
                    className="md:col-span-1 lg:col-span-8 h-[35vh] md:h-[40vh] lg:h-[45vh] min-h-[280px] rounded-[2.5rem]"
                >
                    <GallerySlotImage
                        image={heroImages[1]}
                        sizes="(max-width: 768px) 100vw, 66vw"
                        onClick={onImageClick}
                        className="w-full h-full rounded-[2.5rem]"
                    />
                </TextReveal>

                {/* Slot 2 — medium bottom-right left */}
                <TextReveal
                    as="div"
                    delay={0.4}
                    className="md:col-span-1 lg:col-span-4 h-[30vh] md:h-[40vh] lg:h-[38vh] min-h-[220px] rounded-[2.5rem]"
                >
                    <GallerySlotImage
                        image={heroImages[2]}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        onClick={onImageClick}
                        className="w-full h-full rounded-[2.5rem]"
                    />
                </TextReveal>

                {/* Slot 3 — medium bottom-right right */}
                <TextReveal
                    as="div"
                    delay={0.5}
                    className="md:col-span-1 lg:col-span-4 h-[30vh] md:h-[40vh] lg:h-[38vh] min-h-[220px] rounded-[2.5rem]"
                >
                    <GallerySlotImage
                        image={heroImages[3]}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        onClick={onImageClick}
                        className="w-full h-full rounded-[2.5rem]"
                    />
                </TextReveal>
            </div>

            {/* Extra images — horizontal scroll strip (images 5+) */}
            {extraImages.length > 0 && (
                <div className="w-full mt-10 md:mt-16 overflow-hidden">
                    <div className="px-4 md:px-6 mb-4">
                        <p className="text-olive-500 text-xs uppercase tracking-widest flex items-center gap-3">
                            <span className="h-px w-6 bg-olive-600 inline-block" />
                            More from our space
                        </p>
                    </div>
                    <HorizontalMarquee images={extraImages} onImageClick={onImageClick} />
                </div>
            )}
        </div>
    );
}

// ─── Main exported section ────────────────────────────────────────────────────

export function GallerySection({ galleryImages }: GallerySectionProps) {
    // Resolve: use uploaded images if any have a URL, otherwise use static fallbacks
    const hasUploaded = galleryImages?.some((img) => !!img.url);
    const displayImages = hasUploaded
        ? (galleryImages ?? []).filter((img) => !!img.url)
        : STATIC_FALLBACKS;

    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    return (
        <Section className="py-0 relative bg-cream-50 overflow-hidden">
            {/* CSS texture overlay */}
            <div className="absolute inset-0 bg-fluted opacity-20 pointer-events-none" aria-hidden="true" />

            <div className="relative w-full">

                {/* ── Editorial Header ── */}
                <div className="relative z-20 max-w-[90rem] mx-auto px-6 pt-12 pb-12 md:pt-12 md:pb-16 grid md:grid-cols-12 gap-8 md:gap-12 items-end">
                    <div className="md:col-span-7">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="h-px w-8 bg-olive-400" aria-hidden="true" />
                            <TextReveal as="span" className="text-olive-600 font-medium tracking-[0.2em] text-xs uppercase">
                                The Interiors
                            </TextReveal>
                        </div>
                        <TextReveal
                            as="h2"
                            delay={0.1}
                            className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-olive-900 leading-[0.9] tracking-tight"
                        >
                            Designed for <br />
                            <span className="italic text-olive-500 ml-4 md:ml-12">Clarity.</span>
                        </TextReveal>
                    </div>
                    <div className="md:col-span-5 md:pb-4">
                        <TextReveal
                            as="p"
                            delay={0.3}
                            className="text-lg md:text-xl text-olive-800/80 font-light leading-relaxed max-w-md ml-auto border-l border-olive-200 pl-6"
                        >
                            A peek into our minimal, green-inspired interiors — thoughtfully crafted for calm, comfort, and conversation.
                        </TextReveal>
                    </div>
                </div>

                {/* ── Adaptive image grid ── */}
                <GalleryGrid images={displayImages} onImageClick={setSelectedImage} />

            </div>

            {/* ── Lightbox Modal ── */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-olive-950/80 backdrop-blur-md p-4 sm:p-6"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
                            className="relative w-full max-w-5xl max-h-[90vh] md:max-h-[85vh] bg-olive-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-gold-500/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button on the Modal */}
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 z-20 p-2 md:p-2.5 text-cream-50/70 hover:text-white bg-olive-950/40 hover:bg-olive-950 rounded-full backdrop-blur-md transition-all sm:top-5 sm:right-5 shadow-lg"
                                aria-label="Close Preview"
                            >
                                <X className="w-5 h-5 md:w-6 md:h-6" />
                            </button>

                            {/* Image Area - Flexible height to accommodate different ratios */}
                            <div className="relative w-full shrink-1 flex-auto flex items-center justify-center bg-olive-950 overflow-hidden min-h-[30vh]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.alt || selectedImage.label || 'Gallery Preview'}
                                    className="max-w-full max-h-full w-auto h-auto object-contain"
                                />
                            </div>

                            {/* Text / Caption Area */}
                            {(selectedImage.label || selectedImage.alt) && (
                                <div className="p-6 md:p-8 shrink-0 overflow-y-auto max-h-[35vh]">
                                    {selectedImage.label && (
                                        <div className="mb-3">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-[10px] md:text-xs uppercase tracking-widest font-medium">
                                                {selectedImage.label}
                                            </span>
                                        </div>
                                    )}
                                    {selectedImage.alt && selectedImage.alt !== selectedImage.label && (
                                        <p className="text-cream-50/90 text-sm md:text-base font-light leading-relaxed max-w-3xl">
                                            {selectedImage.alt}
                                        </p>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Section>
    );
}
