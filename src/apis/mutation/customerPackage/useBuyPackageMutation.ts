import { useForm } from "@/hooks/useForm";
import { PACKAGES_ENDPOINTS } from "@/apis/endpoints/customerPackages_apis";
import { PackageBuyRequest } from "@/types/customer-package";

export function useBuyPackageMutation() {
	const { submit, isLoading, data, errors, setData } = useForm<PackageBuyRequest>(
		PACKAGES_ENDPOINTS.PURCHASE,
		{
			package_plan_id: ""
		},
		{
			method: 'POST'
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

