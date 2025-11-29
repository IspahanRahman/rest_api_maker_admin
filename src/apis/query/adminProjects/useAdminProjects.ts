import  { usePaginatedQuery }  from '@/hooks/usePaginatedQuery';
import { useQuery } from '@/hooks/useQuery';
import { PROJECTS_ENDPOINTS } from '@/apis/endpoints/adminProjects_apis';

//implement page and limit in useAdminProjects
export const useAdminProjects = ({ page, limit }: { page: number; limit: number }) => {
  return usePaginatedQuery<any>(PROJECTS_ENDPOINTS.LIST, page, limit)
}

export const useAdminProjectDetail = (projectId: string) => {
  return useQuery<any>(PROJECTS_ENDPOINTS.DETAIL(projectId))
}

export const useUserAdminProjects = (userId: string) => {
  return usePaginatedQuery<any>(PROJECTS_ENDPOINTS.USER_PROJECTS(userId))
}
