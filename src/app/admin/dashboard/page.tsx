'use client';

import { useCategories, useMenuItems } from '@/hooks/use-menu-admin';
import { UtensilsCrossed, FolderOpen, TrendingUp, Eye } from 'lucide-react';

export default function AdminDashboard() {
    const { data: categories } = useCategories();
    const { data: items } = useMenuItems();

    const totalCategories = categories?.length || 0;
    const totalItems = items?.length || 0;
    const activeItems = items?.filter((i) => i.isActive).length || 0;
    const inactiveItems = totalItems - activeItems;

    const stats = [
        { label: 'Total Categories', value: totalCategories, icon: FolderOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Total Items', value: totalItems, icon: UtensilsCrossed, color: 'text-gold-400', bg: 'bg-gold-500/10' },
        { label: 'Active Items', value: activeItems, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Hidden Items', value: inactiveItems, icon: Eye, color: 'text-olive-400', bg: 'bg-olive-500/10' },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-full pb-20">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-2xl font-serif text-cream-50 mb-1">Dashboard</h1>
                <p className="text-olive-500 text-sm">Overview of your café menu</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="bg-olive-900/30 border border-olive-800/20 rounded-2xl p-6 hover:border-olive-700/30 transition-colors"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-3xl font-semibold text-cream-50 mb-1">{stat.value}</p>
                            <p className="text-olive-500 text-xs uppercase tracking-wider">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick actions */}
            <div className="bg-olive-900/30 border border-olive-800/20 rounded-2xl p-6">
                <h2 className="text-lg font-serif text-cream-50 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <a
                        href="/admin/menu"
                        className="px-5 py-3 bg-gold-500 hover:bg-gold-400 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-gold-500/20"
                    >
                        Manage Menu Items
                    </a>
                    <a
                        href="/menu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 bg-olive-800/50 hover:bg-olive-800/80 text-olive-300 text-sm font-medium rounded-xl transition-colors border border-olive-700/30"
                    >
                        Preview Live Menu ↗
                    </a>
                </div>
            </div>
        </div>
    );
}
