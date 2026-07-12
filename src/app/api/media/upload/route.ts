import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    console.log("[SERVER-SIDE ENV CHECK] Cloudinary variables presence:", {
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
    });

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

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: "Cloudinary credentials not configured. Serverless environments require Cloudinary uploads." },
        { status: 500 }
      );
    }

    // Direct Cloudinary Upload
    const cloudinaryResult = await uploadToCloudinary(
      buffer,
      folder,
      resourceType as "image" | "video",
      file.name
    );

    const result = {
      type: cloudinaryResult.type,
      originalUrl: cloudinaryResult.originalUrl,
      compressedUrl: cloudinaryResult.compressedUrl,
      thumbnailUrl: cloudinaryResult.thumbnailUrl,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      sizeBytes: cloudinaryResult.sizeBytes,
    };

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
      provider: "cloudinary",
    });
  } catch (error: any) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

