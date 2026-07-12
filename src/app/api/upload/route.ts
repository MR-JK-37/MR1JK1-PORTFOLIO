import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie || !verifySession(sessionCookie.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const targetName = formData.get("targetName") as string | null; // e.g. "hero-day", "hero-night", or empty

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folder = "portfolio/hero";
    const resourceType = file.type.startsWith("video/") ? "video" : "image";

    // Upload straight to Cloudinary from memory
    const cloudinaryResult = await uploadToCloudinary(
      buffer,
      folder,
      resourceType,
      file.name
    );

    // Return the secure URL as path
    return NextResponse.json({ path: cloudinaryResult.originalUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

