import { type NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const locales = ['hr', 'en']
const defaultLocale = 'hr'

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') ?? defaultLocale
  const negotiator = new Negotiator({
    headers: { 'accept-language': acceptLanguage },
  })

  const languages = negotiator.languages()
  return match(languages, locales, defaultLocale)
}

// Define the matcher for your protected routes.
const isProtectedRoute = createRouteMatcher(['/en/dashboard', '/hr/dashboard'])

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl

  // --- Locale Redirection ---
  // Skip favicon requests.
  if (
    pathname.includes('favicon.ico') ||
    pathname.includes('apple-touch-icon.png') ||
    pathname.includes('icon-192x192.png') ||
    pathname.includes('icon-512x512.png')
  ) {
    return NextResponse.next()
  }

  // Check if the pathname already includes a valid locale.
  const pathnameHasValidLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasValidLocale) {
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
  }

  // Determine the current locale from the URL.
  const currentLocale =
    locales.find((locale) => pathname.startsWith(`/${locale}`)) || defaultLocale

  // --- Route Protection ---
  // For protected routes, redirect unauthenticated users to the custom sign‑in page.
  if (isProtectedRoute(request)) {
    const { userId } = await auth()
    if (!userId) {
      // Use environment variables (or fallback to defaults) for sign‑in paths.
      const signInPageEn =
        process.env.NEXT_PUBLIC_SIGN_IN_PATH_EN || '/en/sign-in'
      const signInPageHr =
        process.env.NEXT_PUBLIC_SIGN_IN_PATH_HR || '/hr/sign-in'
      const signInUrl = currentLocale === 'hr' ? signInPageHr : signInPageEn
      request.nextUrl.pathname = signInUrl
      return NextResponse.redirect(request.nextUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip internal Next.js paths (like _next/static, _next/image, etc.)
    '/((?!api|_next/static|_next/image).*)',
    // Always run for API routes.
    '/(api|trpc)(.*)',
  ],
}
