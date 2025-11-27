interface Plan {
	plan_type: "monthly" | "yearly" | "quarterly" | "half-yearly";
	duration_days: number;
	price: number;
	discount_type?: "percentage" | "fixed";
	discount_value?: number;
	status: "active" | "inactive";
}

export interface CreatePackageRequest {
	name: string;
	status: "active" | "inactive";
	max_projects: number;
	max_tables_per_project: number;
	features: Record<string, any>;
	plans: Plan[];
}

export interface UpdatePackageRequest {
	name?: string;
	status?: "active" | "inactive";
	max_projects?: number;
	max_tables_per_project?: number;
	features?: Record<string, any>;
	plans?: Plan[];
}
