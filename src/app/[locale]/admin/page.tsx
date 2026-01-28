import { prisma } from '@/lib/prisma'
import StatsCard from '@/components/admin/StatsCard'
import { Package, ShoppingBag, Users, DollarSign, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface AdminDashboardProps {
    params: Promise<{ locale: string }>
}

export default async function AdminDashboard({ params }: AdminDashboardProps) {
    const { locale } = await params
    const isTr = locale === 'tr'

    // Fetch dashboard stats
    const [productCount, userCount, orderCount, lowStockProducts] = await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.user.count(),
        prisma.order.count(),
        prisma.productVariant.findMany({
            where: { stock: { lt: 5 } },
            include: { product: true },
            take: 5
        })
    ])

    // Calculate total revenue (mock for now as we don't have paid orders)
    // In real app: prisma.order.aggregate({ _sum: { total: true }, where: { status: 'PAID' } })
    const totalRevenue = 0

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">{isTr ? 'Panel Özeti' : 'Dashboard Overview'}</h1>
                <p className="text-text-muted">
                    {isTr
                        ? 'Mağazanızın durumunu ve performansını buradan takip edin.'
                        : 'Track your store status and performance here.'}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title={isTr ? 'Toplam Gelir' : 'Total Revenue'}
                    value={`${totalRevenue.toLocaleString('tr-TR')} TL`}
                    icon={DollarSign}
                    trend={{ value: 12, isPositive: true }}
                    description={isTr ? 'Geçen aya göre' : 'vs last month'}
                />
                <StatsCard
                    title={isTr ? 'Siparişler' : 'Orders'}
                    value={orderCount}
                    icon={ShoppingBag}
                    description={isTr ? 'Toplam sipariş adedi' : 'Total orders processed'}
                />
                <StatsCard
                    title={isTr ? 'Ürünler' : 'Products'}
                    value={productCount}
                    icon={Package}
                    description={isTr ? 'Aktif ürün sayısı' : 'Active products listed'}
                />
                <StatsCard
                    title={isTr ? 'Kullanıcılar' : 'Users'}
                    value={userCount}
                    icon={Users}
                    trend={{ value: 5, isPositive: true }}
                    description={isTr ? 'Yeni kullanıcı' : 'New users this week'}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Placeholder */}
                <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">{isTr ? 'Son Siparişler' : 'Recent Orders'}</h2>
                        <Link href={`/${locale}/admin/orders`} className="text-sm text-secondary hover:underline">
                            {isTr ? 'Tümünü Gör' : 'View All'}
                        </Link>
                    </div>

                    <div className="text-center py-12 text-text-muted">
                        <ShoppingBag className="mx-auto mb-3 opacity-20" size={48} />
                        <p>{isTr ? 'Henüz sipariş bulunmuyor.' : 'No orders found yet.'}</p>
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-surface border border-border rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <AlertCircle className="text-warning" size={20} />
                        {isTr ? 'Kritik Stok' : 'Low Stock Alerts'}
                    </h2>

                    <div className="space-y-4">
                        {lowStockProducts.length > 0 ? (
                            lowStockProducts.map(variant => (
                                <div key={variant.id} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">
                                            {isTr ? variant.product.name_tr : variant.product.name_en}
                                        </p>
                                        <p className="text-xs text-text-muted">
                                            {isTr ? variant.color_tr : variant.color_en} / {variant.size}
                                        </p>
                                    </div>
                                    <span className="badge badge-warning text-xs font-bold">
                                        {variant.stock} {isTr ? 'adet' : 'left'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-text-muted text-sm">
                                {isTr ? 'Stoklar normal seviyede.' : 'All stock levels are healthy.'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
