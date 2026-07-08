import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { listThemes, activateTheme } from "@/lib/theme";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const themes = await listThemes();
    const settings = await prisma.appSettings.findUnique({
      where: { id: "singleton" },
    });

    return NextResponse.json({
      themes,
      activeThemeId: settings?.activeThemeId || "",
    });
  } catch (error) {
    console.error("Failed to fetch themes:", error);
    return NextResponse.json(
      { error: "Failed to fetch themes" },
      { status: 500 }
    );
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
    const { themeId } = body;

    if (!themeId) {
      return NextResponse.json(
        { error: "themeId is required" },
        { status: 400 }
      );
    }

    const theme = await activateTheme(themeId);

    return NextResponse.json({
      success: true,
      activeTheme: theme,
    });
  } catch (error) {
    console.error("Failed to activate theme:", error);
    return NextResponse.json(
      { error: "Failed to activate theme" },
      { status: 500 }
    );
  }
}
