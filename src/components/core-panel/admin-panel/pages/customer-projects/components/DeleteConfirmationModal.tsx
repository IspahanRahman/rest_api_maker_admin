'use client'
import React from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import Modal from '@/components/common/Modal'

interface DeleteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    projectName: string
    isDeleting: boolean
	children?: React.ReactNode // <-- Add this line
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    projectName,
    isDeleting
}: DeleteConfirmationModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={isDeleting ? () => { } : onClose}
            title="Delete Project"
            size="md"
        >
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-error-100 dark:bg-error-900/30 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400" />
                    </div>
                    <p className="text-text-primary dark:text-error-200">
                        Are you sure you want to delete <span className="font-semibold">"{projectName}"</span>?
                    </p>
                </div>

                <div className="bg-error-50 dark:bg-error-950/20 border border-error-200 dark:border-error-900 rounded-lg p-4">
                    <p className="text-sm text-error-700 dark:text-error-300 font-medium mb-2">
                        ⚠️ This action cannot be undone!
                    </p>
                    <ul className="text-sm text-error-600 dark:text-error-400 space-y-1 list-disc list-inside">
                        <li>All project data will be permanently deleted</li>
                        <li>Database and tables will be removed</li>
                        <li>API endpoints will be deactivated</li>
                        <li>This cannot be recovered</li>
                    </ul>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 border border-border-input rounded-lg
                            text-text-secondary dark:text-error-300 hover:bg-surface-hover dark:hover:bg-error-900/10
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors font-medium cursor-pointer"
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
                            transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-4 h-4" />
                                Delete Project
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
