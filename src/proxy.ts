import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic gate for private pages: it only checks that a session cookie exists so
 * signed-out visitors are sent to /login. Real authorization happens in the API.
 */
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  const { pathname, search } = request.nextUrl;
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/add-studio",
    "/my-listings",
    "/my-bookings",
    "/saved",
    "/studios/edit/:path*",
  ],
};
