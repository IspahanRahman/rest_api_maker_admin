// Packages API Endpoints
export const PACKAGES_ENDPOINTS = {
  LIST: '/admin/package',
  DETAIL: (id: number | string) => `/admin/package/${id}`,
  CREATE: `/admin/package`,
  UPDATE: (id: number | string) => `/admin/package/${id}`,
  DELETE: (id: number | string) => `/admin/package/${id}`,
  STATUS_UPDATE: (id: number | string) => `/admin/package/${id}/status`,
}
