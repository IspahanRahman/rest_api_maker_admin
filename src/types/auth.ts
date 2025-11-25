// Auth Type Definitions

export interface LoginRequest {
	email: string
	password: string
	remember?: boolean
}

export interface RegisterRequest {
	name: string
	email: string
	password: string
	password_confirmation: string
}

export interface AuthUser {
	id: number | string
	name: string
	email: string
	email_verified_at?: string | null
	avatar?: string | null
	role?: string
	created_at?: string
	updated_at?: string
}

export interface AuthResponse {
	status: boolean
	message: string
	data: {
		token: string
		user: AuthUser
	}
}

export interface ApiErrorResponse {
	status: boolean
	message: string
	errors?: Record<string, string[]>
}
