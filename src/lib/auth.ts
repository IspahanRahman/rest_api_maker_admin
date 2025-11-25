import { LOCAL_STORAGE_KEYS } from '@/config/constants'
import { removeAuthCookie } from './cookies'

/**
 * Logout user - clear all auth data
 */
export function logout(): void {
	if (typeof window === 'undefined') return

	// Clear localStorage
	localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
	localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PROFILE)
	localStorage.removeItem(LOCAL_STORAGE_KEYS.REMEMBER_ME)

	// Clear cookie
	removeAuthCookie()

	// Redirect to login
	window.location.href = '/en/login'
}

/**
 * Check if user is authenticated
 * @returns True if user has a valid token, false otherwise
 */
export function isAuthenticated(): boolean {
	if (typeof window === 'undefined') return false
	return !!localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
}

/**
 * Get the current user from localStorage
 * @returns The user object or null if not found
 */
export function getCurrentUser(): any | null {
	if (typeof window === 'undefined') return null

	const userProfile = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PROFILE)
	if (!userProfile) return null

	try {
		return JSON.parse(userProfile)
	} catch (error) {
		console.error('Error parsing user profile:', error)
		return null
	}
}

/**
 * Get the auth token from localStorage
 * @returns The token string or null if not found
 */
export function getAuthToken(): string | null {
	if (typeof window === 'undefined') return null
	return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
}
