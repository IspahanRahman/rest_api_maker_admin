// PaginatedTable.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
	ChevronUp,
	ChevronDown,
	CheckSquare,
	Square,
	ArrowLeft,
	ArrowRight,
	ChevronsLeft,
	ChevronsRight
} from 'lucide-react';

interface Column {
	accessor: string;
	Header: string;
	render?: (row: any) => React.ReactNode;
}

type TableColumn =
	| (Column & { render?: (row: any) => React.ReactNode })
	| (Column & { render?: never });

interface TableProps {
	columns: TableColumn[];
	data: any[]; // API-paginated data
	totalItems: number; // data.total from API
	pageSize: number; // data.per_page from API
	currentPage: number; // data.current_page from API
	totalPages: number; // data.last_page from API
	onSelectRows?: (selected: any[]) => void;
	rowActions?: (row: any) => React.ReactNode;
	showCheckbox?: boolean;
	pageSizeOptions?: number[];
	onPageSizeChange?: (size: number) => void;
	onPageChange?: (page: number) => void;
}

const PaginatedTable: React.FC<TableProps> = ({
	columns,
	data,
	totalItems,
	pageSize,
	currentPage,
	totalPages,
	onSelectRows,
	rowActions,
	showCheckbox = true,
	pageSizeOptions = [10, 20, 50],
	onPageSizeChange,
	onPageChange
}) => {
	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: 'ascending' | 'descending' | null;
	}>({ key: '', direction: null });

	const sortedData = useMemo(() => {
		if (sortConfig.key) {
			return [...data].sort((a, b) => {
				const aValue = a[sortConfig.key];
				const bValue = b[sortConfig.key];
				if (aValue < bValue)
					return sortConfig.direction === 'ascending' ? -1 : 1;
				if (aValue > bValue)
					return sortConfig.direction === 'ascending' ? 1 : -1;
				return 0;
			});
		}
		return data;
	}, [data, sortConfig]);

	const toggleRowSelection = (id: number) => {
		setSelectedRows(prev =>
			prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
		);
	};
	const toggleSelectAll = () => {
		const allSelected = sortedData.map(row => row.id);
		setSelectedRows(prev => (prev.length === sortedData.length ? [] : allSelected));
	};

	useEffect(() => {
		if (!onSelectRows) return;
		const selectedRowObjects = data.filter(r => selectedRows.includes(r.id));
		onSelectRows(selectedRowObjects);
	}, [selectedRows, data, onSelectRows]);

	return (
		<div className="overflow-x-auto bg-white dark:bg-bg_dark rounded-lg p-4 border">
			<div className="w-full overflow-x-auto">
				<table className="min-w-full table-auto text-gray-900 dark:text-white">
					<thead className="bg-gray-100 dark:bg-body_dark">
						<tr>
							{showCheckbox && (
								<th className="px-3 py-2 text-left">
									<button onClick={toggleSelectAll}>
										{selectedRows.length === sortedData.length && sortedData.length !== 0 ? (
											<CheckSquare className="text-primary-500" />
										) : (
											<Square className="text-gray-500" />
										)}
									</button>
								</th>
							)}
							{columns.map(column => (
								<th
									key={column.accessor}
									onClick={() =>
										setSortConfig({
											key: column.accessor,
											direction:
												sortConfig.key === column.accessor && sortConfig.direction === 'ascending'
													? 'descending'
													: 'ascending'
										})
									}
									className="px-3 py-2 text-left cursor-pointer font-semibold uppercase text-sm"
								>
									{column.Header}
									{sortConfig.key === column.accessor &&
										(sortConfig.direction === 'ascending' ? (
											<ChevronUp className="inline ml-1" />
										) : (
											<ChevronDown className="inline ml-1" />
										))}
								</th>
							))}
							{rowActions && <th className="px-3 py-2 font-semibold">Action</th>}
						</tr>
					</thead>
					<tbody>
						{sortedData.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length + (showCheckbox ? 1 : 0) + (rowActions ? 1 : 0)}
									className="text-center py-4 text-gray-500 dark:text-gray-300"
								>
									No data found.
								</td>
							</tr>
						) : (
							sortedData.map((row, index) => (
								<tr
									key={row.id}
									className={`border-b dark:border-bg_secondary hover:bg-gray-100 dark:hover:bg-gray-800 ${index % 2 === 1 ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-bg_dark'
										}`}
								>
									{showCheckbox && (
										<td className="px-3 py-2">
											<button onClick={() => toggleRowSelection(row.id)}>
												{selectedRows.includes(row.id) ? (
													<CheckSquare className="text-primary-500 dark:text-text-primary" />
												) : (
													<Square className="text-gray-500" />
												)}
											</button>
										</td>
									)}
									{columns.map(column => (
										<td key={column.accessor} className="px-3 py-2">
											{column.render ? column.render(row) : row[column.accessor]}
										</td>
									))}
									{rowActions && (
										<td className="px-3 py-2 dark:text-text-primary">{rowActions(row)}</td>
									)}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination Controls */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">
				<div>
					<select
						value={pageSize}
						onChange={e => {
							const newSize = Number(e.target.value);
							onPageSizeChange?.(newSize);
							onPageChange?.(1); // Reset to first page
						}}
						className="border rounded px-2 py-1"
					>
						{pageSizeOptions.map(size => (
							<option key={size} value={size}>
								Show {size} rows
							</option>
						))}
					</select>
				</div>

				<div className="flex items-center justify-center gap-2">
					<button
						disabled={currentPage === 1}
						onClick={() => onPageChange?.(1)}
						className="p-1 rounded disabled:opacity-50"
					>
						<ChevronsLeft />
					</button>
					<button
						disabled={currentPage === 1}
						onClick={() => onPageChange?.(currentPage - 1)}
						className="p-1 rounded disabled:opacity-50"
					>
						<ArrowLeft />
					</button>
					<p>
						Page {totalItems === 0 ? 0 : currentPage} of {totalItems === 0 ? 0 : totalPages} | Total {totalItems} records
					</p>

					<button
						disabled={currentPage === totalPages}
						onClick={() => onPageChange?.(currentPage + 1)}
						className="p-1 rounded disabled:opacity-50"
					>
						<ArrowRight />
					</button>
					<button
						disabled={currentPage === totalPages}
						onClick={() => onPageChange?.(totalPages)}
						className="p-1 rounded disabled:opacity-50"
					>
						<ChevronsRight />
					</button>
				</div>
			</div>
		</div>
	);
};

export default PaginatedTable;
