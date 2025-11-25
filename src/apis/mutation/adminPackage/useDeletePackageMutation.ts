import { useForm } from "@/hooks/useForm";
import { PACKAGES_ENDPOINTS } from "@/apis/endpoints/adminPackages_apis";

export function useDeletePackageMutation(packageId: number | string) {
	const { submit, isLoading, data, errors, setData } = useForm(
		PACKAGES_ENDPOINTS.DELETE(packageId),
		{},
		{
			method: 'DELETE'
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
