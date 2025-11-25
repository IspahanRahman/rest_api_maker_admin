import { SWRConfig } from '@/types/config'
import { useQuery } from '@/hooks/useQuery'
import { useCallback, useState } from 'react'

interface PaginatedResponse<T> {
  data: T[];             // Paginated data array
  current_page: number;  // Current page
  last_page: number;     // Last page
  // ... plus anything else your server returns
}

// Example: You might want to parameterize the shape of data, e.g. T
export function usePaginatedQuery<T>(
	urlOrConfig: string,
	initialPage = 1,
	initialPerPage = 10,
	swrConfig?: SWRConfig
  ) {
	const [page, setPage] = useState(initialPage);
	const [perPage, setPerPage] = useState(initialPerPage);

	const paginatedUrl = `${urlOrConfig}`;

	const {
	  data,
	  error,
	  isLoading,
	  mutate,
	} = useQuery<T>(paginatedUrl, swrConfig); // ✅ Note: <T>, not <PaginatedResponse<T>>

	return {
	  data,
	  isLoading,
	  error,
	  currentPage: (data as any)?.current_page ?? 1,
	  lastPage: (data as any)?.last_page ?? 1,
	  setPage,
	  setPageSize: (newPerPage: number) => {
		setPerPage(newPerPage);
		setPage(1);
	  },
	  nextPage: () => {
		if ((data as any)?.current_page < (data as any)?.last_page) {
		  setPage(prev => prev + 1);
		}
	  },
	  prevPage: () => {
		if ((data as any)?.current_page > 1) {
		  setPage(prev => prev - 1);
		}
	  },
	  goToPage: (pageNum: number) => {
		if (
		  pageNum >= 1 &&
		  pageNum <= (data as any)?.last_page
		) {
		  setPage(pageNum);
		}
	  },
	  mutate,
	};
  }
