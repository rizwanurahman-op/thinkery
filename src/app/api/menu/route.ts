import { NextResponse } from 'next/server';
import { getPublicMenuData } from '@/lib/menu-store';

// Public endpoint — no auth required
// Used by admin/offerings page to get live menu data from Redis
export async function GET() {
    try {
        // await is required — getPublicMenuData() now reads from Redis (async)
        const data = await getPublicMenuData();
        return NextResponse.json({ success: true, data }, {
            headers: {
                // No CDN caching — data must always be live from Redis
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to load menu' },
            { status: 500 }
        );
    }
}
