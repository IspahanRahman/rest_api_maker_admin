export interface ProjectCreateRequest {
	package_plan_id: string;
	name: string;
	description?: string;
}

export interface Project {
	id: string;
	user_id: string;
	name: string;
	description?: string | null;
	db_name: string;
	db_user: string | null;
	db_password: string | null;
	api_base_url: string | null;
	status: 'active' | 'inactive' | 'suspended';
	createdAt: string;
	updatedAt: string;
	package_plan_id: string;
}

export interface ProjectListResponse {
	status: boolean;
	message: string;
	data: Project[];
}

export interface ProjectDetailResponse {
	status: boolean;
	message: string;
	data: Project;
}

export interface ProjectUpdateRequest {
	package_plan_id?: string;
	name?: string;
	description?: string;
	status?: 'active' | 'inactive' | 'suspended';
}

