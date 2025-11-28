'use client'
import React from 'react'
import { Loader2 } from 'lucide-react'
import { useCreateProjectMutation } from '@/apis/mutation/customerProject/useCreateProjectMutation';
import { usePurchasedPackages } from '@/apis/query/adminPackages/useCustomerPackages';
import { toast } from 'react-toastify'
import Modal from '@/components/common/Modal';
import Swal from 'sweetalert2';
import Select from '@/components/common/Select';

interface CreateProjectModalProps {
	isOpen: boolean
	onClose: () => void
	onSuccess: () => void
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
	const { data: purchasedPackages } = usePurchasedPackages();
	//create plan options with packag names
	const planOptions = purchasedPackages?.data?.map((pkg:any) => ({
		value: pkg?.package?.package_plan_id,
		label: `${pkg?.package?.Package?.name} - ${pkg?.package?.PackagePlan?.plan_type}`
	})) || [];

	const { data, setData, submit, isLoading, errors } = useCreateProjectMutation()

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!data.name.trim()) {
			toast.error('Project name is required');
			return;
		}
		if (!data.package_plan_id) {
			toast.error('Please select a package plan');
			return;
		}
		try {
			const response = await submit();
			if (!response?.status) {
				Swal.fire({
					icon: 'error',
					title: 'Creation Failed',
					text: response?.message || 'Project creation failed',
				});
				return;
			}
			toast.success('Project created successfully!');
			onSuccess();
			onClose();
			// Reset form
			setData('name', '');
			setData('description', '');
			setData('package_plan_id', '');
		}
		catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Creation Failed',
				text: 'An unexpected error occurred during project creation.',
			});
		}
	}

	const handleClose = () => {
		if (!isLoading) {
			onClose()
			// Reset form
			setData('name', '');
			setData('description', '');
			setData('package_plan_id', '');
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Create New Project"
			size="md"
			className="max-h-[90vh] overflow-y-auto"
		>
			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Package Plan */}
				{planOptions.length > 0 && (
					<Select
                        id="package_plan_id"
                        label="Select Package Plan"
                        value={data.package_plan_id || ''}
                        onChange={(value) => setData('package_plan_id', value as string)}
                        options={planOptions}
                        placeholder="-- Select a package plan --"
                        disabled={isLoading}
                        error={errors.package_plan_id}
                        required
						className='cursor-pointer'
                    />
				)}
				{/* Project Name */}
				<div>
					<label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
						Project Name <span className="text-error-500">*</span>
					</label>
					<input
						id="name"
						type="text"
						value={data.name}
						onChange={(e) => setData('name', e.target.value)}
						placeholder="Enter project name"
						disabled={isLoading}
						className="w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
							text-foreground placeholder:text-text-tertiary
							focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
							disabled:opacity-50 disabled:cursor-not-allowed
							transition-all"
					/>
					{errors.name && (
						<p className="mt-1.5 text-sm text-error-600 dark:text-error-400">{errors.name}</p>
					)}
				</div>

				{/* Description */}
				<div>
					<label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
						Description
					</label>
					<textarea
						id="description"
						value={data.description}
						onChange={(e) => setData('description', e.target.value)}
						placeholder="Enter project description (optional)"
						rows={4}
						disabled={isLoading}
						className="w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
							text-foreground placeholder:text-text-tertiary
							focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
							disabled:opacity-50 disabled:cursor-not-allowed
							transition-all resize-none"
					/>
					{errors.description && (
						<p className="mt-1.5 text-sm text-error-600 dark:text-error-400">{errors.description}</p>
					)}
				</div>

				{/* Info Message */}
				<div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-lg p-4 flex items-center justify-center gap-2">
					<p className="text-sm text-primary-700 dark:text-primary-300">
						A database and API will be automatically generated for your project upon creation.
					</p>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3 pt-2">
					<button
						type="button"
						onClick={handleClose}
						disabled={isLoading}
						className="flex-1 px-4 py-2.5 border border-border-input rounded-lg
							text-text-secondary hover:bg-surface-hover
							disabled:opacity-50 disabled:cursor-not-allowed
							transition-colors font-medium cursor-pointer"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isLoading}
						className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700
							text-white rounded-lg font-medium
							disabled:opacity-50 disabled:cursor-not-allowed
							transition-colors flex items-center justify-center gap-2 cursor-pointer"
					>
						{isLoading ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								Creating...
							</>
						) : (
							'Create Project'
						)}
					</button>
				</div>
			</form>
		</Modal>
	)
}
