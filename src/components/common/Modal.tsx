'use client'

import React, { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils';

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	subTitle?: string
	description?: string
	children?: React.ReactNode
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'max'
	className?: string
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	subTitle,
	children,
	size = 'md',
	className
}) => {
	const handleEscape = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		},
		[onClose]
	)

	useEffect(() => {
		if (isOpen) {
			document.body.classList.add('overflow-hidden')
			window.addEventListener('keydown', handleEscape)
		} else {
			document.body.classList.remove('overflow-hidden')
		}

		return () => {
			window.removeEventListener('keydown', handleEscape)
			document.body.classList.remove('overflow-hidden')
		}
	}, [isOpen, handleEscape])

	if (!isOpen) return null

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<motion.div
					className={cn(
						`
            bg-surface-card
            dark:bg-bg_dark
            rounded-2xl
            shadow-xl
            relative
            ${size === 'sm'
							? 'w-80'
							: size === 'md'
								? 'w-96'
								: size === 'lg'
									? 'w-[32rem]'
									: size === 'xl'
										? 'w-[60vw]'
										: size === 'max'
											? 'w-[70vw] overflow-y-auto'
											: 'w-80'}
            max-h-[90vh]
            border border-border-subtle
            scrollbar-hide
          `,
						className,
					)}
					initial={{ scale: 0.9 }}
					animate={{ scale: 1 }}
					exit={{ scale: 0.9 }}
					transition={{ type: 'spring', stiffness: 200 }}
					onClick={e => e.stopPropagation()}
					role="dialog"
					aria-modal="true"
					tabIndex={-1}
				>
					{/* Modal Header */}
					<div className="flex justify-between items-center px-4 pt-4">
						{title && (
							<div>
								<h2 className="text-lg font-bold text-text-primary-sem">
									{title}
								</h2>
								{subTitle && (
									<p className="text-sm text-text-secondary">
										{/* keep your existing subtitle behavior if you want */}
										Payslip for the duration {subTitle}
									</p>
								)}
							</div>
						)}
						<button
							onClick={onClose}
							aria-label="Close modal"
							className="p-2 rounded-full bg-surface-input hover:bg-surface-hover border border-border-subtle dark:bg-bg_dark dark:hover:bg-bg_secondary transition-colors duration-500 cursor-pointer"
						>
							<X className="w-5 h-5 text-foreground  hover:text-error-500 transition-colors duration-500" />
						</button>
					</div>

					<hr className="my-2 border-border-subtle" />

					{/* Modal Content */}
					<div className="px-4 pb-4">
						{children}
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}

export default Modal
