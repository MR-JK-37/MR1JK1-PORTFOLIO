import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const participations = await prisma.participation.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(participations);
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
    const { items } = body as {
      items: Array<{
        id?: string;
        title: string;
        description: string;
        detailedContent: string;
        imageUrl: string;
        certificateUrl: string;
        order: number;
      }>;
    };

    await prisma.participation.deleteMany();

    const created = [];
    for (const item of items) {
      const p = await prisma.participation.create({
        data: {
          title: item.title,
          description: item.description || "",
          detailedContent: item.detailedContent || "",
          imageUrl: item.imageUrl || "",
          certificateUrl: item.certificateUrl || "",
          order: item.order,
        },
      });
      created.push(p);
    }

    return NextResponse.json(created);
  } catch (error) {
    console.error("Failed to save participation:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
