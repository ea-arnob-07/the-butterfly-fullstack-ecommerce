import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'butterfly_session';
const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'PRODUCT_MANAGER', 'ORDER_MANAGER', 'SUPPORT'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const login = new URL('/auth/login', request.url);
  login.searchParams.set('next', request.nextUrl.pathname);
  if (!token) return NextResponse.redirect(login);
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'development-only-change-me');
    const { payload } = await jwtVerify(token, secret);
    if (request.nextUrl.pathname.startsWith('/admin') && !adminRoles.includes(String(payload.role))) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(login);
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = { matcher: ['/account/:path*', '/admin/:path*', '/wishlist/:path*'] };
