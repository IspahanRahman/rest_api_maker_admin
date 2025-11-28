'use client'
import React, { useEffect, useState } from 'react';
import { usePackageDetails } from '@/apis/query/adminPackages/useCustomerPackages';
import { useUpdatePackageMutation } from '@/apis/mutation/adminPackage/useUpdatePackageMutation';
import { toast } from 'react-toastify';
import { useRouter, useParams } from 'next/navigation';
import Select from '@/components/common/Select';
import { Loader2, Trash2, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

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

export default function UpdatePackage({ packageId }: { packageId: string }) {
	const router = useRouter();
	const { data, isLoading } = usePackageDetails(packageId);
	const updatePackageMutation = useUpdatePackageMutation(packageId);

	const [formData, setFormData] = useState<any>(null);
	const [featureKey, setFeatureKey] = useState('');
	const [featureValue, setFeatureValue] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (data?.data) {
			const pkg = data.data;
			setFormData({
				name: pkg.name || '',
				status: pkg.status || 'active',
				max_projects: pkg.max_projects || 0,
				max_tables_per_project: pkg.max_tables_per_project || 0,
				features: pkg.features ? JSON.parse(pkg.features) : {},
				plans: pkg.PackagePlans?.map((plan: any) => ({
					id: plan.id,
					plan_type: plan.plan_type,
					duration_days: plan.duration_days,
					price: Number(plan.price),
					discount_type: plan.discount_type,
					discount_value: plan.discount_value ? Number(plan.discount_value) : undefined,
					status: plan.status,
				})) || [],
			});
		}
	}, [data]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev: any) => ({
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
		setFormData((prev: any) => ({
			...prev,
			plans: updatedPlans,
		}));
	};

	const addPlan = () => {
		setFormData((prev: any) => ({
			...prev,
			plans: [
				...prev.plans,
				{
					plan_type: 'monthly',
					duration_days: 30,
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
		setFormData((prev: any) => ({
			...prev,
			plans: prev.plans.filter((_: any, i: number) => i !== index),
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
		if (featureValue === 'true') parsedValue = true;
		else if (featureValue === 'false') parsedValue = false;
		else if (!isNaN(Number(featureValue)) && featureValue.trim() !== '') parsedValue = Number(featureValue);

		setFormData((prev: any) => ({
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
		setFormData((prev: any) => ({
			...prev,
			features: Object.fromEntries(
				Object.entries(prev.features).filter(([k]) => k !== key)
			),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if(!formData.name || formData.name.trim() === '') {
			toast.error('Package name is required');
			return;
		}
		if(formData.max_projects < 1) {
			toast.error('Max projects must be at least 1');
			return;
		}
		if(formData.max_tables_per_project < 1) {
			toast.error('Max tables per project must be at least 1');
			return;
		}
		if(formData.plans.length === 0) {
			toast.error('At least one plan is required');
			return;
		}
		for(const plan of formData.plans) {
			if(plan.price < 0) {
				toast.error('Plan price cannot be negative');
				return;
			}
			if(plan.duration_days < 1) {
				toast.error('Plan duration must be at least 1 day');
				return;
			}
		}

		setIsSubmitting(true);
		try {
			updatePackageMutation.data.name = formData.name;
			updatePackageMutation.data.status = formData.status;
			updatePackageMutation.data.max_projects = formData.max_projects;
			updatePackageMutation.data.max_tables_per_project = formData.max_tables_per_project;
			updatePackageMutation.data.features = formData.features;
			updatePackageMutation.data.plans = formData.plans;
			const result = await updatePackageMutation.submit();
			if(!result.status) {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: result.message || 'Failed to update package',
				});
				return;
			}
			toast.success('Package updated successfully');
			router.push('/packages');
		} catch (error: any) {
			toast.error(error?.message || 'Failed to update package');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading || !formData) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="animate-spin w-8 h-8 text-blue-600" />
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto">
			<div className="mb-4">
				<h1 className="text-3xl font-bold text-gray-900">Update Package</h1>
				<p className="text-gray-600 mt-1">Edit your subscription package details</p>
			</div>
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Basic Information */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Package Name <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
							/>
						</div>
						<div>
							<Select
								label="Status"
								value={formData.status}
								onChange={val => setFormData((prev: any) => ({ ...prev, status: val }))}
								options={STATUS_OPTIONS}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Max Projects <span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								name="max_projects"
								value={formData.max_projects}
								onChange={handleInputChange}
								min="1"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Max Tables per Project <span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								name="max_tables_per_project"
								value={formData.max_tables_per_project}
								onChange={handleInputChange}
								min="1"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
							/>
						</div>
					</div>
				</div>
				{/* Features */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-6">Features</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Feature Name
							</label>
							<input
								type="text"
								value={featureKey}
								onChange={e => setFeatureKey(e.target.value)}
								placeholder="e.g., priority_support"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Feature Value
							</label>
							<input
								type="text"
								value={featureValue}
								onChange={e => setFeatureValue(e.target.value)}
								placeholder="e.g., true or 5"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
					{Object.entries(formData.features).length > 0 && (
						<div className="space-y-2">
							<p className="text-sm font-medium text-gray-700 mb-3">Added Features:</p>
							{Object.entries(formData.features).map(([key, value]) => (
								<div
									key={key}
									className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
								>
									<div>
										<p className="text-sm font-medium text-gray-900">{key}</p>
										<p className="text-xs text-gray-600">
											Value: {typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value)}
										</p>
									</div>
									<button
										type="button"
										onClick={() => removeFeature(key)}
										className="text-red-600 hover:text-red-700 transition-colors"
									>
										<Trash2 size={18} />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
				{/* Plans */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold text-gray-900">Plans <span className="text-red-500">*</span></h2>
						<button
							type="button"
							onClick={addPlan}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
						>
							<Plus size={18} />
							Add Plan
						</button>
					</div>
					<div className="space-y-6">
						{formData.plans.map((plan: any, index: number) => (
							<div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-gray-900">Plan {index + 1}</h3>
									{formData.plans.length > 1 && (
										<button
											type="button"
											onClick={() => removePlan(index)}
											className="text-red-600 hover:text-red-700 transition-colors"
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
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Duration (Days) <span className="text-red-500">*</span>
										</label>
										<input
											type="number"
											value={plan.duration_days}
											onChange={e => handlePlanChange(index, 'duration_days', e.target.value)}
											min="1"
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Price <span className="text-red-500">*</span>
										</label>
										<input
											type="number"
											value={plan.price}
											onChange={e => handlePlanChange(index, 'price', e.target.value)}
											min="0"
											step="0.01"
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Discount Value
										</label>
										<input
											type="number"
											value={plan.discount_value || 0}
											onChange={e => handlePlanChange(index, 'discount_value', e.target.value)}
											min="0"
											step="0.01"
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
						className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
					>
						{isSubmitting ? 'Updating...' : 'Update Package'}
					</button>
				</div>
			</form>
		</div>
	);
}
