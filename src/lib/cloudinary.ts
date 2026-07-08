import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface UploadResult {
  publicId: string;
  originalUrl: string;
  compressedUrl: string;
  thumbnailUrl: string;
  type: "image" | "video";
  width: number;
  height: number;
  sizeBytes: number;
}

/**
 * Upload a file to Cloudinary.
 *
 * @param fileBuffer - Buffer of the file to upload
 * @param folder - Cloudinary folder path (e.g., "portfolio/certifications")
 * @param resourceType - "image" or "video"
 * @param filename - Original filename for reference
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string,
  resourceType: "image" | "video",
  filename: string
): Promise<UploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary credentials not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env"
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error || !result) {
          return reject(
            new Error(
              `Cloudinary upload failed: ${error?.message || "Unknown error"}`
            )
          );
        }

        const originalUrl = result.secure_url;

        const compressedUrl = cloudinary.url(result.public_id, {
          resource_type: resourceType,
          quality: "auto",
          fetch_format: "auto",
          secure: true,
        });

        const thumbnailUrl = cloudinary.url(result.public_id, {
          resource_type: resourceType,
          width: 400,
          height: 300,
          crop: "fill",
          quality: "auto",
          fetch_format: "auto",
          secure: true,
        });

        resolve({
          publicId: result.public_id,
          originalUrl,
          compressedUrl,
          thumbnailUrl,
          type: resourceType,
          width: result.width,
          height: result.height,
          sizeBytes: result.bytes,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete a file from Cloudinary by public_id.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video"
): Promise<void> {
  if (!isCloudinaryConfigured()) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

/**
 * Check if Cloudinary is configured.
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}
