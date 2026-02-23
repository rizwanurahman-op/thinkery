import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Max 10 MB — Cloudinary handles compression so we can be generous here
const MAX_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
];

export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 },
            );
        }

        // Validate type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid file type. Allowed: JPG, PNG, WebP, AVIF' },
                { status: 400 },
            );
        }

        // Validate size
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { success: false, error: 'File too large. Maximum 10 MB allowed.' },
                { status: 400 },
            );
        }

        // Convert to Buffer and upload to Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Allow callers to specify a Cloudinary folder via query param
        // e.g. /api/admin/upload?folder=calm-cafe/pages
        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder') || 'calm-cafe/menu';

        const { url, publicId } = await uploadToCloudinary(buffer, folder);

        return NextResponse.json({
            success: true,
            data: { url, publicId },
        });
    } catch (error) {
        console.error('[upload] Error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Upload failed' },
            { status: 500 },
        );
    }
}
