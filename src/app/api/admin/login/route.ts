import { NextRequest, NextResponse } from 'next/server';
import {
    validateCredentials,
    createToken,
    setAuthCookie,
    checkRateLimit,
    recordFailedAttempt,
    clearAttempts,
} from '@/lib/auth';

// Generic error message — never reveal which field is wrong
const INVALID_MSG = 'Invalid credentials. Please try again.';

function getClientIdentifier(request: NextRequest): string {
    // Use IP address as the rate-limit key (X-Forwarded-For in production behind proxy)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    return ip;
}

export async function POST(request: NextRequest) {
    try {
        const identifier = getClientIdentifier(request);

        // ── Rate Limit Check ──
        const { blocked, remainingMs } = checkRateLimit(identifier);
        if (blocked) {
            const minutes = Math.ceil((remainingMs ?? 0) / 60000);
            return NextResponse.json(
                {
                    success: false,
                    message: `Too many failed attempts. Try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`,
                    rateLimited: true,
                },
                { status: 429 }
            );
        }

        // ── Parse & Validate Input ──
        let body: Record<string, unknown>;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { success: false, message: 'Invalid request body.' },
                { status: 400 }
            );
        }

        const rawIdentifier = body.identifier;
        const rawPassword = body.password;

        if (
            !rawIdentifier ||
            typeof rawIdentifier !== 'string' ||
            !rawPassword ||
            typeof rawPassword !== 'string'
        ) {
            return NextResponse.json(
                { success: false, message: 'Username/email and password are required.' },
                { status: 400 }
            );
        }

        const trimmedIdentifier = rawIdentifier.trim();
        const trimmedPassword = rawPassword.trim();

        // Basic sanity length limits (prevent abuse)
        if (trimmedIdentifier.length > 200 || trimmedPassword.length > 200) {
            return NextResponse.json(
                { success: false, message: INVALID_MSG },
                { status: 401 }
            );
        }

        // ── Validate Credentials ──
        const isValid = await validateCredentials(trimmedIdentifier, trimmedPassword);

        if (!isValid) {
            recordFailedAttempt(identifier);
            // Intentional small delay makes brute force slower
            await new Promise((r) => setTimeout(r, 500 + Math.random() * 250));
            return NextResponse.json(
                { success: false, message: INVALID_MSG },
                { status: 401 }
            );
        }

        // ── Success ──
        clearAttempts(identifier);
        const token = await createToken();
        await setAuthCookie(token);

        return NextResponse.json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('[Admin Login] Unexpected error:', error);
        return NextResponse.json(
            { success: false, message: 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}
