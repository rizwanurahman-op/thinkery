'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/use-menu-admin';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Coffee, User, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const login = useLogin();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const loginPromise = login.mutateAsync({
            identifier: identifier.trim(),
            password: password.trim(),
        }).then(() => {
            router.push('/admin/dashboard');
        });

        toast.promise(loginPromise, {
            loading: 'Authenticating...',
            success: 'Login successful',
            error: (err: any) => err.message || 'Login failed',
        });
    };

    const isRateLimited = login.isError && login.error?.message?.includes('Too many');

    return (
        <div className="admin-login-root">
            {/* Ambient blobs */}
            <div className="admin-login-blob admin-login-blob-1" />
            <div className="admin-login-blob admin-login-blob-2" />
            <div className="admin-login-blob admin-login-blob-3" />

            {/* Grid overlay */}
            <div className="admin-login-grid" />

            <div className={`admin-login-card-wrap ${mounted ? 'admin-login-card-wrap--visible' : ''}`}>
                {/* Header */}
                <div className="admin-login-header">
                    <div className="admin-login-logo">
                        <Coffee className="admin-login-logo-icon" />
                        <div className="admin-login-logo-ring" />
                    </div>
                    <h1 className="admin-login-title">Thinkery</h1>
                    <p className="admin-login-subtitle">Admin Portal</p>
                    <div className="admin-login-badge">
                        <ShieldCheck size={12} />
                        Secure Access
                    </div>
                </div>

                {/* Form card */}
                <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
                    <div className="admin-login-card">

                        {/* Rate limited banner */}
                        {isRateLimited && (
                            <div className="admin-login-rate-banner">
                                <AlertCircle size={16} />
                                <span>{login.error?.message}</span>
                            </div>
                        )}

                        {/* Identifier field */}
                        <div className="admin-login-field">
                            <label htmlFor="identifier" className="admin-login-label">
                                Username or Email
                            </label>
                            <div className="admin-login-input-wrap">
                                <span className="admin-login-input-icon">
                                    <User size={15} />
                                </span>
                                <input
                                    id="identifier"
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="admin or you@example.com"
                                    className="admin-login-input"
                                    required
                                    autoFocus
                                    autoComplete="username"
                                    maxLength={200}
                                    spellCheck={false}
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="admin-login-field">
                            <label htmlFor="password" className="admin-login-label">
                                Password
                            </label>
                            <div className="admin-login-input-wrap">
                                <span className="admin-login-input-icon">
                                    <Lock size={15} />
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="admin-login-input admin-login-input--password"
                                    required
                                    autoComplete="current-password"
                                    maxLength={200}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="admin-login-toggle"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    tabIndex={0}
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Inline error (non-rate-limited) */}
                        {login.isError && !isRateLimited && (
                            <div className="admin-login-error">
                                <AlertCircle size={14} />
                                <span>{login.error?.message || 'Invalid credentials. Please try again.'}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="admin-login-submit"
                            disabled={login.isPending || !identifier.trim() || !password.trim() || isRateLimited}
                        >
                            {login.isPending ? (
                                <span className="admin-login-submit-inner">
                                    <span className="admin-login-spinner" />
                                    Authenticating…
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>

                    {/* Footer link */}
                    <p className="admin-login-footer">
                        Back to{' '}
                        <a href="/" className="admin-login-footer-link">
                            website
                        </a>
                    </p>
                </form>
            </div>

            <style>{`
                /* ── Root ── */
                .admin-login-root {
                    min-height: 100svh;
                    background: #0d110d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                /* ── Ambient blobs ── */
                .admin-login-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    pointer-events: none;
                }
                .admin-login-blob-1 {
                    width: 500px; height: 500px;
                    top: -150px; left: -150px;
                    background: radial-gradient(circle, rgba(180,140,60,0.12) 0%, transparent 70%);
                    animation: blobFloat1 18s ease-in-out infinite;
                }
                .admin-login-blob-2 {
                    width: 400px; height: 400px;
                    bottom: -100px; right: -100px;
                    background: radial-gradient(circle, rgba(60,90,55,0.15) 0%, transparent 70%);
                    animation: blobFloat2 22s ease-in-out infinite;
                }
                .admin-login-blob-3 {
                    width: 300px; height: 300px;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    background: radial-gradient(circle, rgba(180,140,60,0.05) 0%, transparent 70%);
                    animation: blobFloat3 14s ease-in-out infinite;
                }
                @keyframes blobFloat1 {
                    0%, 100% { transform: translate(0,0) scale(1); }
                    50% { transform: translate(40px, 30px) scale(1.08); }
                }
                @keyframes blobFloat2 {
                    0%, 100% { transform: translate(0,0) scale(1); }
                    50% { transform: translate(-30px, -40px) scale(1.06); }
                }
                @keyframes blobFloat3 {
                    0%, 100% { transform: translate(-50%,-50%) scale(1); }
                    50% { transform: translate(-50%,-50%) scale(1.15); }
                }

                /* ── Grid overlay ── */
                .admin-login-grid {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 40px 40px;
                    pointer-events: none;
                }

                /* ── Card wrapper ── */
                .admin-login-card-wrap {
                    position: relative;
                    width: 100%;
                    max-width: 420px;
                    opacity: 0;
                    transform: translateY(24px);
                    transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
                }
                .admin-login-card-wrap--visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* ── Header ── */
                .admin-login-header {
                    text-align: center;
                    margin-bottom: 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }
                .admin-login-logo {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 72px; height: 72px;
                    border-radius: 22px;
                    background: linear-gradient(135deg, rgba(180,140,60,0.15), rgba(60,90,55,0.15));
                    border: 1px solid rgba(180,140,60,0.2);
                    margin-bottom: 0.5rem;
                    box-shadow: 0 0 0 8px rgba(180,140,60,0.05);
                }
                .admin-login-logo-ring {
                    position: absolute;
                    inset: -8px;
                    border-radius: 28px;
                    border: 1px solid rgba(180,140,60,0.1);
                    animation: logoRingPulse 3s ease-in-out infinite;
                }
                @keyframes logoRingPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.06); }
                }
                .admin-login-logo-icon { color: #c9a84c; width: 32px; height: 32px; }

                .admin-login-title {
                    font-size: 1.75rem;
                    font-family: Georgia, 'Times New Roman', serif;
                    color: #f5eed8;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                    margin: 0;
                }
                .admin-login-subtitle {
                    font-size: 0.8rem;
                    color: #7a8c6e;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    font-weight: 500;
                    margin: 0;
                }
                .admin-login-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 999px;
                    background: rgba(60,90,55,0.2);
                    border: 1px solid rgba(60,90,55,0.35);
                    color: #8aad7a;
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-top: 0.25rem;
                }

                /* ── Card ── */
                .admin-login-card {
                    background: rgba(255,255,255,0.035);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 24px;
                    padding: 2rem;
                    box-shadow:
                        0 8px 32px rgba(0,0,0,0.35),
                        0 0 0 1px rgba(180,140,60,0.07) inset,
                        0 1px 0 rgba(255,255,255,0.06) inset;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                /* ── Rate limited banner ── */
                .admin-login-rate-banner {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    background: rgba(239,68,68,0.1);
                    border: 1px solid rgba(239,68,68,0.25);
                    border-radius: 12px;
                    padding: 0.75rem 1rem;
                    color: #f87171;
                    font-size: 0.8rem;
                    line-height: 1.4;
                }

                /* ── Field ── */
                .admin-login-field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .admin-login-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: #8a9e7a;
                }
                .admin-login-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .admin-login-input-icon {
                    position: absolute;
                    left: 14px;
                    color: #5e7258;
                    display: flex;
                    pointer-events: none;
                    transition: color 0.2s;
                }
                .admin-login-input {
                    width: 100%;
                    padding: 0.875rem 1rem 0.875rem 2.75rem;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 14px;
                    color: #f5eed8;
                    font-size: 0.875rem;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    -webkit-font-smoothing: antialiased;
                }
                .admin-login-input::placeholder { color: #4a5e42; }
                .admin-login-input:focus {
                    border-color: rgba(180,140,60,0.5);
                    box-shadow: 0 0 0 3px rgba(180,140,60,0.1);
                    background: rgba(255,255,255,0.06);
                }
                .admin-login-input:focus + .admin-login-input-icon,
                .admin-login-input-wrap:focus-within .admin-login-input-icon {
                    color: #c9a84c;
                }
                .admin-login-input--password { padding-right: 3rem; }
                .admin-login-toggle {
                    position: absolute;
                    right: 12px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #5e7258;
                    padding: 4px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.2s, background 0.2s;
                }
                .admin-login-toggle:hover { color: #c9a84c; background: rgba(255,255,255,0.06); }
                .admin-login-toggle:focus-visible {
                    outline: 2px solid rgba(180,140,60,0.5);
                    outline-offset: 2px;
                }

                /* ── Error ── */
                .admin-login-error {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #f87171;
                    font-size: 0.78rem;
                    background: rgba(239,68,68,0.08);
                    border: 1px solid rgba(239,68,68,0.2);
                    border-radius: 10px;
                    padding: 0.6rem 0.875rem;
                }

                /* ── Submit ── */
                .admin-login-submit {
                    width: 100%;
                    padding: 0.9rem 1rem;
                    background: linear-gradient(135deg, #c9a84c, #a8893e);
                    color: #0d110d;
                    font-weight: 700;
                    font-size: 0.85rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    border: none;
                    border-radius: 14px;
                    cursor: pointer;
                    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 20px rgba(180,140,60,0.3);
                    margin-top: 0.25rem;
                }
                .admin-login-submit:hover:not(:disabled) {
                    opacity: 0.92;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(180,140,60,0.35);
                }
                .admin-login-submit:active:not(:disabled) {
                    transform: translateY(0);
                }
                .admin-login-submit:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    box-shadow: none;
                }
                .admin-login-submit-inner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.6rem;
                }

                /* ── Spinner ── */
                .admin-login-spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(13,17,13,0.3);
                    border-top-color: #0d110d;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* ── Footer ── */
                .admin-login-footer {
                    text-align: center;
                    color: #4a5e42;
                    font-size: 0.75rem;
                    margin-top: 1.25rem;
                }
                .admin-login-footer-link {
                    color: #c9a84c;
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s;
                }
                .admin-login-footer-link:hover { color: #e2c96e; }
            `}</style>
        </div>
    );
}
