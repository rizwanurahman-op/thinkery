/**
 * migrate-gallery.mjs
 * -------------------
 * One-shot script: reads public/images/gallery-{1..4}.jpg,
 * uploads each to Cloudinary (folder: calm-cafe/gallery),
 * then saves the resulting URLs into src/data/settings.json.
 *
 * Run once:  node scripts/migrate-gallery.mjs
 */

import { v2 as cloudinary } from 'cloudinary';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Load .env.local manually (no dotenv dep needed) ─────────────────────────
const envPath = join(ROOT, '.env.local');
if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
    }
    console.log('✓ Loaded .env.local');
}

// ── Configure Cloudinary ─────────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('❌  CLOUDINARY_CLOUD_NAME not set. Check .env.local');
    process.exit(1);
}

// ── Gallery slot definitions (matches STATIC_FALLBACKS in gallery-section.tsx) ─
const SLOTS = [
    {
        file: 'gallery-4.jpg',           // slot 0 — tall portrait (The Entrance)
        label: 'The Entrance',
        alt: 'Thinkery Café minimal archway entrance in Calicut',
        publicIdHint: 'gallery-entrance',
    },
    {
        file: 'gallery-1.jpg',           // slot 1 — wide (Main Lounge)
        label: 'Main Lounge',
        alt: 'Green-inspired minimal interior seating at Thinkery Café',
        publicIdHint: 'gallery-lounge',
    },
    {
        file: 'gallery-2.jpg',           // slot 2 — medium (The Bar)
        label: 'The Bar',
        alt: 'Coffee bar and brewing station at Thinkery Café',
        publicIdHint: 'gallery-bar',
    },
    {
        file: 'gallery-3.jpg',           // slot 3 — medium (Workspace)
        label: 'Workspace',
        alt: 'Workspace area with power outlets at Thinkery Café Calicut',
        publicIdHint: 'gallery-workspace',
    },
];

// ── Upload helper ────────────────────────────────────────────────────────────
async function uploadImage(slot) {
    const imagePath = join(ROOT, 'public', 'images', slot.file);
    if (!existsSync(imagePath)) {
        console.error(`  ❌  File not found: public/images/${slot.file}`);
        return null;
    }

    console.log(`  ↑  Uploading ${slot.file} → Cloudinary…`);
    const buffer = readFileSync(imagePath);

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'calm-cafe/gallery',
                public_id: slot.publicIdHint,
                overwrite: true,             // idempotent — safe to re-run
                format: 'webp',
                transformation: [
                    // Gallery images are large — allow up to 1920px wide, high quality
                    { width: 1920, crop: 'limit', quality: 'auto:best' },
                ],
                resource_type: 'image',
            },
            (err, result) => {
                if (err || !result) {
                    reject(err ?? new Error('Upload stream failed'));
                    return;
                }
                console.log(`  ✓  ${slot.file} → ${result.secure_url}`);
                resolve({ url: result.secure_url, publicId: result.public_id });
            },
        );
        stream.end(buffer);
    });
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('\n🖼  Gallery Migration — Uploading static images to Cloudinary\n');

    const settingsPath = join(ROOT, 'src', 'data', 'settings.json');
    if (!existsSync(settingsPath)) {
        console.error('❌  src/data/settings.json not found. Run the dev server once first.');
        process.exit(1);
    }

    const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));

    // Build array of 4 gallery image records
    const galleryImages = [];

    for (let i = 0; i < SLOTS.length; i++) {
        const slot = SLOTS[i];
        console.log(`\n[${i + 1}/4] Slot: "${slot.label}"`);

        // Check if this slot already has a Cloudinary URL — skip if already migrated
        const existing = settings.galleryImages?.[i];
        if (existing?.url?.includes('cloudinary.com')) {
            console.log(`  ⏭  Already on Cloudinary (${existing.url.slice(0, 60)}…), skipping.`);
            galleryImages.push(existing);
            continue;
        }

        try {
            const result = await uploadImage(slot);
            if (result) {
                galleryImages.push({
                    url: result.url,
                    publicId: result.publicId,
                    label: slot.label,
                    alt: slot.alt,
                });
            } else {
                // File missing — push empty so slot structure is preserved
                galleryImages.push({ url: '', publicId: '', label: slot.label, alt: slot.alt });
            }
        } catch (err) {
            console.error(`  ❌  Upload failed for ${slot.file}:`, err.message);
            galleryImages.push({ url: '', publicId: '', label: slot.label, alt: slot.alt });
        }
    }

    // Patch settings.json
    settings.galleryImages = galleryImages;
    writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');

    console.log('\n✅  settings.json updated with Cloudinary URLs.');
    console.log('    Refresh http://localhost:3000/admin/gallery to see the images.\n');
}

main().catch((err) => {
    console.error('\n❌  Migration failed:', err);
    process.exit(1);
});
