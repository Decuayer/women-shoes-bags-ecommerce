'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import { Plus } from 'lucide-react'
import Link from 'next/link'

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
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                router.refresh()
            } else {
                alert('Failed to delete product')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('An error occurred')
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
                <Link href={`/${locale}/admin/products/new`} className="btn btn-primary flex items-center gap-2">
                    <Plus size={20} /> {locale === 'tr' ? 'Ürün Ekle' : 'Add Product'}
                </Link>
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
        </div>
    )
}
