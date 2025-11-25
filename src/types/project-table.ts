export interface TableColumn {
    id: string
    name: string
    data_type: string
    is_nullable: boolean
    default_value?: string | null
    is_primary_key: boolean
    is_unique: boolean
    is_indexed: boolean
    max_length?: number | null
    precision?: number | null
    scale?: number | null
    createdAt: string
    updatedAt: string
}

export interface ProjectTable {
    id: string
    project_id: string
    table_name: string
    name?: string
    description?: string | null
    row_count?: number
    columns_count?: number
    status?: 'active' | 'inactive'
    schema_json: string | ColumnSchema[]
    api_endpoints?: string | ApiEndpoint[]
    createdAt: string
    updatedAt: string
    columns?: TableColumn[]
    Project?: {
        id: string
        name: string
        status: 'active' | 'inactive'
    }
}

export interface ColumnSchema {
    name: string
    data_type: string
    is_nullable: boolean
    default_value?: string | null
    is_primary_key: boolean
    is_unique: boolean
    is_indexed?: boolean
    max_length?: number | null
    precision?: number | null
    scale?: number | null
}

export interface ApiEndpoint {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    path: string
    description?: string
    enabled?: boolean
}

export interface TableCreateRequest {
    project_id: string
    table_name: string
    schema_json: ColumnSchema[]
    api_endPoints: ApiEndpoint[]
}

export interface TableUpdateRequest {
    schema_json: ColumnSchema[];
	table_name: string;
	api_endPoints: ApiEndpoint[];
    // description?: string
}

export interface ProjectTableListResponse {
    status: boolean
    message: string
    data: ProjectTable[]
}

export interface ProjectTableDetailResponse {
    status: boolean
    message: string
    data: ProjectTable
}

export interface TableCreateResponse {
    status: boolean
    message: string
    data: ProjectTable
}

export interface TableUpdateResponse {
    status: boolean
    message: string
    data: ProjectTable
}

export interface TableDeleteResponse {
    status: boolean
    message: string
}
