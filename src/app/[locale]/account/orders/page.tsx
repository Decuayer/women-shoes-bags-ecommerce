import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react'
import ResumePaymentButton from '@/components/account/ResumePaymentButton'

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
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

    const orders = await prisma.order.findMany({
        where: { userId: payload.userId as string },
        include: {
            items: true
        },
        orderBy: { createdAt: 'desc' }
    })

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

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                {isTr ? 'Siparişlerim' : 'My Orders'}
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-surface rounded-xl border border-border">
                    <Package size={64} className="mx-auto text-text-muted mb-4" />
                    <h2 className="text-lg font-medium mb-2">
                        {isTr ? 'Henüz siparişiniz bulunmamaktadır.' : 'You have no orders yet.'}
                    </h2>
                    <p className="text-text-muted mb-6">
                        {isTr ? 'Güzel ürünlerimizi keşfetmeye ne dersiniz?' : 'How about exploring our beautiful products?'}
                    </p>
                    <Link href={`/${locale}/products`} className="btn btn-primary">
                        {isTr ? 'Alışverişe Başla' : 'Start Shopping'}
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-surface rounded-xl border border-border overflow-hidden">
                            {/* Order Header */}
                            <div className="p-4 md:p-6 border-b border-border bg-surface-light/50 flex flex-wrap gap-4 justify-between items-center">
                                <div className="space-y-1">
                                    <div className="text-sm text-text-muted">
                                        {isTr ? 'Sipariş No' : 'Order No'}
                                    </div>
                                    <div className="font-medium font-mono">#{order.orderNumber}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-text-muted">
                                        {isTr ? 'Tarih' : 'Date'}
                                    </div>
                                    <div className="font-medium">
                                        {new Date(order.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US')}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-text-muted">
                                        {isTr ? 'Toplam' : 'Total'}
                                    </div>
                                    <div className="font-bold text-secondary">
                                        {Number(order.total).toLocaleString('tr-TR')} TL
                                    </div>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="p-4 md:p-6">
                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                    <div className="flex -space-x-3 overflow-hidden">
                                        {order.items.slice(0, 4).map((item, i) => (
                                            <div key={i} className="w-12 h-12 rounded-lg border-2 border-surface bg-surface-light flex items-center justify-center text-xs font-medium text-text-muted shrink-0 relative">
                                                {/* Placeholder for images since we don't store image URL in order items directly yet, reusing names */}
                                                <span className="uppercase">{item.productName_tr.substring(0, 2)}</span>
                                            </div>
                                        ))}
                                        {order.items.length > 4 && (
                                            <div className="w-12 h-12 rounded-lg border-2 border-surface bg-surface-dark text-surface flex items-center justify-center text-xs font-medium shrink-0 z-10">
                                                +{order.items.length - 4}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-sm text-text-muted">
                                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} {isTr ? 'Ürün' : 'Items'}
                                    </div>

                                    <Link
                                        href={`/${locale}/account/orders/${order.orderNumber}`}
                                        className="btn btn-outline w-full md:w-auto text-sm"
                                    >
                                        {isTr ? 'Detayları Gör' : 'View Details'}
                                        <ChevronRight size={16} />
                                    </Link>

                                    {order.status === 'PENDING' && (
                                        <ResumePaymentButton orderId={order.id} locale={locale} />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
