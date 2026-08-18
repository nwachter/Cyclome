import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// verifie le cookie de session.
// controle du role => dans layouts avec requireRole().
const privatePaths = ["/mon-espace", "/technicien", "/admin", "/reservation/confirmation"];
const guestOnlyPaths = ["/connexion", "/inscription"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = getSessionCookie(request, { cookiePrefix: "cyclome" });

  const needsAuth = privatePaths.some((privatePath) => path.startsWith(privatePath));
  if (needsAuth && !sessionCookie) {
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  const isGuestOnly = guestOnlyPaths.some((guestPath) => path.startsWith(guestPath));
  if (isGuestOnly && sessionCookie) {
    return NextResponse.redirect(new URL("/mon-espace", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/mon-espace/:path*",
    "/technicien/:path*",
    "/admin/:path*",
    "/reservation/confirmation/:path*",
    "/connexion",
    "/inscription",
  ],
};
