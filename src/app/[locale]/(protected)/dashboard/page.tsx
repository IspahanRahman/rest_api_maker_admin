'use client'
import React, { useState } from 'react'
import {
	Table,
	Plus,
	Edit3,
	Trash2,
	Settings,
	Database,
	Eye,
	Download,
	Filter,
	Search,
	MoreVertical,
	ChevronDown,
	Link,
	Copy,
	BarChart3,
	Shield,
	Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'react-toastify'
import Modal from '@/components/common/Modal'
import Swal from 'sweetalert2'

interface TableSchema {
	id: string
	name: string
	displayName: string
	description?: string
	columns: TableColumn[]
	rowCount: number
	apiEndpoints: string[]
	createdAt: string
	updatedAt: string
	status: 'active' | 'draft'
}

interface TableColumn {
	name: string
	type: 'string' | 'integer' | 'boolean' | 'datetime' | 'text' | 'json'
	required: boolean
	unique: boolean
	defaultValue?: string
}

export default function ProjectTables() {
	const [tables, setTables] = useState<TableSchema[]>([
		{
			id: '1',
			name: 'users',
			displayName: 'Users',
			description: 'Stores user account information',
			rowCount: 1542,
			columns: [
				{ name: 'id', type: 'integer', required: true, unique: true },
				{ name: 'name', type: 'string', required: true, unique: false },
				{ name: 'email', type: 'string', required: true, unique: true },
				{ name: 'created_at', type: 'datetime', required: true, unique: false },
			],
			apiEndpoints: ['/api/users', '/api/users/:id'],
			createdAt: '2024-01-15',
			updatedAt: '2024-01-20',
			status: 'active',
		},
		{
			id: '2',
			name: 'products',
			displayName: 'Products',
			description: 'Product catalog and inventory',
			rowCount: 423,
			columns: [
				{ name: 'id', type: 'integer', required: true, unique: true },
				{ name: 'title', type: 'string', required: true, unique: false },
				{ name: 'price', type: 'integer', required: true, unique: false },
				{ name: 'in_stock', type: 'boolean', required: true, unique: false },
			],
			apiEndpoints: ['/api/products', '/api/products/:id'],
			createdAt: '2024-01-16',
			updatedAt: '2024-01-19',
			status: 'active',
		},
	])

	const [selectedTable, setSelectedTable] = useState<TableSchema | null>(null)
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'draft'>('all')

	const filteredTables = tables.filter(table => {
		const matchesSearch = table.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			table.description?.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesStatus = selectedStatus === 'all' || table.status === selectedStatus
		return matchesSearch && matchesStatus
	})

	const handleCreateTable = (tableData: Partial<TableSchema>) => {
		const newTable: TableSchema = {
			id: Date.now().toString(),
			name: tableData.name || '',
			displayName: tableData.displayName || '',
			description: tableData.description,
			columns: tableData.columns || [],
			rowCount: 0,
			apiEndpoints: [`/api/${tableData.name}`, `/api/${tableData.name}/:id`],
			createdAt: new Date().toISOString().split('T')[0],
			updatedAt: new Date().toISOString().split('T')[0],
			status: 'draft',
		}
		setTables([...tables, newTable])
		toast.success('Table created successfully!')
	}

	const handleDeleteTable = (tableId: string) => {
		Swal.fire({
			title: 'Delete Table?',
			text: 'This action cannot be undone. All data in this table will be lost.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#ef4444',
			cancelButtonColor: '#6b7280',
			confirmButtonText: 'Delete Table',
			cancelButtonText: 'Cancel',
		}).then(result => {
			if (result.isConfirmed) {
				setTables(tables.filter(t => t.id !== tableId))
				toast.success('Table deleted successfully!')
			}
		})
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
		toast.success('Copied to clipboard!')
	}

	const getTableColor = (index: number) => {
		const colors = [
			{ bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200' },
			{ bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200' },
			{ bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-200' },
			{ bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200' },
			{ bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200' },
		]
		return colors[index % colors.length]
	}

	return (
		<>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold text-text-primary-sem">Project Tables</h1>
						<p className="text-text-secondary mt-2">
							Manage your database tables and configure API endpoints
						</p>
					</div>
					<button
						onClick={() => setIsCreateModalOpen(true)}
						className="inline-flex items-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold cursor-pointer"
					>
						<Plus className="w-5 h-5" />
						Create Table
					</button>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="bg-surface-card rounded-xl p-4 border border-border-subtle">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
								<Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<p className="text-2xl font-bold text-text-primary-sem">{tables.length}</p>
								<p className="text-sm text-text-secondary">Total Tables</p>
							</div>
						</div>
					</div>
					<div className="bg-surface-card rounded-xl p-4 border border-border-subtle">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
								<BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
							</div>
							<div>
								<p className="text-2xl font-bold text-text-primary-sem">
									{tables.reduce((acc, table) => acc + table.rowCount, 0).toLocaleString()}
								</p>
								<p className="text-sm text-text-secondary">Total Rows</p>
							</div>
						</div>
					</div>
					<div className="bg-surface-card rounded-xl p-4 border border-border-subtle">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
								<Link className="w-5 h-5 text-purple-600 dark:text-purple-400" />
							</div>
							<div>
								<p className="text-2xl font-bold text-text-primary-sem">
									{tables.reduce((acc, table) => acc + table.apiEndpoints.length, 0)}
								</p>
								<p className="text-sm text-text-secondary">API Endpoints</p>
							</div>
						</div>
					</div>
					<div className="bg-surface-card rounded-xl p-4 border border-border-subtle">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
								<Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
							</div>
							<div>
								<p className="text-2xl font-bold text-text-primary-sem">
									{tables.filter(t => t.status === 'active').length}
								</p>
								<p className="text-sm text-text-secondary">Active Tables</p>
							</div>
						</div>
					</div>
				</div>

				{/* Filters and Search */}
				<div className="bg-surface-card rounded-xl p-4 border border-border-subtle">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
							<input
								type="text"
								placeholder="Search tables..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 bg-surface-input border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							/>
						</div>
						<div className="flex gap-2">
							<select
								value={selectedStatus}
								onChange={(e) => setSelectedStatus(e.target.value as any)}
								className="px-3 py-2 bg-surface-input border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
							>
								<option value="all">All Status</option>
								<option value="active">Active</option>
								<option value="draft">Draft</option>
							</select>
							<button className="px-3 py-2 bg-surface-input border border-border-subtle rounded-lg hover:bg-surface-hover transition-colors cursor-pointer">
								<Filter className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>

				{/* Tables Grid */}
				{filteredTables.length === 0 ? (
					<div className="bg-surface-card rounded-xl p-12 text-center border border-border-subtle">
						<Database className="w-12 h-12 text-text-secondary opacity-50 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-text-primary-sem mb-2">
							No tables found
						</h3>
						<p className="text-text-secondary mb-6">
							{searchTerm || selectedStatus !== 'all'
								? 'Try adjusting your search filters'
								: 'Create your first table to get started'
							}
						</p>
						{!searchTerm && selectedStatus === 'all' && (
							<button
								onClick={() => setIsCreateModalOpen(true)}
								className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
							>
								<Plus className="w-4 h-4" />
								Create Table
							</button>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
						{filteredTables.map((table, index) => {
							const colors = getTableColor(index)
							return (
								<div
									key={table.id}
									className="bg-surface-card rounded-xl border border-border-subtle hover:border-primary-500 transition-all duration-300 hover:shadow-lg group"
								>
									<div className="p-6">
										{/* Header */}
										<div className="flex items-start justify-between mb-4">
											<div className="flex items-center gap-3">
												<div className={cn('p-2 rounded-lg', colors.bg)}>
													<Table className={cn('w-5 h-5', colors.text)} />
												</div>
												<div>
													<h3 className="font-semibold text-text-primary-sem group-hover:text-primary-500 transition-colors">
														{table.displayName}
													</h3>
													<p className="text-sm text-text-secondary">{table.name}</p>
												</div>
											</div>
											<div className="flex items-center gap-1">
												<span className={cn(
													'text-xs px-2 py-1 rounded-full border',
													table.status === 'active'
														? 'bg-success-50 text-success-600 border-success-200 dark:bg-success-900/20 dark:text-success-300 dark:border-success-700/60'
														: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700/60'
												)}>
													{table.status}
												</span>
												<button className="p-1 hover:bg-surface-hover rounded cursor-pointer">
													<MoreVertical className="w-4 h-4 text-text-secondary" />
												</button>
											</div>
										</div>

										{/* Description */}
										{table.description && (
											<p className="text-sm text-text-secondary mb-4 line-clamp-2">
												{table.description}
											</p>
										)}

										{/* Stats */}
										<div className="grid grid-cols-2 gap-4 mb-4">
											<div>
												<p className="text-2xl font-bold text-text-primary-sem">
													{table.rowCount.toLocaleString()}
												</p>
												<p className="text-xs text-text-secondary">Rows</p>
											</div>
											<div>
												<p className="text-2xl font-bold text-text-primary-sem">
													{table.columns.length}
												</p>
												<p className="text-xs text-text-secondary">Columns</p>
											</div>
										</div>

										{/* API Endpoints */}
										<div className="mb-4">
											<p className="text-xs font-medium text-text-secondary mb-2">API Endpoints</p>
											<div className="space-y-1">
												{table.apiEndpoints.slice(0, 2).map((endpoint, idx) => (
													<div key={idx} className="flex items-center gap-2">
														<code className="flex-1 text-xs bg-surface-input px-2 py-1 rounded border border-border-subtle truncate">
															{endpoint}
														</code>
														<button
															onClick={() => copyToClipboard(endpoint)}
															className="p-1 hover:bg-surface-hover rounded cursor-pointer"
														>
															<Copy className="w-3 h-3 text-text-secondary" />
														</button>
													</div>
												))}
												{table.apiEndpoints.length > 2 && (
													<p className="text-xs text-text-secondary">
														+{table.apiEndpoints.length - 2} more endpoints
													</p>
												)}
											</div>
										</div>

										{/* Footer */}
										<div className="flex items-center justify-between pt-4 border-t border-border-subtle">
											<div className="flex items-center gap-4 text-xs text-text-secondary">
												<div className="flex items-center gap-1">
													<Clock className="w-3 h-3" />
													{new Date(table.updatedAt).toLocaleDateString()}
												</div>
											</div>
											<div className="flex items-center gap-1">
												<button
													onClick={() => {
														setSelectedTable(table)
														setIsSchemaModalOpen(true)
													}}
													className="p-2 hover:bg-surface-hover rounded transition-colors cursor-pointer"
													title="View Schema"
												>
													<Eye className="w-4 h-4 text-text-secondary" />
												</button>
												<button
													onClick={() => {
														setSelectedTable(table)
														setIsEditModalOpen(true)
													}}
													className="p-2 hover:bg-surface-hover rounded transition-colors cursor-pointer"
													title="Edit Table"
												>
													<Edit3 className="w-4 h-4 text-text-secondary" />
												</button>
												<button
													onClick={() => handleDeleteTable(table.id)}
													className="p-2 hover:bg-error-50 rounded transition-colors cursor-pointer"
													title="Delete Table"
												>
													<Trash2 className="w-4 h-4 text-error-500" />
												</button>
											</div>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>

			{/* Create Table Modal */}
			<Modal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				title="Create New Table"
				size="lg"
			>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-text-primary-sem mb-2">
							Table Name
						</label>
						<input
							type="text"
							placeholder="e.g., users, products, orders"
							className="w-full px-3 py-2 bg-surface-input border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						/>
						<p className="text-xs text-text-secondary mt-1">
							This will be used as the table name in the database
						</p>
					</div>
					<div>
						<label className="block text-sm font-medium text-text-primary-sem mb-2">
							Display Name
						</label>
						<input
							type="text"
							placeholder="e.g., Users, Products, Orders"
							className="w-full px-3 py-2 bg-surface-input border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-text-primary-sem mb-2">
							Description
						</label>
						<textarea
							placeholder="Describe what this table will store..."
							rows={3}
							className="w-full px-3 py-2 bg-surface-input border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						/>
					</div>
					<div className="flex justify-end gap-3 pt-4">
						<button
							onClick={() => setIsCreateModalOpen(false)}
							className="px-4 py-2 border border-border-subtle rounded-lg text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
						>
							Cancel
						</button>
						<button
							onClick={() => {
								handleCreateTable({
									name: 'new_table',
									displayName: 'New Table',
									description: 'A new table description',
								})
								setIsCreateModalOpen(false)
							}}
							className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
						>
							Create Table
						</button>
					</div>
				</div>
			</Modal>

			{/* Schema View Modal */}
			<Modal
				isOpen={isSchemaModalOpen}
				onClose={() => setIsSchemaModalOpen(false)}
				title={selectedTable ? `${selectedTable.displayName} Schema` : 'Table Schema'}
				size="xl"
			>
				{selectedTable && (
					<div className="space-y-6">
						<div className="bg-surface-input rounded-lg p-4">
							<h4 className="font-medium text-text-primary-sem mb-3">Columns</h4>
							<div className="space-y-2">
								{selectedTable.columns.map((column, index) => (
									<div key={index} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-b-0">
										<div>
											<span className="font-medium text-text-primary-sem">{column.name}</span>
											<span className="text-xs text-text-secondary ml-2 bg-surface-card px-2 py-1 rounded">
												{column.type}
											</span>
										</div>
										<div className="flex items-center gap-2">
											{column.required && (
												<span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Required</span>
											)}
											{column.unique && (
												<span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Unique</span>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</Modal>
		</>
	)
}
