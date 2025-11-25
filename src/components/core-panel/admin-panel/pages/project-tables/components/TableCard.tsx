'use client'
import React from 'react'
import {
	Table,
	CheckCircle2,
	XCircle,
	Eye,
	Edit,
	MoreVertical,
	Trash2,
	Columns,
	List,
	Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProjectTable } from '@/types/project-table'

interface TableCardProps {
	table: ProjectTable
	onView: (table: ProjectTable) => void
	onEdit: (table: ProjectTable) => void
	onDelete: (table: ProjectTable) => void
	openMenu: string | null
	setOpenMenu: (id: string | null) => void
}

const getStatusConfig = (status: string) => {
	switch (status) {
		case 'active':
			return {
				label: 'Active',
				icon: CheckCircle2,
				chipClass:
					'bg-success-50 text-success-700 border border-success-200 dark:bg-success-950/30 dark:text-success-300 dark:border-success-800/70',
				iconBg: 'bg-success-100/80 dark:bg-success-900/30',
			}
		case 'inactive':
			return {
				label: 'Inactive',
				icon: XCircle,
				chipClass:
					'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-700',
				iconBg: 'bg-gray-100/80 dark:bg-gray-800/60',
			}
		default:
			return {
				label: status,
				icon: XCircle,
				chipClass:
					'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-700',
				iconBg: 'bg-gray-100/80 dark:bg-gray-800/60',
			}
	}
}

export default function TableCard({ table, onView, onEdit, onDelete, openMenu, setOpenMenu }: TableCardProps) {
	const statusConfig = getStatusConfig(table.status || 'active')
	const StatusIcon = statusConfig.icon
	const createdDate = new Date(table.createdAt)
	const updatedDate = new Date(table.updatedAt)

	const isMenuOpen = openMenu === table.id

	return (
		<div
			className={cn(
				'bg-surface-card border border-border-subtle rounded-xl p-6 hover:shadow-lg transition-all relative group',
				isMenuOpen && 'z-30'
			)}
		>
			{/* Gradient Overlay */}
			<div className="absolute inset-0 pointer-events-none rounded-2xl bg-linear-to-br from-white/5 via-transparent to-primary-500/5 dark:from-white/0 dark:via-transparent dark:to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

			<div className="relative">
				{/* Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-3 mb-2 flex-wrap">
							<button
								type="button"
								onClick={() => onView(table)}
								className="text-base lg:text-lg font-semibold text-text-primary-sem hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate text-left"
							>
								{table.name}
							</button>

							<span
								className={cn(
									'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0',
									statusConfig.chipClass
								)}
							>
								<StatusIcon className="w-3.5 h-3.5" />
								{statusConfig.label}
							</span>
						</div>

						{table.description && (
							<p className="text-sm text-text-secondary dark:text-text-tertiary line-clamp-2 mb-3">
								{table.description}
							</p>
						)}

						{/* Table Info */}
						<div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary dark:text-text-tertiary mb-2">
							<div className="flex items-center gap-2">
								<Columns className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
								<span className="font-mono">
									{table.columns_count} {table.columns_count === 1 ? 'column' : 'columns'}
								</span>
							</div>
							<span>•</span>
							<div className="flex items-center gap-2">
								<List className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
								<span className="font-mono">{(table.row_count || 0).toLocaleString()} rows</span>
							</div>
						</div>

						{/* Dates */}
						<div className="flex flex-wrap items-center gap-4 text-xs text-text-tertiary dark:text-text-tertiary">
							<div className="flex items-center gap-1.5">
								<Calendar className="w-3 h-3" />
								<span>Created {createdDate.toLocaleDateString()}</span>
							</div>
							<span>•</span>
							<span>Updated {updatedDate.toLocaleDateString()}</span>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-between pt-4 border-t border-border-subtle dark:border-border-input">
					{/* Quick Actions - Desktop */}
					<div className="hidden md:flex items-center gap-2">
						<button
							type="button"
							onClick={() => onView(table)}
							className="p-2 rounded-lg hover:bg-surface-input dark:hover:bg-surface-card transition-colors text-text-secondary dark:text-text-tertiary hover:text-text-primary dark:hover:text-primary-400 cursor-pointer"
							title="View details"
						>
							<Eye className="w-5 h-5" />
						</button>

						<button
							type="button"
							onClick={() => onEdit(table)}
							className="p-2 rounded-lg hover:bg-surface-input dark:hover:bg-surface-card transition-colors text-text-secondary dark:text-text-tertiary hover:text-text-primary dark:hover:text-primary-400 cursor-pointer"
							title="Edit table"
						>
							<Edit className="w-5 h-5" />
						</button>
					</div>

					{/* Mobile Actions */}
					<div className="flex md:hidden items-center gap-2">
						<button
							type="button"
							onClick={() => onView(table)}
							className="p-2 rounded-lg bg-surface-input dark:bg-surface-card text-text-secondary dark:text-text-tertiary hover:text-text-primary dark:hover:text-primary-400 hover:bg-surface-hover dark:hover:bg-surface-card transition-colors"
							title="View details"
						>
							<Eye className="w-5 h-5" />
						</button>
						<button
							type="button"
							onClick={() => onEdit(table)}
							className="p-2 rounded-lg bg-surface-input dark:bg-surface-card text-text-secondary dark:text-text-tertiary hover:text-text-primary dark:hover:text-primary-400 hover:bg-surface-hover dark:hover:bg-surface-card transition-colors"
							title="Edit table"
						>
							<Edit className="w-5 h-5" />
						</button>
					</div>

					{/* More Menu */}
					<div className="relative">
						<button
							type="button"
							onClick={() => setOpenMenu(isMenuOpen ? null : table.id)}
							className={cn(
								'p-2 rounded-lg transition-colors cursor-pointer',
								isMenuOpen
									? 'bg-surface-input dark:bg-surface-card text-text-primary dark:text-primary-400'
									: 'hover:bg-surface-input dark:hover:bg-surface-card text-text-secondary dark:text-text-tertiary hover:text-text-primary dark:hover:text-primary-400'
							)}
							aria-haspopup="menu"
							aria-expanded={isMenuOpen}
						>
							<MoreVertical className="w-5 h-5" />
						</button>

						{/* Dropdown Menu */}
						{isMenuOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-surface-card dark:bg-surface-card/95 border border-border-subtle dark:border-border-input rounded-xl shadow-xl z-40 overflow-visible">
								<div className="px-4 py-2 border-b border-border-subtle dark:border-border-input bg-surface-hover/60 dark:bg-surface-card/80">
									<p className="text-xs font-semibold text-text-tertiary dark:text-text-secondary uppercase tracking-wide">
										Table Actions
									</p>
								</div>

								<div className="py-2">
									<button
										type="button"
										onClick={() => {
											onDelete(table)
											setOpenMenu(null)
										}}
										className="w-full flex items-center gap-3 px-4 py-3 hover:bg-error-50 dark:hover:bg-error-900/20 text-error-600 dark:text-error-400 transition-colors text-sm text-left"
									>
										<Trash2 className="w-4 h-4" />
										<span>Delete Table</span>
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
