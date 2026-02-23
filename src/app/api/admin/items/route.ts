import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from '@/lib/auth';
import { getAllItems, createItem } from '@/lib/menu-store';
import type { MenuItem } from '@/types';

export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const items = await getAllItems();
        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to load items' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await request.json() as MenuItem;

        if (!body.name || !body.categoryId) {
            return NextResponse.json(
                { success: false, error: 'Name and categoryId are required' },
                { status: 400 }
            );
        }

        const item = await createItem({
            id: body.id || `item-${Date.now()}`,
            name: body.name,
            description: body.description || '',
            shortDesc: body.shortDesc || '',
            price: body.price,
            categoryId: body.categoryId,
            badge: body.badge,
            image: body.image,
            imagePublicId: body.imagePublicId,
            isActive: body.isActive ?? true,
            sortOrder: body.sortOrder ?? 999,
        });

        revalidatePath('/');
        revalidatePath('/menu');

        return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to create item' },
            { status: 400 }
        );
    }
}
