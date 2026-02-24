#!/usr/bin/env node
/**
 * scripts/seed-blob.mjs
 *
 * Seeds local src/data/*.json into Redis (primary) + Vercel Blob (backup).
 *
 * Usage:  node scripts/seed-blob.mjs
 *
 * Requires in .env.local:
 *   REDIS_URL=redis://default:xxx@host:port
 *   BLOB_READ_WRITE_TOKEN=...  (optional)
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
    const envPath = join(ROOT, '.env.local');
    if (!existsSync(envPath)) { console.error('❌  .env.local not found.'); process.exit(1); }
    for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
        const t = line.trim();
        if (!t || t.startsWith('#')) continue;
        const eq = t.indexOf('=');
        if (eq === -1) continue;
        const key = t.slice(0, eq).trim();
        const val = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) process.env[key] = val;
    }
}
loadEnv();

const FILES = [
    { localPath: join(ROOT, 'src', 'data', 'menu.json'), blobKey: 'thinkery/menu.json', kvKey: 'thinkery:menu', label: 'Menu  (categories + items)' },
    { localPath: join(ROOT, 'src', 'data', 'settings.json'), blobKey: 'thinkery/settings.json', kvKey: 'thinkery:settings', label: 'Settings (gallery, offerings, page images)' },
];

// ─── Seed Redis ───────────────────────────────────────────────────────────────
const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
    console.error('❌  REDIS_URL not found in .env.local');
    console.error('   Add:  REDIS_URL=redis://default:password@host:port');
    process.exit(1);
}

console.log('\n🚀  Thinkery → Data Store Seed\n');
console.log('📦  Seeding Redis (primary store)...\n');

const { default: Redis } = await import('ioredis');
const redis = new Redis(REDIS_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 });

let allOk = true;

for (const file of FILES) {
    if (!existsSync(file.localPath)) { console.warn(`⚠️   Skipping — not found: ${file.localPath}`); continue; }
    const raw = readFileSync(file.localPath, 'utf-8');
    try { JSON.parse(raw); } catch { console.error(`❌  Invalid JSON: ${file.localPath}`); allOk = false; continue; }

    process.stdout.write(`   ${file.label} → "${file.kvKey}" ... `);
    try {
        await redis.set(file.kvKey, raw);
        console.log('✅');
    } catch (err) {
        console.error(`❌  ${err.message}`);
        allOk = false;
    }
}

// ─── Also seed Blob as backup ─────────────────────────────────────────────────
if (process.env.BLOB_READ_WRITE_TOKEN) {
    console.log('\n📦  Seeding Vercel Blob (backup)...\n');
    const { put } = await import('@vercel/blob');
    for (const file of FILES) {
        if (!existsSync(file.localPath)) continue;
        process.stdout.write(`   ${file.label} → "${file.blobKey}" ... `);
        try {
            await put(file.blobKey, readFileSync(file.localPath, 'utf-8'), { access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true });
            console.log('✅');
        } catch (err) { console.warn(`⚠️   ${err.message}`); }
    }
}

await redis.quit();

console.log('\n' + (allOk ? '✅  Done! Production has the latest data.\n' : '⚠️   Some files failed. Check errors above.\n'));
console.log('💡  View your data: https://console.upstash.com (or your Redis provider dashboard)\n');
