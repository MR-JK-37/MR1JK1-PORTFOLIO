import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signSession, COOKIE_NAME, getSessionCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    /* Only allow setup if no admin exists */
    const existingAdmin = await prisma.admin.findFirst();
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists. Use login instead." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const admin = await prisma.admin.create({
      data: { passwordHash },
    });

    const token = signSession(admin.id);
    const response = NextResponse.json({ success: true });
    const cookieOptions = getSessionCookieOptions();

    response.cookies.set(COOKIE_NAME, token, cookieOptions);

    return response;
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
