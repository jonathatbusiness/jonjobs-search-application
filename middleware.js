import { NextResponse } from "next/server";

const protectedRoutes = ["/jobs", "/search", "/applications", "/settings"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const hasSession = Boolean(request.cookies.get("jonjobs_session")?.value);

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/jobs", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/jobs/:path*", "/search/:path*", "/applications/:path*", "/settings/:path*", "/login"],
};
