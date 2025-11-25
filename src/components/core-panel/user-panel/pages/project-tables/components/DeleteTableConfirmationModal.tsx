'use client'
import React from 'react'
import { AlertCircle, Loader2, Trash2 } from 'lucide-react'
import Modal from '@/components/common/Modal'

interface DeleteTableConfirmationModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	tableName: string
	isDeleting: boolean
}

export default function DeleteTableConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	tableName,
	isDeleting,
}: DeleteTableConfirmationModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={isDeleting ? () => {} : onClose} title="Delete Table" size="md">
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-error-100 dark:bg-error-900/30 rounded-lg">
						<Trash2 className="w-5 h-5 text-error-600 dark:text-error-400" />
					</div>
					<p className="text-text-primary dark:text-primary-200">
						Are you sure you want to delete the table <span className="font-semibold">"{tableName}"</span>?
					</p>
				</div>

				<div className="bg-error-50 dark:bg-error-950/20 border border-error-200 dark:border-error-900 rounded-lg p-4">
					<p className="text-sm text-error-700 dark:text-error-300 font-medium mb-2">⚠️ This action cannot be undone!</p>
					<ul className="text-sm text-error-600 dark:text-error-400 space-y-1 list-disc list-inside">
						<li>All table data will be permanently deleted</li>
						<li>All rows and columns will be removed</li>
						<li>Table structure cannot be recovered</li>
						<li>API endpoints for this table will be affected</li>
					</ul>
				</div>

				<div className="flex items-center gap-3 pt-2">
					<button
						type="button"
						onClick={onClose}
						disabled={isDeleting}
						className="flex-1 px-4 py-2.5 border border-border-input rounded-lg
                            text-text-secondary dark:text-primary-300 hover:bg-surface-hover dark:hover:bg-primary-900/10
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isDeleting}
						className="flex-1 px-4 py-2.5 bg-error-600 hover:bg-error-700 dark:bg-error-700 dark:hover:bg-error-800
                            text-white rounded-lg font-medium
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors flex items-center justify-center gap-2"
					>
						{isDeleting ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								Deleting...
							</>
						) : (
							<>
								<Trash2 className="w-4 h-4" />
								Delete Table
							</>
						)}
					</button>
				</div>
			</div>
		</Modal>
	)
}
