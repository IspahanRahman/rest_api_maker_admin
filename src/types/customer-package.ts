export type PlanTerm = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly' | 'custom'

export interface PackagePlan {
	id: string
	plan_type: string // 'monthly' | 'yearly' | others | ''
	duration_days: number
	price: number
	discount_type?: string // 'percentage' | 'fixed' | null
	discount_value?: number
	final_price: number
	status?: string
	term?: PlanTerm
}

export interface PackageType {
	id: string
	name: string
	status?: string
	sell_count?: number
	max_projects?: number
	max_tables_per_project?: number
	features?: Record<string, any>
	plans: PackagePlan[]
}

export interface PackageBuyRequest{
	package_plan_id: string;
}
