'use client'

import { useState } from 'react'
import DataTable from '@/components/admin/DataTable'
import { useRouter } from 'next/navigation'
import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface UserListClientProps {
    users: any[]
    fullPagination: any
    searchParams: any
    locale: string
}

export default function UserListClient({ users, fullPagination, searchParams, locale }: UserListClientProps) {
    const router = useRouter()
    const isTr = locale === 'tr'
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async (id: string) => {
        if (!confirm(isTr ? 'Bu kullanıcıyı silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this user?')) return

        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error('Failed to delete')

            router.refresh()
            alert(isTr ? 'Kullanıcı silindi' : 'User deleted')
        } catch (error) {
            console.error('Delete error:', error)
            alert(isTr ? 'Silme işlemi başarısız' : 'Delete failed')
        } finally {
            setIsLoading(false)
        }
    }

    const columns = [
        {
            header: isTr ? 'Ad Soyad' : 'Name',
            accessor: (user: any) => (
                <div>
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-text-muted">ID: {user.id}</div>
                </div>
            )
        },
        {
            header: 'Email',
            accessor: 'email'
        },
        {
            header: isTr ? 'Rol' : 'Role',
            accessor: (user: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                    {user.role}
                </span>
            )
        },
        {
            header: isTr ? 'Siparişler' : 'Orders',
            accessor: (user: any) => user._count.orders
        },
        {
            header: isTr ? 'Kayıt Tarihi' : 'Joined',
            accessor: (user: any) => new Date(user.createdAt).toLocaleDateString(isTr ? 'tr-TR' : 'en-US')
        },
        {
            header: isTr ? 'İşlemler' : 'Actions',
            accessor: (user: any) => (
                <div className="flex items-center gap-2">
                    <Link
                        href={`/${locale}/admin/users/${user.id}`}
                        className="p-2 hover:bg-surface-highlight rounded-lg transition-colors"
                    >
                        <Edit size={18} />
                    </Link>
                    <button
                        onClick={() => handleDelete(user.id)}
                        disabled={isLoading}
                        className="p-2 hover:bg-surface-highlight text-red-500 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ]

    return (
        <DataTable
            data={users}
            columns={columns}
            onSearch={(query) => {
                const params = new URLSearchParams(window.location.search)
                if (query) {
                    params.set('q', query)
                } else {
                    params.delete('q')
                }
                params.delete('page')
                router.push(`/${locale}/admin/users?${params.toString()}`)
            }}
            searchPlaceholder={isTr ? 'İsim veya email ara...' : 'Search name or email...'}
            pagination={fullPagination}
            keyField="id"
        />
    )
}
