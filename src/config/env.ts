/**
 * Environment Variables Type Definitions
 *
 * This file provides TypeScript type safety for environment variables.
 * It ensures that required env vars are present and properly typed.
 */

declare namespace NodeJS {
	interface ProcessEnv {
		// Application
		NODE_ENV: 'development' | 'staging' | 'production';
		NEXT_PUBLIC_APP_NAME?: string;
		NEXT_PUBLIC_APP_URL: string;

		// API Configuration
		NEXT_PUBLIC_API_BASE_URL: string;
		NEXT_PUBLIC_API_TIMEOUT?: string;
		NEXT_PUBLIC_API_VERSION?: string;

		// Authentication (NextAuth.js)
		NEXTAUTH_SECRET: string;
		NEXTAUTH_URL: string;
		NEXTAUTH_BASEPATH?: string;
		NEXTAUTH_SESSION_MAX_AGE?: string;

		// Feature Flags
		NEXT_PUBLIC_ENABLE_ANALYTICS?: string;
		NEXT_PUBLIC_ENABLE_ERROR_REPORTING?: string;
		NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE?: string;

		// Third-Party Services (Optional)
		GOOGLE_CLIENT_ID?: string;
		GOOGLE_CLIENT_SECRET?: string;
		GITHUB_CLIENT_ID?: string;
		GITHUB_CLIENT_SECRET?: string;

		// Email Service (Optional)
		EMAIL_SERVER_HOST?: string;
		EMAIL_SERVER_PORT?: string;
		EMAIL_SERVER_USER?: string;
		EMAIL_SERVER_PASSWORD?: string;
		EMAIL_FROM?: string;

		// Database (Optional)
		DATABASE_URL?: string;

		// Monitoring & Analytics (Optional)
		NEXT_PUBLIC_SENTRY_DSN?: string;
		NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;

		// Development Tools
		NEXT_PUBLIC_DEBUG?: string;
		NEXT_PUBLIC_SHOW_ERROR_DETAILS?: string;

		// Documentation & External Links
		NEXT_PUBLIC_DOCS_URL?: string;
		NEXT_PUBLIC_SUPPORT_EMAIL?: string;

		// Security
		ALLOWED_ORIGINS?: string;
		RATE_LIMIT_MAX_REQUESTS?: string;
		RATE_LIMIT_WINDOW_MS?: string;
	}
}

// Type-safe environment variable helper
export const env = {
	// Application
	nodeEnv: process.env.NODE_ENV,
	appName: process.env.NEXT_PUBLIC_APP_NAME || 'Rest API Maker',
	appUrl: process.env.NEXT_PUBLIC_APP_URL,

	// API
	apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
	apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
	apiVersion: process.env.NEXT_PUBLIC_API_VERSION,

	// Authentication
	nextAuthSecret: process.env.NEXTAUTH_SECRET,
	nextAuthUrl: process.env.NEXTAUTH_URL,
	nextAuthBasePath: process.env.NEXTAUTH_BASEPATH || '/api/auth',
	sessionMaxAge: parseInt(
		process.env.NEXTAUTH_SESSION_MAX_AGE || '2592000'
	),

	// Feature Flags
	enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
	enableErrorReporting:
		process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
	enableMaintenanceMode:
		process.env.NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE === 'true',

	// Development
	debug: process.env.NEXT_PUBLIC_DEBUG === 'true',
	showErrorDetails: process.env.NEXT_PUBLIC_SHOW_ERROR_DETAILS === 'true',

	// External Links
	docsUrl: process.env.NEXT_PUBLIC_DOCS_URL,
	supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,

	// Checks
	isDevelopment: process.env.NODE_ENV === 'development',
	isProduction: process.env.NODE_ENV === 'production'
} as const;

// Validation helper
export function validateEnv() {
	const required = [
		'NEXT_PUBLIC_APP_URL',
		'NEXT_PUBLIC_API_BASE_URL',
		'NEXTAUTH_SECRET',
		'NEXTAUTH_URL'
	];

	const missing = required.filter((key) => !process.env[key]);

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(', ')}\n` +
				'Please check your .env file and ENV_GUIDE.md for setup instructions.'
		);
	}
}
