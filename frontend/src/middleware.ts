import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const accessMap: Record<string, string[]> = {
  "/dashboard/admin": ["admin"],
  "/dashboard/teacher": ["teacher"],
  "/dashboard/student": ["student"],
  "/dashboard/user": ["user"],
};

export default withAuth(
  function middleware(req) {
    const token = (req as any).nextauth?.token as any;
    const role = token?.user?.role?.toString().toLowerCase() ?? "user";
    const { pathname } = req.nextUrl;

    for (const base in accessMap) {
      if (pathname.startsWith(base)) {
        const allowed = accessMap[base];
        if (!allowed.includes(role)) {
          const url = req.nextUrl.clone();
          url.pathname = "/dashboard";
          return NextResponse.redirect(url);
        }
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
