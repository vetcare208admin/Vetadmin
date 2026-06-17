import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('session_token')?.value;
    const { pathname } = request.nextUrl;

    // Define protected route patterns
    const protectedPaths = [
        '/admin',
        '/vet',
        '/lab',
        '/finance',
        '/hr',
        '/dashboard',
        '/appointments',
        '/pets',
        '/invoices'
    ];

    // Check if the current path starts with any of the protected patterns
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    // Public routes that should always be accessible
    const isPublic = pathname === '/' || pathname === '/login' || pathname === '/register';

    if (isProtected && !token) {
        // Redirect to login if not authenticated
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Also prevent logged-in users from seeing login/register pages
    if (token && (pathname === '/login' || pathname === '/register')) {
        // Redirect them to their respective dashboards? 
        // For simplicity, just let them see the landing page or keep them where they are.
        // Let's redirect to root which handles routing to dashboard if logged in.
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
