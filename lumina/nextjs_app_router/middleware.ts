
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate a random nonce for each request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // Define the Content Security Policy
  const cspHeader = \`
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' https://image.tmdb.org;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://vidsrc.to/ https://vidphantom.com/ https://www.2embed.cc/ https://nexstream.site/;
    connect-src 'self';
    upgrade-insecure-requests;
  \`;

  const requestHeaders = new Headers(request.headers);

  // Set the CSP header
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set(
    'Content-Security-Policy',
    // Replace newline characters and multiple spaces
    cspHeader.replace(/\\s{2,}/g, ' ').trim()
  );

  // Set other security headers
  requestHeaders.set('X-Content-Type-Options', 'nosniff');
  requestHeaders.set('X-Frame-Options', 'DENY'); // DENY by default, frame-src in CSP is more flexible
  requestHeaders.set('X-XSS-Protection', '1; mode=block');
  requestHeaders.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  requestHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Also set headers on the response, especially for the first render
  response.headers.set('Content-Security-Policy', cspHeader.replace(/\\s{2,}/g, ' ').trim());
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
