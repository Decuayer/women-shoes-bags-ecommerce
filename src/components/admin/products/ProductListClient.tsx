'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import { Plus } from 'lucide-react'
import LoadingLink from '@/components/ui/LoadingLink'
import { useLoading } from '@/context/LoadingContext'
import { useToast } from '@/context/ToastContext'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface ProductListClientProps {
    data: any[]
    totalPages: number
    currentPage: number
    locale: string
}

export default function ProductListClient({ data, totalPages, currentPage, locale }: ProductListClientProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { showLoading, hideLoading } = useLoading()
    const { addToast } = useToast()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [productToDelete, setProductToDelete] = useState<any>(null)

    const handleSearch = (query: string) => {
        const params = new URLSearchParams(searchParams)
        if (query) {
            params.set('q', query)
        } else {
            params.delete('q')
        }
        params.set('page', '1') // Reset to page 1
        router.push(`${pathname}?${params.toString()}`)
    }

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleDelete = async (id: string) => {
        const product = data.find(p => p.id === id)
        setProductToDelete(product)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!productToDelete) return

        setDeleteLoading(true)

        try {
            const res = await fetch(`/api/admin/products/${productToDelete.id}`, {
                method: 'DELETE'
            })

            const resData = await res.json()

            if (res.ok) {
                addToast(
                    locale === 'tr'
                        ? `"${productToDelete.name}" başarıyla silindi!`
                        : `"${productToDelete.name}" deleted successfully!`,
                    'success',
                    { title: locale === 'tr' ? 'Başarılı' : 'Success' }
                )
                setDeleteDialogOpen(false)
                router.refresh()
            } else {
                addToast(
                    resData.message || (locale === 'tr' ? 'Ürün silinemedi' : 'Failed to delete product'),
                    'error',
                    { title: locale === 'tr' ? 'Hata' : 'Error', duration: 7000 }
                )
            }
        } catch (error: any) {
            console.error('Delete error:', error)
            addToast(
                locale === 'tr' ? 'Bir hata oluştu' : 'An error occurred',
                'error',
                { title: locale === 'tr' ? 'Hata' : 'Error' }
            )
        } finally {
            setDeleteLoading(false)
        }
    }

    const columns = [
        {
            header: locale === 'tr' ? 'Görsel' : 'Image',
            accessor: (row: any) => (
                <div className="w-12 h-12 bg-surface-light rounded-lg overflow-hidden relative border border-border">
                    {row.images && row.images[0] ? (
                        <img src={row.images[0].url} alt={row.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">No Img</div>
                    )}
                </div>
            )
        },
        { header: locale === 'tr' ? 'Ürün Adı' : 'Name', accessor: 'name' },
        { header: locale === 'tr' ? 'Kategori' : 'Category', accessor: (row: any) => row.category.name },
        {
            header: locale === 'tr' ? 'Fiyat' : 'Price',
            accessor: (row: any) => `${Number(row.price).toLocaleString('tr-TR')} TL`
        },
        {
            header: locale === 'tr' ? 'Stok' : 'Stock',
            accessor: (row: any) => {
                const totalStock = row.variants.reduce((acc: number, v: any) => acc + v.stock, 0)
                return (
                    <span className={`badge ${totalStock < 5 ? 'badge-error' : totalStock < 20 ? 'badge-warning' : 'badge-success'}`}>
                        {totalStock}
                    </span>
                )
            }
        },
        {
            header: locale === 'tr' ? 'Durum' : 'Status',
            accessor: (row: any) => (
                <span className={`badge ${row.isActive ? 'badge-success' : 'badge-primary'}`}>
                    {row.isActive ? (locale === 'tr' ? 'Aktif' : 'Active') : (locale === 'tr' ? 'Taslak' : 'Draft')}
                </span>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{locale === 'tr' ? 'Ürünler' : 'Products'}</h1>
                <LoadingLink href={`/${locale}/admin/products/new`} className="btn btn-primary flex items-center gap-2">
                    <Plus size={20} /> {locale === 'tr' ? 'Ürün Ekle' : 'Add Product'}
                </LoadingLink>
            </div>

            <DataTable
                data={data}
                columns={columns}
                keyField="id"
                onSearch={handleSearch}
                onDelete={handleDelete}
                editUrl={(row) => `/${locale}/admin/products/${row.id}`}
                pagination={{
                    currentPage,
                    totalPages,
                    onPageChange: handlePageChange
                }}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title={locale === 'tr' ? 'Ürünü Sil' : 'Delete Product'}
                message={
                    productToDelete
                        ? (locale === 'tr'
                            ? `"${productToDelete.name}" ürününü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
                            : `Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`)
                        : ''
                }
                confirmText={locale === 'tr' ? 'Sil' : 'Delete'}
                cancelText={locale === 'tr' ? 'İptal' : 'Cancel'}
                variant="danger"
                loading={deleteLoading}
            />
        </div>
    )
}
