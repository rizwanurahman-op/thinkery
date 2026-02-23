'use client';

import { useState, useRef, useCallback, useId } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    DndContext, closestCenter, PointerSensor, TouchSensor,
    KeyboardSensor, useSensor, useSensors, DragOverlay,
    type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext, useSortable, rectSortingStrategy,
    sortableKeyboardCoordinates, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    ImageIcon, Upload, Trash2, Loader2, Check,
    GripVertical, RefreshCw, Eye, Plus, X, AlertCircle,
} from 'lucide-react';
import type { GalleryImage } from '@/lib/settings-store';

const MAX_IMAGES = 12;

// ─── Unique ID helper (client-only) ──────────────────────────────────────────

function genId() {
    return `img-${Math.random().toString(36).slice(2, 9)}`;
}

// Each image in editing state carries a local id for stable dnd-kit keys
interface EditingImage extends GalleryImage {
    _id: string; // local stable key (not sent to server)
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useGalleryImages() {
    return useQuery<EditingImage[]>({
        queryKey: ['admin', 'gallery'],
        queryFn: async () => {
            const res = await fetch('/api/admin/settings');
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            const images: GalleryImage[] = json.data?.galleryImages ?? [];
            return images.map((img) => ({ ...img, _id: genId() }));
        },
        staleTime: 10_000,
    });
}

function useSaveGallery() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (images: EditingImage[]) => {
            // Strip _id before sending to API
            const galleryImages: GalleryImage[] = images.map(({ _id: _, ...rest }) => rest);
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ galleryImages }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            const saved: GalleryImage[] = json.data?.galleryImages ?? [];
            return saved.map((img) => ({ ...img, _id: genId() }));
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['admin', 'gallery'], data);
        },
    });
}

// ─── Single sortable image card ───────────────────────────────────────────────

function SortableImageCard({
    image,
    index,
    total,
    uploading,
    onUpload,
    onChange,
    onRemove,
}: {
    image: EditingImage;
    index: number;
    total: number;
    uploading: boolean;
    onUpload: (file: File) => void;
    onChange: (field: keyof GalleryImage, value: string) => void;
    onRemove: () => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image._id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        zIndex: isDragging ? 10 : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-[#1a2016] border border-olive-800/30 rounded-2xl overflow-hidden flex flex-col group hover:border-olive-700/50 transition-all duration-300 shadow-lg"
        >
            {/* Card top bar: drag handle + index + remove */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-olive-800/20">
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1 rounded-lg text-olive-600 hover:text-olive-400 hover:bg-olive-800/40 cursor-grab active:cursor-grabbing transition-colors touch-none"
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="w-4 h-4" />
                </button>
                <span className="w-5 h-5 rounded-full bg-olive-800/60 text-olive-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                </span>
                <span className="text-olive-500 text-xs flex-1 min-w-0 truncate">
                    {image.label || `Image ${index + 1}`}
                </span>
                <button
                    onClick={onRemove}
                    className="p-1 rounded-lg text-olive-700 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-auto shrink-0"
                    aria-label="Remove image"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Image preview / upload zone — 16:9 aspect */}
            <div className="relative mx-3 mt-3" style={{ aspectRatio: '16/9' }}>
                {uploading && (
                    <div className="absolute inset-0 z-20 rounded-xl flex flex-col items-center justify-center bg-olive-950/80 backdrop-blur-sm">
                        <Loader2 className="w-7 h-7 text-gold-400 animate-spin mb-1.5" />
                        <span className="text-olive-300 text-xs">Uploading…</span>
                    </div>
                )}

                {image.url ? (
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={image.url}
                            alt={image.alt || image.label}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 rounded-xl">
                            <button
                                onClick={() => fileRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-medium border border-white/20 transition-all"
                            >
                                <Upload className="w-3 h-3" /> Replace
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="absolute inset-0 rounded-xl border-2 border-dashed border-olive-700/40 hover:border-gold-500/50 hover:bg-gold-500/5 flex flex-col items-center justify-center gap-2 text-olive-500 hover:text-olive-300 transition-all disabled:opacity-50"
                    >
                        <div className="w-10 h-10 rounded-full bg-olive-800/40 border border-olive-700/30 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4" />
                        </div>
                        <div className="text-center px-4">
                            <p className="text-xs font-medium">Click to upload</p>
                            <p className="text-[10px] text-olive-700 mt-0.5">JPG · PNG · WebP · Max 10MB</p>
                        </div>
                    </button>
                )}

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUpload(file);
                        e.target.value = '';
                    }}
                />
            </div>

            {/* Label + Alt inputs */}
            <div className="p-3 pt-2 space-y-1.5 mt-auto">
                <input
                    value={image.label}
                    onChange={(e) => onChange('label', e.target.value)}
                    placeholder="Caption (e.g. The Bar)"
                    className="w-full px-2.5 py-1.5 bg-olive-800/30 border border-olive-700/20 rounded-lg text-cream-50 placeholder-olive-700 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500/40 focus:border-gold-500/30 transition-all"
                />
                <input
                    value={image.alt}
                    onChange={(e) => onChange('alt', e.target.value)}
                    placeholder="Alt text (for SEO & accessibility)"
                    className="w-full px-2.5 py-1.5 bg-olive-800/30 border border-olive-700/20 rounded-lg text-olive-500 placeholder-olive-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-gold-500/40 transition-all"
                />
            </div>
        </div>
    );
}

// Ghost card shown under the cursor while dragging
function DragGhostCard({ image }: { image: EditingImage }) {
    return (
        <div className="bg-[#1a2016] border border-gold-500/40 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 rotate-2 scale-105 w-64 opacity-95">
            {image.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image.url} alt="" className="w-full aspect-video object-cover rounded-t-2xl" />
            ) : (
                <div className="w-full aspect-video bg-olive-800/40 flex items-center justify-center rounded-t-2xl">
                    <ImageIcon className="w-8 h-8 text-olive-600" />
                </div>
            )}
            <div className="p-3">
                <p className="text-cream-50 text-xs font-medium truncate">{image.label || 'Untitled'}</p>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GalleryManagerPage() {
    const queryClient = useQueryClient();
    const dndId = useId();
    const { data: serverImages, isLoading, isError, refetch } = useGalleryImages();
    const saveGallery = useSaveGallery();

    const [images, setImages] = useState<EditingImage[] | null>(null);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [savedFlash, setSavedFlash] = useState(false);
    const [activeItem, setActiveItem] = useState<EditingImage | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const currentImages: EditingImage[] = images ?? serverImages ?? [];

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragStart = useCallback((e: DragStartEvent) => {
        setActiveItem(currentImages.find((img) => img._id === e.active.id) ?? null);
    }, [currentImages]);

    const handleDragEnd = useCallback((e: DragEndEvent) => {
        setActiveItem(null);
        const { active, over } = e;
        if (!over || active.id === over.id) return;
        setImages((prev) => {
            const list = prev ?? serverImages ?? [];
            const oldIdx = list.findIndex((img) => img._id === active.id);
            const newIdx = list.findIndex((img) => img._id === over.id);
            return arrayMove(list, oldIdx, newIdx);
        });
    }, [serverImages]);

    const updateImage = useCallback((id: string, field: keyof GalleryImage, value: string) => {
        setImages((prev) => {
            const list = prev ?? serverImages ?? [];
            return list.map((img) => img._id === id ? { ...img, [field]: value } : img);
        });
    }, [serverImages]);

    const removeImage = useCallback((id: string) => {
        setImages((prev) => {
            const list = prev ?? serverImages ?? [];
            return list.filter((img) => img._id !== id);
        });
    }, [serverImages]);

    const addSlot = useCallback(() => {
        const newImg: EditingImage = { _id: genId(), url: '', publicId: '', label: '', alt: '' };
        setImages((prev) => [...(prev ?? serverImages ?? []), newImg]);
    }, [serverImages]);

    const handleUpload = useCallback(async (id: string, file: File) => {
        setUploadError(null);
        setUploadingId(id);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            const json = await res.json();
            if (json.success && json.data?.url) {
                setImages((prev) => {
                    const list = prev ?? serverImages ?? [];
                    return list.map((img) =>
                        img._id === id
                            ? { ...img, url: json.data.url, publicId: json.data.publicId ?? '' }
                            : img,
                    );
                });
            } else {
                setUploadError(json.error || 'Upload failed — check Cloudinary credentials.');
            }
        } catch {
            setUploadError('Upload failed. Check your internet connection and try again.');
        } finally {
            setUploadingId(null);
        }
    }, [serverImages]);

    const handleSave = async () => {
        await saveGallery.mutateAsync(currentImages);
        setImages(null);
        queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 3000);
    };

    const isDirty = images !== null;
    const canAddMore = currentImages.length < MAX_IMAGES;

    // ── Loading ──
    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="animate-pulse space-y-4 max-w-5xl">
                    <div className="h-8 bg-olive-800/40 rounded-xl w-1/3" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-video bg-olive-800/20 rounded-2xl" />
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
                    Failed to load gallery settings.
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
                    <h1 className="text-2xl font-serif text-cream-50 mb-1">Gallery Manager</h1>
                    <p className="text-olive-500 text-sm">
                        Upload &amp; arrange photos for the{' '}
                        <span className="text-gold-400 font-medium">&ldquo;Designed for Clarity&rdquo;</span> section.
                        Drag to reorder · Up to {MAX_IMAGES} images.
                    </p>
                </div>
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-olive-800/40 border border-olive-700/30 rounded-xl text-olive-300 text-xs hover:text-cream-50 hover:border-olive-600/40 transition-all shrink-0"
                >
                    <Eye className="w-3.5 h-3.5" /> Preview Homepage
                </a>
            </div>

            {/* ── Layout info banner ── */}
            <div className="mb-6 p-4 bg-olive-900/40 border border-olive-800/20 rounded-xl flex gap-3">
                <AlertCircle className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div className="text-olive-400 text-xs leading-relaxed space-y-1">
                    <p><span className="text-gold-400 font-semibold">4 images:</span> Editorial mosaic — tall portrait (left) + wide + 2 medium (right).</p>
                    <p><span className="text-gold-400 font-semibold">5–12 images:</span> Editorial mosaic + horizontal scroll strip showing all extras.</p>
                    <p><span className="text-gold-400 font-semibold">Tip:</span> First image is most prominent. Drag to set the order shown on the homepage.</p>
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

            {/* ── DnD sortable grid ── */}
            <DndContext
                id={dndId}
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={currentImages.map((img) => img._id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentImages.map((image, index) => (
                            <SortableImageCard
                                key={image._id}
                                image={image}
                                index={index}
                                total={currentImages.length}
                                uploading={uploadingId === image._id}
                                onUpload={(file) => handleUpload(image._id, file)}
                                onChange={(field, value) => updateImage(image._id, field, value)}
                                onRemove={() => removeImage(image._id)}
                            />
                        ))}

                        {/* ── Add Image Card ── */}
                        {canAddMore && (
                            <button
                                onClick={addSlot}
                                className="border-2 border-dashed border-olive-700/40 hover:border-gold-500/50 hover:bg-gold-500/5 rounded-2xl flex flex-col items-center justify-center gap-3 text-olive-500 hover:text-olive-300 transition-all duration-300 min-h-[200px] group"
                            >
                                <div className="w-12 h-12 rounded-full bg-olive-800/40 border border-olive-700/30 group-hover:border-gold-500/40 flex items-center justify-center transition-all">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">Add Image</p>
                                    <p className="text-[11px] text-olive-700 mt-0.5">
                                        {currentImages.length}/{MAX_IMAGES} used
                                    </p>
                                </div>
                            </button>
                        )}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeItem ? <DragGhostCard image={activeItem} /> : null}
                </DragOverlay>
            </DndContext>

            {/* ── Empty state ── */}
            {currentImages.length === 0 && (
                <div className="text-center py-20 text-olive-600">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium text-olive-500">No gallery images yet</p>
                    <p className="text-sm mt-1">Click &ldquo;Add Image&rdquo; to get started</p>
                </div>
            )}

            {/* ── Sticky Save Bar ── */}
            <div className={`
                fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                flex items-center gap-4 px-5 py-3
                bg-olive-900/95 backdrop-blur-xl border rounded-2xl shadow-2xl shadow-black/40
                transition-all duration-500 min-w-[280px]
                ${isDirty || saveGallery.isPending
                    ? 'opacity-100 translate-y-0 border-gold-500/30'
                    : savedFlash
                        ? 'opacity-100 translate-y-0 border-emerald-500/30'
                        : 'opacity-0 translate-y-6 pointer-events-none border-olive-800/20'
                }
            `}>
                {savedFlash && !isDirty ? (
                    <>
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-emerald-300 text-sm font-medium">Saved — homepage updated!</span>
                    </>
                ) : (
                    <>
                        <span className="text-olive-400 text-sm">Unsaved changes</span>
                        <div className="flex items-center gap-2 ml-auto">
                            <button
                                onClick={() => setImages(null)}
                                disabled={saveGallery.isPending}
                                className="px-3 py-2 text-olive-400 hover:text-olive-200 text-xs rounded-lg hover:bg-olive-800/40 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saveGallery.isPending || uploadingId !== null}
                                className="flex items-center gap-2 px-5 py-2 bg-gold-500 hover:bg-gold-400 disabled:bg-olive-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-gold-500/20"
                            >
                                {saveGallery.isPending ? (
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
