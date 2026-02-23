'use client';

import { useState, useRef, useCallback, useEffect } from 'react'; // useRef: fileInputRef
import {
    useCategories, useMenuItems,
    useCreateCategory, useUpdateCategory, useDeleteCategory,
    useCreateItem, useUpdateItem, useDeleteItem,
} from '@/hooks/use-menu-admin';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MenuItem, MenuCategoryItem } from '@/types';
import {
    Plus, Pencil, Trash2, X, Eye, EyeOff,
    FolderOpen, UtensilsCrossed, Upload, ImageIcon, Tag, Check,
    GripVertical, Loader2,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

// ─── dnd-kit ───
import {
    DndContext,
    closestCenter,
    PointerSensor,
    TouchSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ─── Types ───

type Tab = 'categories' | 'items';

interface CategoryFormData {
    id: string;
    label: string;
    icon: string;
    sortOrder: number;
}

interface ItemFormData {
    id: string;
    name: string;
    description: string;
    shortDesc: string;
    price: string;
    categoryId: string;
    badge: string;
    image: string;
    imagePublicId: string;
    isActive: boolean;
    sortOrder: number;
}

const emptyCategoryForm: CategoryFormData = { id: '', label: '', icon: '📋', sortOrder: 1 };
const emptyItemForm: ItemFormData = { id: '', name: '', description: '', shortDesc: '', price: '', categoryId: '', badge: '', image: '', imagePublicId: '', isActive: true, sortOrder: 1 };

// ─── Modal ───

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-olive-900 border border-olive-700/30 sm:rounded-2xl rounded-t-2xl shadow-2xl w-full sm:max-w-lg flex flex-col max-h-[90vh] sm:max-h-[85vh] sm:m-4">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-olive-800/30 shrink-0">
                    <h3 className="text-lg font-serif text-cream-50">{title}</h3>
                    <button onClick={onClose} className="text-olive-500 hover:text-cream-50 transition-colors p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1">{children}</div>
            </div>
        </div>
    );
}

// ─── Form Helpers ───

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mb-4">
            <label className="block text-xs font-medium text-olive-400 mb-2 uppercase tracking-wider">{label}</label>
            {children}
        </div>
    );
}

function Input({ value, onChange, placeholder, type, ...props }: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & { value: string; onChange: (v: string) => void }) {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            type={type}
            className="w-full px-4 py-3 bg-olive-800/50 border border-olive-700/30 rounded-xl text-cream-50 placeholder-olive-600 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/40 transition-all"
            {...props}
        />
    );
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full px-4 py-3 bg-olive-800/50 border border-olive-700/30 rounded-xl text-cream-50 placeholder-olive-600 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/40 transition-all resize-none"
        />
    );
}

function AccentInput({ value = '', onChange }: { value?: string; onChange: (v: string) => void }) {
    const tags = value.split('•').map((t) => t.trim()).filter(Boolean);
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = inputValue.trim().replace(/•/g, '');
            if (val && !tags.includes(val)) {
                onChange([...tags, val].join(' • '));
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            e.preventDefault();
            onChange(tags.slice(0, -1).join(' • '));
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter((t) => t !== tagToRemove).join(' • '));
    };

    return (
        <div className="space-y-2">
            <div className={`flex flex-wrap items-center gap-2 p-2 min-h-[46px] bg-olive-900 border transition-all rounded-xl cursor-text ${inputValue ? 'border-gold-500/40 ring-1 ring-gold-500/40' : 'border-olive-700/50 focus-within:border-gold-500/40 focus-within:ring-1 focus-within:ring-gold-500/40'}`}>
                {tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-olive-800 text-cream-50 text-[11px] uppercase tracking-widest font-medium rounded-lg border border-olive-700/50">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-olive-400 hover:text-red-400 p-0.5 rounded transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                        const val = inputValue.trim().replace(/•/g, '');
                        if (val && !tags.includes(val)) {
                            onChange([...tags, val].join(' • '));
                        }
                        setInputValue('');
                    }}
                    placeholder={tags.length === 0 ? "Type keyword & press Enter" : "Add keyword..."}
                    className="flex-1 min-w-[140px] bg-transparent text-sm text-cream-50 placeholder:text-olive-600 focus:outline-none"
                />
            </div>
            <p className="text-[10px] text-olive-500 leading-tight">
                Type a keyword and press <kbd className="px-1 py-0.5 border border-olive-700/50 bg-olive-800 rounded mx-0.5 text-olive-400 font-sans shadow-sm">Enter</kbd> or <kbd className="px-1 py-0.5 border border-olive-700/50 bg-olive-800 rounded mx-0.5 text-olive-400 font-sans shadow-sm">,</kbd> to add it.
            </p>
        </div>
    );
}

// ─── Drag overlay drop animation ───

const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: { active: { opacity: '0.5' } },
    }),
};

// ─── Sortable Item Card ───

function SortableItemCard({
    item,
    categories,
    showPrices,
    isDragging,
    onEdit,
    onDelete,
    onToggleActive,
}: {
    item: MenuItem;
    categories: MenuCategoryItem[];
    showPrices: boolean;
    isDragging?: boolean;
    onEdit: (item: MenuItem) => void;
    onDelete: (id: string) => void;
    onToggleActive: (item: MenuItem) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging ? 0.35 : 1,
        zIndex: isSortableDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-olive-900/30 border rounded-2xl overflow-hidden transition-all
                ${item.isActive ? 'border-olive-800/20' : 'border-red-900/20 opacity-60'}
                ${isDragging ? 'shadow-2xl shadow-black/30 scale-[1.02] border-gold-500/30' : 'hover:border-olive-600/30'}
            `}
        >
            {/* Drag handle strip */}
            <div
                {...attributes}
                {...listeners}
                className="flex items-center justify-center h-7 bg-olive-800/20 border-b border-olive-800/20 cursor-grab active:cursor-grabbing group/handle select-none touch-none"
                title="Drag to reorder"
            >
                <GripVertical className="w-4 h-4 text-olive-600 group-hover/handle:text-olive-400 transition-colors" />
            </div>

            {/* Image */}
            {item.image && (
                <div className="h-32 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                        <h4 className="text-cream-50 font-medium text-sm">{item.name}</h4>
                        {item.badge && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-gold-500/10 text-gold-400 text-[10px] rounded-full uppercase tracking-wider">{item.badge}</span>
                        )}
                    </div>
                    {item.price && showPrices && (
                        <span className="text-gold-400 font-semibold text-sm shrink-0">₹{item.price}</span>
                    )}
                    {item.price && !showPrices && (
                        <span className="text-olive-600 text-xs line-through shrink-0">₹{item.price}</span>
                    )}
                </div>
                <p className="text-olive-500 text-xs line-clamp-2 mb-2">{item.description}</p>

                {item.shortDesc ? (
                    <p className="text-[10px] uppercase tracking-widest text-gold-500/70 mb-3">✦ {item.shortDesc}</p>
                ) : (
                    <p className="text-[10px] text-olive-700 italic mb-3">No accent line — click ✏️ to add</p>
                )}

                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-olive-600 uppercase tracking-wider">
                        {categories.find((c) => c.id === item.categoryId)?.label || item.categoryId}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onToggleActive(item)}
                            className={`p-1.5 rounded-lg transition-colors ${item.isActive ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-red-400 hover:bg-red-500/10'}`}
                            title={item.isActive ? 'Hide from menu' : 'Show on menu'}
                        >
                            {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 rounded-lg text-olive-500 hover:text-cream-50 hover:bg-olive-700/30 transition-colors"
                            title="Edit item"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="p-1.5 rounded-lg text-olive-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete item"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Ghost card shown over dragged item in overlay
function ItemCardGhost({ item, showPrices }: { item: MenuItem; showPrices: boolean }) {
    return (
        <div className="bg-olive-900/90 border border-gold-500/40 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 rotate-1 scale-105 cursor-grabbing">
            {item.image && (
                <div className="h-32 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                </div>
            )}
            <div className="p-4">
                <h4 className="text-cream-50 font-medium text-sm">{item.name}</h4>
                {item.price && showPrices && <span className="text-gold-400 text-xs">₹{item.price}</span>}
            </div>
        </div>
    );
}

// ─── Sortable Category Row ───

function SortableCategoryRow({
    cat,
    itemCount,
    isDragging,
    onEdit,
    onDelete,
}: {
    cat: MenuCategoryItem;
    itemCount: number;
    isDragging?: boolean;
    onEdit: (cat: MenuCategoryItem) => void;
    onDelete: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: cat.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 p-4 bg-olive-900/30 border border-olive-800/20 rounded-xl transition-all
                ${isDragging ? 'shadow-xl shadow-black/20 border-gold-500/30 scale-[1.01]' : 'hover:border-olive-600/30'}
            `}
        >
            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className="flex items-center justify-center p-2 rounded-lg cursor-grab active:cursor-grabbing text-olive-600 hover:text-olive-400 hover:bg-olive-800/30 transition-colors touch-none select-none shrink-0"
                title="Drag to reorder"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            <span className="text-2xl shrink-0">{cat.icon}</span>

            <div className="flex-1 min-w-0">
                <h4 className="text-cream-50 font-medium text-sm">{cat.label}</h4>
                <p className="text-olive-600 text-xs">
                    {itemCount} item{itemCount !== 1 ? 's' : ''} · ID: {cat.id}
                </p>
            </div>

            {/* Sort order badge */}
            <span className="shrink-0 w-7 h-7 rounded-full bg-olive-800/50 border border-olive-700/30 text-olive-400 text-xs font-bold flex items-center justify-center">
                {cat.sortOrder}
            </span>

            <div className="flex items-center gap-1 shrink-0">
                <button
                    onClick={() => onEdit(cat)}
                    className="p-2 rounded-lg text-olive-500 hover:text-cream-50 hover:bg-olive-700/30 transition-colors"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(cat.id)}
                    className="p-2 rounded-lg text-olive-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// Ghost for categories
function CategoryRowGhost({ cat }: { cat: MenuCategoryItem }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-olive-900/90 border border-gold-500/40 rounded-xl shadow-2xl shadow-black/30 scale-[1.02] rotate-[0.5deg] cursor-grabbing">
            <GripVertical className="w-4 h-4 text-gold-500" />
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-cream-50 font-medium text-sm">{cat.label}</span>
        </div>
    );
}


// ─── Main Page ───

export default function MenuManagerPage() {
    const [tab, setTab] = useState<Tab>('items');
    const [catModal, setCatModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data: CategoryFormData }>({ open: false, mode: 'create', data: emptyCategoryForm });
    const [itemModal, setItemModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data: ItemFormData }>({ open: false, mode: 'create', data: emptyItemForm });
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [uploading, setUploading] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning' | 'info';
    }>({ open: false, title: '', description: '', onConfirm: () => { } });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Local optimistic ordering state (null = use server order)
    const [localItemOrder, setLocalItemOrder] = useState<string[] | null>(null);
    const [localCatOrder, setLocalCatOrder] = useState<string[] | null>(null);
    const [activeItemId, setActiveItemId] = useState<string | null>(null);
    const [activeCatId, setActiveCatId] = useState<string | null>(null);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    // Data queries
    const { data: categories = [], isLoading: catsLoading } = useCategories();
    const { data: items = [], isLoading: itemsLoading } = useMenuItems();

    // Settings
    const queryClient = useQueryClient();
    const { data: settings, isLoading: settingsLoading } = useQuery({
        queryKey: ['admin', 'settings'],
        queryFn: async () => {
            const res = await fetch('/api/admin/settings');
            const json = await res.json();
            return json.data as { showPrices: boolean };
        },
        staleTime: 30_000,
    });
    const updateSettings = useMutation({
        mutationFn: async (patch: { showPrices: boolean }) => {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patch),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data as { showPrices: boolean };
        },
        onSuccess: (data) => { queryClient.setQueryData(['admin', 'settings'], data); },
    });
    const showPrices = settings?.showPrices ?? true;

    // Mutations
    const createCat = useCreateCategory();
    const updateCat = useUpdateCategory();
    const deleteCat = useDeleteCategory();
    const createItem = useCreateItem();
    const updateItem = useUpdateItem();
    const deleteItem = useDeleteItem();

    // ─── Derived sorted lists ───

    const sortedItems = localItemOrder
        ? [...items].sort((a, b) => {
            const ai = localItemOrder.indexOf(a.id);
            const bi = localItemOrder.indexOf(b.id);
            return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        })
        : [...items].sort((a, b) => a.sortOrder - b.sortOrder);

    const sortedCategories = localCatOrder
        ? [...categories].sort((a, b) => {
            const ai = localCatOrder.indexOf(a.id);
            const bi = localCatOrder.indexOf(b.id);
            return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        })
        : [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

    const filteredItems = filterCategory === 'all'
        ? sortedItems
        : sortedItems.filter((i) => i.categoryId === filterCategory);

    // ─── DnD Sensors ───

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    // ─── Item DnD handlers ───

    const handleItemDragStart = useCallback((event: DragStartEvent) => {
        setActiveItemId(String(event.active.id));
    }, []);

    const handleItemDragEnd = useCallback(async (event: DragEndEvent) => {
        setActiveItemId(null);
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const currentOrder = localItemOrder ?? sortedItems.map((i) => i.id);
        const oldIndex = currentOrder.indexOf(String(active.id));
        const newIndex = currentOrder.indexOf(String(over.id));
        if (oldIndex === -1 || newIndex === -1) return;

        // In "all" mode reorder globally; in filtered mode only reorder within that category
        let nextOrder: string[];
        if (filterCategory === 'all') {
            nextOrder = arrayMove(currentOrder, oldIndex, newIndex);
        } else {
            // Reorder only within filtered items; keep non-filtered in place
            const filteredIds = filteredItems.map((i) => i.id);
            const filteredOld = filteredIds.indexOf(String(active.id));
            const filteredNew = filteredIds.indexOf(String(over.id));
            const reorderedFiltered = arrayMove(filteredIds, filteredOld, filteredNew);

            // Splice reordered filtered back into full order
            nextOrder = [...currentOrder];
            let fi = 0;
            for (let i = 0; i < nextOrder.length; i++) {
                if (filteredIds.includes(nextOrder[i])) {
                    nextOrder[i] = reorderedFiltered[fi++];
                }
            }
        }

        // Optimistic update
        setLocalItemOrder(nextOrder);

        // Persist to server
        setIsSavingOrder(true);
        try {
            await fetch('/api/admin/items/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: nextOrder }),
            });
            queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
        } finally {
            setIsSavingOrder(false);
        }
    }, [localItemOrder, sortedItems, filteredItems, filterCategory, queryClient]);

    // ─── Category DnD handlers ───

    const handleCatDragStart = useCallback((event: DragStartEvent) => {
        setActiveCatId(String(event.active.id));
    }, []);

    const handleCatDragEnd = useCallback(async (event: DragEndEvent) => {
        setActiveCatId(null);
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const currentOrder = localCatOrder ?? sortedCategories.map((c) => c.id);
        const oldIndex = currentOrder.indexOf(String(active.id));
        const newIndex = currentOrder.indexOf(String(over.id));
        if (oldIndex === -1 || newIndex === -1) return;

        const nextOrder = arrayMove(currentOrder, oldIndex, newIndex);
        setLocalCatOrder(nextOrder);

        setIsSavingOrder(true);
        try {
            await fetch('/api/admin/categories/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: nextOrder }),
            });
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        } finally {
            setIsSavingOrder(false);
        }
    }, [localCatOrder, sortedCategories, queryClient]);

    // After the server refetch lands, drop the optimistic local order so the
    // authoritative server order takes over (but only when we're not mid-save).
    useEffect(() => {
        if (!isSavingOrder) setLocalItemOrder(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    useEffect(() => {
        if (!isSavingOrder) setLocalCatOrder(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories]);

    // ─── Category Handlers ───

    const openCreateCategory = () => setCatModal({ open: true, mode: 'create', data: { ...emptyCategoryForm, sortOrder: categories.length + 1 } });
    const openEditCategory = (cat: MenuCategoryItem) => setCatModal({ open: true, mode: 'edit', data: { ...cat } });

    const handleSaveCategory = () => {
        const { mode, data } = catModal;
        if (!data.label) return;
        const payload = { ...data, id: data.id || data.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') };
        if (mode === 'create') {
            createCat.mutate(payload, { onSuccess: () => setCatModal((m) => ({ ...m, open: false })) });
        } else {
            updateCat.mutate(payload, { onSuccess: () => setCatModal((m) => ({ ...m, open: false })) });
        }
    };

    const handleDeleteCategory = (id: string) => {
        setConfirmModal({
            open: true,
            title: 'Delete Category',
            description: 'Are you sure you want to delete this category? Items must be moved to another category first.',
            variant: 'danger',
            onConfirm: () => {
                deleteCat.mutate(id, { onSuccess: () => setConfirmModal(prev => ({ ...prev, open: false })) });
            }
        });
    };

    // ─── Item Handlers ───

    const openCreateItem = () => setItemModal({ open: true, mode: 'create', data: { ...emptyItemForm, sortOrder: items.length + 1, categoryId: sortedCategories[0]?.id || '' } });
    const openEditItem = (item: MenuItem) => setItemModal({ open: true, mode: 'edit', data: { ...item, shortDesc: item.shortDesc || '', price: item.price || '', badge: item.badge || '', image: item.image || '', imagePublicId: item.imagePublicId || '' } });

    const handleSaveItem = () => {
        const { mode, data } = itemModal;
        if (!data.name || !data.categoryId) return;
        const payload = {
            ...data,
            id: data.id || `item-${Date.now()}`,
            sortOrder: Number(data.sortOrder) || 1,
            imagePublicId: data.imagePublicId || undefined,
        };
        const onDone = () => setItemModal((m) => ({ ...m, open: false }));
        if (mode === 'create') {
            createItem.mutate(payload, { onSuccess: onDone });
        } else {
            updateItem.mutate(payload, { onSuccess: onDone });
        }
    };

    const handleDeleteItem = (id: string) => {
        setConfirmModal({
            open: true,
            title: 'Delete Menu Item',
            description: 'Are you sure you want to delete this menu item? This action cannot be undone.',
            variant: 'danger',
            onConfirm: () => {
                deleteItem.mutate(id, { onSuccess: () => setConfirmModal(prev => ({ ...prev, open: false })) });
            }
        });
    };

    const handleToggleActive = (item: MenuItem) => {
        updateItem.mutate({ id: item.id, isActive: !item.isActive });
    };

    // ─── Image Upload ───

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            const json = await res.json();
            if (json.success && json.data?.url) {
                setItemModal((m) => ({ ...m, data: { ...m.data, image: json.data.url, imagePublicId: json.data.publicId ?? '' } }));
            } else {
                alert(json.error || 'Upload failed — check Cloudinary credentials.');
            }
        } catch (err) {
            console.error('[upload]', err);
            alert('Upload failed. Check your internet connection and try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Active dragged items (for overlay)
    const activeDragItem = activeItemId ? items.find((i) => i.id === activeItemId) ?? null : null;
    const activeDragCat = activeCatId ? categories.find((c) => c.id === activeCatId) ?? null : null;

    // ─── Render ───

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-full pb-20">
            {/* Header */}
            <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-serif text-cream-50 mb-1">Menu Manager</h1>
                    <p className="text-olive-500 text-sm flex items-center gap-2">
                        Manage your café menu categories and items
                        {isSavingOrder && (
                            <span className="inline-flex items-center gap-1.5 text-gold-400 text-xs">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Saving order…
                            </span>
                        )}
                    </p>
                </div>

                {/* ━━ Global Price Toggle ━━ */}
                <div className="flex items-center gap-4 px-5 py-4 bg-olive-900/60 backdrop-blur-sm border border-olive-700/30 rounded-2xl shadow-sm hover:border-olive-600/40 transition-colors">
                    <div className="flex flex-col items-start mr-2">
                        <span className="text-cream-50 font-medium text-sm flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-gold-500" />
                            Public Menu Prices
                        </span>
                        <span className={`text-[10px] font-bold tracking-wider mt-1 transition-colors ${showPrices ? 'text-emerald-400' : 'text-olive-500'}`}>
                            {showPrices ? '● CURRENTLY VISIBLE' : '○ HIDDEN FROM VISITORS'}
                        </span>
                    </div>
                    <div className="h-8 w-[1px] bg-olive-800/50" />
                    <button
                        role="switch"
                        aria-checked={showPrices}
                        aria-label="Toggle price visibility"
                        disabled={settingsLoading || updateSettings.isPending}
                        onClick={() => updateSettings.mutate({ showPrices: !showPrices })}
                        className={`relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500/40 disabled:opacity-50 shadow-inner ${showPrices ? 'bg-emerald-500/90' : 'bg-olive-950'}`}
                    >
                        <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center ${showPrices ? 'translate-x-6' : 'translate-x-0'}`}>
                            {showPrices ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-olive-400 stroke-[3]" />}
                        </span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-olive-900/50 rounded-xl border border-olive-800/20 w-fit mb-8">
                {([
                    { key: 'items' as Tab, label: 'Menu Items', icon: UtensilsCrossed },
                    { key: 'categories' as Tab, label: 'Categories', icon: FolderOpen },
                ]).map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-gold-500 text-white shadow-lg' : 'text-olive-400 hover:text-cream-50'}`}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            {/* ━━━ ITEMS TAB ━━━ */}
            {tab === 'items' && (
                <div>
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setFilterCategory('all')}
                                className={`shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all ${filterCategory === 'all' ? 'bg-olive-700/50 text-cream-50' : 'text-olive-500 hover:text-cream-50'}`}
                            >
                                All ({items.length})
                            </button>
                            {sortedCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setFilterCategory(cat.id)}
                                    className={`shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all ${filterCategory === cat.id ? 'bg-olive-700/50 text-cream-50' : 'text-olive-500 hover:text-cream-50'}`}
                                >
                                    {cat.icon} {cat.label} ({items.filter((i) => i.categoryId === cat.id).length})
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={openCreateItem}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-gold-500/20 shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            Add Item
                        </button>
                    </div>

                    {/* Drag hint */}
                    {!itemsLoading && filteredItems.length > 1 && (
                        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-olive-900/30 border border-olive-800/20 rounded-xl w-fit">
                            <GripVertical className="w-3.5 h-3.5 text-olive-500" />
                            <span className="text-olive-500 text-xs">Drag the top handle on any card to reorder</span>
                        </div>
                    )}

                    {/* Items Grid — sortable */}
                    {itemsLoading ? (
                        <div className="text-olive-500 text-center py-20">Loading items...</div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-olive-500 text-center py-20">No items found. Create one to get started.</div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleItemDragStart}
                            onDragEnd={handleItemDragEnd}
                        >
                            <SortableContext
                                items={filteredItems.map((i) => i.id)}
                                strategy={rectSortingStrategy}
                            >
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredItems.map((item) => (
                                        <SortableItemCard
                                            key={item.id}
                                            item={item}
                                            categories={sortedCategories}
                                            showPrices={showPrices}
                                            isDragging={activeItemId === item.id}
                                            onEdit={openEditItem}
                                            onDelete={handleDeleteItem}
                                            onToggleActive={handleToggleActive}
                                        />
                                    ))}
                                </div>
                            </SortableContext>

                            {/* Drag overlay — the ghost that follows the cursor */}
                            <DragOverlay dropAnimation={dropAnimation}>
                                {activeDragItem ? (
                                    <ItemCardGhost item={activeDragItem} showPrices={showPrices} />
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    )}
                </div>
            )}

            {/* ━━━ CATEGORIES TAB ━━━ */}
            {tab === 'categories' && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-olive-500 text-sm">{sortedCategories.length} categories</p>
                        <button
                            onClick={openCreateCategory}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-gold-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Add Category
                        </button>
                    </div>

                    {/* Drag hint */}
                    {!catsLoading && sortedCategories.length > 1 && (
                        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-olive-900/30 border border-olive-800/20 rounded-xl w-fit">
                            <GripVertical className="w-3.5 h-3.5 text-olive-500" />
                            <span className="text-olive-500 text-xs">Drag to reorder — order reflects on public menu</span>
                        </div>
                    )}

                    {catsLoading ? (
                        <div className="text-olive-500 text-center py-20">Loading categories...</div>
                    ) : sortedCategories.length === 0 ? (
                        <div className="text-olive-500 text-center py-20">No categories yet. Create one to get started.</div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleCatDragStart}
                            onDragEnd={handleCatDragEnd}
                        >
                            <SortableContext
                                items={sortedCategories.map((c) => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {sortedCategories.map((cat) => (
                                        <SortableCategoryRow
                                            key={cat.id}
                                            cat={cat}
                                            itemCount={items.filter((i) => i.categoryId === cat.id).length}
                                            isDragging={activeCatId === cat.id}
                                            onEdit={openEditCategory}
                                            onDelete={handleDeleteCategory}
                                        />
                                    ))}
                                </div>
                            </SortableContext>

                            <DragOverlay dropAnimation={dropAnimation}>
                                {activeDragCat ? <CategoryRowGhost cat={activeDragCat} /> : null}
                            </DragOverlay>
                        </DndContext>
                    )}
                </div>
            )}

            {/* ━━━ CATEGORY MODAL ━━━ */}
            <Modal
                open={catModal.open}
                onClose={() => setCatModal((m) => ({ ...m, open: false }))}
                title={catModal.mode === 'create' ? 'New Category' : 'Edit Category'}
            >
                <Field label="Label">
                    <Input value={catModal.data.label} onChange={(v) => setCatModal((m) => ({ ...m, data: { ...m.data, label: v } }))} placeholder="e.g. Hot Beverages" />
                </Field>
                <Field label="Icon (emoji)">
                    <Input value={catModal.data.icon} onChange={(v) => setCatModal((m) => ({ ...m, data: { ...m.data, icon: v } }))} placeholder="e.g. ☕" />
                </Field>
                {catModal.mode === 'create' && (
                    <Field label="ID (slug, auto-generated if empty)">
                        <Input value={catModal.data.id} onChange={(v) => setCatModal((m) => ({ ...m, data: { ...m.data, id: v } }))} placeholder="e.g. hot-beverages" />
                    </Field>
                )}
                <Field label="Sort Order">
                    <Input value={String(catModal.data.sortOrder)} onChange={(v) => setCatModal((m) => ({ ...m, data: { ...m.data, sortOrder: Number(v) || 1 } }))} type="number" placeholder="1" />
                </Field>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-olive-800/30">
                    <button
                        onClick={handleSaveCategory}
                        disabled={createCat.isPending || updateCat.isPending}
                        className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 disabled:bg-olive-700 text-white font-medium rounded-xl transition-colors text-sm"
                    >
                        {(createCat.isPending || updateCat.isPending) ? 'Saving...' : catModal.mode === 'create' ? 'Create Category' : 'Save Changes'}
                    </button>
                    <button
                        onClick={() => setCatModal((m) => ({ ...m, open: false }))}
                        className="px-6 py-3 bg-olive-800/50 hover:bg-olive-800/80 text-olive-300 font-medium rounded-xl transition-colors text-sm"
                    >
                        Cancel
                    </button>
                </div>
                {(createCat.isError || updateCat.isError) && (
                    <p className="mt-3 text-red-400 text-xs">{(createCat.error || updateCat.error)?.message}</p>
                )}
            </Modal>

            {/* ━━━ ITEM MODAL ━━━ */}
            <Modal
                key={itemModal.open ? (itemModal.data.id || 'new') : 'closed'}
                open={itemModal.open}
                onClose={() => setItemModal((m) => ({ ...m, open: false }))}
                title={itemModal.mode === 'create' ? 'New Menu Item' : 'Edit Menu Item'}
            >
                <Field label="Name">
                    <Input value={itemModal.data.name} onChange={(v) => setItemModal((m) => ({ ...m, data: { ...m.data, name: v } }))} placeholder="e.g. Signature Chai" />
                </Field>
                <Field label="Description">
                    <TextArea value={itemModal.data.description} onChange={(v) => setItemModal((m) => ({ ...m, data: { ...m.data, description: v } }))} placeholder="A brief description of the item" />
                </Field>
                <div className="mb-4 px-4 py-3.5 bg-gold-500/5 border border-gold-500/20 rounded-xl">
                    <label className="block text-xs font-semibold text-gold-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <span>✦</span> Offerings Card Accent
                    </label>
                    <AccentInput
                        value={itemModal.data.shortDesc}
                        onChange={(v) => setItemModal((m) => ({ ...m, data: { ...m.data, shortDesc: v } }))}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Price ₹ (optional)">
                        <Input value={itemModal.data.price} onChange={(v) => setItemModal((m) => ({ ...m, data: { ...m.data, price: v } }))} placeholder="e.g. 120" />
                        {!showPrices && (
                            <p className="text-[10px] text-amber-500/80 mt-1">⚠️ Prices are hidden globally</p>
                        )}
                    </Field>
                    <Field label="Badge (optional)">
                        <Input value={itemModal.data.badge} onChange={(v) => setItemModal((m) => ({ ...m, data: { ...m.data, badge: v } }))} placeholder="e.g. New, Popular" />
                    </Field>
                </div>

                <Field label="Category">
                    <select
                        value={itemModal.data.categoryId}
                        onChange={(e) => setItemModal((m) => ({ ...m, data: { ...m.data, categoryId: e.target.value } }))}
                        className="w-full px-4 py-3 bg-olive-800/50 border border-olive-700/30 rounded-xl text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/40 transition-all"
                    >
                        <option value="" className="bg-olive-900">Select category</option>
                        {sortedCategories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-olive-900">{cat.icon} {cat.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Image">
                    {(itemModal.data.image || uploading) && (
                        <div className="mb-3 relative group rounded-xl overflow-hidden h-36 bg-olive-800/40">
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                                    <span className="w-7 h-7 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                            {itemModal.data.image && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={itemModal.data.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            )}
                            {!uploading && itemModal.data.image && (
                                <button
                                    type="button"
                                    onClick={() => setItemModal((m) => ({ ...m, data: { ...m.data, image: '', imagePublicId: '' } }))}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-lg text-white transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remove image"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        className="hidden"
                        onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); }}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-olive-800/50 border border-dashed border-olive-700/30 rounded-xl text-olive-400 hover:text-cream-50 hover:border-olive-500/50 text-sm transition-all disabled:opacity-50"
                    >
                        {uploading ? (
                            <><span className="w-4 h-4 border-2 border-olive-500 border-t-transparent rounded-full animate-spin" /> Uploading to Cloudinary...</>
                        ) : (
                            <>{itemModal.data.image ? <Upload className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />} {itemModal.data.image ? 'Change Image' : 'Upload Image'}</>
                        )}
                    </button>
                    <p className="text-olive-600 text-[10px] mt-1.5">JPG, PNG, WebP or AVIF · Max 10MB · Stored on Cloudinary CDN</p>
                </Field>

                <Field label="Visibility">
                    <button
                        type="button"
                        onClick={() => setItemModal((m) => ({ ...m, data: { ...m.data, isActive: !m.data.isActive } }))}
                        className={`w-full py-3 rounded-xl text-sm font-medium border transition-all ${itemModal.data.isActive
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                            }`}
                    >
                        {itemModal.data.isActive ? '✓ Active (Visible)' : '✗ Hidden'}
                    </button>
                </Field>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-olive-800/30">
                    <button
                        onClick={handleSaveItem}
                        disabled={createItem.isPending || updateItem.isPending}
                        className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 disabled:bg-olive-700 text-white font-medium rounded-xl transition-colors text-sm"
                    >
                        {(createItem.isPending || updateItem.isPending) ? 'Saving...' : itemModal.mode === 'create' ? 'Create Item' : 'Save Changes'}
                    </button>
                    <button
                        onClick={() => setItemModal((m) => ({ ...m, open: false }))}
                        className="px-6 py-3 bg-olive-800/50 hover:bg-olive-800/80 text-olive-300 font-medium rounded-xl transition-colors text-sm"
                    >
                        Cancel
                    </button>
                </div>
                {(createItem.isError || updateItem.isError) && (
                    <p className="mt-3 text-red-400 text-xs">{(createItem.error || updateItem.error)?.message}</p>
                )}
            </Modal>

            {/* ━━━ CONFIRMATION DIALOG ━━━ */}
            <ConfirmDialog
                isOpen={confirmModal.open}
                onClose={() => setConfirmModal(prev => ({ ...prev, open: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                description={confirmModal.description}
                variant={confirmModal.variant}
                isLoading={deleteCat.isPending || deleteItem.isPending}
            />
        </div>
    );
}
