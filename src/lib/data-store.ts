/**
 * Universal Data Store
 *
 * Transparently switches between:
 * - LOCAL (development):  reads/writes JSON files in src/data/ (fast, familiar)
 * - PRODUCTION (Vercel):  reads/writes JSON to Vercel Blob Storage
 *
 * This solves the EROFS read-only filesystem error on Vercel serverless functions.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Check if we're running on Vercel (production/preview environment)
const IS_VERCEL = !!process.env.BLOB_READ_WRITE_TOKEN;

// ─── Local File Helpers ───────────────────────────────────────────────

function localRead<T>(filePath: string, defaultValue: T): T {
    if (!existsSync(filePath)) {
        writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
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

// ─── Vercel Blob Helpers ──────────────────────────────────────────────

async function blobRead<T>(blobKey: string, defaultValue: T): Promise<T> {
    try {
        const { head } = await import('@vercel/blob');

        // head() gives us the authoritative blob metadata (not CDN-cached)
        let blobUrl: string;
        try {
            const metadata = await head(blobKey);
            blobUrl = metadata.url;
        } catch {
            // Blob doesn't exist yet (e.g. first run before any writes)
            return defaultValue;
        }

        // ⚠️ CRITICAL: Vercel Blob serves content via a CDN.
        // After overwriting a blob with allowOverwrite:true, the CDN may serve
        // the OLD cached content for seconds or even minutes.
        // Appending a unique timestamp to the URL forces the CDN to bypass
        // its cache and fetch from origin on every read.
        const cacheBust = `?t=${Date.now()}`;
        const res = await fetch(`${blobUrl}${cacheBust}`, {
            cache: 'no-store',
            headers: {
                // Some CDNs respect Pragma: no-cache as a secondary signal
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache, no-store',
            },
        });
        if (!res.ok) return defaultValue;

        const text = await res.text();
        return JSON.parse(text) as T;
    } catch {
        return defaultValue;
    }
}

async function blobWrite<T>(blobKey: string, data: T): Promise<void> {
    // Dynamically import to avoid loading in local dev
    const { put } = await import('@vercel/blob');
    const json = JSON.stringify(data, null, 2);
    await put(blobKey, json, {
        access: 'public',       // blob is accessed via URL (but the JSON is not secret)
        contentType: 'application/json',
        addRandomSuffix: false,  // keep a stable, deterministic key
        allowOverwrite: true,    // update existing blob on subsequent saves
    });
}

// ─── Public API ───────────────────────────────────────────────────────

/**
 * Read JSON data. Works on both local dev and Vercel.
 * @param localPath  Absolute path to the local .json file
 * @param blobKey    Pathname key in Vercel Blob (e.g. 'thinkery/menu.json')
 * @param defaultValue  Fallback if file/blob doesn't exist yet
 */
export async function readData<T>(
    localPath: string,
    blobKey: string,
    defaultValue: T,
): Promise<T> {
    if (IS_VERCEL) {
        return blobRead(blobKey, defaultValue);
    }
    return localRead(localPath, defaultValue);
}

/**
 * Write JSON data. Works on both local dev and Vercel.
 */
export async function writeData<T>(
    localPath: string,
    blobKey: string,
    data: T,
): Promise<void> {
    if (IS_VERCEL) {
        await blobWrite(blobKey, data);
    } else {
        localWrite(localPath, data);
    }
}

/**
 * Synchronous read — ONLY for local dev and server components that cannot use await at top level.
 * On Vercel, falls back to the in-bundle JSON (read-only, but good enough for public pages).
 */
export function readDataSync<T>(localPath: string, defaultValue: T): T {
    // On Vercel, we can still READ the bundled JSON (it was bundled at build time).
    // Writes go through writeData (async). This is safe for public read-only pages.
    return localRead(localPath, defaultValue);
}
