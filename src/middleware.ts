import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    const isAuthRoute = pathname === '/login' || pathname === '/signup' || pathname === '/onboard';
    const isDashboardRoute = pathname.startsWith('/dashboard');

    // If logged in and trying to access auth pages, redirect to dashboard
    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If not logged in and trying to access dashboard, redirect to login
    if (!token && isDashboardRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Otherwise, allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup', '/onboard'],
};
