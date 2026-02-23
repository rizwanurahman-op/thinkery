'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, RefreshCw, Eye, LayoutPanelTop, Coffee, Zap,
    Pencil, ExternalLink, Check, X, ArrowRight, ListChecks,
} from 'lucide-react';
import Link from 'next/link';
import type { SiteSettings, OfferingsSectionConfig } from '@/lib/settings-store';
import type { MenuItem, MenuCategoryItem, MenuData } from '@/types';

// ─── API hooks ─────────────────────────────────────────────────────────────

function useSettings() {
    return useQuery<SiteSettings>({
        queryKey: ['admin', 'settings'],
        queryFn: async () => {
            const res = await fetch('/api/admin/settings');
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data;
        },
        staleTime: 30_000,
    });
}

function useUpdateSettings() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (patch: Partial<SiteSettings>) => {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patch),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data as SiteSettings;
        },
        onSuccess: (data) => qc.setQueryData(['admin', 'settings'], data),
    });
}

function useMenuData() {
    return useQuery<MenuData>({
        queryKey: ['admin', 'menu-data'],
        queryFn: async () => {
            const res = await fetch('/api/menu');
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data;
        },
        staleTime: 10_000,
    });
}

function useUpdateItemAccent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, shortDesc }: { id: string; shortDesc: string }) => {
            const res = await fetch(`/api/admin/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shortDesc }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data as MenuItem;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'menu-data'] }),
    });
}

// ─── Defaults ──────────────────────────────────────────────────────────────

const DEFAULT_OFFERINGS: OfferingsSectionConfig = {
    badge: 'Savor the Moment',
    heading: 'Simple. Fresh.',
    headingItalic: 'Comforting.',
    quote: 'Fuel for your best ideas.',
    beverageCard: {
        sectionLabel: 'The Brew Bar',
        title: 'Liquid Inspiration',
        categoryIds: ['hot-beverages', 'cold-beverages'],
        maxItems: 5,
    },
    foodCard: {
        sectionLabel: 'The Kitchen',
        title: 'Nourishment',
        categoryIds: ['snacks'],
        maxItems: 4,
    },
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function getCardItems(items: MenuItem[], categoryIds: string[], maxItems: number) {
    return items
        .filter((i) => categoryIds.includes(i.categoryId) && i.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .slice(0, maxItems);
}

// ─── Category Checkbox Picker ──────────────────────────────────────────────

function CategoryPicker({
    allCategories,
    selectedIds,
    lockedIds,
    onChange,
}: {
    allCategories: MenuCategoryItem[];
    selectedIds: string[];
    lockedIds: string[];
    onChange: (ids: string[]) => void;
}) {
    const toggle = (id: string) => {
        onChange(
            selectedIds.includes(id)
                ? selectedIds.filter((x) => x !== id)
                : [...selectedIds, id],
        );
    };

    if (allCategories.length === 0) {
        return (
            <p className="text-olive-600 text-xs italic py-2">
                No categories yet —{' '}
                <Link href="/admin/menu" className="underline text-olive-400">add one in Menu Manager</Link>
            </p>
        );
    }

    return (
        <div className="space-y-2 relative">
            <AnimatePresence>
                {allCategories.map((cat) => {
                    const checked = selectedIds.includes(cat.id);
                    const locked = lockedIds.includes(cat.id);
                    return (
                        <motion.label
                            layout
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={cat.id}
                            className={[
                                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all select-none',
                                locked
                                    ? 'opacity-35 cursor-not-allowed border-olive-700/20'
                                    : checked
                                        ? 'cursor-pointer border-gold-500/50 bg-gold-500/10 ring-1 ring-gold-500/30 shadow-lg shadow-gold-500/5'
                                        : 'cursor-pointer border-olive-700/30 hover:border-olive-600/50 hover:bg-olive-800/20',
                            ].join(' ')}
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                disabled={locked}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    toggle(cat.id);
                                }}
                                className="sr-only"
                            />
                            {/* Custom checkbox */}
                            <span className={[
                                'w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all',
                                checked ? 'bg-gold-500 border-gold-500' : 'border-olive-600/50',
                            ].join(' ')}>
                                {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </span>
                            <span className="text-xl leading-none">{cat.icon}</span>
                            <span className={`text-sm font-medium flex-1 ${locked ? 'text-olive-600' : 'text-cream-50'}`}>
                                {cat.label}
                            </span>
                            {locked && (
                                <span className="text-[9px] text-olive-600 uppercase tracking-widest font-medium">
                                    other card
                                </span>
                            )}
                        </motion.label>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

// ─── Inline Accent Editor ──────────────────────────────────────────────────
// Shown inside each card preview row — hover to reveal ✏️, click to edit shortDesc inline.

function AccentCell({ item, light, showPrices }: {
    item: MenuItem; light: boolean; showPrices: boolean;
}) {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(item.shortDesc ?? '');
    const [saved, setSaved] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const updateAccent = useUpdateItemAccent();

    useEffect(() => { setVal(item.shortDesc ?? ''); }, [item.shortDesc]);
    useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

    const commit = () => {
        if (val === (item.shortDesc ?? '')) { setEditing(false); return; }
        updateAccent.mutate({ id: item.id, shortDesc: val }, {
            onSuccess: () => {
                setEditing(false);
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
            },
        });
    };

    const onKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') { setVal(item.shortDesc ?? ''); setEditing(false); }
    };

    return (
        <div className={`group/row border-b pb-3 transition-colors ${light ? 'border-olive-100' : 'border-olive-700/50'}`}>
            {/* Name + price */}
            <div className="flex items-baseline justify-between mb-1">
                <span className={`font-medium text-base ${light ? 'text-olive-900' : 'text-cream-50'}`}>
                    {item.name}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                    {showPrices && item.price && (
                        <span className={`font-serif text-sm ${light ? 'text-olive-500' : 'text-olive-300'}`}>
                            ₹{item.price}
                        </span>
                    )}
                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            title="Edit accent line"
                            className="opacity-0 group-hover/row:opacity-100 transition-opacity p-1 rounded-md hover:bg-black/10"
                        >
                            <Pencil className={`w-3 h-3 ${light ? 'text-olive-400' : 'text-olive-500'}`} />
                        </button>
                    )}
                </div>
            </div>

            {/* Accent / shortDesc */}
            {editing ? (
                <div className="flex items-center gap-1.5 mt-1">
                    <input
                        ref={inputRef}
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        onKeyDown={onKey}
                        onBlur={commit}
                        placeholder="e.g. Loose Leaf • Blends"
                        className={[
                            'flex-1 text-[10px] uppercase tracking-widest px-2 py-1 rounded-md border',
                            'focus:outline-none focus:ring-1 focus:ring-gold-500/40',
                            light
                                ? 'bg-olive-50 border-olive-200 text-olive-700 placeholder-olive-300'
                                : 'bg-olive-900/60 border-olive-700 text-olive-300 placeholder-olive-600',
                        ].join(' ')}
                    />
                    <button onMouseDown={(e) => { e.preventDefault(); commit(); }}
                        className="p-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30">
                        <Check className="w-3 h-3 text-emerald-400" />
                    </button>
                    <button onMouseDown={(e) => { e.preventDefault(); setVal(item.shortDesc ?? ''); setEditing(false); }}
                        className="p-1 rounded-md bg-red-500/10 hover:bg-red-500/20">
                        <X className="w-3 h-3 text-red-400" />
                    </button>
                </div>
            ) : (
                <p
                    onClick={() => setEditing(true)}
                    title="Click to edit accent line"
                    className={[
                        'text-[10px] uppercase tracking-widest cursor-pointer',
                        light ? 'text-olive-400' : 'text-olive-500',
                        !val ? 'italic opacity-40' : '',
                    ].join(' ')}
                >
                    {saved
                        ? <span className="text-emerald-400 not-italic">✓ Saved</span>
                        : val || 'Click to add accent line…'}
                </p>
            )}
        </div>
    );
}

// ─── Card Preview ──────────────────────────────────────────────────────────

function CardPreview({ icon: Icon, cardNumber, sectionLabel, title, items, light, showPrices }: {
    icon: React.ElementType;
    cardNumber: string;
    sectionLabel: string;
    title: string;
    items: MenuItem[];
    light: boolean;
    showPrices: boolean;
}) {
    return (
        <div className={[
            'relative rounded-3xl overflow-hidden p-7 sm:p-9',
            light
                ? 'bg-white border border-cream-200/80 shadow-xl shadow-olive-900/5'
                : 'bg-olive-950 border border-olive-800/30 shadow-xl shadow-black/20',
        ].join(' ')}>
            {/* bg number watermark */}
            <span
                className={`absolute top-5 right-6 text-7xl sm:text-8xl font-serif select-none pointer-events-none ${light ? 'text-olive-900/[0.08]' : 'text-white/[0.05]'}`}
                aria-hidden
            >{cardNumber}</span>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className={[
                    'w-14 h-14 rounded-full flex items-center justify-center shrink-0',
                    light
                        ? 'bg-olive-900 text-cream-50 shadow-md shadow-olive-900/20'
                        : 'bg-olive-800/50 text-cream-50 border border-olive-700',
                ].join(' ')}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className={`text-xs font-semibold tracking-widest uppercase mb-0.5 ${light ? 'text-olive-500' : 'text-olive-400/80'}`}>
                        {sectionLabel}
                    </p>
                    <h3 className={`text-2xl sm:text-3xl font-serif font-medium leading-none ${light ? 'text-olive-900' : 'text-cream-50'}`}>
                        {title}
                    </h3>
                </div>
            </div>

            {/* Items */}
            {items.length === 0 ? (
                <div className={`text-sm italic py-2 ${light ? 'text-olive-300' : 'text-olive-600'}`}>
                    No items assigned — add items via{' '}
                    <Link href="/admin/menu" className="underline">Menu Manager</Link>
                    {' '}and pick categories in the Settings tab.
                </div>
            ) : (
                <div className={light ? 'grid sm:grid-cols-2 gap-x-8 gap-y-4' : 'space-y-4'}>
                    {items.map((item) => (
                        <AccentCell key={item.id} item={item} light={light} showPrices={showPrices} />
                    ))}
                </div>
            )}

            <p className={`mt-5 text-[10px] ${light ? 'text-olive-300' : 'text-olive-700'}`}>
                Hover any item → click ✏️ to edit its accent line inline.
                Add/remove items via{' '}
                <Link href="/admin/menu" className="underline hover:opacity-80">Menu Manager →</Link>
            </p>
        </div>
    );
}

// ─── Shared field components ───────────────────────────────────────────────

function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div className="mb-5">
            <label className="block text-xs font-semibold text-olive-400 mb-1.5 uppercase tracking-wider">{label}</label>
            {hint && <p className="text-[10px] text-olive-600 mb-2 leading-relaxed">{hint}</p>}
            {children}
        </div>
    );
}

function TextBox({ value, onChange, placeholder, maxLength }: {
    value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number;
}) {
    return (
        <input type="text" value={value} maxLength={maxLength} placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 bg-olive-800/50 border border-olive-700/30 rounded-xl text-cream-50 placeholder-olive-600 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/40 transition-all"
        />
    );
}

function NumberBox({ value, onChange, min = 1, max = 20 }: {
    value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
    return (
        <input type="number" min={min} max={max} value={value}
            onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
            className="w-24 px-3 py-2.5 bg-olive-800/50 border border-olive-700/30 rounded-xl text-cream-50 text-sm text-center focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition-all"
        />
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function OfferingsAdminPage() {
    const { data: settings, isLoading: settingsLoading, isError: settingsError, refetch } = useSettings();
    const { data: menuData, isLoading: menuLoading } = useMenuData();
    const update = useUpdateSettings();

    const [form, setForm] = useState<OfferingsSectionConfig>(DEFAULT_OFFERINGS);
    const [isDirty, setIsDirty] = useState(false);
    const [savedAt, setSavedAt] = useState<Date | null>(null);
    const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview');

    useEffect(() => {
        if (settings?.offeringsSection) {
            setForm(settings.offeringsSection);
            setIsDirty(false);
        }
    }, [settings]);

    // Patch helpers
    const patch = (p: Partial<OfferingsSectionConfig>) => {
        setForm((f) => ({ ...f, ...p }));
        setIsDirty(true);
    };
    const patchBev = (p: Partial<typeof form.beverageCard>) => {
        setForm((f) => ({ ...f, beverageCard: { ...f.beverageCard, ...p } }));
        setIsDirty(true);
    };
    const patchFood = (p: Partial<typeof form.foodCard>) => {
        setForm((f) => ({ ...f, foodCard: { ...f.foodCard, ...p } }));
        setIsDirty(true);
    };

    const handleSave = () => {
        update.mutate({ offeringsSection: form }, {
            onSuccess: () => { setIsDirty(false); setSavedAt(new Date()); },
        });
    };

    // Derived data
    const allCategories = (menuData?.categories ?? []).sort((a, b) => a.sortOrder - b.sortOrder);
    const allItems = menuData?.items ?? [];
    const showPrices = settings?.showPrices ?? true;

    const bevItems = getCardItems(allItems, form.beverageCard.categoryIds, form.beverageCard.maxItems);
    const foodItems = getCardItems(allItems, form.foodCard.categoryIds, form.foodCard.maxItems);

    const isLoading = settingsLoading || menuLoading;

    // ── Loading skeleton ──
    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl animate-pulse space-y-4">
                <div className="h-8 bg-olive-800/40 rounded-xl w-1/3" />
                <div className="h-64 bg-olive-800/20 rounded-2xl" />
                <div className="h-48 bg-olive-800/20 rounded-2xl" />
            </div>
        );
    }

    // ── Error ──
    if (settingsError) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
                <div className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                    Failed to load settings.
                    <button onClick={() => refetch()} className="ml-auto flex items-center gap-1.5 text-xs hover:text-red-300">
                        <RefreshCw className="w-3.5 h-3.5" /> Retry
                    </button>
                </div>
            </div>
        );
    }

    // ── Page ──
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-full pb-20">

            {/* Header */}
            <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-serif text-cream-50 mb-1">Offerings Section</h1>
                    <p className="text-olive-500 text-sm">
                        Edit the homepage &ldquo;Simple. Fresh. Comforting.&rdquo; section
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {savedAt && !isDirty && (
                        <span className="text-emerald-400 text-xs">
                            ✓ Saved {savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                    <a href="/" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 text-olive-400 hover:text-olive-300 text-sm transition-colors mr-1">
                        View live <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <Link href="/admin/menu"
                        className="flex items-center gap-2 px-4 py-2 bg-olive-800/50 hover:bg-olive-700/50 text-olive-300 text-sm rounded-xl transition-all border border-olive-700/30">
                        <ArrowRight className="w-3.5 h-3.5" /> Menu Manager
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={!isDirty || update.isPending}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-400 disabled:bg-olive-700 disabled:text-olive-500 text-white text-sm font-medium rounded-xl transition-all"
                    >
                        <Save className="w-4 h-4" />
                        {update.isPending ? 'Saving…' : isDirty ? 'Save Changes' : 'Saved'}
                    </button>
                </div>
            </div>



            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-olive-900/40 border border-olive-800/20 rounded-2xl mb-6 w-fit">
                {([
                    ['preview', LayoutPanelTop, 'Card Preview & Items'],
                    ['settings', ListChecks, 'Text & Category Settings'],
                ] as const).map(([tab, Icon, label]) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={[
                            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                            activeTab === tab
                                ? 'bg-olive-800 text-cream-50 shadow-sm'
                                : 'text-olive-500 hover:text-olive-300',
                        ].join(' ')}>
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                    </button>
                ))}
            </div>

            {/* ══════════════════════════════════════════
                TAB 1 — CARD PREVIEW + INLINE ACCENT EDIT
                ══════════════════════════════════════════ */}
            {activeTab === 'preview' && (
                <div className="space-y-5">

                    {/* Mini heading preview */}
                    <div className="px-6 py-5 bg-olive-900/30 border border-olive-800/20 rounded-2xl text-center">
                        <p className="text-olive-500 text-[10px] tracking-[0.3em] uppercase mb-2">{form.badge}</p>
                        <p className="text-cream-50 font-serif text-3xl leading-tight">
                            {form.heading}<br />
                            <em className="text-olive-400">{form.headingItalic}</em>
                        </p>
                    </div>

                    {/* Cards */}
                    <div className="grid md:grid-cols-12 gap-5">
                        <div className="md:col-span-7">
                            <CardPreview icon={Coffee} cardNumber="01"
                                sectionLabel={form.beverageCard.sectionLabel}
                                title={form.beverageCard.title}
                                items={bevItems} light showPrices={showPrices} />
                        </div>
                        <div className="md:col-span-5">
                            <CardPreview icon={Zap} cardNumber="02"
                                sectionLabel={form.foodCard.sectionLabel}
                                title={form.foodCard.title}
                                items={foodItems} light={false} showPrices={showPrices} />
                        </div>
                    </div>

                    {/* Quote preview */}
                    <div className="text-center py-4">
                        <p className="text-olive-500 font-serif italic text-lg">&ldquo;{form.quote}&rdquo;</p>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════
                TAB 2 — TEXT + CATEGORY ASSIGNMENT
                ══════════════════════════════════════════ */}
            {activeTab === 'settings' && (
                <div className="space-y-6">

                    {/* Section header text */}
                    <div className="bg-olive-900/30 border border-olive-800/20 rounded-2xl p-5 sm:p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <LayoutPanelTop className="w-4 h-4 text-gold-500" />
                            <h2 className="text-cream-50 font-medium text-sm">Section Header Text</h2>
                        </div>
                        <FieldGroup label="Top Badge" hint="Small uppercase label shown above the heading.">
                            <TextBox value={form.badge} onChange={(v) => patch({ badge: v })} placeholder="Savor the Moment" maxLength={40} />
                        </FieldGroup>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <FieldGroup label="Main Heading">
                                <TextBox value={form.heading} onChange={(v) => patch({ heading: v })} placeholder="Simple. Fresh." maxLength={30} />
                            </FieldGroup>
                            <FieldGroup label="Italic Accent Line">
                                <TextBox value={form.headingItalic} onChange={(v) => patch({ headingItalic: v })} placeholder="Comforting." maxLength={30} />
                            </FieldGroup>
                        </div>
                        <FieldGroup label="Bottom Quote" hint='Shown above the "Explore Full Menu" button. Quote marks are added automatically.'>
                            <TextBox value={form.quote} onChange={(v) => patch({ quote: v })} placeholder="Fuel for your best ideas." maxLength={60} />
                        </FieldGroup>
                    </div>

                    {/* Card settings — side by side */}
                    <div className="grid sm:grid-cols-2 gap-5">

                        {/* ── Beverages Card ── */}
                        <div className="bg-white/[0.03] border border-olive-700/30 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-5">
                                <Coffee className="w-4 h-4 text-gold-400" />
                                <span className="text-cream-50 font-medium text-sm">Beverages Card</span>
                                <span className="ml-auto text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-olive-100/10 text-olive-400 rounded-full">
                                    Light
                                </span>
                            </div>

                            <FieldGroup label="Section Label">
                                <TextBox value={form.beverageCard.sectionLabel}
                                    onChange={(v) => patchBev({ sectionLabel: v })}
                                    placeholder="The Brew Bar" maxLength={30} />
                            </FieldGroup>
                            <FieldGroup label="Card Title">
                                <TextBox value={form.beverageCard.title}
                                    onChange={(v) => patchBev({ title: v })}
                                    placeholder="Liquid Inspiration" maxLength={30} />
                            </FieldGroup>

                            {/* Category checkboxes */}
                            <FieldGroup
                                label="Categories"
                                hint="Choose which menu categories appear in this card. A category can only belong to one card."
                            >
                                <CategoryPicker
                                    allCategories={allCategories}
                                    selectedIds={form.beverageCard.categoryIds}
                                    lockedIds={form.foodCard.categoryIds}
                                    onChange={(ids) => patchBev({ categoryIds: ids })}
                                />
                            </FieldGroup>

                            <FieldGroup label="Max Items Shown" hint="Maximum items displayed from the selected categories.">
                                <div className="flex items-center gap-3">
                                    <NumberBox value={form.beverageCard.maxItems}
                                        onChange={(v) => patchBev({ maxItems: v })}
                                        min={1} max={20} />
                                    <span className="text-olive-500 text-xs">items</span>
                                </div>
                            </FieldGroup>
                        </div>

                        {/* ── Kitchen Card ── */}
                        <div className="bg-olive-950/60 border border-olive-800/40 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-5">
                                <Zap className="w-4 h-4 text-gold-400" />
                                <span className="text-cream-50 font-medium text-sm">Kitchen Card</span>
                                <span className="ml-auto text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-white/5 text-olive-500 rounded-full">
                                    Dark
                                </span>
                            </div>

                            <FieldGroup label="Section Label">
                                <TextBox value={form.foodCard.sectionLabel}
                                    onChange={(v) => patchFood({ sectionLabel: v })}
                                    placeholder="The Kitchen" maxLength={30} />
                            </FieldGroup>
                            <FieldGroup label="Card Title">
                                <TextBox value={form.foodCard.title}
                                    onChange={(v) => patchFood({ title: v })}
                                    placeholder="Nourishment" maxLength={30} />
                            </FieldGroup>

                            {/* Category checkboxes */}
                            <FieldGroup
                                label="Categories"
                                hint="Choose which menu categories appear in this card."
                            >
                                <CategoryPicker
                                    allCategories={allCategories}
                                    selectedIds={form.foodCard.categoryIds}
                                    lockedIds={form.beverageCard.categoryIds}
                                    onChange={(ids) => patchFood({ categoryIds: ids })}
                                />
                            </FieldGroup>

                            <FieldGroup label="Max Items Shown">
                                <div className="flex items-center gap-3">
                                    <NumberBox value={form.foodCard.maxItems}
                                        onChange={(v) => patchFood({ maxItems: v })}
                                        min={1} max={20} />
                                    <span className="text-olive-500 text-xs">items</span>
                                </div>
                            </FieldGroup>
                        </div>
                    </div>

                    {/* Accent line explainer */}
                    <div className="flex gap-3 px-5 py-4 bg-olive-900/20 border border-olive-800/20 rounded-2xl">
                        <span className="text-xl shrink-0">✏️</span>
                        <div>
                            <p className="text-cream-50 text-sm font-medium mb-1">Editing accent lines</p>
                            <p className="text-olive-500 text-xs leading-relaxed">
                                Each item has a short <span className="text-olive-300 font-medium">accent line</span> shown
                                below its name on the homepage card (e.g. <em className="text-olive-400">Loose Leaf • Blends</em>).
                                You can edit it two ways:<br />
                                <span className="text-olive-400">1.</span> Switch to the <strong className="text-olive-300">Card Preview</strong> tab → hover any item → click ✏️<br />
                                <span className="text-olive-400">2.</span> In <Link href="/admin/menu" className="underline text-gold-500 hover:text-gold-400">Menu Manager</Link> → edit an item → &quot;Homepage Accent&quot; field
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {update.isError && (
                <p className="mt-4 text-red-400 text-xs">
                    ⚠️ Save failed: {(update.error as Error)?.message}
                </p>
            )}
        </div>
    );
}
