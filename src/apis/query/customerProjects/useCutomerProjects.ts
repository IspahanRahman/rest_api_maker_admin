import  { usePaginatedQuery }  from '@/hooks/usePaginatedQuery';
import { useQuery } from '@/hooks/useQuery';
import { PROJECTS_ENDPOINTS } from '@/apis/endpoints/customerProjects_apis';

export const useCustomerProjects = () => {
  return usePaginatedQuery<any>(PROJECTS_ENDPOINTS.LIST)
}

export const useCustomerProjectDetail = (projectId: string) => {
  return useQuery<any>(PROJECTS_ENDPOINTS.DETAIL(projectId))
}
