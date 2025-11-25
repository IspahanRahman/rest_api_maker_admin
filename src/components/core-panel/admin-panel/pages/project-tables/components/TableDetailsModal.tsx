'use client'
import React from 'react'
import {
	Loader2,
	Table,
	CheckCircle2,
	XCircle,
	Calendar,
	Columns,
	List,
	Copy,
	Database,
} from 'lucide-react'
import Modal from '@/components/common/Modal'
import { ProjectTable } from '@/types/project-table'
import { toast } from 'react-toastify'

interface TableDetailsModalProps {
	isOpen: boolean
	onClose: () => void
	table: ProjectTable | null
}

export default function TableDetailsModal({ isOpen, onClose, table }: TableDetailsModalProps) {
	console.log('TableDetailsModal table:', table);
	const getStatusConfig = (status: string) => {
		switch (status) {
			case 'active':
				return {
					label: 'Active',
					icon: CheckCircle2,
					className:
						'bg-success-100 dark:bg-success-900/20 text-success-700 dark:text-success-300 border-success-200 dark:border-success-800',
				}
			case 'inactive':
				return {
					label: 'Inactive',
					icon: XCircle,
					className: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
				}
			default:
				return {
					label: status,
					icon: XCircle,
					className: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
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
			minute: '2-digit',
		})
	}

	if (!table) return null

	const statusConfig = getStatusConfig(table.status || 'active')
	const StatusIcon = statusConfig?.icon

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
			<div className="max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
				<div className="space-y-6">
					{/* Header */}
					<div className="flex items-start justify-between pb-4 border-b border-border-subtle dark:border-border-input">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
								<Table className="w-5 h-5 text-primary-600 dark:text-primary-400" />
							</div>
							<h2 className="text-xl font-semibold text-text-primary dark:text-primary-100">{table.name}</h2>
						</div>
						{table.description && (
							<p className="text-text-secondary dark:text-text-tertiary ml-12">{table.description}</p>
						)}
					</div>
					{StatusIcon && (
						<div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusConfig?.className}`}>
							<StatusIcon className="w-4 h-4" />
							<span className="text-sm font-medium">{statusConfig?.label}</span>
						</div>
					)}
				</div>

				{/* Table Information Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Columns Count */}
					<div className="bg-surface-hover dark:bg-surface-card border border-border-subtle dark:border-border-input rounded-lg p-4">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<Columns className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
									<span className="text-sm text-text-secondary dark:text-text-tertiary">Columns</span>
								</div>
								<p className="text-base font-semibold text-text-primary dark:text-primary-200">
									{table.columns_count}
								</p>
							</div>
						</div>
					</div>

					{/* Row Count */}
					<div className="bg-surface-hover dark:bg-surface-card border border-border-subtle dark:border-border-input rounded-lg p-4">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<List className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
									<span className="text-sm text-text-secondary dark:text-text-tertiary">Total Rows</span>
								</div>
							<p className="text-base font-semibold text-text-primary dark:text-primary-200">
								{(table.row_count || 0).toLocaleString()}
							</p>
							</div>
						</div>
					</div>

					{/* Created Date */}
					<div className="bg-surface-hover dark:bg-surface-card border border-border-subtle dark:border-border-input rounded-lg p-4">
						<div className="flex items-center gap-2 mb-1">
							<Calendar className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
							<span className="text-sm text-text-secondary dark:text-text-tertiary">Created At</span>
						</div>
						<p className="text-base font-medium text-text-primary dark:text-primary-200">{formatDate(table.createdAt)}</p>
					</div>

					{/* Updated Date */}
					<div className="bg-surface-hover dark:bg-surface-card border border-border-subtle dark:border-border-input rounded-lg p-4">
						<div className="flex items-center gap-2 mb-1">
							<Calendar className="w-4 h-4 text-text-tertiary dark:text-text-tertiary" />
							<span className="text-sm text-text-secondary dark:text-text-tertiary">Updated At</span>
						</div>
						<p className="text-base font-medium text-text-primary dark:text-primary-200">{formatDate(table.updatedAt)}</p>
					</div>
				</div>

				{/* Table Name Copy */}
				<div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900 rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div className="flex-1">
							<span className="text-sm text-primary-700 dark:text-primary-300 block mb-1">Table Name</span>
							<p className="text-base font-mono font-medium text-primary-900 dark:text-primary-200">{table.name || table.table_name}</p>
						</div>
						<button
							onClick={() => handleCopy(table.name || table.table_name, 'Table name')}
							className="p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
							title="Copy table name"
						>
							<Copy className="w-4 h-4 text-primary-600 dark:text-primary-400" />
						</button>
					</div>
				</div>

				{/* Columns List (if available) */}
				{table.columns && table.columns.length > 0 && (
					<div className="bg-surface-hover dark:bg-surface-card border border-border-subtle dark:border-border-input rounded-lg p-4">
						<div className="flex items-center gap-2 mb-3">
							<Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
							<h3 className="text-lg font-semibold text-text-primary dark:text-primary-200">Table Columns</h3>
						</div>
						<div className="space-y-2 max-h-60 overflow-y-auto">
							{table.columns.map((column, index) => (
								<div
									key={column.id}
									className="flex items-center justify-between p-3 bg-white dark:bg-surface-card rounded-lg border border-border-subtle dark:border-border-input"
								>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<span className="font-mono font-medium text-text-primary dark:text-primary-200">
												{column.name}
											</span>
											{column.is_primary_key && (
												<span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded">
													PK
												</span>
											)}
											{column.is_unique && (
												<span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
													UNIQUE
												</span>
											)}
										</div>
										<p className="text-sm text-text-secondary dark:text-text-tertiary mt-1">
											{column.data_type}
											{column.max_length && `(${column.max_length})`}
											{!column.is_nullable && ' • NOT NULL'}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

					{/* Footer Actions */}
					<div className="flex items-center justify-end pt-4 border-t border-border-subtle dark:border-border-input">
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800
								text-white rounded-lg font-medium transition-colors"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</Modal>
	)
}
