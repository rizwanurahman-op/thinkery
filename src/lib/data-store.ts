/**
 * Universal Data Store
 *
 * Storage tier priority:
 *
 *  LOCAL DEV    → src/data/*.json  (fast, no auth required)
 *  VERCEL + KV  → Redis via REDIS_URL (immediately consistent, no CDN)
 *  Fallback     → Vercel Blob (CDN-backed — not recommended for writes)
 *
 * Why Redis over Blob for mutable data:
 *   Vercel Blob uses a CDN. After overwriting a blob, the CDN may serve stale
 *   content for 10–60+ seconds. Redis is immediately consistent on every read.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

// ─── Environment detection ────────────────────────────────────────────────────

const IS_VERCEL = !!(process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN || process.env.REDIS_URL);
const HAS_REDIS = !!process.env.REDIS_URL;

// ─── Redis singleton (reuse connection across requests in same process) ───────

let redisClient: import('ioredis').default | null = null;

async function getRedis() {
    if (redisClient && redisClient.status === 'ready') return redisClient;

    const { default: Redis } = await import('ioredis');

    redisClient = new Redis(process.env.REDIS_URL!, {
        // Serverless-safe: reconnect automatically but don't hang indefinitely
        maxRetriesPerRequest: 3,
        connectTimeout: 5000,
        lazyConnect: false,
        // Keep connection alive within the same serverless invocation
        enableReadyCheck: true,
        // Required for TLS Redis Cloud connections
        tls: process.env.REDIS_URL!.startsWith('rediss://') ? {} : undefined,
    });

    redisClient.on('error', (err) => {
        console.error('[data-store] Redis error:', err.message);
    });

    return redisClient;
}

// ─── Redis Helpers ────────────────────────────────────────────────────────────

async function kvRead<T>(kvKey: string, defaultValue: T): Promise<T> {
    try {
        const redis = await getRedis();
        const raw = await redis.get(kvKey);
        if (!raw) return defaultValue;
        return JSON.parse(raw) as T;
    } catch (err) {
        console.error('[data-store] Redis GET error:', err);
        return defaultValue;
    }
}

async function kvWrite<T>(kvKey: string, data: T): Promise<void> {
    try {
        const redis = await getRedis();
        await redis.set(kvKey, JSON.stringify(data));
    } catch (err) {
        console.error('[data-store] Redis SET error:', err);
        throw err;
    }
}

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

// ─── Blob backup write (non-blocking) ────────────────────────────────────────

async function blobWrite<T>(blobKey: string, data: T): Promise<void> {
    try {
        const { put } = await import('@vercel/blob');
        await put(blobKey, JSON.stringify(data, null, 2), {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false,
            allowOverwrite: true,
        });
    } catch {
        // Non-fatal — Redis is source of truth
    }
}

// ─── Redis key convention: thinkery/menu.json → thinkery:menu ────────────────

function toKvKey(blobKey: string): string {
    return blobKey.replace(/\//g, ':').replace('.json', '');
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Read JSON data. On Vercel, reads from Redis (immediately consistent).
 */
export async function readData<T>(
    localPath: string,
    blobKey: string,
    defaultValue: T,
): Promise<T> {
    if (!IS_VERCEL) {
        return localRead(localPath, defaultValue);
    }
    if (HAS_REDIS) {
        return kvRead(toKvKey(blobKey), defaultValue);
    }
    return defaultValue;
}

/**
 * Write JSON data. On Vercel, writes to Redis and Blob (backup).
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
    if (HAS_REDIS) {
        // Primary: Redis (immediately consistent)
        await kvWrite(toKvKey(blobKey), data);
        // Backup: Blob (non-blocking, best-effort)
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            blobWrite(blobKey, data).catch(() => { /* non-fatal */ });
        }
        return;
    }
    throw new Error('REDIS_URL is not set. Add it to your .env.local and Vercel environment variables.');
}

/**
 * Synchronous read — for server components (RSC).
 * Reads the bundled JSON (build-time snapshot). For admin, use readData() instead.
 */
export function readDataSync<T>(localPath: string, defaultValue: T): T {
    return localRead(localPath, defaultValue);
}
