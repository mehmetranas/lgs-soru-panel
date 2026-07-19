import { NextResponse } from 'next/server';

const COOKIE_NAME = 'session';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isPublic = pathname === '/login' || pathname === '/api/login';
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (isPublic) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
