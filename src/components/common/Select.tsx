'use client'
import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
	value: string | number
	label: string
	disabled?: boolean
}

interface SelectProps {
	id?: string
	label?: string
	value: string | number
	onChange: (value: string | number) => void
	options: SelectOption[]
	placeholder?: string
	disabled?: boolean
	error?: string
	required?: boolean
	helperText?: string
	className?: string
}

export default function Select({
	id,
	label,
	value,
	onChange,
	options,
	placeholder = 'Select an option...',
	disabled = false,
	error,
	required = false,
	helperText,
	className,
}: SelectProps) {
	const selectId = id || `select-${Math.random()}`

	return (
		<div className={cn('space-y-2', className)}>
			{label && (
				<label
					htmlFor={selectId}
					className="block text-sm font-medium text-foreground"
				>
					{label}
					{required && <span className="text-error-500 ml-1">*</span>}
				</label>
			)}

			<div className="relative">
				<select
					id={selectId}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={disabled}
					className={cn(
						'w-full px-4 py-2.5 bg-white dark:bg-surface-card',
						'border border-border-input dark:border-border-subtle rounded-lg',
						'text-foreground dark:text-foreground placeholder:text-text-tertiary dark:placeholder:text-text-tertiary',
						'focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent',
						'disabled:opacity-50 disabled:cursor-not-allowed',
						'transition-all appearance-none pr-10',
						'hover:border-border-input dark:hover:border-border-input',
						error && 'border-error-500 dark:border-error-500 focus:ring-error-500 dark:focus:ring-error-400',
					)}
				>
					{placeholder && (
						<option value="" disabled>
							{placeholder}
						</option>
					)}
					{options.map((option) => (
						<option
							key={option.value}
							value={option.value}
							disabled={option.disabled}
						>
							{option.label}
						</option>
					))}
				</select>

				{/* Chevron Icon */}
				<ChevronDown
					className={cn(
						'absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5',
						'text-text-secondary dark:text-text-tertiary pointer-events-none',
						'transition-colors',
						disabled && 'opacity-50',
					)}
				/>
			</div>

			{error && (
				<p className="text-sm text-error-600 dark:text-error-400">{error}</p>
			)}

			{helperText && !error && (
				<p className="text-xs text-text-tertiary dark:text-text-secondary">
					{helperText}
				</p>
			)}
		</div>
	)
}
