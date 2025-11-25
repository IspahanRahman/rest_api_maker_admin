'use client'
import React from 'react'
import { Search, Filter, X, ChevronDown, CheckCircle2, XCircle, AlertTriangle, Clock, SortAsc } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectFiltersProps {
	searchQuery: string
	setSearchQuery: (query: string) => void
	statusFilter: 'all' | 'active' | 'inactive' | 'suspended'
	setStatusFilter: (filter: 'all' | 'active' | 'inactive' | 'suspended') => void
	sortBy: 'name' | 'created' | 'updated'
	setSortBy: (sort: 'name' | 'created' | 'updated') => void
	showFilters: boolean
	setShowFilters: (show: boolean) => void
	totalProjects: number
	filteredCount: number
}

export default function ProjectFilters({
	searchQuery,
	setSearchQuery,
	statusFilter,
	setStatusFilter,
	sortBy,
	setSortBy,
	showFilters,
	setShowFilters,
	totalProjects,
	filteredCount,
}: ProjectFiltersProps) {
	const statusOptions: Array<{
		value: 'all' | 'active' | 'inactive' | 'suspended'
		label: string
		icon?: React.ElementType
	}> = [
			{ value: 'all', label: 'All Projects' },
			{ value: 'active', label: 'Active', icon: CheckCircle2 },
			{ value: 'inactive', label: 'Inactive', icon: XCircle },
			{ value: 'suspended', label: 'Suspended', icon: AlertTriangle },
		]

	const sortOptions: Array<{ value: 'name' | 'created' | 'updated'; label: string; icon?: React.ElementType }> = [
		{ value: 'name', label: 'Name', icon: SortAsc },
		{ value: 'created', label: 'Created Date', icon: Clock },
		{ value: 'updated', label: 'Last Updated', icon: Clock },
	]

	const hasActiveFilters =
		!!searchQuery || statusFilter !== 'all' || sortBy !== 'updated'

	return (
		<div className="space-y-4">
			{/* Top bar: search + filters + summary */}
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				{/* Search + filter toggle */}
				<div className="flex flex-col sm:flex-row gap-3 flex-1">
					{/* Search Input */}
					<div className="relative flex-1">
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<Search className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
						</div>
						<input
							type="text"
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							placeholder="Search projects by name, database, or description..."
							className={cn(
								'w-full rounded-lg border bg-surface-input/90 dark:bg-surface-card px-9 pr-10 py-2.5 text-sm',
								'text-text-primary dark:text-text-secondary placeholder:text-text-tertiary dark:placeholder:text-text-tertiary',
								'border-border-input dark:border-border-input focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
								'transition-all',
							)}
						/>
						{searchQuery && (
							<button
								onClick={() => setSearchQuery('')}
								className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-hover dark:hover:bg-surface-card transition-colors"
								type="button"
							>
								<X className="w-4 h-4 text-text-secondary dark:text-text-tertiary" />
							</button>
						)}
					</div>

					{/* Filter Toggle Button */}
					<button
						type="button"
						onClick={() => setShowFilters(!showFilters)}
						className={cn(
							'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium border',
							'transition-all',
							showFilters
								? 'bg-primary-50 dark:bg-primary-950/20 border-primary-300 dark:border-primary-800 text-primary-700 dark:text-primary-300 shadow-sm'
								: 'bg-surface-card dark:bg-surface-card border-border-input dark:border-border-input text-text-secondary dark:text-text-tertiary hover:bg-surface-hover dark:hover:bg-surface-card',
						)}
					>
						<Filter className="w-4 h-4" />
						<span>Filters</span>
						<ChevronDown
							className={cn(
								'w-4 h-4 transition-transform',
								showFilters && 'rotate-180',
							)}
						/>
					</button>
				</div>

				{/* Results Count */}
				<div className="flex items-center gap-2 text-xs sm:text-sm text-text-secondary dark:text-text-tertiary justify-between sm:justify-end">
					<p>
						{filteredCount === totalProjects ? (
							<>
								Showing{' '}
								<span className="font-semibold text-text-primary dark:text-primary-300">
									{totalProjects}
								</span>{' '}
								project{totalProjects === 1 ? '' : 's'}
							</>
						) : (
							<>
								Showing{' '}
								<span className="font-semibold text-text-primary dark:text-primary-300">
									{filteredCount}
								</span>{' '}
								of{' '}
								<span className="font-semibold text-text-primary dark:text-primary-300">
									{totalProjects}
								</span>{' '}
								projects
							</>
						)}
					</p>

					{hasActiveFilters && (
						<span className="inline-flex items-center gap-1 rounded-full bg-surface-card dark:bg-surface-card px-2.5 py-1 text-[11px] font-medium text-text-tertiary dark:text-text-tertiary border border-border-subtle dark:border-border-input">
							<Filter className="w-3 h-3" />
							<span>Filters applied</span>
						</span>
					)}
				</div>
			</div>

			{/* Expanded Filters */}
			{showFilters && (
				<div className="rounded-xl border border-border-subtle dark:border-border-input bg-surface-card/95 dark:bg-surface-card p-5 sm:p-6 shadow-sm space-y-6">
					{/* Status Filter */}
					<div className="space-y-3">
						<div className="flex items-center justify-between gap-2">
							<label className="block text-sm font-semibold text-text-primary dark:text-primary-300">
								Status
							</label>
							{statusFilter !== 'all' && (
								<span className="text-[11px] text-text-tertiary dark:text-text-tertiary">
									Filtering by:{' '}
									<span className="font-medium capitalize">{statusFilter}</span>
								</span>
							)}
						</div>

						<div className="inline-flex flex-wrap gap-2">
							{statusOptions.map(option => {
								const Icon = option.icon
								const isActive = statusFilter === option.value
								return (
									<button
										key={option.value}
										type="button"
										onClick={() => setStatusFilter(option.value)}
										className={cn(
											'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all',
											isActive
												? 'bg-primary-600 text-white border-primary-600 shadow-sm dark:bg-primary-700 dark:border-primary-700'
												: 'bg-surface-input dark:bg-surface-card text-text-secondary dark:text-text-tertiary border-border-input dark:border-border-input hover:bg-surface-hover dark:hover:bg-surface-card',
										)}
									>
										{Icon && <Icon className="w-3.5 h-3.5" />}
										<span>{option.label}</span>
									</button>
								)
							})}
						</div>
					</div>

					{/* Sort Options */}
					<div className="space-y-3">
						<div className="flex items-center justify-between gap-2">
							<label className="block text-sm font-semibold text-text-primary dark:text-primary-300">
								Sort by
							</label>
							<span className="text-[11px] text-text-tertiary dark:text-text-tertiary">
								Currently:{' '}
								<span className="font-medium">
									{sortOptions.find(o => o.value === sortBy)?.label}
								</span>
							</span>
						</div>

						<div className="inline-flex flex-wrap gap-2">
							{sortOptions.map(option => {
								const Icon = option.icon
								const isActive = sortBy === option.value
								return (
									<button
										key={option.value}
										type="button"
										onClick={() => setSortBy(option.value)}
										className={cn(
											'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all',
											isActive
												? 'bg-primary-600 text-white border-primary-600 shadow-sm dark:bg-primary-700 dark:border-primary-700'
												: 'bg-surface-input dark:bg-surface-card text-text-secondary dark:text-text-tertiary border-border-input dark:border-border-input hover:bg-surface-hover dark:hover:bg-surface-card',
										)}
									>
										{Icon && (
											<Icon className="w-3.5 h-3.5 opacity-80" />
										)}
										<span>{option.label}</span>
									</button>
								)
							})}
						</div>
					</div>

					{/* Clear Filters */}
					{hasActiveFilters && (
						<div className="pt-4 border-t border-border-subtle dark:border-border-input flex items-center justify-between gap-3">
							<p className="text-xs text-text-tertiary dark:text-text-tertiary">
								You can reset the filters to see all projects again.
							</p>
							<button
								type="button"
								onClick={() => {
									setSearchQuery('')
									setStatusFilter('all')
									setSortBy('updated')
								}}
								className="text-xs sm:text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
							>
								Clear all filters
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
