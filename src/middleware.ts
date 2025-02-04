import { auth } from "@/lib/next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const isAdminPanel = nextUrl.pathname.startsWith('/admin');

  if (isAdminPanel) {
    const session = await auth();
    
    // Allow access to admin login page
    if (nextUrl.pathname === '/admin/login') {
      if (session?.user?.isAdmin) {
        return NextResponse.redirect(new URL('/admin', nextUrl));
      }
      return NextResponse.next();
    }

    // Protect all other admin routes
    if (!session?.user?.isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
};
