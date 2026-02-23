'use client';

import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ImageIcon, Upload, Loader2, Check, RefreshCw,
    X, AlertCircle, RotateCcw, Eye,
} from 'lucide-react';
import type { PageImages, PageImage } from '@/lib/settings-store';

// ─── Default fallback URLs (local static images) ────────────────────────────

const DEFAULTS: PageImages = {
    heroMain: {
        url: '/images/shop-interior.jpg',
        publicId: '',
        alt: 'Thinkery Café interior — sophisticated olive and cream design with brass accents',
    },
    aboutBig: {
        url: '/images/cafe-interior-2.jpg',
        publicId: '',
        alt: 'Premium Thinkery workspace — calm café interior in Calicut',
    },
    aboutSmall: {
        url: '/images/shop-interior.jpg',
        publicId: '',
        alt: 'Calm corner for reading at Thinkery Café',
    },
    aboutPageMain: {
        url: '/images/cafe-interior-2.jpg',
        publicId: '',
        alt: 'The Thinkery Journey — café interior in Calicut',
    },
    workAndMeetMain: {
        url: '/images/workspace.jpg',
        publicId: '',
        alt: 'Premium Thinkery workspace in Calicut',
    },
};

// Meta for each slot
const SLOTS: {
    key: keyof PageImages;
    label: string;
    description: string;
    hint: string;
    page: string;
    aspect: string;
}[] = [
        {
            key: 'heroMain',
            label: 'Hero Image',
            description: 'Main image shown in the Hero section on the homepage.',
            hint: 'Desktop: right-panel portrait. Mobile: full-screen background.',
            page: 'Homepage › Hero',
            aspect: '3/4',
        },
        {
            key: 'aboutBig',
            label: 'About — Main Image',
            description: 'Large portrait image in the About section on the homepage.',
            hint: 'Displayed as a tall arch-shaped portrait on the left.',
            page: 'Homepage › About',
            aspect: '3/4',
        },
        {
            key: 'aboutSmall',
            label: 'About — Overlay Image',
            description: 'Small square overlay card image shown bottom-right of the About section.',
            hint: 'Appears as a floating card over the main image.',
            page: 'Homepage › About',
            aspect: '1/1',
        },
        {
            key: 'aboutPageMain',
            label: 'About Page — Story Image',
            description: 'Tall arch portrait in the Story section of the About page.',
            hint: 'Shown on the left side of the "Built for thinkers & dreamers" section.',
            page: 'About Page › Story',
            aspect: '3/4',
        },
        {
            key: 'workAndMeetMain',
            label: 'Work & Meet — Main Image',
            description: 'Tall arch portrait in the main section of the Work & Meet page.',
            hint: 'Shown on the left side of the work sanctuary copy.',
            page: 'Work & Meet Page › Hero',
            aspect: '3/4',
        },
    ];

// ─── Hooks ─────────────────────────────────────────────────────────────────

function usePageImages() {
    return useQuery<PageImages>({
        queryKey: ['admin', 'pageImages'],
        queryFn: async () => {
            const res = await fetch('/api/admin/settings');
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return (json.data?.pageImages ?? DEFAULTS) as PageImages;
        },
        staleTime: 10_000,
    });
}

function useSavePageImages() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (pageImages: PageImages) => {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pageImages }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return (json.data?.pageImages ?? DEFAULTS) as PageImages;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['admin', 'pageImages'], data);
        },
    });
}

// ─── Individual Image Card ───────────────────────────────────────────────────

function PageImageCard({
    slotKey,
    meta,
    image,
    uploadingKey,
    onUpload,
    onAltChange,
    onReset,
}: {
    slotKey: keyof PageImages;
    meta: typeof SLOTS[number];
    image: PageImage;
    uploadingKey: string | null;
    onUpload: (key: keyof PageImages, file: File) => void;
    onAltChange: (key: keyof PageImages, alt: string) => void;
    onReset: (key: keyof PageImages) => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const isUploading = uploadingKey === slotKey;
    const isCustom = image.publicId !== '';
    const isDefaultLocal = image.url.startsWith('/images/');

    return (
        <div className="bg-[#1a2016] border border-olive-800/30 rounded-2xl overflow-hidden flex flex-col gap-0 hover:border-olive-700/40 transition-all duration-300">
            {/* Card header */}
            <div className="flex items-start justify-between gap-3 px-4 py-3.5 border-b border-olive-800/20">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-cream-50 text-sm font-medium leading-snug">{meta.label}</span>
                        {isCustom ? (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Custom
                            </span>
                        ) : (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-olive-700/40 text-olive-500 border border-olive-700/20">
                                Default
                            </span>
                        )}
                    </div>
                    <p className="text-olive-600 text-[11px] leading-snug">{meta.page}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    {isCustom && (
                        <button
                            onClick={() => onReset(slotKey)}
                            title="Reset to default image"
                            className="p-1.5 rounded-lg text-olive-600 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Image preview */}
            <div className="relative mx-3 mt-3" style={{ aspectRatio: meta.aspect }}>
                {isUploading && (
                    <div className="absolute inset-0 z-20 rounded-xl flex flex-col items-center justify-center bg-olive-950/85 backdrop-blur-sm">
                        <Loader2 className="w-7 h-7 text-gold-400 animate-spin mb-1.5" />
                        <span className="text-olive-300 text-xs">Uploading…</span>
                    </div>
                )}

                <div className="relative w-full h-full rounded-xl overflow-hidden group bg-olive-900/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            // If local image fails (dev env), show placeholder
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 rounded-xl">
                        <button
                            onClick={() => fileRef.current?.click()}
                            disabled={isUploading}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-medium border border-white/20 transition-all"
                        >
                            <Upload className="w-3 h-3" />
                            {isCustom ? 'Replace' : 'Upload'}
                        </button>
                        {image.url && !isDefaultLocal && (
                            <a
                                href={image.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-medium border border-white/20 transition-all"
                            >
                                <Eye className="w-3 h-3" />
                                View Full
                            </a>
                        )}
                    </div>
                </div>

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUpload(slotKey, file);
                        e.target.value = '';
                    }}
                />
            </div>

            {/* Upload button (always visible below image) */}
            <div className="px-3 pt-2">
                <button
                    onClick={() => fileRef.current?.click()}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-olive-800/30 hover:bg-olive-700/40 border border-olive-700/20 hover:border-gold-500/30 rounded-lg text-olive-400 hover:text-cream-50 text-xs font-medium transition-all disabled:opacity-40"
                >
                    <Upload className="w-3 h-3" />
                    {isCustom ? 'Replace Image' : 'Upload to Cloudinary'}
                </button>
            </div>

            {/* Description & hint */}
            <div className="px-3 pb-1 pt-2 space-y-1">
                <p className="text-olive-500 text-[11px] leading-relaxed">{meta.description}</p>
                <p className="text-olive-700 text-[10px] italic">{meta.hint}</p>
            </div>

            {/* Alt text */}
            <div className="px-3 pb-3">
                <input
                    value={image.alt}
                    onChange={(e) => onAltChange(slotKey, e.target.value)}
                    placeholder="Alt text (for SEO & accessibility)"
                    className="w-full px-2.5 py-1.5 bg-olive-800/30 border border-olive-700/20 rounded-lg text-olive-400 placeholder-olive-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-gold-500/40 focus:border-gold-500/30 transition-all"
                />
            </div>
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PagesManagerPage() {
    const queryClient = useQueryClient();
    const { data: serverImages, isLoading, isError, refetch } = usePageImages();
    const saveImages = useSavePageImages();

    const [images, setImages] = useState<PageImages | null>(null);
    const [uploadingKey, setUploadingKey] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [savedFlash, setSavedFlash] = useState(false);

    const current: PageImages = images ?? serverImages ?? DEFAULTS;
    const isDirty = images !== null;

    const handleUpload = useCallback(async (key: keyof PageImages, file: File) => {
        setUploadError(null);
        setUploadingKey(key);
        try {
            const formData = new FormData();
            formData.append('file', file);
            // Upload to pages-specific folder
            const res = await fetch('/api/admin/upload?folder=calm-cafe/pages', { method: 'POST', body: formData });
            const json = await res.json();
            if (json.success && json.data?.url) {
                setImages((prev) => {
                    const base = prev ?? serverImages ?? DEFAULTS;
                    return {
                        ...base,
                        [key]: {
                            ...base[key],
                            url: json.data.url,
                            publicId: json.data.publicId ?? '',
                        },
                    };
                });
            } else {
                setUploadError(json.error || 'Upload failed — check Cloudinary credentials.');
            }
        } catch {
            setUploadError('Upload failed. Check your internet connection and try again.');
        } finally {
            setUploadingKey(null);
        }
    }, [serverImages]);

    const handleAltChange = useCallback((key: keyof PageImages, alt: string) => {
        setImages((prev) => {
            const base = prev ?? serverImages ?? DEFAULTS;
            return { ...base, [key]: { ...base[key], alt } };
        });
    }, [serverImages]);

    const handleReset = useCallback((key: keyof PageImages) => {
        setImages((prev) => {
            const base = prev ?? serverImages ?? DEFAULTS;
            return { ...base, [key]: DEFAULTS[key] };
        });
    }, [serverImages]);

    const handleSave = async () => {
        await saveImages.mutateAsync(current);
        setImages(null);
        queryClient.invalidateQueries({ queryKey: ['admin', 'pageImages'] });
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 3000);
    };

    // ── Loading ──
    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="animate-pulse space-y-4 max-w-5xl">
                    <div className="h-8 bg-olive-800/40 rounded-xl w-1/3" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-olive-800/20 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ── Error ──
    if (isError) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm max-w-xl">
                    Failed to load page image settings.
                    <button onClick={() => refetch()} className="ml-auto flex items-center gap-1.5 text-xs hover:text-red-300">
                        <RefreshCw className="w-3.5 h-3.5" /> Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto pb-28">

            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-serif text-cream-50 mb-1">Page Images</h1>
                    <p className="text-olive-500 text-sm">
                        Manage the key section images for the{' '}
                        <span className="text-gold-400 font-medium">Hero, About & Work&nbsp;and&nbsp;Meet</span>{' '}
                        pages. Upload to Cloudinary or reset to defaults.
                    </p>
                </div>
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-olive-800/40 border border-olive-700/30 rounded-xl text-olive-300 text-xs hover:text-cream-50 hover:border-olive-600/40 transition-all shrink-0"
                >
                    <Eye className="w-3.5 h-3.5" /> Preview Site
                </a>
            </div>

            {/* ── Info banner ── */}
            <div className="mb-6 p-4 bg-olive-900/40 border border-olive-800/20 rounded-xl flex gap-3">
                <AlertCircle className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div className="text-olive-400 text-xs leading-relaxed space-y-1">
                    <p><span className="text-gold-400 font-semibold">Default images:</span> Local static photos are used until you upload a custom Cloudinary image.</p>
                    <p><span className="text-gold-400 font-semibold">Recommended:</span> Portrait images (3:4 ratio) work best for Hero & About. Square (1:1) for the About overlay card.</p>
                    <p><span className="text-gold-400 font-semibold">Tip:</span> Click <em>Reset to default</em> (↺ icon) to restore any image back to the local static photo.</p>
                </div>
            </div>

            {/* ── Upload error ── */}
            {uploadError && (
                <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {uploadError}
                    <button onClick={() => setUploadError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
                </div>
            )}

            {/* ── Cards grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SLOTS.map((slot) => (
                    <PageImageCard
                        key={slot.key}
                        slotKey={slot.key}
                        meta={slot}
                        image={current[slot.key]}
                        uploadingKey={uploadingKey}
                        onUpload={handleUpload}
                        onAltChange={handleAltChange}
                        onReset={handleReset}
                    />
                ))}
            </div>

            {/* ── Sticky Save Bar ── */}
            <div className={`
                fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                flex items-center gap-4 px-5 py-3
                bg-olive-900/95 backdrop-blur-xl border rounded-2xl shadow-2xl shadow-black/40
                transition-all duration-500 min-w-[280px]
                ${isDirty || saveImages.isPending
                    ? 'opacity-100 translate-y-0 border-gold-500/30'
                    : savedFlash
                        ? 'opacity-100 translate-y-0 border-emerald-500/30'
                        : 'opacity-0 translate-y-6 pointer-events-none border-olive-800/20'
                }
            `}>
                {savedFlash && !isDirty ? (
                    <>
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-emerald-300 text-sm font-medium">Saved — pages updated!</span>
                    </>
                ) : (
                    <>
                        <span className="text-olive-400 text-sm">Unsaved changes</span>
                        <div className="flex items-center gap-2 ml-auto">
                            <button
                                onClick={() => setImages(null)}
                                disabled={saveImages.isPending}
                                className="px-3 py-2 text-olive-400 hover:text-olive-200 text-xs rounded-lg hover:bg-olive-800/40 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saveImages.isPending || uploadingKey !== null}
                                className="flex items-center gap-2 px-5 py-2 bg-gold-500 hover:bg-gold-400 disabled:bg-olive-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-gold-500/20"
                            >
                                {saveImages.isPending ? (
                                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                                ) : (
                                    <><Check className="w-3.5 h-3.5" /> Save &amp; Publish</>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
