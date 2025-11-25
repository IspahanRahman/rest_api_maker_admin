import { useForm } from "@/hooks/useForm";
import { PROJECTS_ENDPOINTS } from "@/apis/endpoints/customerProjects_apis";
import { ProjectUpdateRequest } from "@/types/customer-project";

export function useUpdateProjectMutation(projectId: string) {
	const { submit, isLoading, data, errors, setData } = useForm<ProjectUpdateRequest>(
		PROJECTS_ENDPOINTS.UPDATE(projectId),
		{
			package_plan_id: "",
			name: "",
			description: ""
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
