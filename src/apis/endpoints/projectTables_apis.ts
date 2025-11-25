export const TABLES_ENDPOINTS = {
	CREATE: '/customer/project-table',
	LIST: (projectId: string) => `/customer/project-table/all/${projectId}`,
	DETAIL: (tableId: string) => `/customer/project-table/${tableId}`,
	UPDATE: (tableId: string) => `/customer/project-table/${tableId}`,
	DELETE: (tableId: string) => `/customer/project-table/${tableId}`,
	COLUMNS: (tableId: string) => `/customer/project-table/${tableId}/columns`,
}
