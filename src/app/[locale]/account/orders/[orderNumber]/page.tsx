import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Package, MapPin, CreditCard, AlertCircle } from 'lucide-react'
import CancelOrderButton from './CancelOrderButton' // We'll create this client component next

export default async function OrderDetailsPage({ params }: { params: Promise<{ locale: string, orderNumber: string }> }) {
    const { locale, orderNumber } = await params
    const isTr = locale === 'tr'

    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
        redirect(`/${locale}/auth/login`)
    }

    const payload = await verifyAccessTokenEdge(token)
    if (!payload) {
        redirect(`/${locale}/auth/login`)
    }

    const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true }
    })

    if (!order) {
        notFound()
    }

    if (order.userId !== payload.userId) {
        redirect(`/${locale}/account/orders`)
    }

    const getStatusText = (status: string) => {
        const statuses: Record<string, string> = {
            PENDING: isTr ? 'Ödeme Bekliyor' : 'Pending Payment',
            CONFIRMED: isTr ? 'Sipariş Alındı' : 'Order Confirmed',
            PREPARING: isTr ? 'Hazırlanıyor' : 'Preparing',
            SHIPPED: isTr ? 'Kargolandı' : 'Shipped',
            DELIVERED: isTr ? 'Teslim Edildi' : 'Delivered',
            CANCELLED: isTr ? 'İptal Edildi' : 'Cancelled',
            REFUNDED: isTr ? 'İade Edildi' : 'Refunded'
        }
        return statuses[status] || status
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
            case 'PREPARING':
            case 'SHIPPED':
            case 'DELIVERED':
                return 'text-success bg-success/10'
            case 'CANCELLED':
            case 'REFUNDED':
                return 'text-error bg-error/10'
            default:
                return 'text-warning bg-warning/10'
        }
    }

    const isCancellable = ['PENDING', 'PREPARING'].includes(order.status)

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <Link
                    href={`/${locale}/account/orders`}
                    className="inline-flex items-center text-text-muted hover:text-primary transition-colors mb-4"
                >
                    <ChevronLeft size={20} className="mr-1" />
                    {isTr ? 'Siparişlere Dön' : 'Back to Orders'}
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        {isTr ? 'Sipariş Detayı' : 'Order Details'}
                        <span className="font-mono text-xl text-text-muted">#{order.orderNumber}</span>
                    </h1>
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-surface rounded-xl border border-border overflow-hidden">
                        <div className="p-4 border-b border-border bg-surface-light/50 font-medium flex items-center gap-2">
                            <Package size={18} />
                            {isTr ? 'Ürünler' : 'Items'}
                        </div>
                        <div className="divide-y divide-border">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-4 flex gap-4">
                                    <div className="w-20 h-20 bg-surface-light rounded-lg border border-border flex items-center justify-center text-xs font-medium text-text-muted shrink-0">
                                        {/* Image placeholder */}
                                        <span className="uppercase">{item.productName_tr.substring(0, 2)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-text-dark truncate">
                                            {isTr ? item.productName_tr : item.productName_en}
                                        </h3>
                                        <p className="text-sm text-text-muted mt-1">
                                            {isTr ? 'Beden:' : 'Size:'} {item.variantSize} | {isTr ? item.variantColor_tr : item.variantColor_en}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm">x{item.quantity}</span>
                                            <span className="font-medium">{Number(item.price).toLocaleString('tr-TR')} TL</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-surface rounded-xl border border-border overflow-hidden">
                        <div className="p-4 border-b border-border bg-surface-light/50 font-medium flex items-center gap-2">
                            <CreditCard size={18} />
                            {isTr ? 'Ödeme Bilgileri' : 'Payment Information'}
                        </div>
                        <div className="p-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-muted">{isTr ? 'Ara Toplam' : 'Subtotal'}</span>
                                <span>{Number(order.subtotal).toLocaleString('tr-TR')} TL</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-muted">{isTr ? 'Kargo' : 'Shipping'}</span>
                                <span>{Number(order.shippingCost) === 0 ? (isTr ? 'Ücretsiz' : 'Free') : `${Number(order.shippingCost).toLocaleString('tr-TR')} TL`}</span>
                            </div>
                            <div className="pt-3 mt-3 border-t border-border flex justify-between font-bold text-lg">
                                <span>{isTr ? 'Toplam' : 'Total'}</span>
                                <span>{Number(order.total).toLocaleString('tr-TR')} TL</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Address */}
                    <div className="bg-surface rounded-xl border border-border overflow-hidden">
                        <div className="p-4 border-b border-border bg-surface-light/50 font-medium flex items-center gap-2">
                            <MapPin size={18} />
                            {isTr ? 'Teslimat Adresi' : 'Shipping Address'}
                        </div>
                        <div className="p-4 text-sm space-y-1">
                            <div className="font-medium">{order.shippingFullName}</div>
                            <div className="text-text-muted">{order.shippingAddressLine1}</div>
                            {order.shippingAddressLine2 && <div className="text-text-muted">{order.shippingAddressLine2}</div>}
                            <div className="text-text-muted">
                                {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
                            </div>
                            <div className="text-text-muted">{order.shippingCountry}</div>
                            <div className="mt-2 text-text-muted">{order.shippingPhone}</div>
                        </div>
                    </div>

                    {/* Actions */}
                    {isCancellable && (
                        <div className="bg-surface rounded-xl border border-border p-4">
                            <div className="flex items-start gap-3 mb-4">
                                <AlertCircle className="text-warning shrink-0 mt-0.5" size={20} />
                                <div className="text-sm text-text-muted">
                                    {isTr
                                        ? 'Siparişiniz hazırlanma aşamasındadır. Henüz kargoya verilmediği için iptal edebilirsiniz.'
                                        : 'Your order is being prepared. You can cancel it since it hasn\'t been shipped yet.'}
                                </div>
                            </div>
                            <CancelOrderButton
                                orderId={order.id}
                                isTr={isTr}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
