import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/admin", "/checkout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get("humazd_auth")?.value;
  if (!token) {
    const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
    const loginUrl = new URL(isAdminRoute ? "/admin-login" : "/auth", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/checkout"],
};
