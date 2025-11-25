'use client'
import React from 'react'
import {
	FolderKanban,
	CheckCircle2,
	XCircle,
	AlertTriangle,
	Database,
	User,
	Copy,
	Eye,
	Edit,
	PlayCircle,
	PauseCircle,
	MoreVertical,
	Settings,
	Code,
	FileText,
	Trash2,
	Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Project } from '@/types/customer-project'
import { toast } from 'react-toastify'

interface ProjectCardProps {
	project: Project
	onView: (project: Project) => void
	onEdit: (project: Project) => void
	onDelete: (project: Project) => void
	onToggleStatus: (project: Project) => void
	isUpdating: boolean
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
				accentBorder: 'border-l-4 border-success-400/70',
			}
		case 'inactive':
			return {
				label: 'Inactive',
				icon: XCircle,
				chipClass:
					'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-700',
				iconBg: 'bg-gray-100/80 dark:bg-gray-800/60',
				accentBorder: 'border-l-4 border-gray-400/60',
			}
		case 'suspended':
			return {
				label: 'Suspended',
				icon: AlertTriangle,
				chipClass:
					'bg-error-50 text-error-700 border border-error-200 dark:bg-error-950/40 dark:text-error-300 dark:border-error-800/70',
				iconBg: 'bg-error-100/80 dark:bg-error-900/30',
				accentBorder: 'border-l-4 border-error-400/70',
			}
		default:
			return {
				label: status,
				icon: AlertTriangle,
				chipClass:
					'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-700',
				iconBg: 'bg-gray-100/80 dark:bg-gray-800/60',
				accentBorder: 'border-l-4 border-gray-400/60',
			}
	}
}

export default function ProjectCard({
	project,
	onView,
	onEdit,
	onDelete,
	onToggleStatus,
	isUpdating,
	openMenu,
	setOpenMenu,
}: ProjectCardProps) {
	const statusConfig = getStatusConfig(project.status)
	const StatusIcon = statusConfig.icon
	const createdDate = new Date(project.createdAt)
	const updatedDate = new Date(project.updatedAt)
	const daysSinceUpdate = Math.floor(
		(Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24),
	)

	const handleCopyDBName = (dbName: string) => {
		navigator.clipboard.writeText(dbName)
		toast.success('Database name copied!')
	}

	const isMenuOpen = openMenu === project.id

	return (
		<div
			className={cn(
				'relative group rounded-2xl border bg-surface-card/90 dark:bg-surface-card/95 backdrop-blur-sm',
				'border-border-subtle dark:border-border-input hover:border-primary-500/70 hover:shadow-lg',
				'transition-all duration-200 hover:-translate-y-0.5',
				statusConfig.accentBorder,
				isMenuOpen && 'z-30',
				'overflow-visible'
			)}
		>
			<div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-primary-500/5 dark:from-white/0 dark:via-transparent dark:to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

			<div className="relative p-5 lg:p-6">
				<div className="flex items-start justify-between gap-6">
					{/* Project Info */}
					<div className="flex-1 min-w-0">
						<div className="flex items-start gap-4">
							{/* Icon */}
							<div
								className={cn(
									'p-3 rounded-xl shrink-0 flex items-center justify-center',
									statusConfig.iconBg,
								)}
							>
								<FolderKanban className="w-6 h-6 text-text-primary dark:text-primary-300" />
							</div>

							{/* Content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-3 mb-2 flex-wrap">
								<button
									type="button"
									onClick={() => onView(project)}
									className="text-base lg:text-lg font-semibold text-text-primary-sem hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate text-left"
								>
									{project.name}
								</button>

								<span
										className={cn(
											'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0',
											statusConfig.chipClass,
										)}
									>
										<StatusIcon className="w-3.5 h-3.5" />
										{statusConfig.label}
									</span>
								</div>

								{project.description && (
									<p className="text-sm text-text-secondary dark:text-text-tertiary line-clamp-2 mb-3">
										{project.description}
									</p>
								)}

								{/* Database Info */}
								<div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary dark:text-text-tertiary mb-2">
									<div className="flex items-center gap-2">
										<Database className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
										<span className="font-mono text-[11px] bg-surface-input dark:bg-surface-card px-2 py-0.5 rounded-md">
											{project.db_name}
										</span>
										<button
											onClick={() => handleCopyDBName(project.db_name)}
											className="ml-1 p-1 hover:bg-surface-input dark:hover:bg-surface-card rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
											title="Copy database name"
											type="button"
										>
											<Copy className="w-3.5 h-3.5 text-text-secondary dark:text-text-tertiary hover:text-text-primary dark:hover:text-primary-400" />
										</button>
									</div>
									{project.db_user && (
										<div className="flex items-center gap-2">
											<User className="w-3.5 h-3.5 text-text-tertiary dark:text-text-secondary" />
											<span className="font-mono text-[11px]">
												{project.db_user}
											</span>
										</div>
									)}
								</div>

								{/* Dates */}
								<div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary dark:text-text-secondary">
									<span>
										Created{' '}
										<span className="font-medium">
											{createdDate.toLocaleDateString()}
										</span>
									</span>
									<span className="text-border-subtle dark:text-border-input">•</span>
									<span>
										Updated{' '}
										<span className="font-medium">
											{daysSinceUpdate === 0 ? 'today' : `${daysSinceUpdate}d ago`}
										</span>
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="flex items-start gap-2 shrink-0">
						{/* Quick Actions (md+) */}
						<div className="hidden md:flex items-center gap-1">
							<button
								type="button"
								onClick={() => onToggleStatus(project)}
								disabled={isUpdating}
								className="p-2 rounded-lg hover:bg-surface-input dark:hover:bg-surface-card transition-colors text-text-secondary dark:text-text-tertiary hover:text-text-primary dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
								title={
									project.status === 'active'
										? 'Inactive project'
										: 'Active project'
								}
							>
								{isUpdating ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : project.status === 'active' ? (
									<PauseCircle className="w-5 h-5" />
								) : (
									<PlayCircle className="w-5 h-5" />
								)}
						</button>

						<button
							type="button"
							onClick={() => onView(project)}
							className="p-2 rounded-lg hover:bg-surface-input dark:hover:bg-surface-card transition-colors text-text-secondary dark:text-text-tertiary hover:text-text-primary dark:hover:text-primary-400 cursor-pointer"
							title="View details"
						>
							<Eye className="w-5 h-5" />
						</button>

						<button
								type="button"
								onClick={() => onEdit(project)}
								className="p-2 rounded-lg hover:bg-surface-input dark:hover:bg-surface-card transition-colors text-text-secondary dark:text-text-tertiary hover:text-text-primary dark:hover:text-primary-400 cursor-pointer"
								title="Edit project"
							>
								<Edit className="w-5 h-5" />
							</button>
						</div>

						{/* More Menu */}
						<div className="relative">
							<button
								type="button"
								onClick={() => setOpenMenu(isMenuOpen ? null : project.id)}
								className={cn(
									'p-2 rounded-lg transition-colors cursor-pointer',
									isMenuOpen
										? 'bg-surface-input dark:bg-surface-card text-text-primary dark:text-primary-400'
										: 'hover:bg-surface-input dark:hover:bg-surface-card text-text-secondary dark:text-text-tertiary hover:text-text-primary dark:hover:text-primary-400',
								)}
								aria-haspopup="menu"
								aria-expanded={isMenuOpen}
							>
								<MoreVertical className="w-5 h-5" />
							</button>

							{/* Dropdown Menu */}
							{isMenuOpen && (
								<div className="absolute right-0 mt-2 w-60 bg-surface-card dark:bg-surface-card/95 border border-border-subtle dark:border-border-input rounded-xl shadow-xl z-40 overflow-visible">
									<div className="px-4 py-2 border-b border-border-subtle dark:border-border-input bg-surface-hover/60 dark:bg-surface-card/80">
										<p className="text-xs font-semibold text-text-tertiary dark:text-text-secondary uppercase tracking-wide">
											Project actions
										</p>
									</div>

									{/* <Link
										href={`/dashboard/projects/${project.id}/settings`}
										className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover dark:hover:bg-surface-card text-text-primary dark:text-text-secondary transition-colors text-sm"
									>
										<Settings className="w-4 h-4 text-text-tertiary dark:text-text-secondary" />
										<span>Settings</span>
									</Link>

									<button
										type="button"
										className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-hover dark:hover:bg-surface-card text-text-primary dark:text-text-secondary transition-colors text-sm text-left"
									>
										<Code className="w-4 h-4 text-text-tertiary dark:text-text-secondary" />
										<span>API Documentation</span>
									</button>

									<button
										type="button"
										className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-hover dark:hover:bg-surface-card text-text-primary dark:text-text-secondary transition-colors text-sm text-left"
									>
										<FileText className="w-4 h-4 text-text-tertiary dark:text-text-secondary" />
										<span>Export Config</span>
									</button> */}

									<button
										type="button"
										onClick={() => onDelete(project)}
										className="w-full flex items-center gap-3 px-4 py-3 hover:bg-error-50 dark:hover:bg-error-950/20 text-error-600 dark:text-error-400 transition-colors text-sm text-left cursor-pointer"
									>
										<Trash2 className="w-4 h-4" />
										<span>Delete Project</span>
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* Mobile Actions (sm only) */}
			<div className="flex md:hidden items-center gap-2 mt-4 px-4">
				<button
					type="button"
					onClick={() => onToggleStatus(project)}
					disabled={isUpdating}
					className="p-2 rounded-lg bg-surface-input dark:bg-surface-card text-text-secondary dark:text-text-tertiary hover:text-text-primary dark:hover:text-primary-400 hover:bg-surface-hover dark:hover:bg-surface-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					title={project.status === 'active' ? 'Pause project' : 'Activate project'}
				>
					{isUpdating ? (
						<Loader2 className="w-5 h-5 animate-spin" />
					) : project.status === 'active' ? (
						<PauseCircle className="w-5 h-5" />
					) : (
						<PlayCircle className="w-5 h-5" />
					)}
				</button>
				<button
					type="button"
					onClick={() => onView(project)}
					className="p-2 rounded-lg bg-surface-input dark:bg-surface-card text-text-secondary dark:text-text-tertiary hover:text-text-primary dark:hover:text-primary-400 hover:bg-surface-hover dark:hover:bg-surface-card transition-colors"
					title="View details"
				>
					<Eye className="w-5 h-5" />
				</button>
				<button
					type="button"
					onClick={() => onEdit(project)}
					className="p-2 rounded-lg bg-surface-input dark:bg-surface-card text-text-secondary dark:text-text-tertiary hover:text-text-primary dark:hover:text-primary-400 hover:bg-surface-hover dark:hover:bg-surface-card transition-colors"
					title="Edit project"
				>
					<Edit className="w-5 h-5" />
				</button>
			</div>
		</div>
	)
}
