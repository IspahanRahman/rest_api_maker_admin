'use client';
import React, { useState } from 'react';
import { usePackages } from '@/apis/query/customerPackages/useCustomerPackages';
import { useDeletePackageMutation } from '@/apis/mutation/adminPackage/useDeletePackageMutation';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Edit2, Trash2, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import Modal from '@/components/common/Modal';

export default function Packages() {
	const { data: packagesData, isLoading, mutate } = usePackages();
	const [deletePackageId, setDeletePackageId] = useState<string | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const deletePackageMutation = useDeletePackageMutation(deletePackageId ?? '');
	const [searchTerm, setSearchTerm] = useState('');

	const packages = packagesData?.data || [];

	const filteredPackages = packages.filter((pkg: any) =>
		pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
	);
	const handleDelete = async () => {
		try {
			const result = await deletePackageMutation.submit();
			if (!result?.status) {
				Swal.fire({
					icon: 'error',
					title: 'Deletion Failed',
					text: result?.message || 'Package deletion failed',
				});
				return;
			}
			toast.success('Package deleted successfully');
			mutate();
			setDeleteModalOpen(false);
			setDeletePackageId(null);
		}
		catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Deletion Failed',
				text: 'An error occurred while deleting the package.',
			});
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Packages</h1>
					<p className="text-gray-600 mt-1">Manage your subscription packages</p>
				</div>
				<Link
					href="/admin/packages/create"
					className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus size={20} />
					New Package
				</Link>
			</div>

			{/* Search Bar */}
			<div className="mb-6">
				<input
					type="text"
					placeholder="Search packages..."
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>

			{/* Packages Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredPackages.map((pkg: any) => {
					const features = JSON.parse(pkg.features);
					return (
						<div
							key={pkg.id}
							className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
						>
							{/* Card Header */}
							<div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
								<div className="flex items-start justify-between mb-2">
									<h2 className="text-xl font-bold text-gray-900">{pkg.name}</h2>
									<span
										className={`px-3 py-1 rounded-full text-xs font-semibold ${pkg.status === 'active'
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'
											}`}
									>
										{pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
									</span>
								</div>
								<p className="text-sm text-gray-600">
									<strong>{pkg.sell_count}</strong> active subscriptions
								</p>
							</div>

							{/* Card Body */}
							<div className="px-6 py-4 space-y-4">
								{/* Specs */}
								<div className="space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-sm">Max Projects</span>
										<span className="font-semibold text-gray-900">{pkg.max_projects}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-sm">Tables per Project</span>
										<span className="font-semibold text-gray-900">{pkg.max_tables_per_project}</span>
									</div>
								</div>

								{/* Features */}
								<div className="border-t border-gray-200 pt-4">
									<p className="text-xs font-semibold text-gray-700 mb-3 uppercase">Features</p>
									<div className="space-y-2">
										{Object.entries(features).map(([key, value]) => (
											<div key={key} className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
												<span className="text-sm text-gray-700">
													{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}
													{typeof value === 'number' && value > 1 ? `: ${value}` : ''}
												</span>
											</div>
										))}
									</div>
								</div>

								{/* Plans */}
								<div className="border-t border-gray-200 pt-4">
									<p className="text-xs font-semibold text-gray-700 mb-3 uppercase">Plans</p>
									<div className="space-y-2">
										{pkg.PackagePlans.map((plan: any) => (
											<div key={plan.id} className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg">
												<span className="text-sm text-gray-700 font-medium">
													{plan.plan_type.replace(/_/g, ' ').toUpperCase()}
												</span>
												<div className="text-right">
													<p className="text-sm font-bold text-gray-900">${plan.final_price}</p>
													{plan.discount_value && (
														<p className="text-xs text-green-600">
															Save {plan.discount_value}%
														</p>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Card Footer */}
							<div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-2">
								<Link
									href={`/admin/packages/${pkg.id}`}
									className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
								>
									<Edit2 size={16} />
									Edit
								</Link>
								<button
									onClick={() => {
										setDeletePackageId(pkg.id);
										setDeleteModalOpen(true);
									}}
									disabled={deletePackageMutation.isLoading}
									className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
								>
									<Trash2 size={16} />
									Delete
								</button>
							</div>
						</div>
					);
				})}
			</div>

			{/* Empty State */}
			{filteredPackages.length === 0 && (
				<div className="text-center py-12">
					<div className="text-gray-400 mb-4">
						<Eye size={48} className="mx-auto" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
					<p className="text-gray-600 mb-6">
						{searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating a new package'}
					</p>
					{!searchTerm && (
						<Link
							href="/admin/packages/create"
							className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
						>
							<Plus size={20} />
							Create Package
						</Link>
					)}
				</div>
			)}
		</div>
	);
}
