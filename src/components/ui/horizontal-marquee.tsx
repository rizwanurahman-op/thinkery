import { OptimizedImage } from "@/components/ui/optimized-image";
import type { GalleryImage } from "@/lib/settings-store";

interface HorizontalMarqueeProps {
    images: GalleryImage[];
    onImageClick?: (image: GalleryImage) => void;
}

export function HorizontalMarquee({ images, onImageClick }: HorizontalMarqueeProps) {
    if (!images || images.length === 0) return null;

    // First we repeat the images until we have at least 10 items.
    // This ensures that even if there's only 1 extra image, the marquee fills ultra-wide screens seamlessly.
    let duplicatedImages = [...images];
    while (duplicatedImages.length < 10) {
        duplicatedImages = [...duplicatedImages, ...images];
    }

    // Now duplicatedImages forms one "half" of the track.
    // We double it to create a seamless infinite CSS loop.
    const items = [...duplicatedImages, ...duplicatedImages];

    return (
        <div
            className="relative w-full overflow-hidden py-4"
            style={{
                maskImage: 'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)'
            }}
        >
            {/* Scrolling Track Container */}
            <div className="flex w-max animate-marquee">
                {items.map((img, i) => (
                    <div
                        key={i}
                        onClick={() => onImageClick?.(img)}
                        className={`shrink-0 w-[240px] md:w-[320px] lg:w-[380px] h-[180px] md:h-[220px] lg:h-[260px] rounded-[1.5rem] overflow-hidden shadow-xl shadow-black/5 relative group ml-4 md:ml-6 ${onImageClick ? 'cursor-pointer' : ''}`}
                    >
                        <OptimizedImage
                            src={img.url}
                            alt={img.alt || img.label || 'Gallery image'}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 480px, (max-width: 1024px) 640px, 760px"
                            quality={85}
                            loading="lazy"
                        />

                        {/* Persistent Bottom Gradient for Title Legibility + Darker Overlay on Hover/Mobile */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                        {/* Title and Description Text */}
                        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 z-20 flex flex-col justify-end pointer-events-none">
                            {img.label && (
                                <div className="transform transition-transform duration-500">
                                    <span className="inline-block text-white text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase border border-white/30 bg-white/10 px-3 md:px-3.5 py-1.5 rounded-full backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                                        {img.label}
                                    </span>
                                </div>
                            )}
                            {img.alt && img.alt !== img.label && (
                                <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
                                    <div className="overflow-hidden">
                                        <div className="pt-2 md:pt-3">
                                            <p className="text-white text-xs md:text-sm font-light line-clamp-2 md:line-clamp-3 leading-relaxed border border-white/30 bg-white/10 backdrop-blur-xl rounded-2xl p-3 shadow-xl">
                                                {img.alt}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
