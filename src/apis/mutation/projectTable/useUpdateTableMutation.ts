import { useForm } from '@/hooks/useForm'
import { TABLES_ENDPOINTS } from '@/apis/endpoints/projectTables_apis'
import { TableUpdateRequest } from '@/types/project-table'

export function useUpdateTableMutation(tableId: string) {
	const { submit, isLoading, data, errors, setData } = useForm<TableUpdateRequest>(
		TABLES_ENDPOINTS.UPDATE(tableId),
		{
			schema_json: [],
			table_name: '',
			api_endPoints: [],
		},
		{
			method: 'PUT',
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
