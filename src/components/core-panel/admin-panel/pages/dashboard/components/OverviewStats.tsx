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
			bg: 'bg-sky-50',
			border: 'border-sky-100',
			text: 'text-sky-700',
		},
		{
			label: 'Active Users',
			value: totals.activeUsers,
			icon: UserCheck,
			bg: 'bg-emerald-50',
			border: 'border-emerald-100',
			text: 'text-emerald-700',
		},
		{
			label: 'Total Projects',
			value: totals.totalProjects,
			icon: FolderGit2,
			bg: 'bg-violet-50',
			border: 'border-violet-100',
			text: 'text-violet-700',
		},
		{
			label: 'Total Packages',
			value: totals.totalPackages,
			icon: Package,
			bg: 'bg-amber-50',
			border: 'border-amber-100',
			text: 'text-amber-700',
		},
		{
			label: 'Total Purchases',
			value: totals.totalPurchases,
			icon: ShoppingCart,
			bg: 'bg-indigo-50',
			border: 'border-indigo-100',
			text: 'text-indigo-700',
		},
		{
			label: 'Total Revenue',
			value: totals.totalRevenue,
			icon: Coins,
			bg: 'bg-slate-900',
			border: 'border-slate-900',
			text: 'text-amber-300',
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
						className={`flex items-center justify-between rounded-2xl border ${card.border} ${card.dark ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-slate-50' : card.bg
							} px-4 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
					>
						<div>
							<p
								className={`text-xs font-medium uppercase tracking-wide ${card.dark ? 'text-slate-300' : 'text-slate-500'
									}`}
							>
								{card.label}
							</p>
							<p className="mt-2 text-2xl font-semibold">
								{card.isCurrency ? `$${formatter.format(card.value)}` : formatter.format(card.value)}
							</p>
						</div>
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.dark ? 'bg-slate-800 text-amber-200' : `bg-white ${card.text}`
								} shadow-sm`}
						>
							<Icon className="h-5 w-5" />
						</div>
					</div>
				);
			})}
		</section>
	);
}
