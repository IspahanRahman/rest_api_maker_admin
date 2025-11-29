'use client';

import React from 'react';
import { AlertTriangle, User as UserIcon, Shield } from 'lucide-react';
import Image from 'next/image';

interface AdminUserItem {
	id: string;
	name: string;
	email: string;
	phone_number: string | null;
	address: string | null;
	city: string | null;
	state: string | null;
	country: string | null;
	profile_image: string | null;
	role: string;
	createdAt: string;
	updatedAt: string;
}

interface AdminUsersTableProps {
	users: AdminUserItem[];
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

function getInitials(name: string) {
	if (!name) return '?';
	const parts = name.trim().split(' ');
	if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
	return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

export default function AdminUsersTable({
	users,
	isLoading,
	isFetching,
	error,
}: AdminUsersTableProps) {
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
							Failed to load users
						</h2>
						<p className="text-xs text-text-secondary mt-1">
							Please check the API or your connection and try again.
						</p>
					</div>
				</div>
			</section>
		);
	}

	if (!users.length) {
		return (
			<section className="bg-surface-card border border-border-subtle rounded-xl px-4 py-6 sm:px-6 shadow-sm text-center">
				<p className="text-sm text-text-secondary">
					No users found for the current page.
				</p>
			</section>
		);
	}

	return (
		<section className="bg-surface-card border border-border-subtle rounded-xl shadow-sm overflow-hidden">
			<div className="px-4 pt-4 pb-3 sm:px-6 flex items-center justify-between gap-3">
				<div>
					<h2 className="text-sm font-semibold text-text-primary-sem">Users</h2>
					<p className="text-xs text-text-secondary">
						Overview of all registered users, roles and locations.
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
								User
							</th>
							<th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase">
								Contact
							</th>
							<th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase">
								Location
							</th>
							<th className="px-4 py-2 text-center text-xs font-medium text-text-secondary uppercase">
								Role
							</th>
							<th className="px-4 py-2 text-right text-xs font-medium text-text-secondary uppercase">
								Created
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border-subtle">
						{users.map((user) => (
							<tr
								key={user.id}
								className="hover:bg-surface-hover/70 transition-colors"
							>
								{/* User */}
								<td className="px-4 py-3 align-top">
									<div className="flex items-center gap-3">
										<div className="h-9 w-9 rounded-full bg-surface-input border border-border-subtle flex items-center justify-center overflow-hidden text-xs font-semibold text-text-primary-sem">
											{user.profile_image ? (
												// eslint-disable-next-line @next/next/no-img-element
												<Image
													src={appUrl+user.profile_image}
													alt={user.name}
													width={36}
													height={36}
													className="h-full w-full object-cover"
												/>
											) : (
												getInitials(user.name)
											)}
										</div>
										<div className="flex flex-col">
											<span className="text-sm font-medium text-text-primary-sem">
												{user.name}
											</span>
											<span className="text-[11px] text-text-secondary">
												ID: {user.id.slice(0, 8)}…
											</span>
										</div>
									</div>
								</td>

								{/* Contact */}
								<td className="px-4 py-3 align-top">
									<div className="flex flex-col gap-0.5">
										<span className="text-sm text-text-primary-sem">
											{user.email}
										</span>
										<span className="text-[11px] text-text-secondary">
											{user.phone_number || 'No phone added'}
										</span>
									</div>
								</td>

								{/* Location */}
								<td className="px-4 py-3 align-top">
									<div className="flex flex-col gap-0.5">
										<span className="text-xs text-text-primary-sem">
											{user.city || user.state || user.country
												? [
													user.city,
													user.state,
													user.country,
												]
													.filter(Boolean)
													.join(', ')
												: 'Not provided'}
										</span>
										{user.address && (
											<span className="text-[11px] text-text-secondary line-clamp-1">
												{user.address}
											</span>
										)}
									</div>
								</td>

								{/* Role */}
								<td className="px-4 py-3 align-top text-center">
									<span
										className={`inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium border ${user.role === 'admin'
												? 'bg-primary-50 text-primary-600 border-primary-200'
												: 'bg-surface-input text-text-secondary border-border-subtle'
											}`}
									>
										<Shield className="w-3 h-3" />
										{user.role}
									</span>
								</td>

								{/* Created */}
								<td className="px-4 py-3 align-top text-right">
									<p className="text-xs text-text-primary-sem">
										{formatDate(user.createdAt)}
									</p>
									<p className="text-[11px] text-text-secondary">
										Updated: {formatDate(user.updatedAt)}
									</p>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}
