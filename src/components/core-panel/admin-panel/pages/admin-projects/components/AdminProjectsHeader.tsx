import React from 'react';
import { FolderGit2 } from 'lucide-react';

interface AdminProjectsHeaderProps {
	total: number;
}

export default function AdminProjectsHeader({ total }: AdminProjectsHeaderProps) {
	return (
		<header className="bg-surface-card border border-border-subtle rounded-xl px-4 py-4 sm:px-6 sm:py-5 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="space-y-2">
				<div className="inline-flex items-center gap-2 rounded-full bg-surface-input px-3 py-1 border border-border-subtle">
					<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-50">
						<FolderGit2 className="h-4 w-4 text-primary-500" />
					</span>
					<span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
						Admin · Projects
					</span>
				</div>

				<h1 className="text-2xl font-semibold text-text-primary-sem sm:text-3xl">
					All User Projects
				</h1>

				<p className="max-w-2xl text-sm text-text-secondary">
					Monitor and manage projects created by all users. View owners, plans, usage and
					database info at a glance.
				</p>
			</div>

			<div className="flex flex-col items-end gap-2">
				<span className="text-xs text-text-secondary">Total Projects</span>
				<div className="inline-flex items-center gap-2 rounded-full bg-surface-input border border-border-subtle px-4 py-1.5">
					<span className="text-lg font-semibold text-text-primary-sem">{total}</span>
				</div>
			</div>
		</header>
	);
}
