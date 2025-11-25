'use client'
import React, { useState, useMemo } from 'react'
import { Plus, AlertTriangle, Loader2 } from 'lucide-react'
import { useCustomerProjects, useCustomerProjectDetail } from '@/apis/query/customerProjects/useCutomerProjects';
import { useDeleteProjectMutation } from '@/apis/mutation/customerProject/useDeleteProjectMutation';
import { usePatchProjectMutation } from '@/apis/mutation/customerProject/usePatchProjectMutation';
import { toast } from 'react-toastify'
import { Project } from '@/types/customer-project'
import ProjectStats from './components/ProjectStats'
import ProjectFilters from './components/ProjectFilters'
import ProjectCard from './components/ProjectCard'
import CreateProjectModal from './components/CreateProjectModal'
import EditProjectModal from './components/EditProjectModal'
import DeleteConfirmationModal from './components/DeleteConfirmationModal'
import StatusChangeConfirmationModal from './components/StatusChangeConfirmationModal'
import ProjectDetailsModal from './components/ProjectDetailsModal'
import Swal from 'sweetalert2'
export default function CustomerProjects() {
	const { data: projectData, isLoading, error, mutate } = useCustomerProjects();
	const projects = projectData?.data || [];

	// UI State
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')
	const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated'>('updated')
	const [showFilters, setShowFilters] = useState(false)
	const [openMenu, setOpenMenu] = useState<string | null>(null)

	// Modal State
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);

	//Status Modal State
	const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
	const [statusTargetProject, setStatusTargetProject] = useState<Project | null>(null)
    const [statusTargetNewStatus, setStatusTargetNewStatus] = useState<'active' | 'inactive'>('active')

	// Operation State
	const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null)
	const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
	const deleteProjectMutation = useDeleteProjectMutation(String(selectedProject?.id ?? '0'));
	const { data, setData, isLoading:patchLoading, submit } = usePatchProjectMutation(String(statusTargetProject?.id ?? '0'));
	const { data: projectDetailData, isLoading: isDetailLoading } = useCustomerProjectDetail(
		selectedProject?.id ? String(selectedProject.id) : ''
	);

	// Calculate statistics
	const stats = useMemo(() => {
		if (!projects) return { total: 0, active: 0, inactive: 0, suspended: 0 }

		return {
			total: projects.length,
			active: projects.filter((p: Project) => p.status === 'active').length,
			inactive: projects.filter((p: Project) => p.status === 'inactive').length,
			suspended: projects.filter((p: Project) => p.status === 'suspended').length,
		}
	}, [projects])

	// Filter and sort projects
	const filteredProjects = useMemo(() => {
		if (!projects) return []

		let filtered = [...projects]

		// Apply search filter
		if (searchQuery) {
			filtered = filtered.filter(p =>
				p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.db_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.description?.toLowerCase().includes(searchQuery.toLowerCase())
			)
		}

		// Apply status filter
		if (statusFilter !== 'all') {
			filtered = filtered.filter(p => p.status === statusFilter)
		}

		// Apply sorting
		filtered.sort((a, b) => {
			switch (sortBy) {
				case 'name':
					return a.name.localeCompare(b.name)
				case 'created':
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				case 'updated':
					return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
				default:
					return 0
			}
		})

		return filtered
	}, [projects, searchQuery, statusFilter, sortBy])

	// Handlers
	const handleCreateProject = () => {
		setIsCreateModalOpen(true)
	}

	const handleViewProject = (project: Project) => {
		setSelectedProject(project)
		setIsDetailsModalOpen(true)
		setOpenMenu(null)
	}

	const handleEditProject = (project: Project) => {
		setSelectedProject(project)
		setIsEditModalOpen(true)
		setOpenMenu(null)
	}

	const handleDeleteProject = (project: Project) => {
		setSelectedProject(project)
		setIsDeleteModalOpen(true)
		setOpenMenu(null)
	}

	const handleConfirmDelete = async () => {
		if (!selectedProject) return;

		setDeletingProjectId(selectedProject.id);

		try {
			const response = await deleteProjectMutation.submit();
			if (!response?.status) {
				Swal.fire({
					icon: 'error',
					title: 'Delete Failed',
					text: response?.message || 'Failed to delete project',
				});
				return;
			}
			toast.success(`Project "${selectedProject.name}" deleted successfully`);
			setIsDeleteModalOpen(false);
			setSelectedProject(null);
			mutate();
		} catch (error: any) {
			const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete project';
			Swal.fire({
				icon: 'error',
				title: 'Delete Failed',
				text: errorMessage,
			});
		} finally {
			setDeletingProjectId(null);
		}
	};

	const handleToggleStatus = async (project: Project) => {
		const newStatus = project.status === 'active' ? 'inactive' : 'active';
        setStatusTargetProject(project);
        setStatusTargetNewStatus(newStatus);
        setIsStatusModalOpen(true);
        setOpenMenu(null);
	}

	const handleConfirmStatusChange = async () => {
		if (!statusTargetProject) return;

		try {
			data.status = statusTargetNewStatus;
			const response = await submit();
			if (!response?.status) {
				Swal.fire({
					icon: 'error',
					title: 'Update Failed',
					text: response?.message || 'Failed to update project status',
				});
				return;
			}
			toast.success(`Project "${statusTargetProject.name}" is now ${statusTargetNewStatus}`);
			mutate();
		} catch (error: any) {
			Swal.fire({
				icon: 'error',
				title: 'Update Failed',
				text: error?.response?.data?.message || error?.message || 'Failed to update project status',
			});
		} finally {
			setUpdatingProjectId(null);
			setIsStatusModalOpen(false);
			setStatusTargetProject(null);
		}
	}

	const handleModalSuccess = () => {
		mutate()
	}

	// Error State
	if (error) {
		return (
			<div className="min-h-screen bg-surface-primary p-6">
				<div className="max-w-7xl mx-auto">
					<div className="bg-error-50 dark:bg-error-950/20 border border-error-200 dark:border-error-900 rounded-lg p-6 text-center">
						<AlertTriangle className="w-12 h-12 text-error-600 dark:text-error-400 mx-auto mb-3" />
						<h3 className="text-lg font-semibold text-error-900 dark:text-error-100 mb-2">
							Failed to load projects
						</h3>
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
				</div>
			</div>
		)
	}

	// Loading State
	if (isLoading) {
		return (
			<div className="min-h-screen bg-surface-primary p-6 flex items-center justify-center">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col items-center justify-center py-20">
						<Loader2 className="w-12 h-12 text-primary-600 dark:text-primary-400 animate-spin mb-4" />
						<p className="text-text-secondary">Loading your projects...</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-surface-primary">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold text-foreground mb-2">Customer Projects</h1>
						<p className="text-text-secondary">
							Manage and monitor all your API projects
						</p>
					</div>
					<button
						onClick={handleCreateProject}
						className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700
							text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all cursor-pointer"
					>
						<Plus className="w-5 h-5" />
						Create Project
					</button>
				</div>

				{/* Statistics */}
				<ProjectStats
					total={stats.total}
					active={stats.active}
					inactive={stats.inactive}
					suspended={stats.suspended}
				/>

				{/* Filters */}
				<ProjectFilters
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					statusFilter={statusFilter}
					setStatusFilter={setStatusFilter}
					sortBy={sortBy}
					setSortBy={setSortBy}
					showFilters={showFilters}
					setShowFilters={setShowFilters}
					totalProjects={projects?.length || 0}
					filteredCount={filteredProjects.length}
				/>

				{/* Projects List */}
				{filteredProjects.length === 0 ? (
					<div className="bg-surface-card border border-border-subtle rounded-xl p-12 text-center">
						<div className="max-w-md mx-auto">
							<div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4">
								<Plus className="w-8 h-8 text-text-tertiary" />
							</div>
							<h3 className="text-xl font-semibold text-text-primary mb-2">
								{searchQuery || statusFilter !== 'all' ? 'No projects found' : 'No projects yet'}
							</h3>
							<p className="text-text-secondary mb-6">
								{searchQuery || statusFilter !== 'all'
									? 'Try adjusting your search or filters'
									: 'Get started by creating your first project'}
							</p>
							{!searchQuery && statusFilter === 'all' && (
								<button
									onClick={handleCreateProject}
									className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700
										text-white rounded-lg font-medium transition-colors"
								>
									<Plus className="w-5 h-5" />
									Create Your First Project
								</button>
							)}
						</div>
					</div>
				) : (
					<div className=" overflow-hidden">
						<div className="divide-y divide-border-subtle">
						{filteredProjects.map((project) => (
							<ProjectCard
								key={project.id}
								project={project}
								onView={handleViewProject}
								onEdit={handleEditProject}
								onDelete={handleDeleteProject}
								onToggleStatus={handleToggleStatus}
								isUpdating={updatingProjectId === project.id}
								openMenu={openMenu}
								setOpenMenu={setOpenMenu}
							/>
						))}
						</div>
					</div>
				)}
			</div>

			{/* Modals */}
			<CreateProjectModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSuccess={handleModalSuccess}
			/>

			<EditProjectModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false)
					setSelectedProject(null)
				}}
				onSuccess={handleModalSuccess}
				project={selectedProject}
			/>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false)
					setSelectedProject(null)
				}}
				onConfirm={handleConfirmDelete}
				projectName={selectedProject?.name || ''}
				isDeleting={deletingProjectId === selectedProject?.id}
			/>

			<StatusChangeConfirmationModal
				isOpen={isStatusModalOpen}
				onClose={() => {
					setIsStatusModalOpen(false);
					setStatusTargetProject(null);
				}}
				onConfirm={handleConfirmStatusChange}
				projectName={statusTargetProject?.name || ''}
				currentStatus={statusTargetProject?.status || ''}
				newStatus={statusTargetNewStatus}
				isUpdating={updatingProjectId === statusTargetProject?.id}
			/>

			<ProjectDetailsModal
				isOpen={isDetailsModalOpen}
				onClose={() => {
					setIsDetailsModalOpen(false)
					setSelectedProject(null)
				}}
				project={projectDetailData?.data || null}
				isLoading={isDetailLoading}
			/>
		</div>
	)
}
