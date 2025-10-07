import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWTExtended } from "./types/Auth";
import { getToken } from "next-auth/jwt";
import environment from "./config/environment";

export async function middleware(request: NextRequest) {
  const token: JWTExtended | null = await getToken({
    req: request,
    secret: environment.AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  if (pathname === "/auth/signin" || pathname === "/auth/signup") {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!token) {
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    if (token?.user?.data?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (pathname.startsWith("/teacher")) {
    if (!token) {
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    if (token?.user?.data?.role !== "teacher") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname === "teacher") {
    return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
  }

  if (pathname.startsWith("/student")) {
    if (!token) {
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    if (token?.user?.data?.role !== "student") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname === "student") {
    return NextResponse.redirect(new URL("/student/dashboard", request.url));
  }

  // Protect any /user/* routes (profile, settings, etc.)
  if (pathname.startsWith("/user")) {
    if (!token) {
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    if (token?.user?.data?.role !== "user") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/user/:path*",
  ],
};
