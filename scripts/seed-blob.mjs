#!/usr/bin/env node
/**
 * scripts/seed-blob.mjs
 *
 * Uploads your local src/data/menu.json and src/data/settings.json
 * to Vercel Blob Storage so production has the correct initial data.
 *
 * Usage:
 *   node scripts/seed-blob.mjs
 *
 * Requirements:
 *   - BLOB_READ_WRITE_TOKEN must be in your .env.local
 *     (copy it from Vercel Dashboard → Storage → your Blob store → .env.local)
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Load .env.local manually (no third-party dotenv needed) ─────────────────

function loadEnv() {
    const envPath = join(ROOT, '.env.local');
    if (!existsSync(envPath)) {
        console.error('❌  .env.local not found. Please create it with BLOB_READ_WRITE_TOKEN.');
        process.exit(1);
    }
    const lines = readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) process.env[key] = value;
    }
}

loadEnv();

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!TOKEN) {
    console.error('❌  BLOB_READ_WRITE_TOKEN not found in .env.local');
    console.error('   → Go to Vercel Dashboard → Storage → your Blob store → .env.local tab');
    console.error('   → Copy BLOB_READ_WRITE_TOKEN and paste it into your .env.local');
    process.exit(1);
}

// ─── Import Vercel Blob ───────────────────────────────────────────────────────

const { put } = await import('@vercel/blob');

// ─── Files to seed ───────────────────────────────────────────────────────────

const FILES = [
    {
        localPath: join(ROOT, 'src', 'data', 'menu.json'),
        blobKey: 'thinkery/menu.json',
        label: 'Menu  (categories + items)',
    },
    {
        localPath: join(ROOT, 'src', 'data', 'settings.json'),
        blobKey: 'thinkery/settings.json',
        label: 'Settings (gallery, offerings, page images)',
    },
];

// ─── Upload ───────────────────────────────────────────────────────────────────

console.log('\n🚀  Thinkery → Vercel Blob Seed\n');

let allOk = true;

for (const file of FILES) {
    if (!existsSync(file.localPath)) {
        console.warn(`⚠️   Skipping — file not found: ${file.localPath}`);
        continue;
    }

    const json = readFileSync(file.localPath, 'utf-8');

    // Validate JSON before uploading
    try {
        JSON.parse(json);
    } catch {
        console.error(`❌  Invalid JSON in ${file.localPath} — skipping.`);
        allOk = false;
        continue;
    }

    process.stdout.write(`   Uploading ${file.label} ... `);

    try {
        const result = await put(file.blobKey, json, {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false,
            allowOverwrite: true,
        });

        console.log(`✅  ${result.url}`);
    } catch (err) {
        console.error(`❌  Failed: ${err.message}`);
        allOk = false;
    }
}

console.log('\n' + (allOk
    ? '✅  All files seeded successfully! Your Vercel production site now has the latest data.\n   → Redeploy on Vercel is NOT required — Blob reads are always live.\n'
    : '⚠️   Some files failed to upload. Check the errors above.\n'
));

// ─── Show how to view in Vercel Dashboard ────────────────────────────────────

console.log('💡  To VIEW your blob files in the Vercel Dashboard:');
console.log('   1. Go to https://vercel.com/dashboard');
console.log('   2. Click your project → Storage tab');
console.log('   3. Click your Blob store');
console.log('   4. You will see thinkery/menu.json and thinkery/settings.json');
console.log('   5. Click any file to preview its content\n');
