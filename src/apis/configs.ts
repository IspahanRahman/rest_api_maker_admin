import axios from 'axios'
import { ApiRequestConfig } from '@/types/config'
import { LOCAL_STORAGE_KEYS } from '@/config/constants'
import { env } from '@/config/env'

// Validate environment variables on initialization
if (!env.apiBaseUrl) {
	throw new Error(
		'NEXT_PUBLIC_API_BASE_URL is not defined in .env\n' +
			'Please check your .env file and ENV_GUIDE.md for setup instructions.'
	)
}

const AxiosAPI = axios.create({
	baseURL: env.apiBaseUrl,
	timeout: env.apiTimeout,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	},
	withCredentials: false
})

AxiosAPI.interceptors.request.use((config) => {
	const token = typeof window !== 'undefined'
	? window.localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
	: null;
	// window.localStorage.setItem("user_id", "1");
	// window.localStorage.setItem("organization_id", "1");
	// const token =
	// 	'd40478aa4c136eb977f0315113bc075bd5ab4dfc3b303e2120742b2cf44aec85'
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})


export const AxiosFetcher = async (args: string | ApiRequestConfig) => {
	if (typeof args === 'string') {
		// Check for export in URL
		const isExport = args.includes('/export');
		return await AxiosAPI.get(args, {
			responseType: isExport ? 'arraybuffer' : 'json'
		}).then((res) => res.data);
	} else {
		const { data, ...rest } = args
		// Detect export by URL or add `isExport: true` in custom config
		const isExport = rest.url?.includes('/export') || rest.responseType === 'arraybuffer';

		if (data && data instanceof FormData) {
			rest.headers = {
				...rest.headers,
				'Content-Type': 'multipart/form-data'
			}
		}
		return await AxiosAPI.request({
			data,
			responseType: isExport ? 'arraybuffer' : 'json',
			...rest
		}).then((res) => res.data)
	}
}
