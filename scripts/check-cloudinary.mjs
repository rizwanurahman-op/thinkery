/**
 * Verify all local /public/images/menu images exist on Cloudinary.
 * Usage: node scripts/check-cloudinary.mjs
 */

import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// ─── Load .env.local ───
const envFile = join(ROOT, '.env.local');
const envLines = readFileSync(envFile, 'utf-8').split('\n');
for (const line of envLines) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const IMAGES_DIR = join(ROOT, 'public', 'images', 'menu');
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

async function check() {
    console.log('\n🔍  Checking Cloudinary vs Local images...\n');

    // 1. Local files
    const localFiles = readdirSync(IMAGES_DIR)
        .filter(f => ALLOWED_EXT.includes(extname(f).toLowerCase()));

    console.log(`📁  Local files in /public/images/menu: ${localFiles.length}`);
    localFiles.forEach(f => console.log(`     • ${f}`));

    // 2. Cloudinary assets in calm-cafe/menu
    console.log('\n☁️   Fetching Cloudinary assets in calm-cafe/menu ...\n');
    let cloudinaryFiles = [];
    try {
        let nextCursor = null;
        do {
            const result = await cloudinary.api.resources({
                type: 'upload',
                prefix: 'calm-cafe/menu/',
                max_results: 500,
                ...(nextCursor ? { next_cursor: nextCursor } : {}),
            });
            cloudinaryFiles.push(...result.resources.map(r => r.public_id));
            nextCursor = result.next_cursor;
        } while (nextCursor);
    } catch (err) {
        console.error('❌  Failed to fetch Cloudinary resources:', err.message);
        process.exit(1);
    }

    console.log(`☁️   Cloudinary assets found: ${cloudinaryFiles.length}`);
    cloudinaryFiles.forEach(f => console.log(`     • ${f}`));

    // 3. Cross-check: which local files are MISSING from Cloudinary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const missing = [];
    for (const localFile of localFiles) {
        // Strip extension for comparison (Cloudinary stores without extension)
        const nameWithoutExt = localFile.replace(/\.[^.]+$/, '');
        const expectedPublicId = `calm-cafe/menu/${nameWithoutExt}`;
        const found = cloudinaryFiles.some(cid => cid === expectedPublicId);
        if (!found) {
            missing.push(localFile);
            console.log(`❌  MISSING on Cloudinary: ${localFile}  (expected public_id: ${expectedPublicId})`);
        } else {
            console.log(`✅  OK: ${localFile}`);
        }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (missing.length === 0) {
        console.log(`\n🎉  All ${localFiles.length} local images are on Cloudinary! Nothing to migrate.\n`);
    } else {
        console.log(`\n⚠️   ${missing.length} image(s) are NOT on Cloudinary:\n`);
        missing.forEach(f => console.log(`     • ${f}`));
        console.log('\n▶️   Run this to upload the missing ones:');
        console.log('     node scripts/migrate-to-cloudinary.mjs\n');
    }
}

check().catch(err => { console.error('💥', err); process.exit(1); });
