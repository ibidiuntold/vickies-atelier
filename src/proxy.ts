/**
 * Proxy for Performance Optimizations
 * 
 * Implements caching headers for static assets to improve performance.
 * 
 * Requirements: 16.8 - Cache static assets with appropriate cache headers
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const response = NextResponse.next();
  
  const { pathname } = request.nextUrl;
  
  // Cache static assets (images, fonts, etc.)
  if (
    pathname.startsWith('/images/') ||
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/_next/image') ||
    pathname.match(/\.(jpg|jpeg|png|webp|avif|gif|svg|ico|woff|woff2|ttf|otf)$/)
  ) {
    // Cache for 1 year (immutable assets)
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }
  
  // Cache API routes with shorter duration
  if (pathname.startsWith('/api/')) {
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
  }
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/webpack-hmr (hot module replacement)
     */
    '/((?!_next/webpack-hmr).*)',
  ],
};
