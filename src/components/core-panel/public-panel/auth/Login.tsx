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
						Sign in to Admin Panel to continue
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

							{/* <Link
								href={`/${locale}/forgot-password`}
								className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
							>
								Forgot password?
							</Link> */}
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
					</form>
				</div>

			</div>
		</div>
	)
}

export default Login
