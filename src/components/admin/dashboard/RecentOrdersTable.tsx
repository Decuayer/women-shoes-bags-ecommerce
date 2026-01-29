'use client'

import Link from 'next/link'
import { Eye, ShoppingBag } from 'lucide-react'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'

interface RecentOrdersTableProps {
    orders: any[]
    locale: string
}

export default function RecentOrdersTable({ orders, locale }: RecentOrdersTableProps) {
    const isTr = locale === 'tr'

    return (
        <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{isTr ? 'Son Siparişler' : 'Recent Orders'}</h2>
                <Link href={`/${locale}/admin/orders`} className="text-sm text-secondary hover:underline">
                    {isTr ? 'Tümünü Gör' : 'View All'}
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12 text-text-muted">
                    <ShoppingBag className="mx-auto mb-3 opacity-20" size={48} />
                    <p>{isTr ? 'Henüz sipariş bulunmuyor.' : 'No orders found yet.'}</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border text-left">
                                <th className="pb-3 text-sm font-medium text-text-muted">{isTr ? 'Sipariş No' : 'Order ID'}</th>
                                <th className="pb-3 text-sm font-medium text-text-muted">{isTr ? 'Müşteri' : 'Customer'}</th>
                                <th className="pb-3 text-sm font-medium text-text-muted">{isTr ? 'Tutar' : 'Amount'}</th>
                                <th className="pb-3 text-sm font-medium text-text-muted">{isTr ? 'Durum' : 'Status'}</th>
                                <th className="pb-3 text-sm font-medium text-text-muted w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {orders.map((order) => (
                                <tr key={order.id} className="group hover:bg-surface-light/50 transition-colors">
                                    <td className="py-3 text-sm font-medium">{order.orderNumber}</td>
                                    <td className="py-3 text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{order.shippingFullName}</span>
                                            <span className="text-xs text-text-muted">{order.user?.email || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-sm">{Number(order.total).toLocaleString('tr-TR')} TL</td>
                                    <td className="py-3 text-sm">
                                        <OrderStatusBadge status={order.status} locale={locale} />
                                    </td>
                                    <td className="py-3 text-sm text-right">
                                        <Link
                                            href={`/${locale}/admin/orders/${order.id}`}
                                            className="inline-flex p-2 text-text-muted hover:text-secondary bg-transparent hover:bg-secondary/10 rounded-lg transition-all"
                                            title={isTr ? 'Detayları Gör' : 'View Details'}
                                        >
                                            <Eye size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
