'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationMeta {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

interface AdminUsersPaginationProps {
	pagination: PaginationMeta;
	onPageChange: (page: number) => void;
}

export default function AdminUsersPagination({
	pagination,
	onPageChange,
}: AdminUsersPaginationProps) {
	const { total, page, limit, totalPages } = pagination;

	if (!total || totalPages <= 1) return null;

	const start = (page - 1) * limit + 1;
	const end = Math.min(total, page * limit);

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-surface-card border border-border-subtle rounded-xl px-4 py-3 sm:px-6 shadow-sm">
			<div className="text-xs text-text-secondary">
				Showing{' '}
				<span className="font-medium text-text-primary-sem">
					{start}
				</span>{' '}
				to{' '}
				<span className="font-medium text-text-primary-sem">
					{end}
				</span>{' '}
				of{' '}
				<span className="font-medium text-text-primary-sem">
					{total}
				</span>{' '}
				users
			</div>

			<div className="flex items-center justify-end gap-1">
				<button
					type="button"
					onClick={() => page > 1 && onPageChange(page - 1)}
					disabled={page === 1}
					className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-input px-2.5 py-1.5 text-xs text-text-secondary disabled:opacity-50"
				>
					<ChevronLeft className="w-3 h-3" />
					Prev
				</button>

				<div className="flex items-center gap-1">
					{pages.map((p) => (
						<button
							key={p}
							type="button"
							onClick={() => onPageChange(p)}
							className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 text-xs border ${p === page
									? 'bg-primary-500 text-white border-primary-500'
									: 'bg-surface-input text-text-secondary border-border-subtle hover:bg-surface-hover'
								}`}
						>
							{p}
						</button>
					))}
				</div>

				<button
					type="button"
					onClick={() => page < totalPages && onPageChange(page + 1)}
					disabled={page === totalPages}
					className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-input px-2.5 py-1.5 text-xs text-text-secondary disabled:opacity-50"
				>
					Next
					<ChevronRight className="w-3 h-3" />
				</button>
			</div>
		</section>
	);
}
