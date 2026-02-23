/**
 * Cloudinary server-side helper
 * ⚠️  Server-only — never import this in client components or pages
 */
import { v2 as cloudinary } from 'cloudinary';

// Initialise once (module-level singleton)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Always use HTTPS URLs
});

export interface CloudinaryUploadResult {
    url: string;        // Final CDN URL (HTTPS)
    publicId: string;   // Cloudinary public ID — store this to delete later
}

/**
 * Upload a raw buffer to Cloudinary.
 * Returns the secure CDN URL and the public ID (needed for deletion).
 */
export async function uploadToCloudinary(
    buffer: Buffer,
    folder = 'calm-cafe/menu',
): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                // Auto-convert to WebP/AVIF for best performance
                format: 'webp',
                // Auto-crop to square — good for menu item thumbnails
                transformation: [
                    { width: 800, height: 800, crop: 'limit', quality: 'auto:good' },
                ],
                resource_type: 'image',
            },
            (error, result) => {
                if (error || !result) {
                    reject(error ?? new Error('Cloudinary upload failed'));
                    return;
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            },
        );

        uploadStream.end(buffer);
    });
}

/**
 * Delete an image from Cloudinary by its public ID.
 * Safe to call even if publicId is undefined/empty — just a no-op in that case.
 */
export async function deleteFromCloudinary(publicId?: string): Promise<void> {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        // Log but don't throw — deletion failure shouldn't block the main action
        console.error(`[Cloudinary] Failed to delete image "${publicId}":`, err);
    }
}
