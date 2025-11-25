'use client'
import React from 'react'
import {
	X,
	Loader2,
	Database,
	Globe,
	Calendar,
	User,
	FileText,
	Key,
	Server,
	CheckCircle2,
	XCircle,
	AlertCircle,
	Copy,
	ExternalLink,
	Shield
} from 'lucide-react'
import Modal from '@/components/common/Modal'
import { Project } from '@/types/customer-project'
import { toast } from 'react-toastify'

interface ProjectDetailsModalProps {
	isOpen: boolean
	onClose: () => void
	project: Project | null
	isLoading: boolean
}

export default function ProjectDetailsModal({
	isOpen,
	onClose,
	project,
	isLoading
}: ProjectDetailsModalProps) {
	const getStatusConfig = (status: string) => {
		switch (status) {
			case 'active':
				return {
					label: 'Active',
					icon: CheckCircle2,
					className: 'bg-success-100 dark:bg-success-900/20 text-success-700 dark:text-success-300 border-success-200 dark:border-success-800'
				}
			case 'inactive':
				return {
					label: 'Inactive',
					icon: XCircle,
					className: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
				}
			case 'suspended':
				return {
					label: 'Suspended',
					icon: AlertCircle,
					className: 'bg-error-100 dark:bg-error-900/20 text-error-700 dark:text-error-300 border-error-200 dark:border-error-800'
				}
			default:
				return {
					label: status,
					icon: AlertCircle,
					className: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
				}
		}
	}

	const handleCopy = (text: string, label: string) => {
		navigator.clipboard.writeText(text)
		toast.success(`${label} copied to clipboard!`)
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	if (!project && !isLoading) return null

	const statusConfig = project ? getStatusConfig(project.status) : null
	const StatusIcon = statusConfig?.icon

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-12">
					<Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin mb-4" />
					<p className="text-text-secondary dark:text-text-tertiary">Loading project details...</p>
				</div>
			) : project ? (
				<div className="space-y-6">
					{/* Header */}
					<div className="flex items-start justify-between pb-4 border-b border-border-subtle dark:border-border-input">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
									<Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
								</div>
								<h2 className="text-xl font-semibold text-text-primary dark:text-primary-100">
									{project.name}
								</h2>
							</div>
							{project.description && (
								<p className="text-text-secondary dark:text-text-tertiary ml-12">
									{project.description}
								</p>
							)}
						</div>
						{StatusIcon && (
							<div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusConfig?.className}`}>
								<StatusIcon className="w-4 h-4" />
								<span className="text-sm font-medium">{statusConfig?.label}</span>
							</div>
						)}
					</div>

					{/* Project Information Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Project ID */}
						{/* <div className="bg-surface-hover dark:bg-surface-card border border-border-subtle dark:border-border-input rounded-lg p-4">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<Key className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
										<span className="text-sm text-text-secondary dark:text-text-tertiary">Project ID</span>
									</div>
									<p className="text-base font-mono font-medium text-text-primary dark:text-primary-200">
										{project.id}
									</p>
								</div>
							</div>
						</div> */}

						{/* User ID */}
						{/* <div className="bg-surface-hover dark:bg-surface-card border border-border-subtle dark:border-border-input rounded-lg p-4">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<User className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
										<span className="text-sm text-text-secondary dark:text-text-tertiary">User ID</span>
									</div>
									<p className="text-base font-mono font-medium text-text-primary dark:text-primary-200">
										{project.user_id}
									</p>
								</div>
							</div>
						</div> */}

						{/* Created Date */}
						<div className="bg-surface-hover dark:bg-surface-card border border-border-subtle dark:border-border-input rounded-lg p-4">
							<div className="flex items-center gap-2 mb-1">
								<Calendar className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
								<span className="text-sm text-text-secondary dark:text-text-tertiary">Created At</span>
							</div>
							<p className="text-base font-medium text-text-primary dark:text-primary-200">
								{formatDate(project.createdAt)}
							</p>
						</div>

						{/* Updated Date */}
						<div className="bg-surface-hover dark:bg-surface-card border border-border-subtle dark:border-border-input rounded-lg p-4">
							<div className="flex items-center gap-2 mb-1">
								<Calendar className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
								<span className="text-sm text-text-secondary dark:text-text-tertiary">Updated At</span>
							</div>
							<p className="text-base font-medium text-text-primary dark:text-primary-200">
								{formatDate(project.updatedAt)}
							</p>
						</div>
					</div>

					{/* Database Configuration */}
					<div className="bg-background border border-primary-200 dark:border-primary-900 rounded-lg p-4">
						<div className="flex items-center gap-2 mb-4">
							<Server className="w-5 h-5 text-primary-600 dark:text-primary-400" />
							<h3 className="text-lg font-semibold text-text-primary dark:text-primary-200">
								Database Configuration
							</h3>
						</div>

						<div className="space-y-3">
							{/* Database Name */}
							<div className="flex items-center justify-between bg-white dark:bg-surface-card rounded-lg p-3 border border-border-subtle dark:border-border-input">
								<div className="flex-1">
									<span className="text-sm text-text-secondary dark:text-text-tertiary block mb-1">
										Database Name
									</span>
									<p className="text-base font-mono font-medium text-text-primary dark:text-primary-200">
										{project.db_name}
									</p>
								</div>
								<button
									onClick={() => handleCopy(project.db_name, 'Database name')}
									className="p-2 hover:bg-surface-hover dark:hover:bg-primary-900/20 rounded-lg transition-colors"
									title="Copy database name"
								>
									<Copy className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
								</button>
							</div>

							{/* Database User */}
							{project.db_user && (
								<div className="flex items-center justify-between bg-white dark:bg-surface-card rounded-lg p-3 border border-border-subtle dark:border-border-input">
									<div className="flex-1">
										<span className="text-sm text-text-secondary dark:text-text-tertiary block mb-1">
											Database User
										</span>
										<p className="text-base font-mono font-medium text-text-primary dark:text-primary-200">
											{project.db_user}
										</p>
									</div>
									<button
										onClick={() => handleCopy(project.db_user!, 'Database user')}
										className="p-2 hover:bg-surface-hover dark:hover:bg-primary-900/20 rounded-lg transition-colors"
										title="Copy database user"
									>
										<Copy className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
									</button>
								</div>
							)}

							{/* Database Password */}
							{project.db_password && (
								<div className="flex items-center justify-between bg-white dark:bg-surface-card rounded-lg p-3 border border-border-subtle dark:border-border-input">
									<div className="flex-1">
										<span className="text-sm text-text-secondary dark:text-text-tertiary block mb-1">
											Database Password
										</span>
										<p className="text-base font-mono font-medium text-text-primary dark:text-primary-200">
											{'•'.repeat(12)}
										</p>
									</div>
									<button
										onClick={() => handleCopy(project.db_password!, 'Database password')}
										className="p-2 hover:bg-surface-hover dark:hover:bg-primary-900/20 rounded-lg transition-colors"
										title="Copy database password"
									>
										<Copy className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
									</button>
								</div>
							)}
						</div>
					</div>

					{/* API Configuration */}
					{project.api_base_url && (
						<div className="bg-success-50 dark:bg-success-950/20 border border-success-200 dark:border-success-900 rounded-lg p-4">
							<div className="flex items-center gap-2 mb-3">
								<Globe className="w-5 h-5 text-success-600 dark:text-success-400" />
								<h3 className="text-lg font-semibold text-text-primary dark:text-primary-200">
									API Configuration
								</h3>
							</div>

							<div className="flex items-center justify-between bg-white dark:bg-surface-card rounded-lg p-3 border border-border-subtle dark:border-border-input">
								<div className="flex-1 min-w-0">
									<span className="text-sm text-text-secondary dark:text-text-tertiary block mb-1">
										API Base URL
									</span>
									<p className="text-base font-mono font-medium text-text-primary dark:text-primary-200 truncate">
										{project.api_base_url}
									</p>
								</div>
								<div className="flex items-center gap-2 ml-3">
									<button
										onClick={() => handleCopy(project.api_base_url!, 'API Base URL')}
										className="p-2 hover:bg-surface-hover dark:hover:bg-primary-900/20 rounded-lg transition-colors"
										title="Copy API URL"
									>
										<Copy className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
									</button>
									<a
										href={project.api_base_url}
										target="_blank"
										rel="noopener noreferrer"
										className="p-2 hover:bg-surface-hover dark:hover:bg-primary-900/20 rounded-lg transition-colors"
										title="Open API URL"
									>
										<ExternalLink className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
									</a>
								</div>
							</div>
						</div>
					)}

					{/* Footer Actions */}
					<div className="flex items-center justify-end pt-4 border-t border-border-subtle dark:border-border-input">
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800
								text-white rounded-lg font-medium transition-colors cursor-pointer"
						>
							Close
						</button>
					</div>
				</div>
			) : null}
		</Modal>
	)
}
