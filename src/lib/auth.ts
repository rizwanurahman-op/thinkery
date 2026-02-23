import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_token';
const TOKEN_MAX_AGE = 60 * 60 * 24; // 24 hours

// ─── Rate Limiting (in-memory, resets on server restart) ───
// For production, use Redis or a proper store.
type AttemptRecord = { count: number; lockUntil: number };
const loginAttempts = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(identifier: string): { blocked: boolean; remainingMs?: number } {
    const record = loginAttempts.get(identifier);
    if (!record) return { blocked: false };

    const now = Date.now();
    if (record.lockUntil > now) {
        return { blocked: true, remainingMs: record.lockUntil - now };
    }

    // Lock expired — reset
    if (record.lockUntil > 0 && record.lockUntil <= now) {
        loginAttempts.delete(identifier);
        return { blocked: false };
    }

    return { blocked: false };
}

export function recordFailedAttempt(identifier: string): void {
    const now = Date.now();
    const record = loginAttempts.get(identifier) ?? { count: 0, lockUntil: 0 };

    // If lock expired, reset
    if (record.lockUntil > 0 && record.lockUntil <= now) {
        loginAttempts.set(identifier, { count: 1, lockUntil: 0 });
        return;
    }

    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
        record.lockUntil = now + LOCK_DURATION_MS;
    }
    loginAttempts.set(identifier, record);
}

export function clearAttempts(identifier: string): void {
    loginAttempts.delete(identifier);
}

// ─── Credential Getters ───

function getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET environment variable is not set');
    return secret;
}

function getAdminPassword(): string {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) throw new Error('ADMIN_PASSWORD environment variable is not set');
    return password;
}

function getAdminUsername(): string {
    // Falls back to 'admin' if not set, but production should set ADMIN_USERNAME
    return process.env.ADMIN_USERNAME ?? 'admin';
}

function getAdminEmail(): string {
    // Falls back to empty string if not set
    return process.env.ADMIN_EMAIL ?? '';
}

// ─── Constant-time string comparison (prevents timing attacks) ───

async function safeCompare(a: string, b: string): Promise<boolean> {
    const encoder = new TextEncoder();
    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    // Hash both so they are equal length before comparing
    const [aHash, bHash] = await Promise.all([
        crypto.subtle.digest('SHA-256', aBytes),
        crypto.subtle.digest('SHA-256', bBytes),
    ]);

    const aArr = new Uint8Array(aHash);
    const bArr = new Uint8Array(bHash);

    let result = 0;
    for (let i = 0; i < aArr.length; i++) {
        result |= aArr[i] ^ bArr[i];
    }
    return result === 0;
}

// ─── Token Signature ───

async function createSignature(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
    const expected = await createSignature(payload, secret);
    // Constant-time comparison
    if (expected.length !== signature.length) return false;
    let result = 0;
    for (let i = 0; i < expected.length; i++) {
        result |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    return result === 0;
}

// ─── Token Generation & Verification ───

function generateJti(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function createToken(): Promise<string> {
    const secret = getSecret();
    const payload = JSON.stringify({
        role: 'admin',
        jti: generateJti(), // unique token ID to prevent confusion attacks
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + TOKEN_MAX_AGE,
    });
    const encoded = btoa(payload);
    const signature = await createSignature(encoded, secret);
    return `${encoded}.${signature}`;
}

export async function verifyToken(token: string): Promise<boolean> {
    try {
        const secret = getSecret();
        const dotIndex = token.lastIndexOf('.');
        if (dotIndex === -1) return false;

        const encoded = token.slice(0, dotIndex);
        const signature = token.slice(dotIndex + 1);

        if (!encoded || !signature) return false;

        const isValid = await verifySignature(encoded, signature, secret);
        if (!isValid) return false;

        let payload: { role?: string; exp?: number; iat?: number };
        try {
            payload = JSON.parse(atob(encoded));
        } catch {
            return false;
        }

        if (typeof payload.exp !== 'number') return false;
        if (payload.exp < Math.floor(Date.now() / 1000)) return false;
        if (typeof payload.iat !== 'number') return false;
        // Reject tokens issued in the future (clock skew tolerance: 60s)
        if (payload.iat > Math.floor(Date.now() / 1000) + 60) return false;

        return payload.role === 'admin';
    } catch {
        return false;
    }
}

// ─── Credential Validation ───

/**
 * Validates identifier (username or email) AND password.
 * Returns true only if BOTH are correct.
 * Uses constant-time comparisons to prevent timing attacks.
 */
export async function validateCredentials(identifier: string, password: string): Promise<boolean> {
    const adminUsername = getAdminUsername();
    const adminEmail = getAdminEmail();
    const adminPassword = getAdminPassword();

    const normalizedIdentifier = identifier.trim().toLowerCase();

    const isUsername = await safeCompare(normalizedIdentifier, adminUsername.toLowerCase());
    const isEmail = adminEmail
        ? await safeCompare(normalizedIdentifier, adminEmail.toLowerCase())
        : false;
    const isPasswordCorrect = await safeCompare(password, adminPassword);

    return (isUsername || isEmail) && isPasswordCorrect;
}

// ─── Cookie Management ───

export async function setAuthCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // Upgraded from 'lax' to 'strict' for better CSRF protection
        maxAge: TOKEN_MAX_AGE,
        path: '/',
    });
}

export async function clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function getAuthToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}

export async function isAuthenticated(): Promise<boolean> {
    const token = await getAuthToken();
    if (!token) return false;
    return verifyToken(token);
}
