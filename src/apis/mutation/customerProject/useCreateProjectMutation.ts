import { useForm } from "@/hooks/useForm";
import { PROJECTS_ENDPOINTS } from "@/apis/endpoints/customerProjects_apis";
import { ProjectCreateRequest } from "@/types/customer-project";

export function useCreateProjectMutation() {
	const { submit, isLoading, data, errors, setData } = useForm<ProjectCreateRequest>(
		PROJECTS_ENDPOINTS.CREATE,
		{
			package_plan_id: "",
			name: "",
			description: ""
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
