import { useForm } from "@/hooks/useForm";
import { PACKAGES_ENDPOINTS } from "@/apis/endpoints/adminPackages_apis";
import { CreatePackageRequest } from "@/types/admin-package";

export function useCreatePackageMutation() {
	const { submit, isLoading, data, errors, setData } = useForm<CreatePackageRequest>(
		PACKAGES_ENDPOINTS.CREATE,
		{
			name: "",
			status: "active",
			max_projects: 0,
			max_tables_per_project: 0,
			features: {},
			plans: []
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
