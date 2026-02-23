'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthCheck, useLogout } from '@/hooks/use-menu-admin';
import {
    Coffee, LayoutDashboard, UtensilsCrossed,
    LogOut, ExternalLink, Menu, X, Settings, LayoutPanelTop, Images, Layers,
} from 'lucide-react';
import Link from 'next/link';
import { AdminNavbar } from '@/components/admin/admin-navbar';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';


const SIDEBAR_LINKS = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/menu', label: 'Menu Manager', icon: UtensilsCrossed },
    { href: '/admin/offerings', label: 'Offerings', icon: LayoutPanelTop },
    { href: '/admin/gallery', label: 'Gallery', icon: Images },
    { href: '/admin/pages', label: 'Page Images', icon: Layers },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function SidebarInner({
    pathname,
    onLogout,
    isPending,
    onLinkClick,
}: {
    pathname: string;
    onLogout: () => void;
    isPending: boolean;
    onLinkClick?: () => void;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Logo */}
            <div className="p-6 border-b border-olive-800/30 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-olive-800/50 border border-olive-700/30 flex items-center justify-center">
                        <Coffee className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                        <h2 className="text-cream-50 font-serif text-lg leading-none">Thinkery</h2>
                        <span className="text-olive-500 text-[10px] uppercase tracking-[0.2em]">Admin Panel</span>
                    </div>
                </div>
            </div>

            {/* Navigation — scrollable if many links */}
            <nav className="p-4 space-y-1" style={{ flex: 1, overflowY: 'auto' }}>
                {SIDEBAR_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onLinkClick}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                ${isActive
                                    ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                                    : 'text-olive-400 hover:text-cream-50 hover:bg-olive-800/30'
                                }`}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="p-4 border-t border-olive-800/30 space-y-1 shrink-0">
                <a
                    href="/menu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-olive-400 hover:text-cream-50 hover:bg-olive-800/30 transition-all"
                >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    View Live Menu
                </a>
                <button
                    type="button"
                    onClick={onLogout}
                    disabled={isPending}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all w-full text-left"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {isPending ? 'Signing out...' : 'Sign Out'}
                </button>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: isAuth, isLoading } = useAuthCheck();
    const logout = useLogout();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


    const isLoginPage = pathname === '/admin/login';

    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    useEffect(() => {
        if (!isLoading && !isAuth && !isLoginPage) {
            router.push('/admin/login');
        }
    }, [isAuth, isLoading, isLoginPage, router]);

    if (isLoginPage) return <>{children}</>;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-olive-950 flex items-center justify-center">
                <div className="flex items-center gap-3 text-olive-400">
                    <div className="w-5 h-5 border-2 border-olive-600 border-t-gold-400 rounded-full animate-spin" />
                    Loading...
                </div>
            </div>
        );
    }

    if (!isAuth) return null;

    const handleLogout = () => {
        setShowLogoutConfirm(false);
        const logoutPromise = logout.mutateAsync().then(() => {
            router.push('/admin/login');
        });

        toast.promise(logoutPromise, {
            loading: 'Signing out...',
            success: 'Signed out successfully',
            error: (err: any) => err.message || 'Failed to sign out',
        });
    };

    return (
        <>
            {/*
             * APPROACH: position:fixed wrapper that covers the full viewport.
             * This bypasses any parent flex/height issues from the root layout body.
             * Sidebar is left-pinned, main content fills the rest.
             */}
            <div
                className="fixed inset-0 flex overflow-hidden bg-olive-950"
            >
                {/* ── DESKTOP SIDEBAR ── visible on lg+ ─────────────────── */}
                <aside
                    className="hidden lg:block bg-olive-900/60 border-r border-olive-800/30"
                    style={{ width: 280, flexShrink: 0, height: '100%' }}
                >
                    <SidebarInner
                        pathname={pathname}
                        onLogout={() => {
                            setShowLogoutConfirm(true);
                        }}
                        isPending={logout.isPending}
                    />
                </aside>

                {/* ── MAIN CONTENT AREA ────────────────────────────────────── */}
                <div className="flex-1 flex flex-col min-w-0 min-h-0 relative">
                    <AdminNavbar
                        onMenuClick={() => setSidebarOpen(true)}
                        onLogoutClick={() => {
                            setShowLogoutConfirm(true);
                        }}
                    />

                    <main className="flex-1 overflow-y-auto overscroll-contain bg-olive-950 custom-scrollbar">
                        {children}
                    </main>
                </div>
            </div>

            {/* ━━━ LOGOUT CONFIRMATION ━━━ */}
            {showLogoutConfirm && (
                <ConfirmDialog
                    isOpen={showLogoutConfirm}
                    onClose={() => setShowLogoutConfirm(false)}
                    onConfirm={handleLogout}
                    title="Sign Out"
                    description="Are you sure you want to sign out? You will need to enter your password again to access the admin panel."
                    confirmLabel="Sign Out"
                    variant="warning"
                    isLoading={logout.isPending}
                />
            )}

            {/* ── MOBILE SIDEBAR OVERLAY ── */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`
                    lg:hidden fixed top-0 left-0 bottom-0 z-50
                    bg-olive-900/95 border-r border-olive-800/30 shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                style={{ width: 280 }}
            >
                <SidebarInner
                    pathname={pathname}
                    onLogout={() => {
                        setShowLogoutConfirm(true);
                    }}
                    isPending={logout.isPending}
                    onLinkClick={() => setSidebarOpen(false)}
                />
            </aside>
        </>
    );
}

