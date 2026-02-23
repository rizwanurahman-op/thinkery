'use client';

import { User, LogOut, ExternalLink, Menu, Bell, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminNavbarProps {
    onMenuClick: () => void;
    onLogoutClick: () => void;
    userName?: string;
}

export function AdminNavbar({ onMenuClick, onLogoutClick, userName = 'Administrator' }: AdminNavbarProps) {
    return (
        <header className="sticky top-0 z-40 w-full bg-olive-950/80 backdrop-blur-xl border-b border-olive-800/30">
            <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* Left: Mobile Toggle & Page Info */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 -ml-2 text-olive-400 hover:text-cream-50 hover:bg-olive-800/50 rounded-lg transition-all"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="hidden sm:flex items-center gap-2">
                        <span className="h-4 w-[1px] bg-olive-800/50 hidden lg:block" />
                        <span className="text-xs font-medium text-olive-500 uppercase tracking-widest hidden lg:block">Overview</span>
                    </div>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Live Preview Button */}
                    <a
                        href="/"
                        target="_blank"
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gold-400 hover:text-gold-300 bg-gold-500/5 hover:bg-gold-500/10 border border-gold-500/20 rounded-full transition-all"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Live Site
                    </a>

                    <div className="h-4 w-[1px] bg-olive-800/50 hidden sm:block mx-1" />

                    {/* Profile Dropdown Simulation */}
                    <div className="flex items-center gap-3 pl-2">
                        <div className="hidden text-right lg:block">
                            <p className="text-sm font-medium text-cream-50 leading-none mb-1">{userName}</p>
                            <p className="text-[10px] text-olive-500 uppercase tracking-tighter">Site Manager</p>
                        </div>

                        <div className="relative group">
                            <button
                                type="button"
                                onClick={onLogoutClick}
                                className="flex items-center gap-2 p-1 pr-2 sm:p-1.5 sm:pr-3 bg-olive-900/50 hover:bg-red-500/10 border border-olive-800/30 hover:border-red-500/30 rounded-full transition-all group"
                            >
                                <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <LogOut className="w-3.5 h-3.5 text-olive-500 group-hover:text-red-400 transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
