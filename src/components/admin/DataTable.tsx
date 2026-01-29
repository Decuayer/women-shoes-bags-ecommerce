'use client'

import { ChevronLeft, ChevronRight, Search, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

interface Column<T> {
    header: string
    accessor: keyof T | ((row: T) => ReactNode)
    className?: string
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    keyField: keyof T
    searchPlaceholder?: string
    onSearch?: (query: string) => void
    onDelete?: (id: string) => void
    editUrl?: (row: T) => string
    actions?: (row: T) => ReactNode
    pagination?: {
        currentPage: number
        totalPages: number
        onPageChange: (page: number) => void
    }
}

export default function DataTable<T extends Record<string, any>>({
    data,
    columns,
    keyField,
    searchPlaceholder = 'Search...',
    onSearch,
    onDelete,
    editUrl,
    actions,
    pagination,
}: DataTableProps<T>) {
    return (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-border flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    {onSearch && (
                        <>
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                onChange={(e) => onSearch(e.target.value)}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-light border-b border-border">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className={`px-6 py-4 text-xs font-semibold uppercase text-text-muted ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                            {(editUrl || onDelete || actions) && (
                                <th className="px-6 py-4 text-xs font-semibold uppercase text-text-muted text-right">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.length > 0 ? (
                            data.map((row) => (
                                <tr key={row[keyField]} className="hover:bg-surface-light/5">
                                    {columns.map((col, idx) => (
                                        <td key={idx} className={`px-6 py-4 text-sm ${col.className || ''}`}>
                                            {typeof col.accessor === 'function'
                                                ? col.accessor(row)
                                                : row[col.accessor]}
                                        </td>
                                    ))}
                                    {(editUrl || onDelete || actions) && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {actions && actions(row)}
                                                {editUrl && (
                                                    <Link
                                                        href={editUrl(row)}
                                                        className="p-2 text-secondary hover:bg-primary/10 rounded-lg transition-colors"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(row[keyField])}
                                                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (editUrl || onDelete || actions ? 1 : 0)} className="px-6 py-12 text-center text-text-muted">
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="p-4 border-t border-border flex items-center justify-between">
                    <button
                        disabled={pagination.currentPage === 1}
                        onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                        className="btn btn-secondary text-sm px-3 py-1 disabled:opacity-50"
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <span className="text-sm text-text-muted">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                        className="btn btn-secondary text-sm px-3 py-1 disabled:opacity-50"
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    )
}
