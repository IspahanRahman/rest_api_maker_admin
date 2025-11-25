export const PROJECTS_ENDPOINTS = {
	CREATE: '/customer/projects',
	LIST: '/customer/projects',
	UPDATE: (projectId: string) => `/customer/projects/${projectId}`,
	DETAIL: (projectId: string) => `/customer/projects/${projectId}`,
	DELETE: (projectId: string) => `/customer/projects/${projectId}`,
	PATCH: (projectId: string) => `/customer/projects/${projectId}/status`,
}
