import React from 'react';
import { Users, UserCheck, FolderGit2, Package, ShoppingCart, Coins } from 'lucide-react';

interface Totals {
	totalUsers: number;
	activeUsers: number;
	totalProjects: number;
	totalPackages: number;
	totalPurchases: number;
	totalRevenue: number;
}

interface OverviewStatsProps {
	totals: Totals;
}

const formatter = new Intl.NumberFormat('en-US');

export default function OverviewStats({ totals }: OverviewStatsProps) {
	const cards = [
		{
			label: 'Total Users',
			value: totals.totalUsers,
			icon: Users,
			bg: 'bg-sky-50 dark:bg-sky-900/60',
			border: 'border-sky-100 dark:border-sky-900',
			text: 'text-sky-700 dark:text-sky-300',
		},
		{
			label: 'Active Users',
			value: totals.activeUsers,
			icon: UserCheck,
			bg: 'bg-emerald-50 dark:bg-emerald-900/60',
			border: 'border-emerald-100 dark:border-emerald-900',
			text: 'text-emerald-700 dark:text-emerald-300',
		},
		{
			label: 'Total Projects',
			value: totals.totalProjects,
			icon: FolderGit2,
			bg: 'bg-violet-50 dark:bg-violet-900/60',
			border: 'border-violet-100 dark:border-violet-900',
			text: 'text-violet-700 dark:text-violet-300',
		},
		{
			label: 'Total Packages',
			value: totals.totalPackages,
			icon: Package,
			bg: 'bg-amber-50 dark:bg-amber-900/60',
			border: 'border-amber-100 dark:border-amber-900',
			text: 'text-amber-700 dark:text-amber-300',
		},
		{
			label: 'Total Purchases',
			value: totals.totalPurchases,
			icon: ShoppingCart,
			bg: 'bg-indigo-50 dark:bg-indigo-900/60',
			border: 'border-indigo-100 dark:border-indigo-900',
			text: 'text-indigo-700 dark:text-indigo-300',
		},
		{
			label: 'Total Revenue',
			value: totals.totalRevenue,
			icon: Coins,
			bg: 'bg-slate-900 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800',
			border: 'border-slate-900 dark:border-slate-800',
			text: 'text-amber-300 dark:text-amber-300',
			isCurrency: true,
			dark: true,
		},
	];

	return (
		<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{cards.map((card) => {
				const Icon = card.icon;
				return (
					<div
						key={card.label}
						className={`flex items-center justify-between rounded-2xl border ${card.border} ${card.bg} px-4 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
					>
						<div>
							<p
								className={`text-xs font-medium uppercase tracking-wide ${card.text}`}
							>
								{card.label}
							</p>
							<p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
								{card.isCurrency ? `$${formatter.format(card.value)}` : formatter.format(card.value)}
							</p>
						</div>
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 ${card.text} shadow-sm`}
						>
							<Icon className="h-5 w-5" />
						</div>
					</div>
				);
			})}
		</section>
	);
}
