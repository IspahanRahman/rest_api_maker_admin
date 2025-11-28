'use client';

import React, { useMemo } from 'react';
import { useDashboardStats } from '@/apis/query/dashboard/useDashboardQuery';
import { Loader2, AlertCircle } from 'lucide-react';
import DashboardHeader from './components/DashboardHeader';
import OverviewStats from './components/OverviewStats';
import ChartsSection from './components/ChartsSection';
import TopSellingPackages from './components/TopSellingPackages';

export default function Dashboard() {
	const { data, isLoading, error } = useDashboardStats();

	const stats = data?.data;

	const totals = useMemo(
		() => stats?.totals ?? {
			totalUsers: 0,
			activeUsers: 0,
			totalProjects: 0,
			totalPackages: 0,
			totalPurchases: 0,
			totalRevenue: 0,
		},
		[stats]
	);

	const charts = stats?.charts ?? {
		purchaseStatusStats: [],
		monthlyRevenue: [],
		topSellingPackages: [],
		userGrowth: [],
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
				<div className="text-center">
					<Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-blue-600" />
					<p className="text-sm text-slate-600">Loading dashboard data...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
				<div className="max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
					<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
						<AlertCircle className="h-6 w-6" />
					</div>
					<h2 className="mb-2 text-lg font-semibold text-slate-900">
						Dashboard failed to load
					</h2>
					<p className="text-sm text-slate-600">
						We couldn&apos;t retrieve your stats right now. Please refresh the page or try again later.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50/80">
			<div className="mx-auto max-w-7xl space-y-4">
				<DashboardHeader />

				<OverviewStats totals={totals} />

				<ChartsSection charts={charts} />

				<TopSellingPackages topSellingPackages={charts.topSellingPackages || []} />
			</div>
		</div>
	);
}
