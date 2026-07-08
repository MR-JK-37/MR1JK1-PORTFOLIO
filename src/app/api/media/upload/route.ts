import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie || !verifySession(sessionCookie.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const ownerType = formData.get("ownerType") as string;
    const ownerId = formData.get("ownerId") as string;
    const isCover = formData.get("isCover") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type;
    const isVideo = mimeType.startsWith("video/");
    const isImage = mimeType.startsWith("image/");

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: "Only images and videos are supported" },
        { status: 400 }
      );
    }

    const resourceType = isVideo ? "video" : "image";
    const folder = `portfolio/${ownerType || "general"}`;

    let result;
    let provider = "cloudinary";

    if (!isCloudinaryConfigured()) {
      provider = "local";
      const uploadsDir = join(process.cwd(), "public", "uploads", "media");
      await mkdir(uploadsDir, { recursive: true });

      const sanitizedFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filepath = join(uploadsDir, sanitizedFilename);
      await writeFile(filepath, buffer);

      const localUrl = `/uploads/media/${sanitizedFilename}`;
      result = {
        type: resourceType as "image" | "video",
        originalUrl: localUrl,
        compressedUrl: localUrl,
        thumbnailUrl: localUrl,
        width: 0,
        height: 0,
        sizeBytes: buffer.length,
      };
    } else {
      // Direct Cloudinary Upload
      const cloudinaryResult = await uploadToCloudinary(
        buffer,
        folder,
        resourceType as "image" | "video",
        file.name
      );
      result = {
        type: cloudinaryResult.type,
        originalUrl: cloudinaryResult.originalUrl,
        compressedUrl: cloudinaryResult.compressedUrl,
        thumbnailUrl: cloudinaryResult.thumbnailUrl,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        sizeBytes: cloudinaryResult.sizeBytes,
      };
    }

    // Save to MediaAsset table
    const asset = await prisma.mediaAsset.create({
      data: {
        ownerType: ownerType || "general",
        ownerId: ownerId || "",
        type: result.type,
        originalUrl: result.originalUrl,
        compressedUrl: result.compressedUrl,
        thumbnailUrl: result.thumbnailUrl,
        isCover,
        width: result.width,
        height: result.height,
        sizeBytes: result.sizeBytes,
      },
    });

    return NextResponse.json({
      asset,
      originalSize: buffer.length,
      provider,
    });
  } catch (error: any) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
