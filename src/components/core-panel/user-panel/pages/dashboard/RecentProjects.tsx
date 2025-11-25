import React from 'react'
import { FolderKanban, MoreVertical, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Project {
  id: number
  name: string
  description?: string
  db_name: string
  db_user: string
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

interface RecentProjectsProps {
  projects: Project[]
  isLoading?: boolean
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'active':
      return {
        label: 'Active',
        icon: CheckCircle2,
        className: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
      }
    case 'inactive':
      return {
        label: 'Inactive',
        icon: XCircle,
        className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
      }
    case 'suspended':
      return {
        label: 'Suspended',
        icon: AlertCircle,
        className: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
      }
    default:
      return {
        label: status,
        icon: Clock,
        className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
      }
  }
}

export const RecentProjects: React.FC<RecentProjectsProps> = ({ projects, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-surface-card rounded-xl shadow-sm border border-border-subtle p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-input rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface-input rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-card rounded-xl shadow-sm border border-border-subtle overflow-hidden">
      <div className="p-6 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary-sem flex items-center gap-2">
            <FolderKanban className="w-5 h-5" />
            Recent Projects
          </h2>
          <Link
            href="/dashboard/projects"
            className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="divide-y divide-border-subtle">
        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <FolderKanban className="w-12 h-12 mx-auto text-text-secondary mb-3 opacity-50" />
            <p className="text-text-secondary">No projects yet</p>
            <Link
              href="/dashboard/projects/new"
              className="inline-block mt-4 text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              Create your first project
            </Link>
          </div>
        ) : (
          projects.map((project) => {
            const statusConfig = getStatusConfig(project.status)
            const StatusIcon = statusConfig.icon

            return (
              <div
                key={project.id}
                className="p-4 hover:bg-surface-hover transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-text-primary-sem truncate">
                        {project.name}
                      </h3>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                          statusConfig.className
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </div>

                    {project.description && (
                      <p className="text-sm text-text-secondary line-clamp-1 mb-2">
                        {project.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span>DB: {project.db_name}</span>
                      <span>•</span>
                      <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    className="p-2 rounded-lg hover:bg-surface-input transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4 text-text-secondary" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
