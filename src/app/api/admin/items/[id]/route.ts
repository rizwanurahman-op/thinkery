import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from '@/lib/auth';
import { getItemById, updateItem, deleteItem } from '@/lib/menu-store';
import { deleteFromCloudinary } from '@/lib/cloudinary';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const body = await request.json();

        // If the image is being replaced, delete the old one from Cloudinary
        const existing = getItemById(id);
        if (
            existing?.imagePublicId &&
            body.imagePublicId &&
            body.imagePublicId !== existing.imagePublicId
        ) {
            await deleteFromCloudinary(existing.imagePublicId);
        }

        const updated = updateItem(id, body);

        // Revalidate public pages so sort order changes appear immediately
        revalidatePath('/');
        revalidatePath('/menu');

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to update item' },
            { status: 400 },
        );
    }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { id } = await params;

        // Delete image from Cloudinary before removing item from store
        const item = getItemById(id);
        if (item?.imagePublicId) {
            await deleteFromCloudinary(item.imagePublicId);
        }

        deleteItem(id);

        // Revalidate public pages so deleted items disappear immediately
        revalidatePath('/');
        revalidatePath('/menu');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to delete item' },
            { status: 400 },
        );
    }
}
