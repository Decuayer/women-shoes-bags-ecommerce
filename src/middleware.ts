import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessTokenEdge } from './lib/auth-edge'

const locales = ['tr']

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale: 'tr',
    localePrefix: 'always'
})

export default async function middleware(request: NextRequest) {
    // 1. Handle i18n
    const response = intlMiddleware(request)

    // 2. Auth Protection logic
    const path = request.nextUrl.pathname

    // Check if path is protected
    const isAdminPath = path.includes('/admin')
    const isAccountPath = path.includes('/account')
    const isCheckoutPath = path.includes('/checkout') && !path.includes('/checkout/success')

    // Allow public access to login/register within admin/account structure if they exist
    if (path.includes('/auth/login') || path.includes('/auth/register')) {
        return response
    }

    if (isAdminPath || isAccountPath || isCheckoutPath) {
        const token = request.cookies.get('accessToken')?.value

        // No token -> Redirect to login
        if (!token) {
            const locale = request.cookies.get('NEXT_LOCALE')?.value || 'tr'
            return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url))
        }

        // Verify token
        const payload = await verifyAccessTokenEdge(token)

        if (!payload) {
            const locale = request.cookies.get('NEXT_LOCALE')?.value || 'tr'
            return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url))
        }

        // Admin check
        console.log('Middleware Admin Check:', { path, role: payload?.role, required: 'ADMIN' })

        if (isAdminPath && payload.role !== 'ADMIN') {
            const locale = request.cookies.get('NEXT_LOCALE')?.value || 'tr'
            // Redirect non-admins to home or account
            return NextResponse.redirect(new URL(`/${locale}/account`, request.url))
        }
    }

    return response
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
