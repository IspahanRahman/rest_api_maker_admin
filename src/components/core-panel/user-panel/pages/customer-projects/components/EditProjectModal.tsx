'use client'
import React, { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useUpdateProjectMutation } from '@/apis/mutation/customerProject/useUpdateProjectMutation';
import { usePurchasedPackages } from '@/apis/query/customerPackages/useCustomerPackages';
import { toast } from 'react-toastify'
import Modal from '@/components/common/Modal'
import { Project } from '@/types/customer-project';
import Swal from 'sweetalert2';
import Select from '@/components/common/Select';

interface EditProjectModalProps {
	isOpen: boolean
	onClose: () => void
	onSuccess: () => void
	project: Project | null
}

export default function EditProjectModal({ isOpen, onClose, onSuccess, project }: EditProjectModalProps) {
	const { data: purchasedPackages } = usePurchasedPackages();
	//create plan options with package names
	const planOptions = purchasedPackages?.data?.map((pkg:any) => ({
		value: pkg?.package?.package_plan_id,
		label: `${pkg?.package?.Package?.name} - ${pkg?.package?.PackagePlan?.plan_type}`
	})) || [];
	const { data, setData, submit, isLoading, errors } = useUpdateProjectMutation(project?.id ?? "")

	useEffect(() => {
		if (project) {
			setData('name', project.name)
			setData('description', project.description || '');
			setData('package_plan_id', project.package_plan_id);
		}
	}, [project])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!(data.name ?? '').trim()) {
			toast.error('Project name is required');
			return;
		}
		if (!(data.package_plan_id ?? '').trim()) {
			toast.error('Package plan is required');
			return;
		}
		try {
			const response = await submit();
			if (!response?.status) {
				Swal.fire({
					icon: 'error',
					title: 'Update Failed',
					text: response?.message || 'Project update failed',
				});
				return;
			}
			toast.success('Project updated successfully!');
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
				title: 'Update Failed',
				text: 'An unexpected error occurred during project update.',
			});
		}
	}

	const handleClose = () => {
		if (!isLoading) onClose()
	}

	if (!project) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={
				"Edit Project"
			}
			size="md"
			className="max-h-[90vh] overflow-y-auto"
		>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Package Plan */}
				<Select
					label="Package Plan"
					placeholder="Select a package plan"
					options={planOptions}
					value={data.package_plan_id ?? ''}
					onChange={(value) => setData('package_plan_id', value !== undefined ? String(value) : undefined)}
					disabled={isLoading}
					error={errors.package_plan_id}
					required
				/>
				{/* Project Name */}
				<div>
					<label htmlFor="edit-name" className="block text-sm font-medium text-foreground mb-2">
						Project Name <span className="text-error-500">*</span>
					</label>
					<input
						id="edit-name"
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
					<label htmlFor="edit-description" className="block text-sm font-medium text-foreground mb-2">
						Description
					</label>
					<textarea
						id="edit-description"
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

				{/* Database Info (Read-only) */}
				<div className="bg-surface-hover dark:bg-surface-card border border-border-subtle dark:border-border-input rounded-lg p-4">
					<p className="text-sm font-medium text-foreground mb-2">Database Information</p>
					<div className="space-y-1.5 text-sm text-text-secondary">
						<div className="flex justify-between">
							<span>Database Name:</span>
							<span className="font-mono text-foreground">{project.db_name}</span>
						</div>
						{project.db_user && (
							<div className="flex justify-between">
								<span>Database User:</span>
								<span className="font-mono text-foreground">{project.db_user}</span>
							</div>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3 pt-2">
					<button
						type="button"
						onClick={handleClose}
						disabled={isLoading}
						className="flex-1 px-4 py-2.5 border border-border-input rounded-lg
                            text-text-secondary hover:bg-surface-hover dark:hover:bg-surface-card
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
								Updating...
							</>
						) : (
							'Update Project'
						)}
					</button>
				</div>
			</form>
		</Modal>
	)
}
