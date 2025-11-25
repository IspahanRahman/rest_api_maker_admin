import { register } from '@/apis/endpoints/auth_apis'
import { useForm } from '@/hooks/useForm'
import { RegisterRequest } from '@/types/auth'

export function useRegisterMutation() {
	const { submit, isLoading, data, errors, setData, register: registerField } =
		useForm<RegisterRequest>(
			register,
			{
				name: '',
				email: '',
				password: '',
				password_confirmation: '',
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
		setData,
		register: registerField
	}
}
