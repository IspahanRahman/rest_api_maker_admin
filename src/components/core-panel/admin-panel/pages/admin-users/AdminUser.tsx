'use client';

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAdminUsers } from '@/apis/query/adminUsers/useAdminUsers';
import AdminUsersHeader from './components/AdminUsersHeader';
import AdminUsersTable from './components/AdminUsersTable';
import AdminUsersPagination from './components/AdminUsersPagination';

export default function AdminUser() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, mutate, error } = useAdminUsers({ page, limit });

  const apiStatus = data?.status;
  const apiMessage = data?.message;
  const users = data?.data ?? [];
  const paginationMeta = data?.pagination;

  const pagination = paginationMeta ?? {
    total: users.length,
    page,
    limit,
    totalPages: 1,
  };

  // If API responded but status === false, show a nice error card
  if (apiStatus === false) {
    return (
      <div className="space-y-4">
        <div className="bg-surface-card border border-red-200 rounded-xl px-4 py-6 sm:px-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-red-50 p-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary-sem">
                Failed to load users
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                {apiMessage || 'The server responded with an error while fetching users.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminUsersHeader total={pagination.total} />

      <AdminUsersTable
        users={users}
        isLoading={isLoading}
        // isFetching={isFetching}
        error={error}
      />

      <AdminUsersPagination
        pagination={pagination}
        onPageChange={(newPage) => {
          if (newPage !== page) setPage(newPage);
        }}
      />
    </div>
  );
}
