import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from '@/lib/auth';
import { readSettingsLive, writeSettings } from '@/lib/settings-store';

// Admin — GET current settings
export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const settings = await readSettingsLive();
        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to load settings' },
            { status: 500 },
        );
    }
}

// Admin — PUT update settings
export async function PUT(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await request.json();
        const updated = await writeSettings(body);
        // Revalidate public pages so gallery/settings changes appear immediately
        revalidatePath('/');
        revalidatePath('/menu');
        revalidatePath('/about');
        revalidatePath('/work-and-meet');
        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to update settings' },
            { status: 500 },
        );
    }
}
