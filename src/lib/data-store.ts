/**
 * Universal Data Store
 *
 * Storage tier priority:
 *
 *  LOCAL DEV    → src/data/*.json  (fast, no auth required)
 *  VERCEL + KV  → Upstash Redis    (immediately consistent, no CDN)
 *  VERCEL + Blob only → Vercel Blob (legacy fallback, CDN-cached — not recommended for writes)
 *
 * Why Redis over Blob for mutable data:
 *   Vercel Blob uses a CDN. After overwriting a blob, the CDN may serve stale
 *   content for 10–60+ seconds regardless of cache-busting headers.
 *   Upstash Redis (KV) has NO CDN layer — reads always return the latest write.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// ─── Environment detection ────────────────────────────────────────────────────

const IS_VERCEL = !!(process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN || process.env.UPSTASH_REDIS_REST_URL);
const HAS_KV = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

// ─── Local File Helpers ───────────────────────────────────────────────────────

function localRead<T>(filePath: string, defaultValue: T): T {
    if (!existsSync(filePath)) {
        try { writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8'); } catch { /* readonly env */ }
        return defaultValue;
    }
    try {
        const raw = readFileSync(filePath, 'utf-8');
        return JSON.parse(raw) as T;
    } catch {
        return defaultValue;
    }
}

function localWrite<T>(filePath: string, data: T): void {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Upstash Redis (KV) Helpers ───────────────────────────────────────────────
// Immediately consistent — no CDN, reads always see the latest write.

async function kvRead<T>(kvKey: string, defaultValue: T): Promise<T> {
    try {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        });
        const data = await redis.get<T>(kvKey);
        return data ?? defaultValue;
    } catch (err) {
        console.error('[data-store] KV read error:', err);
        return defaultValue;
    }
}

async function kvWrite<T>(kvKey: string, data: T): Promise<void> {
    try {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        });
        // Store with no expiry — data persists until explicitly updated
        await redis.set(kvKey, data);
    } catch (err) {
        console.error('[data-store] KV write error:', err);
        throw err;
    }
}

// ─── Vercel Blob Helpers (write-backup only) ──────────────────────────────────
// Used as a secondary backup store. NOT used for reads (CDN caching makes reads unreliable).

async function blobWrite<T>(blobKey: string, data: T): Promise<void> {
    try {
        const { put } = await import('@vercel/blob');
        const json = JSON.stringify(data, null, 2);
        await put(blobKey, json, {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false,
            allowOverwrite: true,
        });
    } catch (err) {
        // Blob write failure is non-fatal if KV succeeds
        console.warn('[data-store] Blob backup write failed:', err);
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Read JSON data — always returns immediately consistent data.
 */
export async function readData<T>(
    localPath: string,
    blobKey: string,
    defaultValue: T,
): Promise<T> {
    if (!IS_VERCEL) {
        return localRead(localPath, defaultValue);
    }
    if (HAS_KV) {
        // Primary: Redis — immediately consistent
        const kvKey = blobKey.replace(/\//g, ':').replace('.json', '');
        return kvRead(kvKey, defaultValue);
    }
    // Fallback: should not be reached in normal operation
    return defaultValue;
}

/**
 * Write JSON data — writes to Redis (primary) + Blob (backup).
 */
export async function writeData<T>(
    localPath: string,
    blobKey: string,
    data: T,
): Promise<void> {
    if (!IS_VERCEL) {
        localWrite(localPath, data);
        return;
    }
    if (HAS_KV) {
        const kvKey = blobKey.replace(/\//g, ':').replace('.json', '');
        // Write to Redis (primary — immediately consistent)
        await kvWrite(kvKey, data);
        // Also write to Blob as a backup (async, non-blocking)
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            blobWrite(blobKey, data).catch(() => { /* non-fatal */ });
        }
        return;
    }
    throw new Error('No storage backend configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your environment.');
}

/**
 * Synchronous read — for server components (RSC) that cannot await.
 * On Vercel, reads the bundled JSON (build-time snapshot) — suitable for public pages.
 * For admin pages, use readData() instead.
 */
export function readDataSync<T>(localPath: string, defaultValue: T): T {
    return localRead(localPath, defaultValue);
}
