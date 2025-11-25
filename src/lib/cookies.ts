import { LOCAL_STORAGE_KEYS } from '@/config/constants'

/**
 * Set authentication token in cookie
 * @param token - The authentication token
 * @param rememberMe - Whether to remember the user (affects expiry time)
 */
export function setAuthCookie(token: string, rememberMe: boolean = false): void {
	if (typeof window === 'undefined') return

	const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7 // 30 days or 7 days
	const isSecure = window.location.protocol === 'https:'

	document.cookie = `${LOCAL_STORAGE_KEYS.AUTH_TOKEN}=${token}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? '; Secure' : ''}`
}

/**
 * Remove authentication cookie
 */
export function removeAuthCookie(): void {
	if (typeof window === 'undefined') return

	document.cookie = `${LOCAL_STORAGE_KEYS.AUTH_TOKEN}=; path=/; max-age=0`
}

/**
 * Get cookie value by name
 * @param name - The cookie name
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
	if (typeof window === 'undefined') return null

	const value = `; ${document.cookie}`
	const parts = value.split(`; ${name}=`)

	if (parts.length === 2) {
		return parts.pop()?.split(';').shift() || null
	}

	return null
}

/**
 * Check if a cookie exists
 * @param name - The cookie name
 * @returns True if cookie exists, false otherwise
 */
export function hasCookie(name: string): boolean {
	return getCookie(name) !== null
}
