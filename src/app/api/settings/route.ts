import { NextResponse } from 'next/server';
import { readSettings } from '@/lib/settings-store';

// Public endpoint — no auth required
// Used by the public /menu page to decide whether to show prices
export async function GET() {
    try {
        const settings = readSettings();
        return NextResponse.json({ success: true, data: settings }, {
            headers: {
                // Cache for 30 seconds — price toggle reflects quickly without hammering the server
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to load settings' },
            { status: 500 },
        );
    }
}
