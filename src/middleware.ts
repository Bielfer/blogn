import { type NextRequest, NextResponse } from 'next/server';
import { env } from './env.mjs';

export const config = {
  matcher: ['/', '/((?!api/|_next/|_static/|_vercel|.*\\..*).*)'],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const appUrl = env.NEXT_PUBLIC_APP_URL.replace('http://', '').replace(
    'https://',
    ''
  );
  const hostname = req.headers
    .get('host')!
    .replace('http://', '')
    .replace('https://', '')
    .replace('.localhost:3000', `.${appUrl}`);
  const { pathname } = url;

  if (hostname === appUrl)
    return NextResponse.rewrite(new URL(`/app${pathname}`, req.url));

  return NextResponse.rewrite(
    new URL(`/blogs/${hostname}${pathname}`, req.url)
  );
}
