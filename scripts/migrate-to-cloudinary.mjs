/**
 * ─────────────────────────────────────────────────────────────────
 *  Cloudinary Migration Script
 *  Migrates all local /public/images/menu images to Cloudinary CDN
 *  and updates src/data/menu.json with the new URLs + publicIds.
 *
 *  Usage (run once from project root):
 *    node scripts/migrate-to-cloudinary.mjs
 * ─────────────────────────────────────────────────────────────────
 */

import { v2 as cloudinary } from 'cloudinary';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ─── Setup paths ───
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const IMAGES_DIR = join(ROOT, 'public', 'images', 'menu');
const MENU_JSON = join(ROOT, 'src', 'data', 'menu.json');

// ─── Load env vars from .env.local ───
const envFile = join(ROOT, '.env.local');
if (!existsSync(envFile)) {
    console.error('❌  .env.local not found at', envFile);
    process.exit(1);
}
const envLines = readFileSync(envFile, 'utf-8').split('\n');
for (const line of envLines) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim();
    }
}

// ─── Configure Cloudinary ───
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// ─── Helper: upload one file ───
async function uploadFile(filePath, fileName) {
    return new Promise((resolve, reject) => {
        const publicId = `calm-cafe/menu/${fileName.replace(/\.[^.]+$/, '')}`; // strip extension

        cloudinary.uploader.upload(
            filePath,
            {
                public_id: publicId,
                overwrite: true,             // safe to re-run
                format: 'webp',              // convert everything to WebP
                transformation: [
                    { width: 800, height: 800, crop: 'limit', quality: 'auto:good' },
                ],
                resource_type: 'image',
            },
            (error, result) => {
                if (error || !result) {
                    reject(error ?? new Error('Upload failed for ' + fileName));
                    return;
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            },
        );
    });
}

// ─── Main ───
async function migrate() {
    console.log('\n🚀  Starting Cloudinary migration...\n');

    // 1. Read all image files
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    const imageFiles = readdirSync(IMAGES_DIR).filter(f =>
        allowedExts.includes(extname(f).toLowerCase()),
    );
    console.log(`📁  Found ${imageFiles.length} images in /public/images/menu\n`);

    // 2. Upload each image and build a mapping:  localPath → { url, publicId }
    //    e.g. "/images/menu/espresso.jpg" → { url: "https://res.cloudinary.com/...", publicId: "calm-cafe/menu/espresso" }
    const mapping = {}; // key = the local path as stored in menu.json

    for (const fileName of imageFiles) {
        const localKey = `/images/menu/${fileName}`;
        const filePath = join(IMAGES_DIR, fileName);

        process.stdout.write(`  ⬆️   Uploading ${fileName}...`);
        try {
            const result = await uploadFile(filePath, fileName);
            mapping[localKey] = result;
            console.log(` ✅  ${result.url}`);
        } catch (err) {
            console.log(` ❌  FAILED: ${err.message}`);
        }
    }

    console.log('\n📝  Updating menu.json...\n');

    // 3. Patch menu.json
    const menuData = JSON.parse(readFileSync(MENU_JSON, 'utf-8'));
    let updatedCount = 0;

    for (const item of menuData.items) {
        if (item.image && mapping[item.image]) {
            const { url, publicId } = mapping[item.image];
            item.image = url;
            item.imagePublicId = publicId;
            updatedCount++;
            console.log(`  ✔  ${item.name}  →  ${url}`);
        } else if (item.image) {
            console.log(`  ⚠️   ${item.name}  —  no matching upload for "${item.image}" (skipped)`);
        }
    }

    writeFileSync(MENU_JSON, JSON.stringify(menuData, null, 2), 'utf-8');

    console.log(`\n✅  Done! Updated ${updatedCount} menu items in menu.json.`);
    console.log('📌  Images still exist in /public/images/menu — you can delete them after verifying everything works.\n');
}

migrate().catch((err) => {
    console.error('\n💥  Migration failed:', err);
    process.exit(1);
});
