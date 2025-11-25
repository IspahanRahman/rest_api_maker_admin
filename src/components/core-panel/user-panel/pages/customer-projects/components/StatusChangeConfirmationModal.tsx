'use client'
import React from 'react'
import { AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import Modal from '@/components/common/Modal'

interface StatusChangeConfirmationModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	projectName: string
	currentStatus: string
	newStatus: string
	isUpdating: boolean
}

export default function StatusChangeConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	projectName,
	currentStatus,
	newStatus,
	isUpdating
}: StatusChangeConfirmationModalProps) {
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'text-success-600 dark:text-success-400'
			case 'inactive':
				return 'text-gray-600 dark:text-gray-400'
			case 'suspended':
				return 'text-error-600 dark:text-error-400'
			default:
				return 'text-gray-600 dark:text-gray-400'
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'active':
				return CheckCircle2
			case 'inactive':
				return XCircle
			default:
				return AlertCircle
		}
	}

	const NewStatusIcon = getStatusIcon(newStatus)

	return (
		<Modal
			isOpen={isOpen}
			onClose={isUpdating ? () => { } : onClose}
			title="Change Project Status"
			size="md"
		>
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
						<AlertCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
					</div>
					<p className="text-text-primary dark:text-primary-200">
						Are you sure you want to change the status of <span className="font-semibold">"{projectName}"</span>?
					</p>
				</div>

				<div className="bg-surface-hover dark:bg-surface-card border border-border-subtle dark:border-border-input rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="text-sm text-text-secondary dark:text-text-tertiary">Current:</span>
							<span className={`text-sm font-semibold capitalize ${getStatusColor(currentStatus)}`}>
								{currentStatus}
							</span>
						</div>
						<span className="text-text-tertiary dark:text-text-tertiary">→</span>
						<div className="flex items-center gap-2">
							<span className="text-sm text-text-secondary dark:text-text-tertiary">New:</span>
							<div className="flex items-center gap-1.5">
								<NewStatusIcon className={`w-4 h-4 ${getStatusColor(newStatus)}`} />
								<span className={`text-sm font-semibold capitalize ${getStatusColor(newStatus)}`}>
									{newStatus}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900 rounded-lg p-4">
					<p className="text-sm text-primary-700 dark:text-primary-300">
						{newStatus === 'active'
							? '✓ The project will be active and all API endpoints will be accessible.'
							: '⚠ The project will be inactive and API endpoints may become inaccessible.'}
					</p>
				</div>

				<div className="flex items-center gap-3 pt-2">
					<button
						type="button"
						onClick={onClose}
						disabled={isUpdating}
						className="flex-1 px-4 py-2.5 border border-border-input rounded-lg
							text-text-secondary dark:text-primary-300 hover:bg-surface-hover dark:hover:bg-primary-900/10
							disabled:opacity-50 disabled:cursor-not-allowed
							transition-colors font-medium cursor-pointer"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isUpdating}
						className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800
							text-white rounded-lg font-medium
							disabled:opacity-50 disabled:cursor-not-allowed
							transition-colors flex items-center justify-center gap-2 cursor-pointer"
					>
						{isUpdating ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								Updating...
							</>
						) : (
							<>
								<NewStatusIcon className="w-4 h-4" />
								Change Status
							</>
						)}
					</button>
				</div>
			</div>
		</Modal>
	)
}
