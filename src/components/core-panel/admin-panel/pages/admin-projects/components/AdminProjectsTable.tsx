'use client';

import React from 'react';
import { AlertTriangle, User, Database } from 'lucide-react';
import Image from 'next/image';

interface PackageInfo {
	id: string;
	name: string;
}

interface PackagePlan {
	id: string;
	plan_type: string;
	duration_days: number;
	price: string;
	final_price: string;
	Package: PackageInfo;
}

interface UserInfo {
	id: string;
	name: string;
	email: string;
	profile_image: string | null;
	country: string | null;
}

interface ProjectItem {
	id: string;
	name: string;
	description: string;
	db_name: string;
	status: string;
	total_table_limit: number;
	total_created_table: number;
	createdAt: string;
	updatedAt: string;
	PackagePlan: PackagePlan;
	User: UserInfo;
}

interface AdminProjectsTableProps {
	projects: ProjectItem[];
	isLoading: boolean;
	isFetching?: boolean;
	error: any;
}

function formatDate(dateString: string) {
	try {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	} catch {
		return dateString;
	}
}

export default function AdminProjectsTable({
	projects,
	isLoading,
	isFetching,
	error,
}: AdminProjectsTableProps) {
	const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
	if (isLoading) {
		return (
			<section className="bg-surface-card border border-border-subtle rounded-xl px-4 py-6 sm:px-6 shadow-sm">
				<div className="animate-pulse space-y-4">
					<div className="h-4 w-40 bg-surface-input rounded" />
					<div className="h-9 w-full bg-surface-input rounded" />
					<div className="h-9 w-full bg-surface-input rounded" />
					<div className="h-9 w-2/3 bg-surface-input rounded" />
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="bg-surface-card border border-red-200 rounded-xl px-4 py-6 sm:px-6 shadow-sm">
				<div className="flex items-start gap-3">
					<div className="mt-0.5 rounded-full bg-red-50 p-2">
						<AlertTriangle className="w-4 h-4 text-red-500" />
					</div>
					<div>
						<h2 className="text-sm font-semibold text-text-primary-sem">
							Failed to load projects
						</h2>
						<p className="text-xs text-text-secondary mt-1">
							Please check the API or your connection and try again.
						</p>
					</div>
				</div>
			</section>
		);
	}

	if (!projects.length) {
		return (
			<section className="bg-surface-card border border-border-subtle rounded-xl px-4 py-6 sm:px-6 shadow-sm text-center">
				<p className="text-sm text-text-secondary">
					No projects found for the current filters.
				</p>
			</section>
		);
	}

	return (
		<section className="bg-surface-card border border-border-subtle rounded-xl shadow-sm overflow-hidden">
			<div className="px-4 pt-4 pb-3 sm:px-6 flex items-center justify-between gap-3">
				<div>
					<h2 className="text-sm font-semibold text-text-primary-sem">Projects</h2>
					<p className="text-xs text-text-secondary">
						Detailed overview of all user projects, ownership and plan usage.
					</p>
				</div>
				{isFetching && (
					<span className="text-[11px] text-text-secondary">
						Refreshing data…
					</span>
				)}
			</div>

			<div className="overflow-x-auto border-t border-border-subtle">
				<table className="min-w-full text-sm">
					<thead className="bg-surface-input">
						<tr>
							<th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase">
								Project
							</th>
							<th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase">
								Owner
							</th>
							<th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase">
								Plan
							</th>
							<th className="px-4 py-2 text-center text-xs font-medium text-text-secondary uppercase">
								Tables
							</th>
							<th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase">
								Database
							</th>
							<th className="px-4 py-2 text-center text-xs font-medium text-text-secondary uppercase">
								Status
							</th>
							<th className="px-4 py-2 text-right text-xs font-medium text-text-secondary uppercase">
								Created
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border-subtle">
						{projects.map((project) => {
							const used = project.total_created_table;
							const limit = project.total_table_limit;
							const progress = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
							return (
								<tr
									key={project.id}
									className="hover:bg-surface-hover/70 transition-colors"
								>
									{/* Project */}
									<td className="px-4 py-3 align-top">
										<div className="flex flex-col">
											<span className="text-sm font-semibold text-text-primary-sem">
												{project.name}
											</span>
											<span className="text-[11px] text-text-secondary line-clamp-2">
												{project.description || 'No description'}
											</span>
											<span className="mt-1 text-[11px] text-text-secondary/80">
												ID: {project.id.slice(0, 8)}…
											</span>
										</div>
									</td>

									{/* Owner */}
									<td className="px-4 py-3 align-top">
										<div className="flex items-center gap-2">
											<div className="h-8 w-8 rounded-full bg-surface-input border border-border-subtle flex items-center justify-center overflow-hidden">
												{project.User.profile_image ? (
													// eslint-disable-next-line @next/next/no-img-element
													<Image
														src={appUrl + project.User.profile_image}
														alt={project.User.name}
														width={32}
														height={32}
														className="h-full w-full object-cover"
													/>
												) : (
													<User className="w-4 h-4 text-text-secondary" />
												)}
											</div>
											<div>
												<p className="text-sm font-medium text-text-primary-sem">
													{project.User.name}
												</p>
												<p className="text-[11px] text-text-secondary">
													{project.User.email}
												</p>
											</div>
										</div>
									</td>

									{/* Plan */}
									<td className="px-4 py-3 align-top">
										<div className="flex flex-col gap-0.5">
											<span className="text-sm text-text-primary-sem">
												{project.PackagePlan.Package.name}
											</span>
											<span className="text-[11px] text-text-secondary capitalize">
												{project.PackagePlan.plan_type} · {project.PackagePlan.duration_days} days
											</span>
											<span className="text-[11px] text-text-secondary">
												${Number(project.PackagePlan.final_price).toFixed(2)}
											</span>
										</div>
									</td>

									{/* Tables */}
									<td className="px-4 py-3 align-top text-center">
										<div className="flex flex-col items-center gap-1">
											<span className="text-xs text-text-primary-sem font-medium">
												{used}/{limit}
											</span>
											<div className="h-1.5 w-20 rounded-full bg-surface-input border border-border-subtle overflow-hidden">
												<div
													className="h-full rounded-full bg-primary-500"
													style={{ width: `${progress}%` }}
												/>
											</div>
										</div>
									</td>

									{/* Database */}
									<td className="px-4 py-3 align-top">
										<div className="flex items-start gap-2">
											<Database className="w-4 h-4 text-text-secondary mt-0.5" />
											<div>
												<p className="text-[11px] text-text-secondary break-all">
													{project.db_name}
												</p>
												{/* <p className="text-[11px] text-text-secondary/70">
													API base: {project.api_base_url || 'Not configured'}
												</p> */}
											</div>
										</div>
									</td>

									{/* Status */}
									<td className="px-4 py-3 align-top text-center">
										<span
											className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-medium border ${project.status === 'active'
													? 'bg-success-50 text-success-600 border-success-200'
													: 'bg-amber-50 text-amber-600 border-amber-200'
												}`}
										>
											{project.status}
										</span>
									</td>

									{/* Created */}
									<td className="px-4 py-3 align-top text-right">
										<p className="text-xs text-text-primary-sem">
											{formatDate(project.createdAt)}
										</p>
										<p className="text-[11px] text-text-secondary">
											Updated: {formatDate(project.updatedAt)}
										</p>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</section>
	);
}
