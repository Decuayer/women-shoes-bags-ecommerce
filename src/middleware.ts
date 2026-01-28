import createMiddleware from 'next-intl/middleware'

// Define locales inline to avoid importing from i18n.ts which uses server-side APIs
const locales = ['tr', 'en'] as const

// Create i18n middleware
// Authentication checks are handled in API routes using server-side auth utilities
// as Edge Runtime doesn't support Node.js crypto module required for JWT verification
const intlMiddleware = createMiddleware({
    locales,
    defaultLocale: 'tr',
    localePrefix: 'always',
})

export default intlMiddleware

export const config = {
    // Match all pathnames except for
    // - API routes, _next, _vercel
    // - Static files (files containing a dot)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
