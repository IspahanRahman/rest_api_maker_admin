'use client'
import React, { useState, useMemo } from 'react'
import { Plus, AlertTriangle, Loader2, Database, Table as TableIcon } from 'lucide-react'
import { useCustomerProjects } from '@/apis/query/customerProjects/useCutomerProjects'
import { useProjectTables } from '@/apis/query/projectTables/useProjectTables'
import { useDeleteTableMutation } from '@/apis/mutation/projectTable/useDeleteTableMutation'
import { toast } from 'react-toastify'
import { ProjectTable } from '@/types/project-table'
import { Project } from '@/types/customer-project'
import Select from '@/components/common/Select'
import Swal from 'sweetalert2'
import { TableCard, CreateTableModal, EditTableModal, DeleteTableConfirmationModal, TableDetailsModal, TableStats } from './components';
export default function ProjectTables() {
	const { data: projectData, isLoading: projectsLoading } = useCustomerProjects()
	const projects = projectData?.data || []

	// State
	const [selectedProjectId, setSelectedProjectId] = useState<string>('')
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
	const [openMenu, setOpenMenu] = useState<string | null>(null)

	// Modal State
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
	const [selectedTable, setSelectedTable] = useState<ProjectTable | null>(null)

	// Operation State
	const [deletingTableId, setDeletingTableId] = useState<string | null>(null)

	// Fetch tables for selected project
	const { data: tablesData, isLoading: tablesLoading, error, mutate } = useProjectTables(selectedProjectId)
	const tables = useMemo(() => {
		if (!tablesData?.data) return []
		return tablesData.data.map((table: any) => {
			// Parse schema_json to get columns
			let parsedColumns = []
			try {
				let schemaData = table.schema_json
				// Handle double-encoded JSON strings
				if (typeof schemaData === 'string') {
					schemaData = JSON.parse(schemaData)
					// If still a string, parse again (handles double-encoding)
					if (typeof schemaData === 'string') {
						schemaData = JSON.parse(schemaData)
					}
				}
				parsedColumns = Array.isArray(schemaData) ? schemaData : []
			} catch (e) {
				console.error('Error parsing schema_json:', e)
				parsedColumns = []
			}

			// Parse api_endpoints if exists
			let parsedEndpoints = []
			try {
				let endpointData = table.api_endpoints
				if (endpointData) {
					if (typeof endpointData === 'string') {
						endpointData = JSON.parse(endpointData)
						// If still a string, parse again (handles double-encoding)
						if (typeof endpointData === 'string') {
							endpointData = JSON.parse(endpointData)
						}
					}
					parsedEndpoints = Array.isArray(endpointData) ? endpointData : []
				}
			} catch (e) {
				console.error('Error parsing api_endpoints:', e)
				parsedEndpoints = []
			}

			return {
				...table,
				name: table.table_name, // Map table_name to name for component compatibility
				row_count: 0, // API doesn't provide this yet
				columns_count: parsedColumns.length || 0, // Calculate from schema
				status: table.Project?.status || 'active', // Use Project status as fallback
				schema_json: parsedColumns,
				api_endpoints: parsedEndpoints,
				columns: parsedColumns?.map((col: any, index: number) => ({
					id: `${table.id}-col-${index}`,
					name: col.name,
					data_type: col.data_type,
					is_nullable: col.is_nullable,
					default_value: col.default_value,
					is_primary_key: col.is_primary_key,
					is_unique: col.is_unique,
					is_indexed: col.is_indexed || false,
					max_length: col.max_length,
					precision: col.precision,
					scale: col.scale,
					createdAt: table.createdAt,
					updatedAt: table.updatedAt,
				})),
			}
		})
	}, [tablesData?.data])

	const deleteTableMutation = useDeleteTableMutation(selectedTable?.id ?? '0')

	// Calculate statistics
	const stats = useMemo(() => {
		if (!tables) return { total: 0, active: 0, inactive: 0, totalRows: 0 }

		return {
			total: tables.length,
			active: tables.filter((t: ProjectTable) => t.status === 'active').length,
			inactive: tables.filter((t: ProjectTable) => t.status === 'inactive').length,
			totalRows: tables.reduce((sum: number, t: ProjectTable) => sum + (t.row_count || 0), 0),
		}
	}, [tables])

	// Filter tables
	const filteredTables = useMemo(() => {
		if (!tables) return []

		let filtered = [...tables]

		// Apply search filter
		if (searchQuery) {
			filtered = filtered.filter(
				(t: ProjectTable) =>
					(t.name || t.table_name)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					t.description?.toLowerCase().includes(searchQuery.toLowerCase())
			)
		}

		// Apply status filter
		if (statusFilter !== 'all') {
			filtered = filtered.filter((t: ProjectTable) => t.status === statusFilter)
		}

		return filtered
	}, [tables, searchQuery, statusFilter])

	// Project options for select
	const projectOptions = projects.map((p: Project) => ({
		value: p.id,
		label: `${p.name} (${p.db_name})`,
	}))

	// Handlers
	const handleCreateTable = () => {
		if (!selectedProjectId) {
			toast.error('Please select a project first')
			return
		}
		setIsCreateModalOpen(true)
	}

	const handleViewTable = (table: ProjectTable) => {
		setSelectedTable(table)
		setIsDetailsModalOpen(true)
		setOpenMenu(null)
	}

	const handleEditTable = (table: ProjectTable) => {
		setSelectedTable(table)
		setIsEditModalOpen(true)
		setOpenMenu(null)
	}

	const handleDeleteTable = (table: ProjectTable) => {
		setSelectedTable(table)
		setIsDeleteModalOpen(true)
		setOpenMenu(null)
	}

	const handleConfirmDelete = async () => {
		if (!selectedTable) return

		setDeletingTableId(selectedTable.id)

		try {
			const response = await deleteTableMutation.submit()
			if (!response?.status) {
				Swal.fire({
					icon: 'error',
					title: 'Delete Failed',
					text: response?.message || 'Failed to delete table',
				})
				return
			}
			toast.success(`Table "${selectedTable.name}" deleted successfully`)
			setIsDeleteModalOpen(false)
			setSelectedTable(null)
			mutate()
		} catch (error: any) {
			const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete table'
			Swal.fire({
				icon: 'error',
				title: 'Delete Failed',
				text: errorMessage,
			})
		} finally {
			setDeletingTableId(null)
		}
	}

	const handleModalSuccess = () => {
		mutate()
	}

	// Loading State
	if (projectsLoading) {
		return (
			<div className="min-h-screen bg-surface-primary p-6 flex items-center justify-center">
				<div className="flex flex-col items-center justify-center py-20">
					<Loader2 className="w-12 h-12 text-primary-600 dark:text-primary-400 animate-spin mb-4" />
					<p className="text-text-secondary">Loading projects...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-surface-primary">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex flex-col gap-4">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-foreground mb-2">Project Tables</h1>
							<p className="text-text-secondary">Manage database tables for your projects</p>
						</div>
						<button
							onClick={handleCreateTable}
							disabled={!selectedProjectId}
							className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700
								text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all
								disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						>
							<Plus className="w-5 h-5" />
							Create Table
						</button>
					</div>

					{/* Project Selector */}
					<div className="bg-surface-card border border-border-subtle rounded-xl p-6">
						<div className="flex items-center gap-3 mb-4">
							<Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
							<h2 className="text-lg font-semibold text-foreground">Select Project</h2>
						</div>
						<Select
							value={selectedProjectId}
							onChange={(value) => setSelectedProjectId(value as string)}
							options={projectOptions}
							placeholder="Choose a project to view its tables..."
							className="max-w-md"
						/>
					</div>
				</div>

				{selectedProjectId ? (
					<>
						{/* Statistics */}
						<TableStats
							total={stats.total}
							active={stats.active}
							inactive={stats.inactive}
							totalRows={stats.totalRows}
						/>

						{/* Search and Filters */}
						<div className="bg-surface-card border border-border-subtle rounded-xl p-4">
							<div className="flex flex-col md:flex-row gap-4">
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search tables..."
									className="flex-1 px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
										text-foreground placeholder:text-text-tertiary
										focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
								/>
								<div className="flex gap-2">
									<button
										onClick={() => setStatusFilter('all')}
										className={`px-4 py-2 rounded-lg font-medium transition-colors ${
											statusFilter === 'all'
												? 'bg-primary-600 text-white'
												: 'bg-surface-input text-text-secondary hover:bg-surface-hover'
										}`}
									>
										All
									</button>
									<button
										onClick={() => setStatusFilter('active')}
										className={`px-4 py-2 rounded-lg font-medium transition-colors ${
											statusFilter === 'active'
												? 'bg-success-600 text-white'
												: 'bg-surface-input text-text-secondary hover:bg-surface-hover'
										}`}
									>
										Active
									</button>
									<button
										onClick={() => setStatusFilter('inactive')}
										className={`px-4 py-2 rounded-lg font-medium transition-colors ${
											statusFilter === 'inactive'
												? 'bg-gray-600 text-white'
												: 'bg-surface-input text-text-secondary hover:bg-surface-hover'
										}`}
									>
										Inactive
									</button>
								</div>
							</div>
						</div>

						{/* Tables List */}
						{tablesLoading ? (
							<div className="flex flex-col items-center justify-center py-20">
								<Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin mb-4" />
								<p className="text-text-secondary">Loading tables...</p>
							</div>
						) : error ? (
							<div className="bg-error-50 dark:bg-error-950/20 border border-error-200 dark:border-error-900 rounded-lg p-6 text-center">
								<AlertTriangle className="w-12 h-12 text-error-600 dark:text-error-400 mx-auto mb-3" />
								<h3 className="text-lg font-semibold text-error-900 dark:text-error-100 mb-2">Failed to load tables</h3>
								<p className="text-error-700 dark:text-error-300 mb-4">
									{error.message || 'Please try again later or contact support'}
								</p>
								<button
									onClick={() => mutate()}
									className="inline-flex items-center gap-2 px-6 py-2 bg-error-600 hover:bg-error-700 text-white rounded-lg transition-colors"
								>
									Retry
								</button>
							</div>
						) : filteredTables.length === 0 ? (
							<div className="bg-surface-card border border-border-subtle rounded-xl p-12 text-center">
								<div className="max-w-md mx-auto">
									<div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4">
										<TableIcon className="w-8 h-8 text-text-tertiary" />
									</div>
									<h3 className="text-xl font-semibold text-text-primary mb-2">
										{searchQuery || statusFilter !== 'all' ? 'No tables found' : 'No tables yet'}
									</h3>
									<p className="text-text-secondary mb-6">
										{searchQuery || statusFilter !== 'all'
											? 'Try adjusting your search or filters'
											: 'Get started by creating your first database table'}
									</p>
									{!searchQuery && statusFilter === 'all' && (
										<button
											onClick={handleCreateTable}
											className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700
												text-white rounded-lg font-medium transition-colors"
										>
											<Plus className="w-5 h-5" />
											Create Your First Table
										</button>
									)}
								</div>
							</div>
						) : (
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{filteredTables.map((table: ProjectTable) => (
									<TableCard
										key={table.id}
										table={table}
										onView={handleViewTable}
										onEdit={handleEditTable}
										onDelete={handleDeleteTable}
										openMenu={openMenu}
										setOpenMenu={setOpenMenu}
									/>
								))}
							</div>
						)}
					</>
				) : (
					<div className="bg-surface-card border border-border-subtle rounded-xl p-12 text-center">
						<div className="max-w-md mx-auto">
							<div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
								<Database className="w-8 h-8 text-primary-600 dark:text-primary-400" />
							</div>
							<h3 className="text-xl font-semibold text-text-primary mb-2">Select a Project</h3>
							<p className="text-text-secondary">Please select a project from the dropdown above to view and manage its database tables</p>
						</div>
					</div>
				)}
			</div>

			{/* Modals */}
			<CreateTableModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSuccess={handleModalSuccess}
				projectId={selectedProjectId}
			/>

			<EditTableModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false)
					setSelectedTable(null)
				}}
				onSuccess={handleModalSuccess}
				table={selectedTable}
			/>

			<DeleteTableConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false)
					setSelectedTable(null)
				}}
				onConfirm={handleConfirmDelete}
				tableName={selectedTable?.name || ''}
				isDeleting={deletingTableId === selectedTable?.id}
			/>

			<TableDetailsModal
				isOpen={isDetailsModalOpen}
				onClose={() => {
					setIsDetailsModalOpen(false)
					setSelectedTable(null)
				}}
				table={selectedTable}
			/>
		</div>
	)
}

