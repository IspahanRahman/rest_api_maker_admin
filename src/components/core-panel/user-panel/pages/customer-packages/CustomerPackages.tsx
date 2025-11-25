'use client'
import React, { useState } from 'react'
import { usePackages, usePurchasedPackages } from '@/apis/query/customerPackages/useCustomerPackages'
import {
	Package,
	Check,
	X,
	Zap,
	Crown,
	Rocket,
	Sparkles,
	ArrowRight,
	Star,
	TrendingUp,
	Shield,
	Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'react-toastify';
import { PlanTerm, PackagePlan, PackageType } from '@/types/customer-package';
import { useBuyPackageMutation } from '@/apis/mutation/customerPackage/useBuyPackageMutation';
import Modal from '@/components/common/Modal';
import Swal from 'sweetalert2';

/** ---------- Utils: normalize API ---------- */
// features comes as stringified JSON, sometimes double-encoded
function safeParseFeatures(input: unknown): Record<string, any> | undefined {
	if (typeof input !== 'string') return undefined
	try {
		const once = JSON.parse(input)
		if (typeof once === 'string') {
			return JSON.parse(once)
		}
		return once
	} catch {
		try {
			return JSON.parse(input)
		} catch {
			return undefined
		}
	}
}

function derivePlanTerm(plan: {
	plan_type?: string
	duration_days?: number
}): PlanTerm {
	const t = (plan.plan_type || '').toLowerCase()
	const days = Number(plan.duration_days || 0)

	if (t === 'monthly') return 'monthly'
	if (t === 'quarterly' || t === '3_months' || t === '3months') return 'quarterly'
	if (t === 'half_yearly' || t === '6_months' || t === '6months')
		return 'half_yearly'
	if (t === 'yearly' || t === 'annual' || t === 'annually') return 'yearly'

	// Fallback: infer from duration_days
	if (days >= 25 && days <= 35) return 'monthly'
	if (days >= 80 && days <= 100) return 'quarterly'
	if (days >= 170 && days <= 190) return 'half_yearly'
	if (days >= 350 && days <= 380) return 'yearly'

	return 'custom'
}

function normalizePackages(apiData: any[]): PackageType[] {
	return (apiData || []).map((p: any) => {
		const plans: PackagePlan[] = Array.isArray(p.PackagePlans)
			? p.PackagePlans.map((plan: any) => {
				const duration = Number(plan.duration_days ?? 0)
				const price =
					typeof plan.price === 'number'
						? plan.price
						: parseFloat(plan.price ?? '0')
				const finalPrice =
					typeof plan.final_price === 'number'
						? plan.final_price
						: parseFloat(plan.final_price ?? plan.price ?? '0')

				const basePlan = {
					id: String(plan.id),
					plan_type: String(plan.plan_type ?? ''),
					duration_days: duration,
					price,
					discount_type: plan.discount_type ?? undefined,
					discount_value:
						plan.discount_value != null ? Number(plan.discount_value) : undefined,
					final_price: finalPrice,
					status: plan.status,
				}

				return {
					...basePlan,
					term: derivePlanTerm(basePlan),
				}
			})
			: []

		return {
			id: p.id != null ? String(p.id) : '',
			name: String(p.name ?? 'Package'),
			status: p.status ? String(p.status) : undefined,
			sell_count: p.sell_count != null ? Number(p.sell_count) : undefined,
			max_projects: Number(p.max_projects ?? 0),
			max_tables_per_project: Number(p.max_tables_per_project ?? 0),
			features: safeParseFeatures(p.features),
			plans,
		}
	})
}

export default function CustomerPackages() {
	const { data: packages, isLoading, error, mutate } = usePackages()
	const { data: purchasedPackages, isLoading: isLoadingPurchased, error: errorPurchased, mutate: mutatePurchased } = usePurchasedPackages();

	const [selectedTerm, setSelectedTerm] = useState<PlanTerm>('monthly')
	// will hold the *plan* id that is being purchased
	const [processingId, setProcessingId] = useState<string | null>(null)

	const {
		submit,
		data,
		setData,
		isLoading: isBuying,
	} = useBuyPackageMutation();
	// NEW: confirmation modal data
	type ConfirmData = {
		planId: string
		packageName: string
		price: number
		unitLabel: string
	} | null

	const [confirmData, setConfirmData] = useState<ConfirmData>(null);

	const handlePurchase = async (planId?: string) => {
		if (!planId) {
			toast.error('No valid plan found for this package')
			return
		}
		try {
			setProcessingId(planId)
			data.package_plan_id = String(planId);
			const result = await submit();
			if (!result?.status) {
				Swal.fire({
					icon: 'error',
					title: 'Purchase Failed',
					text: result?.message || 'Failed to purchase package',
				});
				return;
			}
			toast.success('Package purchased successfully!');
			mutate();
			mutatePurchased();
		} catch (err) {
			console.error(err)
			toast.error('Failed to purchase package')
		} finally {
			setProcessingId(null)
		}
	}

	const getPackageIcon = (index: number) => {
		const icons = [
			Package,
			Zap,
			Crown,
			Rocket,
			Sparkles,
			Star,
			Shield,
			TrendingUp,
			Check,
			Clock,
			X,
			ArrowRight,
		]
		return icons[index % icons.length]
	}

	const getPackageColor = (index: number) => {
		const colors = [
			{
				bg: 'bg-blue-100 dark:bg-blue-900/30',
				text: 'text-blue-600 dark:text-blue-400',
				border: 'border-blue-500',
				button: 'bg-blue-500 hover:bg-blue-600',
				gradient: 'from-blue-500 to-blue-600',
			},
			{
				bg: 'bg-purple-100 dark:bg-purple-900/30',
				text: 'text-purple-600 dark:text-purple-400',
				border: 'border-purple-500',
				button: 'bg-purple-500 hover:bg-purple-600',
				gradient: 'from-purple-500 to-purple-600',
			},
			{
				bg: 'bg-orange-100 dark:bg-orange-900/30',
				text: 'text-orange-600 dark:text-orange-400',
				border: 'border-orange-500',
				button: 'bg-orange-500 hover:bg-orange-600',
				gradient: 'from-orange-500 to-orange-600',
			},
			{
				bg: 'bg-green-100 dark:bg-green-900/30',
				text: 'text-green-600 dark:text-green-400',
				border: 'border-green-500',
				button: 'bg-green-500 hover:bg-green-600',
				gradient: 'from-green-500 to-green-600',
			},
			{
				bg: 'bg-pink-100 dark:bg-pink-900/30',
				text: 'text-pink-600 dark:text-pink-400',
				border: 'border-pink-500',
				button: 'bg-pink-500 hover:bg-pink-600',
				gradient: 'from-pink-500 to-pink-600',
			},
			{
				bg: 'bg-indigo-100 dark:bg-indigo-900/30',
				text: 'text-indigo-600 dark:text-indigo-400',
				border: 'border-indigo-500',
				button: 'bg-indigo-500 hover:bg-indigo-600',
				gradient: 'from-indigo-500 to-indigo-600',
			},
			{
				bg: 'bg-teal-100 dark:bg-teal-900/30',
				text: 'text-teal-600 dark:text-teal-400',
				border: 'border-teal-500',
				button: 'bg-teal-500 hover:bg-teal-600',
				gradient: 'from-teal-500 to-teal-600',
			},
			{
				bg: 'bg-rose-100 dark:bg-rose-900/30',
				text: 'text-rose-600 dark:text-rose-400',
				border: 'border-rose-500',
				button: 'bg-rose-500 hover:bg-rose-600',
				gradient: 'from-rose-500 to-rose-600',
			},
			{
				bg: 'bg-cyan-100 dark:bg-cyan-900/30',
				text: 'text-cyan-600 dark:text-cyan-400',
				border: 'border-cyan-500',
				button: 'bg-cyan-500 hover:bg-cyan-600',
				gradient: 'from-cyan-500 to-cyan-600',
			},
			{
				bg: 'bg-amber-100 dark:bg-amber-900/30',
				text: 'text-amber-600 dark:text-amber-400',
				border: 'border-amber-500',
				button: 'bg-amber-500 hover:bg-amber-600',
				gradient: 'from-amber-500 to-amber-600',
			},
			{
				bg: 'bg-emerald-100 dark:bg-emerald-900/30',
				text: 'text-emerald-600 dark:text-emerald-400',
				border: 'border-emerald-500',
				button: 'bg-emerald-500 hover:bg-emerald-600',
				gradient: 'from-emerald-500 to-emerald-600',
			},
			{
				bg: 'bg-violet-100 dark:bg-violet-900/30',
				text: 'text-violet-600 dark:text-violet-400',
				border: 'border-violet-500',
				button: 'bg-violet-500 hover:bg-violet-600',
				gradient: 'from-violet-500 to-violet-600',
			},
		]
		return colors[index % colors.length]
	}

	if (isLoading) {
		return (
			<div className="space-y-8">
				<div className="animate-pulse">
					<div className="h-12 bg-surface-card rounded w-1/3 mb-4" />
					<div className="h-6 bg-surface-card rounded w-1/2" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3].map(i => (
						<div key={i} className="h-96 bg-surface-card rounded-2xl animate-pulse" />
					))}
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<div className="p-4 rounded-full bg-error-100 dark:bg-error-900/30 mb-4">
					<X className="w-12 h-12 text-error-500" />
				</div>
				<h2 className="text-2xl font-bold text-text-primary-sem mb-2">
					Failed to Load Packages
				</h2>
				<p className="text-text-secondary mb-6">Please try again later</p>
				<button
					onClick={() => window.location.reload()}
					className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
				>
					Retry
				</button>
			</div>
		)
	}

	// ---- Normalize here ----
	const raw = (packages as any)?.data ?? packages ?? []
	const packageData: PackageType[] = normalizePackages(raw)

	// ---- Normalize purchased packages ----
	const purchasedRaw = (purchasedPackages as any)?.data ?? purchasedPackages ?? []

	const purchasedPlanIds = new Set<string>()
	const purchasedPackageIds = new Set<string>()
	const remainingDaysByPlanId = new Map<string, number>()

	purchasedRaw?.forEach((item: any) => {
		const pkgObj = item.package ?? item
		if (!pkgObj) return

		const planObj = pkgObj.PackagePlan ?? pkgObj.packagePlan ?? {}
		const planId = pkgObj.package_plan_id ?? planObj.id
		const pkgId = pkgObj.package_id ?? pkgObj.Package?.id

		if (planId) {
			purchasedPlanIds.add(planId)
			if (item.remaining_days != null) {
				remainingDaysByPlanId.set(planId, Number(item.remaining_days))
			}
		}

		if (pkgId) {
			purchasedPackageIds.add(pkgId)
		}
	})

	const allTerms: PlanTerm[] = ['monthly', 'quarterly', 'half_yearly', 'yearly']
	const availableTerms: PlanTerm[] = allTerms.filter(term =>
		packageData.some(pkg => pkg.plans.some(pl => pl.term === term)),
	)

	// find package with max sell_count
	const maxSellCount = packageData.reduce(
		(max, pkg) => Math.max(max, pkg.sell_count ?? 0),
		0,
	)
	const popularPackageId =
		packageData.find(pkg => (pkg.sell_count ?? 0) === maxSellCount)?.id ?? null

	// label for /month, /3 months, /6 months, /year
	const unitLabel =
		selectedTerm === 'monthly'
			? 'month'
			: selectedTerm === 'quarterly'
				? '3 months'
				: selectedTerm === 'half_yearly'
					? '6 months'
					: 'year'

	return (
		<>
			<div className="space-y-8">
				{/* Header */}
				<div className="text-center max-w-3xl mx-auto">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4">
						<Sparkles className="w-4 h-4" />
						Pricing Plans
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-text-primary-sem mb-4">
						Choose Your Perfect Plan
					</h1>
					<p className="text-lg text-text-secondary">
						Select the package that best fits your needs. Upgrade or downgrade
						anytime.
					</p>
				</div>

				{/* Period / Term Toggle */}
				<div className="flex justify-center">
					<div className="inline-flex items-center gap-2 p-1 bg-surface-card rounded-lg border border-border-subtle">
						{availableTerms.map(term => {
							const label =
								term === 'monthly'
									? 'Monthly'
									: term === 'quarterly'
										? 'Quarterly'
										: term === 'half_yearly'
											? 'Half-Yearly'
											: 'Yearly'

							return (
								<button
									key={term}
									onClick={() => setSelectedTerm(term)}
									className={cn(
										'px-4 py-2 rounded-md text-sm font-medium transition-all',
										selectedTerm === term
											? 'bg-primary-500 text-white shadow-sm'
											: 'text-text-secondary hover:text-text-primary-sem',
									)}
								>
									{label}
								</button>
							)
						})}
					</div>
				</div>

				{/* Packages Grid */}
				{packageData.length === 0 ? (
					<div className="flex flex-col items-center justify-center min-h-[40vh]">
						<div className="p-4 rounded-full bg-surface-card mb-4">
							<Package className="w-12 h-12 text-text-secondary opacity-50" />
						</div>
						<h2 className="text-xl font-semibold text-text-primary-sem mb-2">
							No Packages Available
						</h2>
						<p className="text-text-secondary">Check back later for new packages</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
						{packageData.map((pkg, index) => {
							const IconComponent = getPackageIcon(index)
							const colors = getPackageColor(index)
							const isPopular = popularPackageId != null && pkg.id === popularPackageId

							// find plan by selectedTerm
							const planByTerm = pkg.plans.find(pl => pl.term === selectedTerm)

							// useful fallbacks
							const monthlyPlan = pkg.plans.find(pl => pl.term === 'monthly')
							const yearlyPlan = pkg.plans.find(pl => pl.term === 'yearly')
							const fallbackPlan = pkg.plans[0]

							// priority: selectedTerm -> monthly -> yearly -> first
							const activePlan = planByTerm || monthlyPlan || yearlyPlan || fallbackPlan

							const rawPrice =
								activePlan?.price ??
								activePlan?.final_price ??
								fallbackPlan?.price ??
								fallbackPlan?.final_price ??
								0

							const finalPrice =
								activePlan?.final_price ?? activePlan?.price ?? 0

							const durationDays =
								activePlan?.duration_days ?? fallbackPlan?.duration_days ?? 0

							let discountText: string | null = null
							if (
								activePlan?.discount_type === 'percentage' &&
								activePlan.discount_value
							) {
								discountText = `Save ${activePlan.discount_value}%`
							} else if (
								activePlan?.discount_type === 'fixed' &&
								activePlan.discount_value
							) {
								discountText = `Save $${activePlan.discount_value}`
							}

							const isPurchasing = processingId === activePlan?.id

							// Purchased info
							const packagePurchased = purchasedPackageIds.has(pkg.id)
							const activePlanPurchased =
								!!activePlan && purchasedPlanIds.has(activePlan.id)
							const remainingDays = activePlan
								? remainingDaysByPlanId.get(activePlan.id)
								: undefined

							return (
								<div
									key={pkg.id}
									className={cn(
										'relative bg-surface-card rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
										isPopular
											? `${colors.border} shadow-lg`
											: 'border-border-subtle hover:border-primary-500',
									)}
								>
									{isPopular && (
										<div
											className={cn(
												'absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-linear-to-r text-white text-sm font-semibold rounded-full shadow-lg flex items-center gap-1',
												colors.gradient,
											)}
										>
											<Star className="w-4 h-4 fill-current" />
											Most Popular
										</div>
									)}

									<div className="p-6 md:p-8">
										{/* Icon */}
										<div className={cn('inline-flex p-3 rounded-xl mb-4', colors.bg)}>
											<IconComponent className={cn('w-6 h-6', colors.text)} />
										</div>

										{/* Name + status */}
										<div className="flex items-center justify-between gap-2 mb-2">
											<div className="flex items-center gap-2">
												<h3 className="text-2xl font-bold text-text-primary-sem">
													{pkg.name}
												</h3>

												{packagePurchased && (
													<span className="text-xs px-2 py-0.5 rounded-full bg-success-50 text-success-700 border border-success-200 dark:bg-success-900/20 dark:text-success-300 dark:border-success-700/60">
														Purchased
													</span>
												)}
											</div>

											{pkg.status && (
												<span
													className={cn(
														'text-xs px-2 py-1 rounded-full border',
														pkg.status === 'active'
															? 'bg-success-50 text-success-600 border-success-200 dark:bg-success-900/20 dark:text-success-300 dark:border-success-700/60'
															: 'bg-surface-card text-text-secondary border-border-subtle',
													)}
												>
													{pkg.status}
												</span>
											)}
										</div>

										{/* Optional sell count */}
										{typeof pkg.sell_count === 'number' && (
											<p className="text-xs text-text-secondary mb-2">
												{pkg.sell_count} user
												{pkg.sell_count === 1 ? '' : 's'} already purchased
											</p>
										)}

										{/* Price */}
										<div className="mb-6">
											<div className="flex items-baseline gap-2">
												<span className="text-4xl font-bold text-text-primary-sem">
													${finalPrice.toFixed(2)}
												</span>
												<span className="text-text-secondary">/{unitLabel}</span>
												{discountText && rawPrice > finalPrice && (
													<span className="text-xs text-text-secondary line-through ml-2">
														${rawPrice.toFixed(2)}
													</span>
												)}
											</div>
											{discountText && (
												<p className="text-sm text-success-500 font-medium mt-1">
													{discountText}
												</p>
											)}

											{activePlanPurchased && remainingDays != null && (
												<p className="text-xs text-success-600 dark:text-success-400 mt-1">
													Active – {remainingDays} day
													{remainingDays === 1 ? '' : 's'} remaining
												</p>
											)}
										</div>

										{/* Features */}
										<ul className="space-y-3 mb-8">
											{/* Standard Features */}
											<li className="flex items-start gap-3">
												<div className="p-0.5 rounded-full bg-success-100 dark:bg-success-900/30 mt-0.5 shrink-0">
													<Check className="w-4 h-4 text-success-600 dark:text-success-400" />
												</div>
												<span className="text-sm text-text-secondary">
													<span className="font-semibold text-text-primary-sem">
														{pkg.max_projects}
													</span>{' '}
													{pkg.max_projects === 1 ? 'Project' : 'Projects'}
												</span>
											</li>

											<li className="flex items-start gap-3">
												<div className="p-0.5 rounded-full bg-success-100 dark:bg-success-900/30 mt-0.5 shrink-0">
													<Check className="w-4 h-4 text-success-600 dark:text-success-400" />
												</div>
												<span className="text-sm text-text-secondary">
													<span className="font-semibold text-text-primary-sem">
														{pkg.max_tables_per_project}
													</span>{' '}
													Tables per project
												</span>
											</li>

											<li className="flex items-start gap-3">
												<div className="p-0.5 rounded-full bg-success-100 dark:bg-success-900/30 mt-0.5 shrink-0">
													<Check className="w-4 h-4 text-success-600 dark:text-success-400" />
												</div>
												<span className="text-sm text-text-secondary">
													<span className="font-semibold text-text-primary-sem">
														{/* Placeholder until you add max_rows_per_table to API */}
														10
													</span>{' '}
													rows per table
												</span>
											</li>

											<li className="flex items-start gap-3">
												<div className="p-0.5 rounded-full bg-success-100 dark:bg-success-900/30 mt-0.5 shrink-0">
													<Check className="w-4 h-4 text-success-600 dark:text-success-400" />
												</div>
												<span className="text-sm text-text-secondary">
													<span className="font-semibold text-text-primary-sem">
														{durationDays}
													</span>{' '}
													{durationDays === 1 ? 'Day' : 'Days'} access
												</span>
											</li>

											{/* Dynamic Features from JSON */}
											{pkg.features &&
												Object.entries(pkg.features).map(([key, value]) => (
													<li key={key} className="flex items-start gap-3">
														<div className="p-0.5 rounded-full bg-success-100 dark:bg-success-900/30 mt-0.5 shrink-0">
															<Check className="w-4 h-4 text-success-600 dark:text-success-400" />
														</div>
														<span className="text-sm text-text-secondary">
															<span className="font-semibold text-text-primary-sem capitalize">
																{key.replace(/_/g, ' ')}:
															</span>{' '}
															{typeof value === 'boolean'
																? value
																	? 'Included'
																	: 'Not included'
																: String(value)}
														</span>
													</li>
												))}

											{/* Default features if no custom features */}
											{(!pkg.features || Object.keys(pkg.features).length === 0) && (
												<>
													<li className="flex items-start gap-3">
														<div className="p-0.5 rounded-full bg-success-100 dark:bg-success-900/30 mt-0.5 shrink-0">
															<Check className="w-4 h-4 text-success-600 dark:text-success-400" />
														</div>
														<span className="text-sm text-text-secondary">
															24/7 Support
														</span>
													</li>
													<li className="flex items-start gap-3">
														<div className="p-0.5 rounded-full bg-success-100 dark:bg-success-900/30 mt-0.5 shrink-0">
															<Check className="w-4 h-4 text-success-600 dark:text-success-400" />
														</div>
														<span className="text-sm text-text-secondary">
															API Documentation
														</span>
													</li>
												</>
											)}
										</ul>

										{/* CTA */}
										<button
											onClick={() => {
												if (!activePlan) {
													toast.error('No valid plan found for this package')
													return
												}
												if (activePlanPurchased) {
													return
												}
												setConfirmData({
													planId: activePlan.id,
													packageName: pkg.name,
													price: finalPrice,
													unitLabel,
												})
											}}
											className={cn(
												'w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer',
												activePlanPurchased
													? 'bg-success-50 text-success-700 border border-success-200 dark:bg-success-900/20 dark:text-success-300 dark:border-success-700/60'
													: isPopular
														? `${colors.button} text-white shadow-md hover:shadow-lg`
														: 'bg-surface-input hover:bg-surface-hover text-text-primary-sem border border-border-subtle',
												(isPurchasing || isBuying || activePlanPurchased) &&
												'opacity-70 cursor-not-allowed',
											)}
											disabled={
												isPurchasing || isBuying || !activePlan || activePlanPurchased
											}
										>
											{activePlanPurchased ? (
												<>Already purchased</>
											) : isPurchasing ? (
												<>
													<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
													Processing...
												</>
											) : (
												<>
													Buy Package
													<ArrowRight className="w-5 h-5" />
												</>
											)}
										</button>
									</div>
								</div>
							)
						})}
					</div>
				)}

				{/* Extra sections unchanged ... */}
				<div className="mt-16">
					<h2 className="text-3xl font-bold text-text-primary-sem text-center mb-8">
						Why Choose Our Packages?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="p-6 bg-surface-card rounded-xl border border-border-subtle hover:border-primary-500 transition-all">
							<div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 inline-flex mb-4">
								<TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
							</div>
							<h3 className="text-lg font-semibold text-text-primary-sem mb-2">
								Scalable Solutions
							</h3>
							<p className="text-text-secondary">
								Grow your projects seamlessly with our flexible table and row
								limits.
							</p>
						</div>
						<div className="p-6 bg-surface-card rounded-xl border border-border-subtle hover:border-primary-500 transition-all">
							<div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 inline-flex mb-4">
								<Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
							</div>
							<h3 className="text-lg font-semibold text-text-primary-sem mb-2">
								Secure &amp; Reliable
							</h3>
							<p className="text-text-secondary">
								Enterprise-grade security with 99.9% uptime guarantee for your
								APIs.
							</p>
						</div>
						<div className="p-6 bg-surface-card rounded-xl border border-border-subtle hover:border-primary-500 transition-all">
							<div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 inline-flex mb-4">
								<Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
							</div>
							<h3 className="text-lg font-semibold text-text-primary-sem mb-2">
								Quick Setup
							</h3>
							<p className="text-text-secondary">
								Get your REST API up and running in minutes, not hours or days.
							</p>
						</div>
					</div>
				</div>

				<div className="mt-16 text-center">
					<h2 className="text-2xl font-bold text-text-primary-sem mb-4">
						Still have questions?
					</h2>
					<p className="text-text-secondary mb-6">
						Our support team is here to help you choose the right package
					</p>
					<button className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold">
						Contact Support
					</button>
				</div>
			</div>

			<Modal
				isOpen={!!confirmData}
				onClose={() => !isBuying && setConfirmData(null)}
				title="Confirm Purchase"
				size="md"
			>
				{confirmData && (
					<div className="space-y-4">
						<p className="text-sm text-text-secondary">
							You are about to purchase{' '}
							<span className="font-semibold text-text-primary-sem">
								{confirmData.packageName}
							</span>{' '}
							plan for{' '}
							<span className="font-semibold text-text-primary-sem">
								${confirmData.price.toFixed(2)} / {confirmData.unitLabel}
							</span>.
						</p>

						<p className="text-xs text-text-secondary">
							Please confirm that you want to proceed with this package plan.
						</p>

						<div className="flex justify-end gap-3 pt-2">
							<button
								type="button"
								onClick={() => setConfirmData(null)}
								className="px-4 py-2 rounded-lg border border-border-subtle text-sm text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
								disabled={isBuying}
							>
								Cancel
							</button>

							<button
								type="button"
								onClick={async () => {
									if (!confirmData) return
									await handlePurchase(confirmData.planId)
									setConfirmData(null)
								}}
								className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-70 cursor-pointer"
								disabled={isBuying}
							>
								{isBuying && (
									<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
								)}
								Confirm
							</button>
						</div>
					</div>
				)}
			</Modal>
		</>
	)
}
