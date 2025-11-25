import { AxiosRequestConfig } from 'axios'
import { SWRConfiguration } from 'swr'

export interface ApiRequestConfig extends AxiosRequestConfig {
	url: string
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	data?: object | FormData,
}

export interface SWRConfig extends SWRConfiguration {
	shouldRetryOnError?: boolean
}

export type TResponse<T> = {
	message: string
	data: T
}

export type TResponsePagination<T> = {
	message: string
	data: T extends Array<unknown>
	  ? { current_page: number; data: T } & PaginationMeta
	  : T
  }

  type PaginationMeta = {
	first_page_url: string
	from: number
	last_page: number
	last_page_url: string
	links: { url: string | null; label: string; active: boolean }[]
	next_page_url: string | null
	path: string
	per_page: number
	prev_page_url: string | null
	to: number
	total: number
  }

  export interface Paginated<T> {
	current_page: number
	data: T[]
	total: number
	per_page: number
	// ... other pagination metadata
}

export type PaginatedEmployeeResponse<T> = {
	current_page: number;
	data: T[];
	first_page_url: string;
	from: number;
	last_page: number;
	last_page_url: string;
	links: { url: string | null; label: string; active: boolean }[];
	next_page_url: string | null;
	path: string;
	per_page: number;
	prev_page_url: string | null;
	to: number;
	total: number;
  };
