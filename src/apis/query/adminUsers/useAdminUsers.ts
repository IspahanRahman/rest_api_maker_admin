import { usePaginatedQuery }  from '@/hooks/usePaginatedQuery';
import { useQuery } from '@/hooks/useQuery';
import { USER_ENDPOINTS } from '@/apis/endpoints/adminUsers_apis';

export const useAdminUsers = ({ page, limit }: { page: number; limit: number }) => {
  return usePaginatedQuery<any>(USER_ENDPOINTS.LIST, page, limit)
}
