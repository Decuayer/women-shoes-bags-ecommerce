'use client'

import { useState } from 'react'
import DataTable from '@/components/admin/DataTable'
import { useRouter } from 'next/navigation'
import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/context/ToastContext'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface UserListClientProps {
    users: any[]
    fullPagination: any
    searchParams: any
    locale: string
}

export default function UserListClient({ users, fullPagination, searchParams, locale }: UserListClientProps) {
    const router = useRouter()
    const isTr = locale === 'tr'
    const { addToast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [userToDelete, setUserToDelete] = useState<any>(null)

    const handleDelete = async (id: string) => {
        const user = users.find(u => u.id === id)
        setUserToDelete(user)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!userToDelete) return

        setDeleteLoading(true)
        try {
            const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error('Failed to delete')

            addToast(
                isTr
                    ? `${userToDelete.firstName} ${userToDelete.lastName} silindi`
                    : `${userToDelete.firstName} ${userToDelete.lastName} deleted`,
                'success',
                { title: isTr ? 'Başarılı' : 'Success' }
            )
            setDeleteDialogOpen(false)
            router.refresh()
        } catch (error) {
            console.error('Delete error:', error)
            addToast(
                isTr ? 'Silme işlemi başarısız' : 'Delete failed',
                'error',
                { title: isTr ? 'Hata' : 'Error' }
            )
        } finally {
            setDeleteLoading(false)
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
        <>
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

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title={isTr ? 'Kullanıcıyı Sil' : 'Delete User'}
                message={
                    userToDelete
                        ? (isTr
                            ? `${userToDelete.firstName} ${userToDelete.lastName} kullanıcısını silmek istediğinizden emin misiniz?${userToDelete._count?.orders > 0 ? ` Bu kullanıcının ${userToDelete._count.orders} siparişi var.` : ''}`
                            : `Are you sure you want to delete ${userToDelete.firstName} ${userToDelete.lastName}?${userToDelete._count?.orders > 0 ? ` This user has ${userToDelete._count.orders} orders.` : ''}`)
                        : ''
                }
                confirmText={isTr ? 'Sil' : 'Delete'}
                cancelText={isTr ? 'İptal' : 'Cancel'}
                variant={userToDelete?._count?.orders > 0 ? 'warning' : 'danger'}
                loading={deleteLoading}
            />
        </>
    )
}
