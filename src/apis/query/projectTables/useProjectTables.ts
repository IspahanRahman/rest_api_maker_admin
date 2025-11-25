import { useQuery } from '@/hooks/useQuery'
import { TABLES_ENDPOINTS } from '@/apis/endpoints/projectTables_apis'

export const useProjectTables = (projectId: string) => {
  return useQuery<any>(projectId ? TABLES_ENDPOINTS.LIST(projectId) : '')
}

export const useProjectTableDetail = (tableId: string | null) => {
  return useQuery<any>(tableId ? TABLES_ENDPOINTS.DETAIL(tableId) : '')
}
