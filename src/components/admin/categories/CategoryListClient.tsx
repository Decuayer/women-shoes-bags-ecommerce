'use client'

import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface CategoryListClientProps {
    data: any[]
    locale: string
}

export default function CategoryListClient({ data, locale }: CategoryListClientProps) {
    const router = useRouter()
    const isTr = locale === 'tr'

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                router.refresh()
            } else {
                const json = await res.json()
                alert(json.error || 'Failed to delete category')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('An error occurred')
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
        </div>
    )
}
