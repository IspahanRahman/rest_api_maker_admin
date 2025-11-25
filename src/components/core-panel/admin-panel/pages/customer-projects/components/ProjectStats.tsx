'use client'
import React from 'react'
import {
	FolderKanban,
	CheckCircle2,
	XCircle,
	AlertTriangle,
	TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectStatsProps {
	total: number
	active: number
	inactive: number
	suspended: number
}

export default function ProjectStats({
	total,
	active,
	inactive,
	suspended,
}: ProjectStatsProps) {
	const stats = [
		{
			label: 'Total Projects',
			value: total,
			icon: FolderKanban,
			color: 'text-primary-600 dark:text-primary-400',
			bgColor: 'bg-primary-100 dark:bg-primary-900/30',
			borderColor: 'border-primary-200 dark:border-primary-800',
			barColor: 'bg-primary-500',
			isPrimary: true,
		},
		{
			label: 'Active',
			value: active,
			icon: CheckCircle2,
			color: 'text-success-600 dark:text-success-400',
			bgColor: 'bg-success-100 dark:bg-success-900/30',
			borderColor: 'border-success-200 dark:border-success-800',
			barColor: 'bg-success-500',
			isPrimary: false,
		},
		{
			label: 'Inactive',
			value: inactive,
			icon: XCircle,
			color: 'text-gray-600 dark:text-gray-400',
			bgColor: 'bg-gray-100 dark:bg-gray-800',
			borderColor: 'border-gray-200 dark:border-gray-700',
			barColor: 'bg-gray-500',
			isPrimary: false,
		},
		{
			label: 'Suspended',
			value: suspended,
			icon: AlertTriangle,
			color: 'text-error-600 dark:text-error-400',
			bgColor: 'bg-error-100 dark:bg-error-900/30',
			borderColor: 'border-error-200 dark:border-error-800',
			barColor: 'bg-error-500',
			isPrimary: false,
		},
	]

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
			{stats.map((stat, index) => {
				const Icon = stat.icon
				const percentage =
					total > 0 && index > 0 ? ((stat.value / total) * 100).toFixed(0) : null

				return (
					<div
						key={stat.label}
						className={cn(
							'relative bg-surface-card dark:bg-surface-card/90 backdrop-blur-sm border rounded-2xl p-5 lg:p-6',
							'shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200',
							'border-border-subtle',
							stat.isPrimary && 'lg:col-span-1',
							stat.borderColor,
						)}
					>
						{/* Top row: icon + meta */}
						<div className="flex items-start justify-between gap-3 mb-4">
							<div className="flex items-center gap-3">
								<div className={cn('p-3 rounded-xl', stat.bgColor)}>
									<Icon className={cn('w-6 h-6', stat.color)} />
								</div>
								{stat.isPrimary && (
									<div className="flex flex-col">
										<span className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
											Overview
										</span>
										<span className="text-sm text-text-secondary">
											Project summary
										</span>
									</div>
								)}
							</div>

							{/* Percentage chip for non-total cards */}
							{percentage !== null && (
								<div className="inline-flex items-center gap-1 rounded-full px-2 py-1 bg-surface-hover dark:bg-surface-card text-[11px] font-medium text-text-tertiary border border-border-subtle">
									<TrendingUp className="w-3 h-3" />
									<span>{percentage}% of total</span>
								</div>
							)}
						</div>

						{/* Value + label */}
						<div>
							<p className="text-3xl font-semibold tracking-tight text-foreground mb-1">
								{stat.value}
							</p>
							<p className="text-sm text-text-secondary font-medium">
								{stat.label}
							</p>
						</div>

						{/* Progress Bar for non-total cards */}
						{percentage !== null && (
							<div
								className={cn(
									"mt-4 h-1.5 rounded-full overflow-hidden",
									// Use a neutral background for inactive/suspended in dark mode
									stat.label === "Inactive"
										? "bg-gray-200 dark:bg-gray-700"
										: stat.label === "Suspended"
											? "bg-error-100 dark:bg-error-900"
											: "bg-surface-hover dark:bg-surface-card"
								)}
							>
								<div
									className={cn('h-full rounded-full transition-all duration-300', stat.barColor)}
									style={{ width: `${percentage}%` }}
								/>
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}
