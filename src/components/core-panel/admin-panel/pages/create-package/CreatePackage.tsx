'use client';
import React, { useState } from 'react';
import { useCreatePackageMutation } from '@/apis/mutation/adminPackage/useCreatePackageMutation';
import { toast } from 'react-toastify';
import Select from '@/components/common/Select';
import Swal from 'sweetalert2';
import { Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Plan {
	plan_type: 'monthly' | 'yearly' | 'quarterly' | 'half-yearly';
	duration_days: number;
	price: number;
	discount_type?: 'percentage' | 'fixed';
	discount_value?: number;
	status: 'active' | 'inactive';
}

interface CreatePackageRequest {
	name: string;
	status: 'active' | 'inactive';
	max_projects: number;
	max_tables_per_project: number;
	features: Record<string, any>;
	plans: Plan[];
}

const PLAN_TYPE_OPTIONS = [
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'quarterly', label: 'Quarterly' },
	{ value: 'half-yearly', label: 'Half-Yearly' },
	{ value: 'yearly', label: 'Yearly' },
];

const STATUS_OPTIONS = [
	{ value: 'active', label: 'Active' },
	{ value: 'inactive', label: 'Inactive' },
];

const DISCOUNT_TYPE_OPTIONS = [
	{ value: 'percentage', label: 'Percentage' },
	{ value: 'fixed', label: 'Fixed' },
];

export default function CreatePackage() {
	const router = useRouter();
	const createPackageMutation = useCreatePackageMutation();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [formData, setFormData] = useState<CreatePackageRequest>({
		name: '',
		status: 'active',
		max_projects: 0,
		max_tables_per_project: 0,
		features: {},
		plans: [
			{
				plan_type: 'monthly',
				duration_days: 30,
				price: 0,
				discount_type: 'percentage',
				discount_value: 0,
				status: 'active',
			},
		],
	});

	const [featureKey, setFeatureKey] = useState('');
	const [featureValue, setFeatureValue] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: name === 'name' || name === 'status' ? value : Number(value),
		}));
	};

	const handlePlanChange = (index: number, field: string, value: any) => {
		const updatedPlans = [...formData.plans];
		updatedPlans[index] = {
			...updatedPlans[index],
			[field]: field === 'plan_type' || field === 'discount_type' || field === 'status' ? value : Number(value),
		};
		setFormData(prev => ({
			...prev,
			plans: updatedPlans,
		}));
	};

	const addPlan = () => {
		setFormData(prev => ({
			...prev,
			plans: [
				...prev.plans,
				{
					plan_type: 'yearly',
					duration_days: 365,
					price: 0,
					discount_type: 'percentage',
					discount_value: 0,
					status: 'active',
				},
			],
		}));
	};

	const removePlan = (index: number) => {
		if (formData.plans.length === 1) {
			toast.error('At least one plan is required');
			return;
		}
		setFormData(prev => ({
			...prev,
			plans: prev.plans.filter((_, i) => i !== index),
		}));
	};

	const addFeature = () => {
		if (!featureKey || featureKey.trim() === '') {
			toast.error('Feature name is required');
			return;
		}
		if (featureValue === '') {
			toast.error('Feature value is required');
			return;
		}
		let parsedValue: any = featureValue;
		if (featureValue.toLowerCase() === 'true') {
			parsedValue = true;
		} else if (featureValue.toLowerCase() === 'false') {
			parsedValue = false;
		} else if (!isNaN(Number(featureValue))) {
			parsedValue = Number(featureValue);
		}
		setFormData(prev => ({
			...prev,
			features: {
				...prev.features,
				[featureKey]: parsedValue,
			},
		}));
		setFeatureKey('');
		setFeatureValue('');
	};

	const removeFeature = (key: string) => {
		setFormData(prev => ({
			...prev,
			features: Object.fromEntries(
				Object.entries(prev.features).filter(([k]) => k !== key)
			),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name.trim()) {
			toast.error('Package name is required');
			return;
		}

		if (formData.max_projects < 1) {
			toast.error('Max projects must be at least 1');
			return;
		}

		if (formData.max_tables_per_project < 1) {
			toast.error('Max tables per project must be at least 1');
			return;
		}

		if (formData.plans.length === 0) {
			toast.error('At least one plan is required');
			return;
		}

		for (const plan of formData.plans) {
			if (plan.price < 0) {
				toast.error('Plan price cannot be negative');
				return;
			}
			if (plan.duration_days < 1) {
				toast.error('Plan duration must be at least 1 day');
				return;
			}
		}

		setIsSubmitting(true);
		try {
			createPackageMutation.data.name = formData.name;
			createPackageMutation.data.status = formData.status;
			createPackageMutation.data.max_projects = formData.max_projects;
			createPackageMutation.data.max_tables_per_project = formData.max_tables_per_project;
			createPackageMutation.data.features = formData.features;
			createPackageMutation.data.plans = formData.plans;

			const result = await createPackageMutation.submit();

			if (result?.status) {
				toast.success('Package created successfully');
				router.push('/packages');
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Creation Failed',
					text: result?.message || 'Package creation failed',
				});
			}
		} catch (error: any) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: error?.message || 'An error occurred while creating the package',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-6xl mx-auto">
			{/* Header */}
			<div className="mb-4">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create New Package</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-1">Set up a new subscription package with plans and features</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Basic Information */}
				<div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Basic Information</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Package Name <span className="text-error-500">*</span>
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="e.g., Professional Plan"
								className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
							/>
						</div>

						<div>
							<Select
								label="Status"
								value={formData.status}
								onChange={val => setFormData(prev => ({ ...prev, status: val as 'active' | 'inactive' }))}
								options={STATUS_OPTIONS}
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Max Projects <span className="text-error-500">*</span>
							</label>
							<input
								type="number"
								name="max_projects"
								value={formData.max_projects}
								onChange={handleInputChange}
								placeholder="10"
								min="1"
								className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Max Tables per Project <span className="text-error-500">*</span>
							</label>
							<input
								type="number"
								name="max_tables_per_project"
								value={formData.max_tables_per_project}
								onChange={handleInputChange}
								placeholder="50"
								min="1"
								className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
							/>
						</div>
					</div>
				</div>

				{/* Features */}
				<div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Features</h2>

					{/* Add Feature */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Feature Name
							</label>
							<input
								type="text"
								value={featureKey}
								onChange={e => setFeatureKey(e.target.value)}
								placeholder="e.g., priority_support"
								className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Feature Value
							</label>
							<input
								type="text"
								value={featureValue}
								onChange={e => setFeatureValue(e.target.value)}
								placeholder="e.g., true or 5"
								className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div className="flex items-end">
							<button
								type="button"
								onClick={addFeature}
								className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
							>
								Add Feature
							</button>
						</div>
					</div>

					{/* Features List */}
					{Object.entries(formData.features).length > 0 && (
						<div className="space-y-2">
							<p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Added Features:</p>
							{Object.entries(formData.features).map(([key, value]) => (
								<div
									key={key}
									className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700"
								>
									<div>
										<p className="text-sm font-medium text-gray-900 dark:text-gray-100">{key}</p>
										<p className="text-xs text-gray-600 dark:text-gray-400">
											Value: {typeof value === 'boolean' ? (value ? 'true' : 'false') : value}
										</p>
									</div>
									<button
										type="button"
										onClick={() => removeFeature(key)}
										className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
									>
										<Trash2 size={18} />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Plans */}
				<div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Plans <span className="text-error-500">*</span></h2>
						<button
							type="button"
							onClick={addPlan}
							className="flex items-center gap-2 px-4 py-2 bg-blue-800 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-900 dark:hover:bg-blue-900 transition-colors text-sm font-medium"
						>
							<Plus size={18} />
							Add Plan
						</button>
					</div>

					<div className="space-y-6">
						{formData.plans.map((plan, index) => (
							<div key={index} className="border border-gray-200 dark:border-slate-700 rounded-lg p-6 bg-gray-50 dark:bg-slate-800">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Plan {index + 1}</h3>
									{formData.plans.length > 1 && (
										<button
											type="button"
											onClick={() => removePlan(index)}
											className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
										>
											<Trash2 size={20} />
										</button>
									)}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									<div>
										<Select
											label="Plan Type"
											value={plan.plan_type}
											onChange={val => handlePlanChange(index, 'plan_type', val)}
											options={PLAN_TYPE_OPTIONS}
											required
											className=""
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Duration (Days) <span className="text-error-500">*</span>
										</label>
										<input
											type="number"
											value={plan.duration_days}
											onChange={e => handlePlanChange(index, 'duration_days', e.target.value)}
											min="1"
											className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											required
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Price <span className="text-error-500">*</span>
										</label>
										<input
											type="number"
											value={plan.price}
											onChange={e => handlePlanChange(index, 'price', e.target.value)}
											min="0"
											step="0.01"
											className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											required
										/>
									</div>

									<div>
										<Select
											label="Discount Type"
											value={plan.discount_type || 'percentage'}
											onChange={val => handlePlanChange(index, 'discount_type', val)}
											options={DISCOUNT_TYPE_OPTIONS}
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Discount Value
										</label>
										<input
											type="number"
											value={plan.discount_value || 0}
											onChange={e => handlePlanChange(index, 'discount_value', e.target.value)}
											min="0"
											step="0.01"
											className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>

									<div>
										<Select
											label="Status"
											value={plan.status}
											onChange={val => handlePlanChange(index, 'status', val)}
											options={STATUS_OPTIONS}
											required
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Submit Button */}
				<div className="flex gap-4 justify-end">
					<button
						type="button"
						onClick={() => router.back()}
						className="px-6 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-6 py-2 bg-blue-800 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-900 dark:hover:bg-blue-900 transition-colors font-medium disabled:opacity-50"
					>
						{isSubmitting ? 'Creating...' : 'Create Package'}
					</button>
				</div>
			</form>
		</div>
	);
}
