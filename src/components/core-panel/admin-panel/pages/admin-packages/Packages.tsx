'use client';
import React, { useState, useMemo } from 'react';
import { usePackages } from '@/apis/query/adminPackages/useCustomerPackages';
import { useDeletePackageMutation } from '@/apis/mutation/adminPackage/useDeletePackageMutation';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Edit2, Trash2, Plus, Eye, Search, Package, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Modal from '@/components/common/Modal';

export default function Packages() {
	const { data: packagesData, isLoading, error, mutate } = usePackages();
	const [deletePackageId, setDeletePackageId] = useState<string | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const deletePackageMutation = useDeletePackageMutation(deletePackageId ?? '');

	const packages = useMemo(() => packagesData?.data || [], [packagesData]);

	const filteredPackages = useMemo(
		() =>
			packages.filter((pkg: any) =>
				pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
			),
		[packages, searchTerm]
	);

	const stats = useMemo(() => {
		const total = packages.length;
		const active = packages.filter((pkg: any) => pkg.status === 'active').length;
		const inactive = total - active;
		return { total, active, inactive };
	}, [packages]);

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
			setIsDeleteModalOpen(false);
			setDeletePackageId(null);
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Deletion Failed',
				text: 'An error occurred while deleting the package.',
			});
		}
	};

	// Format feature key to readable label
	const formatFeatureLabel = (key: string): string => {
		return key
			.replace(/_/g, ' ')
			.replace(/\b\w/g, c => c.toUpperCase());
	};

	// Format plan type to readable format
	const formatPlanType = (planType: string): string => {
		return planType.replace(/_/g, ' ').toUpperCase();
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh] bg-slate-50/60">
				<div className="text-center">
					<Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
					<p className="text-slate-600 text-sm">Loading packages, please wait...</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="flex items-center justify-center min-h-[60vh] bg-slate-50/60">
				<div className="text-center max-w-sm rounded-2xl border border-red-100 bg-white px-8 py-6 shadow-sm">
					<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
						<Package size={32} />
					</div>
					<h3 className="text-lg font-semibold text-slate-900 mb-2">
						Failed to load packages
					</h3>
					<p className="text-sm text-slate-600 mb-5">
						Unable to load packages at this time. Please check your connection and try again.
					</p>
					<button
						onClick={() => mutate()}
						className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						<Loader2 size={16} className="animate-spin" />
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="min-h-screen bg-slate-50/80">
				<div className="mx-auto max-w-7xl">
					{/* Header */}
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
						<div className="space-y-2">
							<div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
								<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
									<Package className="h-3.5 w-3.5 text-blue-700" />
								</span>
								<span className="text-xs font-medium uppercase tracking-wide text-blue-800">
									Package Management
								</span>
							</div>
							<h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
								Subscription Packages
							</h1>
							<p className="text-sm text-slate-600 max-w-2xl">
								Configure and manage your subscription packages. Adjust limits, features, and
								pricing plans to match your customers&apos; needs.
							</p>
						</div>

						<div className="flex items-center gap-3 flex-wrap">
							{packages.length > 0 && (
								<div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
									<span className="text-sm font-medium text-slate-800">
										{filteredPackages.length} of {packages.length}
									</span>
									<span className="text-xs text-slate-500">packages shown</span>
								</div>
							)}

							<Link
								href="/packages/create"
								className="inline-flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							>
								<Plus size={18} />
								New Package
							</Link>
						</div>
					</div>

					{/* Stats Row */}
					{packages.length > 0 && (
						<div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
							<div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
								<p className="text-xs font-medium uppercase tracking-wide text-slate-500">
									Total Packages
								</p>
								<p className="mt-1 text-2xl font-semibold text-slate-900">
									{stats.total}
								</p>
							</div>
							<div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 shadow-sm">
								<p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
									Active
								</p>
								<p className="mt-1 text-2xl font-semibold text-emerald-900">
									{stats.active}
								</p>
							</div>
							<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
								<p className="text-xs font-medium uppercase tracking-wide text-slate-600">
									Inactive
								</p>
								<p className="mt-1 text-2xl font-semibold text-slate-900">
									{stats.inactive}
								</p>
							</div>
						</div>
					)}

					{/* Search Bar */}
					<div className="mb-6">
						<div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm max-w-xl">
							<div className="relative">
								<div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
									<Search size={18} />
								</div>
								<input
									type="text"
									placeholder="Search packages by name..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
								/>
								{searchTerm && (
									<button
										onClick={() => setSearchTerm('')}
										className="absolute inset-y-0 right-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors text-lg"
									>
										×
									</button>
								)}
							</div>
						</div>
					</div>

					{/* Packages Grid */}
					{filteredPackages.length > 0 ? (
						<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
							{filteredPackages.map((pkg: any) => {
								const features = JSON.parse(pkg.features || '{}');
								const isBeingDeleted =
									deletePackageId === pkg.id && deletePackageMutation.isLoading;

								return (
									<div
										key={pkg.id}
										className={`group flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg ${isBeingDeleted ? 'opacity-50 pointer-events-none' : ''
											}`}
									>
										{/* Card Header */}
										<div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/60 px-6 py-4 rounded-t-2xl">
											<div className="flex items-start justify-between gap-3">
												<div className="flex-1 min-w-0">
													<h2 className="text-lg font-semibold text-slate-900 truncate">
														{pkg.name}
													</h2>
													<p className="mt-1 text-xs text-slate-600">
														<span className="font-semibold text-slate-800">
															{pkg.sell_count}
														</span>{' '}
														active subscriptions
													</p>
												</div>
												<span
													className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${pkg.status === 'active'
															? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
															: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
														}`}
												>
													<span
														className={`h-2 w-2 rounded-full ${pkg.status === 'active'
																? 'bg-emerald-500'
																: 'bg-slate-400'
															}`}
													/>
													{pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
												</span>
											</div>
										</div>

										{/* Card Body */}
										<div className="flex-1 px-6 py-5 space-y-5">
											{/* Specifications */}
											<div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50/90 p-4">
												<div className="text-center">
													<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
														Max Projects
													</p>
													<p className="text-xl font-bold text-slate-900">
														{pkg.max_projects}
													</p>
												</div>
												<div className="text-center">
													<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
														Tables / Project
													</p>
													<p className="text-xl font-bold text-slate-900">
														{pkg.max_tables_per_project}
													</p>
												</div>
											</div>

											{/* Features */}
											{Object.keys(features).length > 0 && (
												<div>
													<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2.5">
														Features
													</p>
													<div className="space-y-2">
														{Object.entries(features).slice(0, 5).map(([key, value]) => (
															<div
																key={key}
																className="flex items-center gap-3 text-sm text-slate-700"
															>
																<div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
																<span className="flex-1">
																	{formatFeatureLabel(key)}
																	{typeof value === 'number' && value > 1
																		? `: ${value}`
																		: ''}
																	{typeof value === 'boolean'
																		? value
																			? ': Yes'
																			: ': No'
																		: ''}
																</span>
															</div>
														))}
														{Object.keys(features).length > 5 && (
															<p className="text-xs text-slate-500 text-center pt-1">
																+{Object.keys(features).length - 5} more features
															</p>
														)}
													</div>
												</div>
											)}

											{/* Pricing Plans */}
											{pkg.PackagePlans?.length > 0 && (
												<div>
													<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2.5">
														Pricing Plans
													</p>
													<div className="space-y-3">
														{pkg.PackagePlans.map((plan: any) => (
															<div
																key={plan.id}
																className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-3"
															>
																<div className="flex flex-col gap-1">
																	<span className="text-sm font-semibold text-slate-800">
																		{formatPlanType(plan.plan_type)}
																	</span>
																	{plan.status === 'active' ? (
																		<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
																			<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
																			Active
																		</span>
																	) : (
																		<span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
																			<span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
																			Inactive
																		</span>
																	)}
																</div>

																<div className="text-right">
																	<p className="text-lg font-bold text-slate-900">
																		${plan.final_price}
																	</p>
																	{plan.discount_value && plan.discount_value > 0 && (
																		<p className="text-xs font-medium text-emerald-600">
																			{`${plan.discount_type === 'fixed'
																					? 'Save $'
																					: 'Save '
																				}${plan.discount_value}${plan.discount_type === 'percentage'
																					? '%'
																					: ''
																				}`}
																		</p>
																	)}
																</div>
															</div>
														))}
													</div>
												</div>
											)}
										</div>

										{/* Card Footer */}
										<div className="flex gap-3 border-t border-slate-200 bg-slate-50/60 px-6 py-4 rounded-b-2xl">
											<Link
												href={`/packages/update/${pkg.id}`}
												className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
											>
												<Edit2 size={16} />
												Edit
											</Link>
											<button
												onClick={() => {
													setDeletePackageId(pkg.id);
													setIsDeleteModalOpen(true);
												}}
												disabled={deletePackageMutation.isLoading}
												className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
											>
												{deletePackageId === pkg.id && deletePackageMutation.isLoading ? (
													<Loader2 size={16} className="animate-spin" />
												) : (
													<Trash2 size={16} />
												)}
												Delete
											</button>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						/* Empty State */
						<div className="text-center py-16">
							<div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
								<Eye size={40} />
							</div>
							<h3 className="text-xl font-semibold text-slate-900 mb-2">
								{searchTerm ? 'No packages found' : 'No packages yet'}
							</h3>
							<p className="text-slate-600 mb-8 max-w-md mx-auto text-sm">
								{searchTerm
									? `No packages match "${searchTerm}". Try adjusting your search terms.`
									: 'Get started by creating your first subscription package to offer to customers.'}
							</p>
							{!searchTerm && (
								<Link
									href="/packages/create"
									className="inline-flex items-center gap-2 rounded-lg bg-blue-800 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								>
									<Plus size={18} />
									Create Your First Package
								</Link>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setDeletePackageId(null);
				}}
			>
				<div className="p-6 text-center">
					<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
						<Trash2 size={32} />
					</div>
					<h3 className="mb-2 text-lg font-semibold text-slate-900">
						Delete Package?
					</h3>
					<p className="mb-6 text-sm text-slate-600">
						Are you sure you want to delete this package? This action cannot be undone.
					</p>
					<div className="flex gap-3 justify-center">
						<button
							type="button"
							className="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors cursor-pointer"
							onClick={() => {
								setIsDeleteModalOpen(false);
								setDeletePackageId(null);
							}}
						>
							Cancel
						</button>
						<button
							type="button"
							className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
							onClick={handleDelete}
							disabled={deletePackageMutation.isLoading}
						>
							{deletePackageMutation.isLoading ? (
								<Loader2 size={16} className="inline mr-2 animate-spin" />
							) : null}
							Delete
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}
