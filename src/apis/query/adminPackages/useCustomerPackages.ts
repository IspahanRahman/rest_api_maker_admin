import { useQuery } from '@/hooks/useQuery'
import { PACKAGES_ENDPOINTS } from '@/apis/endpoints/adminPackages_apis';

export const usePackages = () => {
  return useQuery<any>(PACKAGES_ENDPOINTS.LIST)
}

export const usePackageDetails = (id: string) => {
  return useQuery<any>(`${PACKAGES_ENDPOINTS.DETAIL(id)}`)
}

export const usePurchasedPackages = () => {
  return useQuery<any>(PACKAGES_ENDPOINTS.LIST)
}
