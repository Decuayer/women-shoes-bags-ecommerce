'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'
import { Eye } from 'lucide-react'
import Link from 'next/link'

interface OrderListClientProps {
    data: any[]
    totalPages: number
    currentPage: number
    locale: string
}

export default function OrderListClient({ data, totalPages, currentPage, locale }: OrderListClientProps) {
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
        params.set('page', '1')
        router.push(`${pathname}?${params.toString()}`)
    }

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    const columns = [
        { header: locale === 'tr' ? 'Sipariş No' : 'Order ID', accessor: 'orderNumber' },
        {
            header: locale === 'tr' ? 'Müşteri' : 'Customer',
            accessor: (row: any) => (
                <div>
                    <p className="font-medium">{row.user.firstName} {row.user.lastName}</p>
                    <p className="text-xs text-text-muted">{row.user.email}</p>
                </div>
            )
        },
        {
            header: locale === 'tr' ? 'Tarih' : 'Date',
            accessor: (row: any) => new Date(row.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US')
        },
        {
            header: locale === 'tr' ? 'Tutar' : 'Total',
            accessor: (row: any) => `${Number(row.total).toLocaleString('tr-TR')} TL`
        },
        {
            header: locale === 'tr' ? 'Durum' : 'Status',
            accessor: (row: any) => <OrderStatusBadge status={row.status} locale={locale} />
        }
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{locale === 'tr' ? 'Siparişler' : 'Orders'}</h1>

            <DataTable
                data={data}
                columns={columns}
                keyField="id"
                onSearch={handleSearch}
                pagination={{
                    currentPage,
                    totalPages,
                    onPageChange: handlePageChange
                }}
                actions={(row) => (
                    <Link
                        href={`/${locale}/admin/orders/${row.id}`}
                        className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                    >
                        <Eye size={18} />
                    </Link>
                )}
            />
        </div>
    )
}
