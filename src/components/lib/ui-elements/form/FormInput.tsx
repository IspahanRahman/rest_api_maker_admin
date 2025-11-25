'use client'
import React, { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
	helperText?: string
	containerClassName?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
	(
		{
			label,
			error,
			helperText,
			className,
			containerClassName,
			id,
			...props
		},
		ref
	) => {
		const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`

		return (
			<div className={cn('w-full', containerClassName)}>
				{label && (
					<label
						htmlFor={inputId}
						className="block mb-2 text-sm font-medium text-text-primary-sem"
					>
						{label}
						{props.required && <span className="text-error-500 ml-1">*</span>}
					</label>
				)}
				<input
					ref={ref}
					id={inputId}
					className={cn(
						'w-full px-4 py-2.5 rounded-lg border text-text-primary-sem bg-surface-input',
						'transition-all duration-200',
						'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
						'placeholder:text-text-tertiary',
						error
							? 'border-error-500 focus:ring-error-500'
							: 'border-border-subtle hover:border-border-subtle/80',
						'disabled:opacity-50 disabled:cursor-not-allowed',
						className
					)}
					{...props}
				/>
				{error && (
					<p className="mt-1.5 text-sm text-error-500 flex items-center gap-1">
						<svg
							className="w-4 h-4"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
						{error}
					</p>
				)}
				{helperText && !error && (
					<p className="mt-1.5 text-sm text-text-secondary">{helperText}</p>
				)}
			</div>
		)
	}
)

FormInput.displayName = 'FormInput'
