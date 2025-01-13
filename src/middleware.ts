import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthenticated } from './lib/auth'

// Middleware to check if the user is authenticated
export async function middleware(request: NextRequest) {
  const isAtuh = await isAuthenticated()
  if (!isAtuh) {
    return NextResponse.redirect(new URL('/oauth2/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - /health (health check endpoint)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|health).*)',
  ],
}
