import { useForm } from '@/hooks/useForm'
import { TABLES_ENDPOINTS } from '@/apis/endpoints/projectTables_apis'

export function useDeleteTableMutation(tableId: string) {
	const { submit, isLoading, data, errors } = useForm<{}>(
		TABLES_ENDPOINTS.DELETE(tableId),
		{},
		{
			method: 'DELETE',
		}
	)

	return {
		submit,
		isLoading,
		data,
		errors,
	}
}
