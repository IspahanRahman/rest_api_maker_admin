import React from 'react';
import { Package } from 'lucide-react';

interface TopSellingPackageItem {
	package_id: string;
	sales: number;
	Package: {
		name: string;
	};
}

interface TopSellingPackagesProps {
	topSellingPackages: TopSellingPackageItem[];
}

export default function TopSellingPackages({
	topSellingPackages,
}: TopSellingPackagesProps) {
	const hasData = topSellingPackages && topSellingPackages.length > 0;

	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
						<Package className="h-4 w-4" />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-slate-900">
							Top Selling Packages
						</h3>
						<p className="text-xs text-slate-500">
							Packages ranked by total sales.
						</p>
					</div>
				</div>
			</div>

			{hasData ? (
				<div className="overflow-hidden rounded-xl border border-slate-100">
					<table className="min-w-full divide-y divide-slate-100 text-sm">
						<thead className="bg-slate-50">
							<tr>
								<th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
									#
								</th>
								<th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
									Package
								</th>
								<th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
									Sales
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 bg-white">
							{topSellingPackages.map((item, index) => (
								<tr key={item.package_id}>
									<td className="px-4 py-2 text-xs text-slate-500">
										{index + 1}
									</td>
									<td className="px-4 py-2">
										<p className="text-sm font-medium text-slate-900">
											{item.Package?.name ?? 'Unnamed Package'}
										</p>
										<p className="text-xs text-slate-500">
											ID: {item.package_id}
										</p>
									</td>
									<td className="px-4 py-2 text-right">
										<span className="inline-flex min-w-[3rem] justify-end text-sm font-semibold text-slate-900">
											{item.sales}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p className="py-8 text-center text-xs text-slate-500">
					Once customers start purchasing, your best-selling packages will appear here.
				</p>
			)}
		</section>
	);
}
