import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from '@/lib/auth';
import { reorderItems } from '@/lib/menu-store';

// POST /api/admin/items/reorder
// Body: { ids: string[] }  — ordered array of item IDs
export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { ids } = await request.json() as { ids: string[] };
        if (!Array.isArray(ids)) {
            return NextResponse.json({ success: false, error: 'ids must be an array' }, { status: 400 });
        }

        await reorderItems(ids);

        revalidatePath('/');
        revalidatePath('/menu');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Reorder failed' },
            { status: 500 },
        );
    }
}
