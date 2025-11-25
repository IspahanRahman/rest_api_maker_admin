import { useForm } from "@/hooks/useForm";
import { PROJECTS_ENDPOINTS } from "@/apis/endpoints/customerProjects_apis";

export function usePatchProjectMutation(projectId: string) {
	const { submit, isLoading, data, errors, setData } = useForm<{ status: string }>(
		PROJECTS_ENDPOINTS.PATCH(projectId),
		{
			status: ""
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
