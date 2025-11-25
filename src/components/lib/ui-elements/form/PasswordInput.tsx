'use client'
import React, { useState, forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { FormInput, FormInputProps } from './FormInput'
import { cn } from '@/lib/utils'

export interface PasswordInputProps extends Omit<FormInputProps, 'type'> {
	showStrength?: boolean
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
	({ showStrength = false, className, ...props }, ref) => {
		const [showPassword, setShowPassword] = useState(false)
		const [strength, setStrength] = useState(0)

		const calculateStrength = (password: string): number => {
			let score = 0
			if (!password) return 0

			// Length
			if (password.length >= 8) score += 1
			if (password.length >= 12) score += 1

			// Complexity
			if (/[a-z]/.test(password)) score += 1
			if (/[A-Z]/.test(password)) score += 1
			if (/[0-9]/.test(password)) score += 1
			if (/[^a-zA-Z0-9]/.test(password)) score += 1

			return Math.min(score, 5)
		}

		const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (showStrength) {
				setStrength(calculateStrength(e.target.value))
			}
			props.onChange?.(e)
		}

		const getStrengthColor = () => {
			if (strength <= 2) return 'bg-error-500'
			if (strength <= 3) return 'bg-warning-500'
			return 'bg-success-500'
		}

		const getStrengthText = () => {
			if (strength === 0) return ''
			if (strength <= 2) return 'Weak'
			if (strength <= 3) return 'Medium'
			return 'Strong'
		}

		return (
			<div className="w-full">
				<div className="relative">
					<FormInput
						{...props}
						ref={ref}
						type={showPassword ? 'text' : 'password'}
						onChange={handlePasswordChange}
						className={cn('pr-12', className)}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-[70%] -translate-y-1/2 text-text-secondary hover:text-text-primary-sem transition-colors p-1"
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						{showPassword ? (
							<EyeOff className="w-5 h-5" />
						) : (
							<Eye className="w-5 h-5" />
						)}
					</button>
				</div>

				{showStrength && props.value && (
					<div className="mt-2 space-y-1">
						<div className="flex gap-1">
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className={cn(
										'h-1 flex-1 rounded-full transition-all duration-300',
										i < strength ? getStrengthColor() : 'bg-gray-200 dark:bg-gray-700'
									)}
								/>
							))}
						</div>
						{strength > 0 && (
							<p className="text-xs text-text-secondary">
								Password strength: <span className="font-medium">{getStrengthText()}</span>
							</p>
						)}
					</div>
				)}
			</div>
		)
	}
)

PasswordInput.displayName = 'PasswordInput'
