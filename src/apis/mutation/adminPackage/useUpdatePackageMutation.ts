import { useForm } from "@/hooks/useForm";
import { PACKAGES_ENDPOINTS } from "@/apis/endpoints/adminPackages_apis";
import { UpdatePackageRequest } from "@/types/admin-package";

export function useUpdatePackageMutation(packageId: number | string) {
	const { submit, isLoading, data, errors, setData } = useForm<UpdatePackageRequest>(
		PACKAGES_ENDPOINTS.UPDATE(packageId),
		{
			name: "",
			status: "active",
			max_projects: 0,
			max_tables_per_project: 0,
			features: {},
			plans: []
		},
		{
			method: 'PUT'
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
