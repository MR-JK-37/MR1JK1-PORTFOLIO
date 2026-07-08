import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(asset);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie || !verifySession(sessionCookie.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete from storage provider
    if (asset.originalUrl.includes("res.cloudinary.com")) {
      const { deleteFromCloudinary } = await import("@/lib/cloudinary");
      // Extract public ID from the URL or store it. Since we don't store public ID in the schema,
      // let's try to extract it from the URL or if we can extract it properly.
      // Cloudinary URL format: https://res.cloudinary.com/<cloud_name>/<resource_type>/upload/v<version>/<public_id>.<ext>
      const urlParts = asset.originalUrl.split("/upload/");
      if (urlParts.length > 1) {
        const pathAfterUpload = urlParts[1];
        // Remove version (e.g. v1234567/) if present
        const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
        // Remove file extension (e.g. .jpg)
        const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf("."));
        if (publicId) {
          await deleteFromCloudinary(publicId, asset.type as "image" | "video");
        }
      }
    } else if (asset.originalUrl.startsWith("/uploads/")) {
      const { unlink } = await import("fs/promises");
      const { join } = await import("path");
      try {
        const localPath = join(process.cwd(), "public", asset.originalUrl);
        await unlink(localPath);
      } catch (err) {
        console.error("Failed to delete local file:", err);
      }
    }

    await prisma.mediaAsset.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete media error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
