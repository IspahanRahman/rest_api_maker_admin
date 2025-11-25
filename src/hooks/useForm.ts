import { FormEvent, useState } from 'react'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { AxiosFetcher } from '@/apis/configs'

/**
 * A generic hook to handle form submission.
 *
 * @typeParam TData - The shape of your form data (e.g., { name: string; avatar: File }).
 * @typeParam TResponse - The shape of the server response (e.g., { success: boolean; message: string }).
 *
 * @param submitUrl - The endpoint URL.
 * @param initialValues - Default form values.
 * @param config - Additional axios configuration options (method, headers, etc.).
 */

type InitialOptions = string | number | boolean | File | string[] | number[] | boolean[] | Record<string, any> |{
	value: string | number
	validation: string
}

type InitialValueType<T> = {
	[key in keyof T]: InitialOptions | string
}

export function useForm<TData extends Record<string, any> = Record<string, any>, TResponse = any>(
	submitUrl: string,
	initialValues: InitialValueType<TData> = {} as InitialValueType<TData>,
	config?: AxiosRequestConfig & { headers?: Record<string, string> }
) {
	const { method, headers = {} }: AxiosRequestConfig = config || {}

	// State for form initialValues
	const [data, setDataState] = useState<TData>(Object.entries(initialValues).reduce((acc, [key, value]) => {
		// @ts-ignore
		acc[key] = typeof value === 'object' ? value.value : value
		return acc
	}, {} as TData))

	// State for errors; you can adjust the error type to suit your APIs structure
	const [errors, setErrors] = useState<Partial<Record<keyof TData, string>>>({})

	// Loading and server response states
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [responseData, setResponseData] = useState<AxiosResponse | null>(null)

	function isValidate(rules: { [key: string]: string }) {
		Object.keys(rules).forEach((fieldName) => {

			// const validationStr = rules[fieldName].split('|')
			const validationStr = typeof rules[fieldName] === 'string' ? rules[fieldName].split('|') : [];

			validationStr.forEach((rule) => {
				const [ruleName, ruleValue] = rule.split(':')

				let e = null
				if (ruleName === 'required' && !data[fieldName]) {
					e = `This field is required`
				} else if (ruleName === 'min' && data[fieldName].length < parseInt(ruleValue)) {
					e = `This field must be at least ${ruleValue} characters`
				} else if (ruleName === 'max' && data[fieldName].length > parseInt(ruleValue)) {
					e = `This field must be at most ${ruleValue} characters`
				} else if (ruleName === 'email' && !/^\S+@\S+\.\S+$/.test(data[fieldName])) {
					e = `This field must be a valid email address`
				} else if (ruleName === 'confirmed' && data[fieldName] !== data[ruleValue]) {
					e = `This field must match ${ruleValue}`
				} else if (ruleName === 'regex' && !new RegExp(ruleValue).test(data[fieldName])) {
					e = `This field must match ${ruleValue}`
				}

				setErrors((prev) => ({
					...prev,
					[fieldName]: e
				}))
			})
		})
	}

	/**
	 * Updates a single field in the form data.
	 * Clears the error for that field if it exists.
	 * @param fieldName - The name of the form field (key of TData).
	 * @param fieldValue - The new value for that field.
	 */
	function setData<Key extends keyof TData>(fieldName: Key, fieldValue: TData[Key]) {
		setDataState((prev) => ({
			...prev,
			[fieldName]: fieldValue
		}))

		// Optionally clear the existing error for that field
		setErrors((prev) => ({
			...prev,
			[fieldName]: undefined
		}))
	}

	/**
	 * Submits the form data via AxiosFetcher.
	 * @param event - The form event (if called via onSubmit).
	 * @returns The Axios response or partial data on error.
	 */
	async function submit(event?: FormEvent<HTMLFormElement>): Promise<null | TResponse> {
		// Prevent default form submission behavior
		event?.preventDefault()

		setIsLoading(true)
		setErrors({})
		setResponseData(null)

		// extract validation rules
		const validationRules = Object.entries(initialValues).reduce((acc, [key, value]) => {
			// @ts-ignore
			acc[key] = typeof value === 'object' ? value.validation : null
			return acc
		}, {} as Record<keyof TData, string>)

		isValidate(validationRules)

		// check if there is any error
		if (Object.values(errors).some((e) => e)) {
			setIsLoading(false)
			return null
		}

		const isMultipart = Object.values(data).some(
			(value) => value instanceof File || (Array.isArray(value) && value.some(v => v instanceof File))
		);
		let requestData: TData | FormData = data

		// If this is multipart form data, construct a FormData object
		if (isMultipart) {
			const formData = new FormData();
			Object.keys(data).forEach((key) => {
				const value = data[key as keyof TData];

				if (key === 'additional_questions' && Array.isArray(value)) {
					value.forEach((item: any, index: number) => {
						Object.keys(item).forEach((subKey) => {
							formData.append(`additional_questions[${index}][${subKey}]`, String(item[subKey]));
						});
					});

				} else if (Array.isArray(value)) {
					value.forEach((item: any) => {
						if (item instanceof File) {
							formData.append(key, item);
						} else {
							formData.append(`${key}[]`, String(item)); // ✅ use brackets here
						}
					});
				} else if ((value as any) instanceof File) {
					formData.append(key, value);
				} else if (value !== undefined && value !== null) {
					formData.append(key, String(value));
				}
			});

			requestData = formData;
		}


		try {
			const response = await AxiosFetcher({
				...config,
				url: submitUrl,
				// @ts-ignore
				method,
				data: requestData,
				headers: {
					...headers
				}
			})

			setResponseData(response)
			return response as TResponse
		} catch (error: any) {
			let returnedData: TResponse | null = null

			if (error.response) {
				const { data: errorResponse } = error.response as AxiosResponse<TResponse>
				setResponseData(error.response)
				returnedData = errorResponse

				// If Laravel-style validation errors
				if ((errorResponse as any).errors) {
					setErrors((errorResponse as any).errors)
				}
				// If "old" data is returned, repopulate the form
				if ((errorResponse as any).old) {
					setDataState((errorResponse as any).old)
				}
			} else {
				console.error('Error submitting form:', error.message)
			}

			return returnedData
		} finally {
			setIsLoading(false)
		}
	}


	const register = (fieldName: keyof TData) => ({
		name: fieldName,
		value: data[fieldName],
		onChange: (e: any) => {
			if (e.target.type === 'file') {
				setData(fieldName, e.target.files[0])
			} else if (e.target.type === 'checkbox') {
				setData(fieldName, e.target.checked)
			} else {
				setData(fieldName, e.target.value)
			}
		}
	})

	return {
		data,
		setData,
		submit,
		isLoading,
		errors,
		responseData,
		register
	}
}
