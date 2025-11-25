import { useForm } from "@/hooks/useForm";
import { PACKAGES_ENDPOINTS } from "@/apis/endpoints/adminPackages_apis";

export interface StatusUpdatePackageRequest {
	status: 'active' | 'inactive';
}

export function useStatusUpdatePackageMutation(packageId: number | string) {
	const { submit, isLoading, data, errors, setData } = useForm<StatusUpdatePackageRequest>(
		PACKAGES_ENDPOINTS.STATUS_UPDATE(packageId),
		{
			status: 'active'
		},
		{
			method: 'PATCH'
		}
	)

	return {
		submit,
		isLoading,
		data,
		errors,
		setData
	};
}
