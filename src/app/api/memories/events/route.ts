import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const events = await prisma.memoryEvent.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { order: "asc" },
    });

    // Fetch media assets for each event
    const eventsWithMedia = await Promise.all(
      events.map(async (event) => {
        const media = await prisma.mediaAsset.findMany({
          where: { ownerType: "memoryEvent", ownerId: event.id },
          orderBy: { order: "asc" },
        });
        return { ...event, media };
      })
    );

    return NextResponse.json(eventsWithMedia);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie || !verifySession(sessionCookie.value)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...data } = body;

    if (action === "create") {
      const event = await prisma.memoryEvent.create({
        data: {
          categoryId: data.categoryId,
          title: data.title,
          shortDescription: data.shortDescription || "",
          detailedContent: data.detailedContent || "",
          order: data.order || 0,
        },
      });
      return NextResponse.json(event);
    }

    if (action === "update") {
      const event = await prisma.memoryEvent.update({
        where: { id: data.id },
        data: {
          title: data.title,
          shortDescription: data.shortDescription,
          detailedContent: data.detailedContent,
          order: data.order,
        },
      });
      return NextResponse.json(event);
    }

    if (action === "delete") {
      // Delete associated media assets first
      await prisma.mediaAsset.deleteMany({
        where: { ownerType: "memoryEvent", ownerId: data.id },
      });
      await prisma.memoryEvent.delete({ where: { id: data.id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Memory events error:", error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}
