'use client'
import React, { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LoadingButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	isLoading?: boolean
	loadingText?: string
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
	size?: 'sm' | 'md' | 'lg'
}

export function LoadingButton({
	children,
	isLoading = false,
	loadingText,
	variant = 'primary',
	size = 'md',
	className,
	disabled,
	...props
}: LoadingButtonProps) {
	const variants = {
		primary:
			'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md',
		secondary:
			'bg-secondary-500 hover:bg-secondary-600 text-white shadow-sm',
		outline:
			'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
		ghost: 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
	}

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2.5 text-base',
		lg: 'px-6 py-3 text-lg'
	}

	return (
		<button
			{...props}
			disabled={disabled || isLoading}
			className={cn(
				'inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
				'transition-all duration-200',
				'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
				'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
				variants[variant],
				sizes[size],
				className
			)}
		>
			{isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
			{isLoading ? loadingText || children : children}
		</button>
	)
}
