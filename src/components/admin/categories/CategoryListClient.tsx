'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/context/ToastContext'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface CategoryListClientProps {
    data: any[]
    locale: string
}

export default function CategoryListClient({ data, locale }: CategoryListClientProps) {
    const router = useRouter()
    const isTr = locale === 'tr'
    const { addToast } = useToast()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<any>(null)

    const handleDelete = async (id: string) => {
        const category = data.find(c => c.id === id)
        setCategoryToDelete(category)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!categoryToDelete) return

        setDeleteLoading(true)

        try {
            const res = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
                method: 'DELETE'
            })

            const resData = await res.json()

            if (res.ok) {
                addToast(
                    isTr
                        ? `"${categoryToDelete.name_tr}" kategorisi başarıyla silindi!`
                        : `Category "${categoryToDelete.name_tr}" deleted successfully!`,
                    'success',
                    { title: isTr ? 'Başarılı' : 'Success' }
                )
                setDeleteDialogOpen(false)
                router.refresh()
            } else {
                addToast(
                    resData.error || resData.message || (isTr ? 'Kategori silinemedi' : 'Failed to delete category'),
                    'error',
                    { title: isTr ? 'Hata' : 'Error', duration: 7000 }
                )
            }
        } catch (error) {
            console.error('Delete error:', error)
            addToast(
                isTr ? 'Bir hata oluştu' : 'An error occurred',
                'error',
                { title: isTr ? 'Hata' : 'Error' }
            )
        } finally {
            setDeleteLoading(false)
        }
    }

    const columns = [
        { header: isTr ? 'İsim (TR)' : 'Name (TR)', accessor: 'name_tr' },
        { header: isTr ? 'İsim (EN)' : 'Name (EN)', accessor: 'name_en' },
        { header: 'Slug', accessor: 'slug' },
        {
            header: isTr ? 'Ürün Sayısı' : 'Products Count',
            accessor: (row: any) => (
                <span className="badge badge-secondary">{row._count?.products || 0}</span>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{isTr ? 'Kategoriler' : 'Categories'}</h1>
                <Link href={`/${locale}/admin/categories/new`} className="btn btn-primary flex items-center gap-2">
                    <Plus size={20} /> {isTr ? 'Kategori Ekle' : 'Add Category'}
                </Link>
            </div>

            <DataTable
                data={data}
                columns={columns}
                keyField="id"
                onDelete={handleDelete}
                editUrl={(row) => `/${locale}/admin/categories/${row.id}`}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title={isTr ? 'Kategoriyi Sil' : 'Delete Category'}
                message={
                    categoryToDelete
                        ? (isTr
                            ? `"${categoryToDelete.name_tr}" kategorisini silmek istediğinizden emin misiniz?${categoryToDelete._count?.products > 0 ? ` Bu kategoriye ait ${categoryToDelete._count.products} ürün var.` : ''}`
                            : `Are you sure you want to delete "${categoryToDelete.name_tr}"?${categoryToDelete._count?.products > 0 ? ` This category has ${categoryToDelete._count.products} products.` : ''}`)
                        : ''
                }
                confirmText={isTr ? 'Sil' : 'Delete'}
                cancelText={isTr ? 'İptal' : 'Cancel'}
                variant={categoryToDelete?._count?.products > 0 ? 'warning' : 'danger'}
                loading={deleteLoading}
            />
        </div>
    )
}
