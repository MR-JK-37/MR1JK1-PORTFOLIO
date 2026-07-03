import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import {
  verifyPassword,
  signSession,
  COOKIE_NAME,
  getSessionCookieOptions,
} from "@/lib/auth";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetAttempts,
} from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    /* Rate limit check */
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed attempts. Try again in ${rateCheck.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return NextResponse.json(
        { error: "No admin account exists. Please set up first." },
        { status: 404 }
      );
    }

    /* Check DB-level lockout */
    if (admin.lockedUntil && new Date() < admin.lockedUntil) {
      const seconds = Math.ceil(
        (admin.lockedUntil.getTime() - Date.now()) / 1000
      );
      return NextResponse.json(
        { error: `Account locked. Try again in ${seconds} seconds.` },
        { status: 429 }
      );
    }

    const isValid = await verifyPassword(password, admin.passwordHash);

    if (!isValid) {
      recordFailedAttempt(ip);

      const newAttempts = admin.failedAttempts + 1;
      const updateData: { failedAttempts: number; lockedUntil?: Date | null } = {
        failedAttempts: newAttempts,
      };

      if (newAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await prisma.admin.update({
        where: { id: admin.id },
        data: updateData,
      });

      return NextResponse.json(
        { error: "Invalid password." },
        { status: 401 }
      );
    }

    /* Success — reset counters */
    resetAttempts(ip);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { failedAttempts: 0, lockedUntil: null },
    });

    const token = signSession(admin.id);
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, getSessionCookieOptions());

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
