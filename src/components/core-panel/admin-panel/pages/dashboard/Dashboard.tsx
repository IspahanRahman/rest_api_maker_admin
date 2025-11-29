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
            <div className="flex min-h-[60vh] items-center justify-center bg-surface">
                <div className="text-center">
                    <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-surface px-4">
                <div className="max-w-md rounded-2xl border border-red-100 dark:border-red-900 bg-white dark:bg-slate-950 p-6 text-center shadow-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-400">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Dashboard failed to load
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        We couldn&apos;t retrieve your stats right now. Please refresh the page or try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface">
            <div className="mx-auto max-w-7xl space-y-4">
                <DashboardHeader />
                <OverviewStats totals={totals} />
                <ChartsSection charts={charts} />
                <TopSellingPackages topSellingPackages={charts.topSellingPackages || []} />
            </div>
        </div>
    );
}
