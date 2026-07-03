import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Add noindex header to all admin routes */
  if (pathname.startsWith("/admin")) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");

    /* The /admin page itself handles auth state (login vs dashboard) */
    /* But /admin/... subpages need session protection */
    if (pathname !== "/admin" && !pathname.startsWith("/api/")) {
      const sessionCookie = request.cookies.get(COOKIE_NAME);
      if (!sessionCookie?.value) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
