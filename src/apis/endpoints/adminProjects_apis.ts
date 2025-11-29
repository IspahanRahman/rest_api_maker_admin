export const PROJECTS_ENDPOINTS = {
	LIST: '/admin/projects',
	DETAIL: (projectId: string) => `/admin/projects/${projectId}`,
	USER_PROJECTS: (userId: string) => `/admin/projects/users/${userId}`,
	DELETE: (projectId: string) => `/admin/projects/${projectId}`,
	PATCH: (projectId: string) => `/admin/projects/${projectId}/status`,
}
