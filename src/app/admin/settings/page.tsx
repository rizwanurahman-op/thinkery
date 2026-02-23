'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tag, Check, X, Eye, EyeOff, RefreshCw } from 'lucide-react';

// ─── Types ───

interface SiteSettings {
    showPrices: boolean;
}

// ─── Hook ───

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
    const queryClient = useQueryClient();
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
        onSuccess: (data) => {
            queryClient.setQueryData(['admin', 'settings'], data);
        },
    });
}

// ─── Setting Row ───

function ToggleRow({
    icon: Icon,
    title,
    description,
    checked,
    onToggle,
    disabled,
    onLabel,
    offLabel,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    checked: boolean;
    onToggle: () => void;
    disabled: boolean;
    onLabel: string;
    offLabel: string;
}) {
    return (
        <div className="flex items-start gap-5 p-5 sm:p-6 bg-olive-900/30 border border-olive-800/20 rounded-2xl hover:border-olive-700/30 transition-colors">
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-olive-800/60 border border-olive-700/30 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-gold-400" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-cream-50 font-medium text-sm">{title}</p>
                <p className="text-olive-500 text-xs mt-0.5 leading-relaxed">{description}</p>

                {/* Status badge */}
                <span
                    className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors ${checked
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-olive-800/40 text-olive-500 border border-olive-700/20'
                        }`}
                >
                    {checked ? (
                        <><Eye className="w-3 h-3" /> {onLabel}</>
                    ) : (
                        <><EyeOff className="w-3 h-3" /> {offLabel}</>
                    )}
                </span>
            </div>

            {/* Toggle */}
            <button
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={onToggle}
                className={`relative mt-1 shrink-0 w-14 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500/40 disabled:opacity-40 shadow-inner cursor-pointer ${checked ? 'bg-emerald-500/90' : 'bg-olive-950'
                    }`}
            >
                <span
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center ${checked ? 'translate-x-6' : 'translate-x-0'
                        }`}
                >
                    {checked ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    ) : (
                        <X className="w-3.5 h-3.5 text-olive-400 stroke-[3]" />
                    )}
                </span>
            </button>
        </div>
    );
}

// ─── Page ───

export default function SettingsPage() {
    const { data: settings, isLoading, isError, refetch } = useSettings();
    const update = useUpdateSettings();

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-olive-800/40 rounded-xl w-1/3" />
                    <div className="h-20 bg-olive-800/20 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (isError || !settings) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
                <div className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                    Failed to load settings.
                    <button onClick={() => refetch()} className="ml-auto flex items-center gap-1.5 text-xs hover:text-red-300">
                        <RefreshCw className="w-3.5 h-3.5" /> Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto min-h-full pb-20">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-serif text-cream-50 mb-1">Settings</h1>
                <p className="text-olive-500 text-sm">Control how your café menu appears to visitors</p>
            </div>

            {/* Settings groups */}
            <div className="space-y-3">
                <p className="text-olive-600 text-[11px] uppercase tracking-widest font-semibold px-1 mb-3">
                    Menu Display
                </p>

                <ToggleRow
                    icon={Tag}
                    title="Show Prices on Public Menu"
                    description="When enabled, all item prices are displayed on the public menu page and the homepage offerings section. Disable this to hide all prices site-wide — useful when updating your pricing."
                    checked={settings.showPrices}
                    onToggle={() => update.mutate({ showPrices: !settings.showPrices })}
                    disabled={update.isPending}
                    onLabel="Prices Visible"
                    offLabel="Prices Hidden"
                />
            </div>

            {update.isError && (
                <p className="mt-4 text-red-400 text-xs px-1">
                    ⚠️ Failed to save: {(update.error as Error)?.message}
                </p>
            )}

            {update.isSuccess && (
                <p className="mt-4 text-emerald-400 text-xs px-1 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Saved successfully
                </p>
            )}
        </div>
    );
}
