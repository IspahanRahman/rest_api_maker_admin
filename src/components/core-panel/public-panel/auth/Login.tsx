'use client'
import React, { useState } from 'react'
import { useLoginMutation } from '@/apis/mutation/auth/useLoginMutation'
import { toast } from 'react-toastify'
import { LOCAL_STORAGE_KEYS } from '@/config/constants'
import { useRouter, useParams } from 'next/navigation'
import { FormInput } from '@/components/lib/ui-elements/form/FormInput'
import { PasswordInput } from '@/components/lib/ui-elements/form/PasswordInput'
import { LoadingButton } from '@/components/lib/ui-elements/button/LoadingButton'
import { setAuthCookie } from '@/lib/cookies'
import { LogIn, Mail, Lock } from 'lucide-react'
import Link from 'next/link';
import Swal from 'sweetalert2';

const Login = () => {
	const { submit, isLoading, data, errors, setData } = useLoginMutation()
	const router = useRouter()
	const params = useParams()
	const locale = params?.locale || 'en'
	const [rememberMe, setRememberMe] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!data.email.trim() || !data.password.trim()) {
			toast.error('Please fill in all fields')
			return
		}

		try {
			const result = await submit()

			if (!result?.status || !result?.data?.token) {
				Swal.fire({
					icon: 'error',
					title: 'Login Failed',
					text: result?.message || 'Login failed',
				});
				return;
			}

			const token = result.data.token

			// Store token in localStorage
			localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token)

			// Store token in cookie for proxy/middleware
			setAuthCookie(token, rememberMe)

			// Store user profile if available
			if (result.data.user) {
				localStorage.setItem(
					LOCAL_STORAGE_KEYS.USER_PROFILE,
					JSON.stringify(result.data.user)
				)
			}

			// Store remember me preference
			if (rememberMe) {
				localStorage.setItem(LOCAL_STORAGE_KEYS.REMEMBER_ME, 'true')
			}

			toast.success('Login successful! Welcome back.')
			router.push(`/${locale}/dashboard`)
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message ||
				error?.message ||
				'An error occurred during login'
			toast.error(errorMessage)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-surface py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				{/* Header */}
				<div className="text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
						<LogIn className="w-8 h-8 text-primary-600 dark:text-primary-400" />
					</div>
					<h2 className="text-3xl font-bold text-text-primary-sem">
						Welcome back
					</h2>
					<p className="mt-2 text-sm text-text-secondary">
						Sign in to your account to continue
					</p>
				</div>

				{/* Form Card */}
				<div className="bg-surface-card rounded-2xl shadow-lg p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Input */}
						<FormInput
							label="Email Address"
							type="email"
							id="email"
							placeholder="you@example.com"
							value={data.email}
							onChange={e => setData('email', e.target.value)}
							error={errors.email}
							required
							autoComplete="email"
						/>

						{/* Password Input */}
						<PasswordInput
							label="Password"
							id="password"
							placeholder="Enter your password"
							value={data.password}
							onChange={e => setData('password', e.target.value)}
							error={errors.password}
							required
							autoComplete="current-password"
						/>

						{/* Remember Me & Forgot Password */}
						<div className="flex items-center justify-between">
							<label className="flex items-center">
								<input
									type="checkbox"
									checked={rememberMe}
									onChange={e => setRememberMe(e.target.checked)}
									className="w-4 h-4 rounded border-border-subtle text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
								/>
								<span className="ml-2 text-sm text-text-secondary">
									Remember me
								</span>
							</label>

							<Link
								href={`/${locale}/forgot-password`}
								className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
							>
								Forgot password?
							</Link>
						</div>

						{/* Submit Button */}
						<LoadingButton
							type="submit"
							isLoading={isLoading}
							loadingText="Signing in..."
							className="w-full cursor-pointer"
							size="lg"
						>
							<Mail className="w-5 h-5" />
							Sign In
						</LoadingButton>

						{/* Divider */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-border-subtle" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-4 bg-surface-card text-text-secondary">
									Or continue with
								</span>
							</div>
						</div>

						{/* Social Login Buttons */}
						<div className="grid grid-cols-2 gap-4">
							<button
								type="button"
								className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border-subtle rounded-lg bg-surface-input hover:bg-surface-hover text-text-primary-sem transition-colors"
							>
								<svg className="w-5 h-5" viewBox="0 0 24 24">
									<path
										fill="currentColor"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="currentColor"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="currentColor"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="currentColor"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								Google
							</button>

							<button
								type="button"
								className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border-subtle rounded-lg bg-surface-input hover:bg-surface-hover text-text-primary-sem transition-colors"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
								</svg>
								GitHub
							</button>
						</div>
					</form>
				</div>

				{/* Sign Up Link */}
				<div className="text-center">
					<p className="text-sm text-text-secondary">
						Don't have an account?{' '}
						<Link
							href={`/${locale}/register`}
							className="font-semibold text-primary-500 hover:text-primary-600 transition-colors"
						>
							Sign up for free
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Login
