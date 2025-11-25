import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { LOCAL_STORAGE_KEYS } from './config/constants'

// Create next-intl middleware
const intlMiddleware = createMiddleware(routing)

// Define route types
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'] as const
const AUTH_ROUTES = ['/login', '/register'] as const // Routes that authenticated users shouldn't access

/**
 * Extract locale from pathname
 */
function getLocaleFromPath(pathname: string): string {
	const match = pathname.match(/^\/(en|bn)/)
	return match ? match[1] : 'en'
}

/**
 * Check if route is public (doesn't require authentication)
 */
function isPublicRoute(pathname: string): boolean {
	const pathWithoutLocale = pathname.replace(/^\/(en|bn)/, '')
	return PUBLIC_ROUTES.some(route => pathWithoutLocale.startsWith(route))
}

/**
 * Check if route is an auth route (login/register)
 */
function isAuthRoute(pathname: string): boolean {
	const pathWithoutLocale = pathname.replace(/^\/(en|bn)/, '')
	return AUTH_ROUTES.some(route => pathWithoutLocale.startsWith(route))
}

/**
 * Check if path should be skipped (static files, API routes, etc.)
 */
function shouldSkipProxy(pathname: string): boolean {
	return (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/api') ||
		pathname.startsWith('/static') ||
		pathname.includes('.') // Files with extensions
	)
}

export function proxy(req: NextRequest) {
	try {
		const { pathname } = req.nextUrl
		const host = req.headers.get('host')
		const origin = `${req.nextUrl.protocol}//${host}`
		const locale = getLocaleFromPath(pathname)

		// Skip proxy for static files, API routes, etc.
		if (shouldSkipProxy(pathname)) {
			return NextResponse.next()
		}

		// Ensure pathname has locale prefix (en or bn)
		const localeRegex = /^\/(en|bn)(\/|$)/
		if (!localeRegex.test(pathname)) {
			// Redirect root to default locale
			if (pathname === '/') {
				return NextResponse.redirect(`${origin}/en/login`)
			}
			// Add default locale prefix to other paths
			return NextResponse.redirect(`${origin}/en${pathname}`)
		}

		// Get auth token from cookies
		const token = req.cookies.get(LOCAL_STORAGE_KEYS.AUTH_TOKEN)?.value

		// If user is authenticated and tries to access auth pages (login/register)
		// Redirect to dashboard
		if (token && isAuthRoute(pathname)) {
			return NextResponse.redirect(`${origin}/${locale}/dashboard`)
		}

		// If user is not authenticated and tries to access protected routes
		// Redirect to login
		if (!token && !isPublicRoute(pathname)) {
			return NextResponse.redirect(`${origin}/${locale}/login`)
		}

		// Pass through next-intl middleware for internationalization
		return intlMiddleware(req)
	} catch (error) {
		console.error('Proxy error:', error)
		// Fallback to next-intl middleware on error
		return intlMiddleware(req)
	}
}

export const config = {
	// Match all routes except static files and API routes
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder files
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
	],
}
