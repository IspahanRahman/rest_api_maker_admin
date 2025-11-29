import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardHeader() {
	return (
		<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="space-y-2">
				<div className="inline-flex items-center gap-2 rounded-full bg-blue-800 dark:bg-blue-900 px-3 py-1">
					<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-700">
						<LayoutDashboard className="h-4 w-4 text-white" />
					</span>
					<span className="text-xs font-medium uppercase tracking-wide text-white">
						Overview
					</span>
				</div>
				<h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
					Dashboard
				</h1>
				<p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
					Monitor users, projects, packages, and revenue at a glance. Visualize growth and sales performance to make informed decisions.
				</p>
			</div>

			<div className="flex flex-wrap items-center justify-start gap-3 sm:justify-end">
				<div className="rounded-full bg-slate-900 dark:bg-slate-800 px-4 py-2 text-xs font-medium text-slate-100 shadow-sm">
					Project REST API Maker
				</div>
			</div>
		</header>
	);
}
