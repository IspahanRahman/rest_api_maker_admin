'use client'
import React, { useEffect, useState } from 'react'
import { Edit, Loader2, Plus, Trash2 } from 'lucide-react'
import { useUpdateTableMutation } from '@/apis/mutation/projectTable/useUpdateTableMutation'
import { ProjectTable, ColumnSchema, ApiEndpoint } from '@/types/project-table'
import { toast } from 'react-toastify'
import Modal from '@/components/common/Modal'
import Swal from 'sweetalert2'

interface EditTableModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    table: ProjectTable | null
}

interface ColumnDef {
    id: string
    name: string
    data_type: string
    is_nullable: boolean
    is_primary_key: boolean
    is_unique: boolean
    is_indexed?: boolean
    default_value?: string
    max_length?: number
    precision?: number
    scale?: number
}

const DATA_TYPES = [
    'INTEGER',
    'BIGINT',
    'VARCHAR',
    'TEXT',
    'BOOLEAN',
    'DATE',
    'DATETIME',
    'TIMESTAMP',
    'DECIMAL',
    'FLOAT',
    'DOUBLE',
    'JSON',
]

export default function EditTableModal({ isOpen, onClose, onSuccess, table }: EditTableModalProps) {
    const { data, setData, submit, isLoading, errors } = useUpdateTableMutation(table?.id || '')
    const [columns, setColumns] = useState<ColumnDef[]>([])

	// Pre-fill form when table changes
	useEffect(() => {
		if (table && isOpen) {
			setData('table_name', table.table_name || table.name || '')

			// Convert table columns to ColumnDef format
			if (table.columns && table.columns.length > 0) {
				const columnDefs: ColumnDef[] = table.columns.map((col) => ({
					id: col.id,
					name: col.name,
					data_type: col.data_type,
					is_nullable: col.is_nullable,
					is_primary_key: col.is_primary_key,
					is_unique: col.is_unique,
					is_indexed: col.is_indexed || false,
					default_value: col.default_value || undefined,
					max_length: col.max_length || undefined,
					precision: col.precision || undefined,
					scale: col.scale || undefined,
				}))
				setColumns(columnDefs)
			}
		}
	}, [table, isOpen])

	const addColumn = () => {
        const newColumn: ColumnDef = {
            id: Date.now().toString(),
            name: '',
            data_type: 'VARCHAR',
            is_nullable: true,
            is_primary_key: false,
            is_unique: false,
            is_indexed: false,
        }
        setColumns([...columns, newColumn])
    }

    const removeColumn = (id: string) => {
        if (columns.length === 1) {
            toast.error('Table must have at least one column')
            return
        }
        setColumns(columns.filter((col) => col.id !== id))
    }

    const updateColumn = (id: string, field: keyof ColumnDef, value: any) => {
        setColumns(
            columns.map((col) =>
                col.id === id
                    ? {
                            ...col,
                            [field]: value,
                      }
                    : col
            )
        )
    }

    const buildSchemaJson = (): ColumnSchema[] => {
        return columns.map((col) => ({
            name: col.name,
            data_type: col.data_type,
            is_nullable: col.is_nullable,
            is_primary_key: col.is_primary_key,
            is_unique: col.is_unique,
            is_indexed: col.is_indexed || false,
            default_value: col.default_value || null,
            max_length: col.data_type === 'VARCHAR' ? (col.max_length || 255) : null,
            precision: col.precision || null,
            scale: col.scale || null,
        }))
    }

    const buildApiEndpoints = (): ApiEndpoint[] => {
        const baseTable = (data.table_name || table?.name || '').toLowerCase().replace(/\s+/g, '_')

        return [
            {
                method: 'GET',
                path: `/${baseTable}`,
                description: `Get all records from ${data.table_name || table?.name}`,
                enabled: true,
            },
            {
                method: 'GET',
                path: `/${baseTable}/:id`,
                description: `Get a specific record from ${data.table_name || table?.name}`,
                enabled: true,
            },
            {
                method: 'POST',
                path: `/${baseTable}`,
                description: `Create a new record in ${data.table_name || table?.name}`,
                enabled: true,
            },
            {
                method: 'PUT',
                path: `/${baseTable}/:id`,
                description: `Update a record in ${data.table_name || table?.name}`,
                enabled: true,
            },
            {
                method: 'DELETE',
                path: `/${baseTable}/:id`,
                description: `Delete a record from ${data.table_name || table?.name}`,
                enabled: true,
            },
        ]
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!data.table_name?.trim()) {
            toast.error('Table name is required')
            return
        }

        if (columns.length === 0) {
            toast.error('At least one column is required')
            return
        }

        // Validate columns
        for (const col of columns) {
            if (!col.name.trim()) {
                toast.error('All columns must have a name')
                return
            }
        }

        // Check for duplicate column names
        const columnNames = columns.map((c) => c.name.toLowerCase())
        if (new Set(columnNames).size !== columnNames.length) {
            toast.error('Duplicate column names are not allowed')
            return
        }

        try {
            // Build the request payload
            const schema_json = buildSchemaJson()
            const api_endPoints = buildApiEndpoints()

            // Update form data with all required fields
			data.schema_json = schema_json
			data.api_endPoints = api_endPoints

            // Submit the form
            const response = await submit()

            if (!response?.status) {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: response?.message || 'Table update failed',
                })
                return
            }

            toast.success('Table updated successfully!')
            onSuccess()
            handleClose()
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error?.response?.data?.message || 'An unexpected error occurred during table update.',
            })
        }
    }

    const handleClose = () => {
        if (!isLoading) {
            onClose()
            // Reset form data
            setData('table_name', '')
            setData('schema_json', [])
            setData('api_endPoints', [])
            setColumns([])
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Edit Table" size="lg" className="max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Header */}
                <div className="flex items-start gap-3 pb-4 border-b border-border-subtle dark:border-border-input">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <Edit className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">Edit Table Schema</h3>
                        <p className="text-sm text-text-secondary mt-0.5">Update table name, columns, and API endpoints</p>
                    </div>
                </div>

                {/* Read-only info */}
                {table && (
                    <div className="bg-surface-hover dark:bg-surface-card border border-border-subtle dark:border-border-input rounded-lg p-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-text-secondary block mb-1">Columns</span>
                                <span className="font-semibold text-foreground">{table.columns_count}</span>
                            </div>
                            <div>
                                <span className="text-text-secondary block mb-1">Rows</span>
                                <span className="font-semibold text-foreground">{table.row_count}</span>
                            </div>
                            <div>
                                <span className="text-text-secondary block mb-1">Created</span>
                                <span className="font-semibold text-foreground">
                                    {new Date(table.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Name */}
                <div>
                    <label htmlFor="edit-table-name" className="block text-sm font-medium text-foreground mb-2">
                        Table Name <span className="text-error-500">*</span>
                    </label>
                    <input
                        id="edit-table-name"
                        type="text"
                        value={data.table_name || ''}
                        onChange={(e) => setData('table_name', e.target.value)}
                        placeholder="e.g., users, products, orders"
                        disabled={isLoading}
                        className="w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
                            text-foreground placeholder:text-text-tertiary
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all"
                    />
                    {errors.table_name && (
                        <p className="mt-1.5 text-sm text-error-600 dark:text-error-400">{errors.table_name}</p>
                    )}
                </div>

                {/* Columns Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-foreground">
                            Columns <span className="text-error-500">*</span>
                            <span className="text-xs text-text-secondary ml-2">
                                ({columns.length} column{columns.length !== 1 ? 's' : ''})
                            </span>
                        </label>
                        <button
                            type="button"
                            onClick={addColumn}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Add Column
                        </button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto border border-border-subtle dark:border-border-input rounded-lg p-4 bg-surface-hover dark:bg-surface-card">
                        {columns.map((column, index) => (
                            <div
                                key={column.id}
                                className="bg-white dark:bg-surface-card border border-border-input dark:border-border-input rounded-lg p-4 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-text-secondary">Column {index + 1}</span>
                                    {columns.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeColumn(column.id)}
                                            disabled={isLoading}
                                            className="p-1 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Column Name */}
                                    <div>
                                        <label className="block text-xs text-text-secondary mb-1">
                                            Column Name <span className="text-error-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={column.name}
                                            onChange={(e) => updateColumn(column.id, 'name', e.target.value)}
                                            placeholder="column_name"
                                            disabled={isLoading}
                                            className="w-full px-3 py-2 text-sm bg-surface-input dark:bg-surface-card border border-border-input dark:border-border-input rounded-lg
                                                text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>

                                    {/* Data Type */}
                                    <div>
                                        <label className="block text-xs text-text-secondary mb-1">
                                            Data Type <span className="text-error-500">*</span>
                                        </label>
                                        <select
                                            value={column.data_type}
                                            onChange={(e) => updateColumn(column.id, 'data_type', e.target.value)}
                                            disabled={isLoading}
                                            className="w-full px-3 py-2 text-sm bg-surface-input dark:bg-surface-card border border-border-input dark:border-border-input rounded-lg
                                                text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            {DATA_TYPES.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Max Length for VARCHAR */}
                                    {column.data_type === 'VARCHAR' && (
                                        <div>
                                            <label className="block text-xs text-text-secondary mb-1">Max Length</label>
                                            <input
                                                type="number"
                                                value={column.max_length || 255}
                                                onChange={(e) =>
                                                    updateColumn(column.id, 'max_length', parseInt(e.target.value) || 255)
                                                }
                                                min="1"
                                                max="65535"
                                                disabled={isLoading}
                                                className="w-full px-3 py-2 text-sm bg-surface-input dark:bg-surface-card border border-border-input dark:border-border-input rounded-lg
                                                    text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                    )}

                                    {/* Precision and Scale for DECIMAL */}
                                    {(column.data_type === 'DECIMAL' || column.data_type === 'NUMERIC') && (
                                        <>
                                            <div>
                                                <label className="block text-xs text-text-secondary mb-1">Precision</label>
                                                <input
                                                    type="number"
                                                    value={column.precision || 10}
                                                    onChange={(e) =>
                                                        updateColumn(column.id, 'precision', parseInt(e.target.value) || 10)
                                                    }
                                                    min="1"
                                                    disabled={isLoading}
                                                    className="w-full px-3 py-2 text-sm bg-surface-input dark:bg-surface-card border border-border-input dark:border-border-input rounded-lg
                                                        text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-text-secondary mb-1">Scale</label>
                                                <input
                                                    type="number"
                                                    value={column.scale || 2}
                                                    onChange={(e) =>
                                                        updateColumn(column.id, 'scale', parseInt(e.target.value) || 2)
                                                    }
                                                    min="0"
                                                    disabled={isLoading}
                                                    className="w-full px-3 py-2 text-sm bg-surface-input dark:bg-surface-card border border-border-input dark:border-border-input rounded-lg
                                                        text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Checkboxes */}
                                <div className="flex flex-wrap items-center gap-4 col-span-full">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={column.is_nullable}
                                            onChange={(e) => updateColumn(column.id, 'is_nullable', e.target.checked)}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-text-secondary">Nullable</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={column.is_primary_key}
                                            onChange={(e) => updateColumn(column.id, 'is_primary_key', e.target.checked)}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-text-secondary">Primary Key</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={column.is_unique}
                                            onChange={(e) => updateColumn(column.id, 'is_unique', e.target.checked)}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-text-secondary">Unique</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={column.is_indexed || false}
                                            onChange={(e) => updateColumn(column.id, 'is_indexed', e.target.checked)}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-text-secondary">Indexed</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                    {errors.schema_json && (
                        <p className="text-sm text-error-600 dark:text-error-400">{errors.schema_json}</p>
                    )}
                </div>

                {/* Info Message */}
                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-lg p-4">
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                        <strong>Auto-generated:</strong> CRUD API endpoints (GET, POST, PUT, DELETE) will be automatically updated for your table.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 border border-border-input rounded-lg
                            text-text-secondary hover:bg-surface-hover dark:hover:bg-surface-card
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors font-medium cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700
                            text-white rounded-lg font-medium
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Table'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
