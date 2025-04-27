import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define the paths that require authentication
const protectedPaths = ['/dashboard']

export function middleware(request: NextRequest) {
  // 1. Get the token from the cookies
  const token = request.cookies.get('jwtToken')?.value

  // 2. Check if the current path is protected
  const isProtectedRoute = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // 3. Redirect to login if trying to access a protected route without a token
  if (isProtectedRoute && !token) {
    // Create the absolute URL for the login page
    const loginUrl = new URL('/login', request.url)

    // Add a query parameter to indicate where the user was trying to go (optional)
    // loginUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)

    console.log('Middleware: No token found for protected route, redirecting to login.')
    return NextResponse.redirect(loginUrl)
  }

  // 4. Allow the request to proceed if the path is not protected, or if the user has a token
  // Note: Actual token *validity* should be checked by your API routes using the @token_required decorator
  return NextResponse.next()
}

// Configure the matcher to run the middleware on specific paths
export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes consumed by your frontend, not pages)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - login (the login page itself, to avoid redirect loops)
   * - signup (the signup page)
   */
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|login|signup).*)',
  ],
}