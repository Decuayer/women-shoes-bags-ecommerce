'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface OrderDetailClientProps {
    order: any
    locale: string
}

export default function OrderDetailClient({ order, locale }: OrderDetailClientProps) {
    const router = useRouter()
    const isTr = locale === 'tr'
    const [status, setStatus] = useState(order.status)
    const [isLoading, setIsLoading] = useState(false)

    const handleUpdateStatus = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/orders/${order.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })

            if (!res.ok) throw new Error('Failed to update status')

            router.refresh()
            alert(isTr ? 'Sipariş durumu güncellendi' : 'Order status updated')
        } catch (error) {
            console.error('Update error:', error)
            alert(isTr ? 'Güncelleme hatası' : 'Update failed')
        } finally {
            setIsLoading(false)
        }
    }

    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/admin/orders`} className="btn btn-ghost rounded-full p-2">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            {isTr ? 'Sipariş' : 'Order'} #{order.orderNumber}
                            <OrderStatusBadge status={order.status} />
                        </h1>
                        <p className="text-text-muted text-sm">
                            {new Date(order.createdAt).toLocaleString(isTr ? 'tr-TR' : 'en-US')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-surface border border-border rounded-xl p-6">
                        <h2 className="font-bold text-lg mb-4 border-b border-border pb-2">
                            {isTr ? 'Sipariş İçeriği' : 'Order Items'}
                        </h2>
                        <div className="space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-surface-light rounded-lg overflow-hidden border border-border">
                                        {/* Placeholder image logic if needed, accessing product relation */}
                                        <div className="w-full h-full bg-surface-light flex items-center justify-center text-xs">IMG</div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {isTr ? item.productVariant.product.name_tr : item.productVariant.product.name_en}
                                        </p>
                                        <p className="text-sm text-text-muted">
                                            {item.productVariant.size} - {isTr ? item.productVariant.color_tr : item.productVariant.color_en}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{Number(item.price).toLocaleString('tr-TR')} TL</p>
                                        <p className="text-sm text-text-muted">x {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center font-bold text-lg">
                            <span>{isTr ? 'Toplam' : 'Total'}</span>
                            <span>{Number(order.total).toLocaleString('tr-TR')} TL</span>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-surface border border-border rounded-xl p-6">
                        <h2 className="font-bold text-lg mb-4 border-b border-border pb-2">
                            {isTr ? 'Müşteri Bilgileri' : 'Customer Information'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-text-muted mb-1">{isTr ? 'İletişim' : 'Contact'}</h3>
                                <p>{order.user.firstName} {order.user.lastName}</p>
                                <p>{order.user.email}</p>
                                <p>{order.user.phone}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-text-muted mb-1">{isTr ? 'Teslimat Adresi' : 'Shipping Address'}</h3>
                                <p>{order.shippingAddress?.address}</p>
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                                <p>{order.shippingAddress?.zipCode}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                        <h2 className="font-bold text-lg mb-4 border-b border-border pb-2">
                            {isTr ? 'Sipariş Durumu' : 'Order Status'}
                        </h2>

                        <div className="space-y-4">
                            <select
                                className="input w-full"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                {statuses.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>

                            <button
                                onClick={handleUpdateStatus}
                                disabled={isLoading || status === order.status}
                                className="btn btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {isTr ? 'Durumu Güncelle' : 'Update Status'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
