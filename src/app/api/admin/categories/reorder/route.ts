import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from '@/lib/auth';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { MenuData } from '@/types';

const DATA_PATH = join(process.cwd(), 'src', 'data', 'menu.json');

// POST /api/admin/categories/reorder
// Body: { ids: string[] }  — ordered array of category IDs
export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { ids } = await request.json() as { ids: string[] };
        if (!Array.isArray(ids)) {
            return NextResponse.json({ success: false, error: 'ids must be an array' }, { status: 400 });
        }

        const raw = readFileSync(DATA_PATH, 'utf-8');
        const data = JSON.parse(raw) as MenuData;

        // Build a position map from the ordered IDs
        const positionMap = new Map(ids.map((id, index) => [id, index + 1]));

        // Apply new sortOrders — categories not in the list keep their existing sortOrder
        data.categories = data.categories.map((category) => ({
            ...category,
            sortOrder: positionMap.has(category.id) ? positionMap.get(category.id)! : category.sortOrder,
        }));

        writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');

        // Immediately invalidate public page cache
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
