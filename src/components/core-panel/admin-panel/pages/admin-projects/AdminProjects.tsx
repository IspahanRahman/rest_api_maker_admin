'use client';

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAdminProjects } from '@/apis/query/adminProjects/useAdminProjects';
import AdminProjectsHeader from './components/AdminProjectsHeader';
import AdminProjectsTable from './components/AdminProjectsTable';
import AdminProjectsPagination from './components/AdminProjectsPagination';

export default function AdminProjects() {
	const [page, setPage] = useState(1);
	const limit = 10;

	// Adjust params if your hook signature is slightly different
	const { data, isLoading, error, mutate } = useAdminProjects({ page, limit });

	const apiStatus = data?.status;
	const apiMessage = data?.message;
	const projects = data?.data ?? [];
	const paginationMeta = data?.pagination;
	const pagination = paginationMeta ?? {
		total: projects.length,
		page,
		limit,
		totalPages: 1,
	};

	// If API responded but status === false, show a nice error card
	if (apiStatus === false) {
		return (
			<div className="space-y-4">
				<div className="bg-surface-card border border-red-200 rounded-xl px-4 py-6 sm:px-6 shadow-sm">
					<div className="flex items-start gap-3">
						<div className="mt-0.5 rounded-full bg-red-50 p-2">
							<AlertTriangle className="w-4 h-4 text-red-500" />
						</div>
						<div>
							<h2 className="text-sm font-semibold text-text-primary-sem">
								Failed to load projects
							</h2>
							<p className="text-xs text-text-secondary mt-1">
								{apiMessage || 'The server responded with an error while fetching projects.'}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<AdminProjectsHeader total={pagination.total} />

			<AdminProjectsTable
				projects={projects}
				isLoading={isLoading}
				// isFetching={isFetching}
				error={error}
			/>

			<AdminProjectsPagination
				pagination={pagination}
				onPageChange={(newPage) => {
					if (newPage !== page) setPage(newPage);
				}}
			/>
		</div>
	);
}
