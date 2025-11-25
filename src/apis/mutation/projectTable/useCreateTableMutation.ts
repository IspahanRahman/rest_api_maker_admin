import { useForm } from '@/hooks/useForm'
import { TABLES_ENDPOINTS } from '@/apis/endpoints/projectTables_apis'
import { TableCreateRequest } from '@/types/project-table'

export function useCreateTableMutation() {
	const { submit, isLoading, data, errors, setData } = useForm<TableCreateRequest>(
		TABLES_ENDPOINTS.CREATE,
		{
			project_id: '',
			table_name: '',
			schema_json: [],
			api_endPoints: [],
		},
		{
			method: 'POST',
		}
	)

	return {
		submit,
		isLoading,
		data,
		errors,
		setData,
	}
}
