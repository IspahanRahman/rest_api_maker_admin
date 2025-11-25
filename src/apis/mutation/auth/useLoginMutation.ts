import { login } from '@/apis/endpoints/auth_apis';
import { useForm } from "@/hooks/useForm";
import { LoginRequest } from '@/types/auth';

export function useLoginMutation() {
	const { submit, isLoading, data, errors, setData } = useForm<LoginRequest>(
		login,
		{
			email: '',
			password: ''
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
