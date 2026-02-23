import { NextResponse } from 'next/server';
import { getPublicMenuData } from '@/lib/menu-store';

// Public endpoint — no auth required
// Used by the public /menu page for ISR data fetching
export async function GET() {
    try {
        const data = getPublicMenuData();
        return NextResponse.json({ success: true, data }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to load menu' },
            { status: 500 }
        );
    }
}
