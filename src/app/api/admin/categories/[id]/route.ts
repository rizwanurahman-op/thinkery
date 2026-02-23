import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from '@/lib/auth';
import { updateCategory, deleteCategory } from '@/lib/menu-store';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const body = await request.json();
        const updated = await updateCategory(id, body);

        revalidatePath('/');
        revalidatePath('/menu');

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to update category' },
            { status: 400 }
        );
    }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        await deleteCategory(id);

        revalidatePath('/');
        revalidatePath('/menu');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to delete category' },
            { status: 400 }
        );
    }
}
