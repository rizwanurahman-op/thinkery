import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from '@/lib/auth';
import { getAllCategories, createCategory } from '@/lib/menu-store';
import type { MenuCategoryItem } from '@/types';

export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const categories = await getAllCategories();
        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to load categories' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await request.json();
        const { id, label, icon, sortOrder } = body as MenuCategoryItem;

        if (!id || !label) {
            return NextResponse.json(
                { success: false, error: 'ID and label are required' },
                { status: 400 }
            );
        }

        const category = await createCategory({
            id: id.toLowerCase().replace(/\s+/g, '-'),
            label,
            icon: icon || '📋',
            sortOrder: sortOrder ?? 999,
        });

        revalidatePath('/');
        revalidatePath('/menu');

        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to create category' },
            { status: 400 }
        );
    }
}
