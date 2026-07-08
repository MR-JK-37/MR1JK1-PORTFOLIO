import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const certs = await prisma.certification.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(certs);
  } catch (error: any) {
    const fs = require('fs');
    fs.appendFileSync('/home/mr1jk1/Documents/MR1JK1-PORTFOLIO/error.log', `\n--- ERROR ---\n` + (error.stack || error.message || String(error)));
    console.error("GET certifications error:", error);
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
        issuer: string;
        description: string;
        detailedContent: string;
        imageUrl: string;
        order: number;
      }>;
    };

    // Delete all existing and recreate (simple bulk save)
    await prisma.certification.deleteMany();

    const created = [];
    for (const item of items) {
      const cert = await prisma.certification.create({
        data: {
          title: item.title,
          issuer: item.issuer || "",
          description: item.description || "",
          detailedContent: item.detailedContent || "",
          imageUrl: item.imageUrl || "",
          order: item.order,
        },
      });
      created.push(cert);
    }

    return NextResponse.json(created);
  } catch (error) {
    console.error("Failed to save certifications:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
