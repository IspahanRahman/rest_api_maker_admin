import React from 'react'
import { CreditCard, TrendingUp, CheckCircle2, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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

interface RecentPaymentsProps {
  payments: Payment[]
  isLoading?: boolean
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        icon: CheckCircle2,
        className: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
      }
    case 'pending':
      return {
        label: 'Pending',
        icon: Clock,
        className: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
      }
    case 'failed':
      return {
        label: 'Failed',
        icon: XCircle,
        className: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
      }
    default:
      return {
        label: status,
        icon: Clock,
        className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
      }
  }
}

export const RecentPayments: React.FC<RecentPaymentsProps> = ({ payments, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-surface-card rounded-xl shadow-sm border border-border-subtle p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-input rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface-input rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-card rounded-xl shadow-sm border border-border-subtle overflow-hidden">
      <div className="p-6 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary-sem flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Recent Payments
          </h2>
          <Link
            href="/dashboard/payments"
            className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="divide-y divide-border-subtle">
        {payments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 mx-auto text-text-secondary mb-3 opacity-50" />
            <p className="text-text-secondary">No payment history</p>
          </div>
        ) : (
          payments.map((payment) => {
            const statusConfig = getStatusConfig(payment.status)
            const StatusIcon = statusConfig.icon

            return (
              <div
                key={payment.id}
                className="p-4 hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                      <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-text-primary-sem truncate">
                          {payment.package_name || `Package #${payment.package_id}`}
                        </h3>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                            statusConfig.className
                          )}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-text-secondary">
                        {payment.payment_method && (
                          <>
                            <span>{payment.payment_method}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{new Date(payment.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-text-primary-sem">
                      ${payment.amount.toFixed(2)}
                    </p>
                    {payment.transaction_id && (
                      <p className="text-xs text-text-secondary truncate max-w-[100px]">
                        {payment.transaction_id}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
