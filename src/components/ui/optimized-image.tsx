'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    sizes?: string;
    quality?: number;
    loading?: "lazy" | "eager";
}

export function OptimizedImage({
    src,
    alt,
    fill = true,
    width,
    height,
    className = '',
    priority = false,
    sizes,
    quality = 75, // Default Next.js quality is 75, returning to it for optimal performance
    loading,
}: OptimizedImageProps) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div
                className={`bg-gradient-to-br from-olive-100 via-sage-100 to-cream-100 flex items-center justify-center ${className}`}
                style={!fill ? { width, height } : { position: 'absolute', inset: 0 }}
            >
                <div className="text-center p-6">
                    <div className="text-4xl mb-2">🌿</div>
                    <p className="text-olive-500 text-xs font-medium">{alt}</p>
                </div>
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill={fill}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            className={className}
            priority={priority}
            sizes={sizes}
            quality={quality}
            loading={loading}
            onError={() => setError(true)}
        />
    );
}
