#!/usr/bin/env node
/**
 * scripts/seed-blob.mjs
 *
 * Seeds local src/data/*.json files to Upstash Redis (primary) + Vercel Blob (backup).
 *
 * Usage:
 *   node scripts/seed-blob.mjs
 *
 * Requirements (add to .env.local):
 *   UPSTASH_REDIS_REST_URL=...
 *   UPSTASH_REDIS_REST_TOKEN=...
 *   BLOB_READ_WRITE_TOKEN=...  (optional backup)
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Load .env.local manually ─────────────────────────────────────────────────

function loadEnv() {
    const envPath = join(ROOT, '.env.local');
    if (!existsSync(envPath)) {
        console.error('❌  .env.local not found.');
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

// ─── Files to seed ─────────────────────────────────────────────────────────

const FILES = [
    {
        localPath: join(ROOT, 'src', 'data', 'menu.json'),
        blobKey: 'thinkery/menu.json',
        kvKey: 'thinkery:menu',
        label: 'Menu  (categories + items)',
    },
    {
        localPath: join(ROOT, 'src', 'data', 'settings.json'),
        blobKey: 'thinkery/settings.json',
        kvKey: 'thinkery:settings',
        label: 'Settings (gallery, offerings, page images)',
    },
];

// ─── Seed Upstash Redis ────────────────────────────────────────────────────────

const KV_URL = process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

console.log('\n🚀  Thinkery → Data Store Seed\n');

if (!KV_URL || !KV_TOKEN) {
    console.error('❌  UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required.');
    console.error('\n📋  Setup Steps:');
    console.error('   1. Go to https://vercel.com/dashboard → your project → Storage');
    console.error('   2. Click "Create Database" → choose "Redis" (powered by Upstash)');
    console.error('   3. Click the ".env.local" tab in the KV store panel');
    console.error('   4. Copy UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN into your .env.local\n');
    process.exit(1);
}

const { Redis } = await import('@upstash/redis');
const redis = new Redis({ url: KV_URL, token: KV_TOKEN });

console.log('📦  Seeding Upstash Redis (primary store)...\n');

let allOk = true;

for (const file of FILES) {
    if (!existsSync(file.localPath)) {
        console.warn(`⚠️   Skipping — file not found: ${file.localPath}`);
        continue;
    }

    const json = readFileSync(file.localPath, 'utf-8');

    let parsed;
    try {
        parsed = JSON.parse(json);
    } catch {
        console.error(`❌  Invalid JSON in ${file.localPath} — skipping.`);
        allOk = false;
        continue;
    }

    process.stdout.write(`   ${file.label} → Redis key "${file.kvKey}" ... `);
    try {
        await redis.set(file.kvKey, parsed);
        console.log('✅  Done');
    } catch (err) {
        console.error(`❌  Failed: ${err.message}`);
        allOk = false;
    }
}

// ─── Also seed Vercel Blob as backup ──────────────────────────────────────────

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (BLOB_TOKEN) {
    console.log('\n📦  Seeding Vercel Blob (backup)...\n');
    const { put } = await import('@vercel/blob');
    for (const file of FILES) {
        if (!existsSync(file.localPath)) continue;
        const json = readFileSync(file.localPath, 'utf-8');
        process.stdout.write(`   ${file.label} → Blob "${file.blobKey}" ... `);
        try {
            const result = await put(file.blobKey, json, {
                access: 'public',
                contentType: 'application/json',
                addRandomSuffix: false,
                allowOverwrite: true,
            });
            console.log(`✅  ${result.url}`);
        } catch (err) {
            console.warn(`⚠️   Blob backup failed (non-fatal): ${err.message}`);
        }
    }
}

console.log('\n' + (allOk
    ? '✅  All files seeded! Production site now has the latest data.\n'
    : '⚠️   Some files failed. Check errors above.\n'
));

console.log('💡  To view your data:');
console.log('   Redis: https://console.upstash.com → your database → Data Browser');
console.log('   Keys:  thinkery:menu   and   thinkery:settings\n');
