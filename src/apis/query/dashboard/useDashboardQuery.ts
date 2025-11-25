import { useQuery } from '@/hooks/useQuery'
import { DASHBOARD_ENDPOINTS } from '@/apis/endpoints/dashboard_apis'

interface DashboardStats {
  totalProjects: number
  activeProjects: number
  inactiveProjects: number
  suspendedProjects: number
  activePackages: number
  totalPayments: number
  completedPayments: number
  pendingPayments: number
  failedPayments: number
  monthlySpending: number
  lastMonthSpending: number
}

interface Project {
  id: number
  name: string
  description?: string
  db_name: string
  db_user: string
  db_password: string
  api_base_url: string
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

interface Payment {
  id: number
  user_id: number
  package_id: number
  package_name?: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  payment_method?: string
  transaction_id?: string
  created_at: string
  updated_at: string
}

interface Activity {
  id: number
  user_id: number
  action: string
  description: string
  timestamp: string
}

export const useDashboardStats = () => {
  return useQuery<DashboardStats>(DASHBOARD_ENDPOINTS.STATS)
}

export const useRecentProjects = () => {
  return useQuery<Project[]>(DASHBOARD_ENDPOINTS.RECENT_PROJECTS)
}

export const useRecentPayments = () => {
  return useQuery<Payment[]>(DASHBOARD_ENDPOINTS.RECENT_PAYMENTS)
}

export const useRecentActivity = () => {
  return useQuery<Activity[]>(DASHBOARD_ENDPOINTS.ACTIVITY)
}
