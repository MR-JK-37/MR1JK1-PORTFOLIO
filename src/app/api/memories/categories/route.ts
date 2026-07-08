import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const categories = await prisma.memoryCategory.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(categories);
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
      const cat = await prisma.memoryCategory.create({
        data: {
          label: data.label,
          slug: data.slug || data.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
          order: data.order || 0,
        },
      });
      return NextResponse.json(cat);
    }

    if (action === "update") {
      const cat = await prisma.memoryCategory.update({
        where: { id: data.id },
        data: {
          label: data.label,
          slug: data.slug,
          order: data.order,
        },
      });
      return NextResponse.json(cat);
    }

    if (action === "delete") {
      await prisma.memoryCategory.delete({ where: { id: data.id } });
      return NextResponse.json({ success: true });
    }

    if (action === "reorder") {
      for (const item of data.items as Array<{ id: string; order: number }>) {
        await prisma.memoryCategory.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Memory categories error:", error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}
