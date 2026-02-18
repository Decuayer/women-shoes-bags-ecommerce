import { prisma } from '@/lib/prisma'
import StatsCard from '@/components/admin/StatsCard'
import DashboardStatsClient from '@/components/admin/dashboard/DashboardStatsClient'
import RecentOrdersTable from '@/components/admin/dashboard/RecentOrdersTable'
import DashboardChart from '@/components/admin/dashboard/DashboardChart'
import { Package, ShoppingBag, Users, DollarSign, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface AdminDashboardProps {
    params: Promise<{ locale: string }>
}

export default async function AdminDashboard({ params }: AdminDashboardProps) {
    const { locale } = await params
    const isTr = locale === 'tr'

    // --- DATA FETCHING ---
    const now = new Date()
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [
        productCount,
        userCount,
        userCountLastMonth,
        recentOrders,
        lowStockProducts,
        ordersCurrentMonth,
        ordersLastMonth,
        orderStats
    ] = await Promise.all([
        // 1. Product Count
        prisma.product.count({ where: { isActive: true } }),

        // 2. User Stats (Current vs Last Month)
        prisma.user.count(),
        prisma.user.count({ where: { createdAt: { lt: firstDayCurrentMonth } } }),

        // 3. Recent Orders
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        }),

        // 4. Low Stock
        prisma.productVariant.findMany({
            where: { stock: { lt: 5 } },
            include: { product: true },
            take: 5
        }),

        // 5. Monthly Comparison (Counts & Revenue)
        prisma.order.groupBy({
            by: ['status'],
            where: { createdAt: { gte: firstDayCurrentMonth } },
            _count: true,
            _sum: { total: true }
        }),
        prisma.order.groupBy({
            by: ['status'],
            where: {
                createdAt: {
                    gte: firstDayLastMonth,
                    lt: firstDayCurrentMonth
                }
            },
            _count: true,
            _sum: { total: true }
        }),

        // 6. ALL TIME Stats by Status
        prisma.order.groupBy({
            by: ['status'],
            _count: true,
            _sum: { total: true }
        })
    ])

    // --- AGGREGATION LOGIC ---

    // Metrics for specific statuses
    const getStat = (status: string) => {
        const stat = orderStats.find(s => s.status === status)
        return {
            count: stat?._count ?? 0,
            amount: stat?._sum.total?.toNumber() ?? 0
        }
    }

    const pending = getStat('PENDING')
    const confirmed = getStat('CONFIRMED')
    const preparing = getStat('PREPARING')
    const shipped = getStat('SHIPPED')
    const delivered = getStat('DELIVERED')
    const cancelled = getStat('CANCELLED')
    const refunded = getStat('REFUNDED')

    // Totals
    const totalOrders = orderStats.reduce((acc: number, curr: any) => acc + curr._count, 0)
    const totalRevenue = orderStats.reduce((acc: number, curr: any) => acc + (curr._sum.total?.toNumber() ?? 0), 0)

    // "Paid" Amount (Confirmed + Preparing + Shipped + Delivered)
    // Note: This logic assumes 'PENDING' is unpaid. 'CANCELLED'/'REFUNDED' might be tricky depending on refund logic, 
    // but usually we exclude them from "Net Sales". For now, summing success statuses.
    const totalPaidAmount = confirmed.amount + preparing.amount + shipped.amount + delivered.amount

    // Trends Calculation
    const currentMonthRevenue = ordersCurrentMonth.reduce((acc: number, curr: any) => acc + (curr._sum.total?.toNumber() ?? 0), 0)
    const lastMonthRevenue = ordersLastMonth.reduce((acc: number, curr: any) => acc + (curr._sum.total?.toNumber() ?? 0), 0)
    const revenueTrend = lastMonthRevenue === 0
        ? null
        : Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)

    const currentMonthOrders = ordersCurrentMonth.reduce((acc: number, curr: any) => acc + curr._count, 0)
    const lastMonthOrders = ordersLastMonth.reduce((acc: number, curr: any) => acc + curr._count, 0)
    const orderTrend = lastMonthOrders === 0
        ? null
        : Math.round(((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100)

    const userTrend = userCountLastMonth === 0
        ? null
        : Math.round(((userCount - userCountLastMonth) / userCountLastMonth) * 100)

    // --- CHART DATA (Last 30 Days) ---
    // 1. Calculate Date Range (Midnight to Midnight)
    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today

    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29) // Inclusive of today = 30 days
    thirtyDaysAgo.setHours(0, 0, 0, 0) // Start of the first day

    // 2. Fetch Orders in strict Range
    const rawChartOrders = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: thirtyDaysAgo,
                lte: today
            },
            status: {
                not: 'CANCELLED'
            }
        },
        select: {
            createdAt: true,
            total: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    // 3. Aggregate Data by "YYYY-MM-DD"
    // We use Local Date String (tr-TR) for keys to ensure "Jan 30 01:00" counts as Jan 30
    const salesMap = new Map<string, { total: number; count: number }>()

    rawChartOrders.forEach(order => {
        // Use consistent formatting for the key. 
        // Note: To match the XAxis labels, we should use the same date object generation logic.
        // Or simpler: Convert order date to the same "Day" representation.
        // Ideally we stick to one timezone. Let's try ISO Date (UTC) to match standard database storage.
        const dateKey = order.createdAt.toISOString().split('T')[0]

        const current = salesMap.get(dateKey) || { total: 0, count: 0 }

        salesMap.set(dateKey, {
            total: current.total + order.total.toNumber(),
            count: current.count + 1
        })
    })

    const chartData = []

    // 4. Trace the 30 days and fill
    for (let i = 0; i < 30; i++) {
        const d = new Date(thirtyDaysAgo)
        d.setDate(d.getDate() + i)

        // This key must match the grouping key above
        const dateKey = d.toISOString().split('T')[0]

        const data = salesMap.get(dateKey) || { total: 0, count: 0 }

        // Label using the requested locale
        const label = d.toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' })

        chartData.push({
            name: label,
            total: data.total,
            count: data.count
        })
    }

    // --- SERIALIZATION ---
    // Fix for: "Decimal objects are not supported"
    const serializedRecentOrders = recentOrders.map(order => ({
        ...order,
        total: order.total.toNumber(),
        subtotal: order.subtotal.toNumber(),
        shippingCost: order.shippingCost.toNumber(),
        tax: order.tax.toNumber(),
    }))

    const serializedLowStockProducts = lowStockProducts.map(item => ({
        ...item,
        product: {
            ...item.product,
            price: item.product.price.toNumber(),
            // potentially other decimal fields like rating, oldPrice if they exist
        }
    }))

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold mb-2">{isTr ? 'Panel Özeti' : 'Dashboard Overview'}</h1>
                <p className="text-text-muted">
                    {isTr
                        ? 'Mağazanızın durumunu ve performansını buradan takip edin.'
                        : 'Track your store status and performance here.'}
                </p>
            </div>

            {/* Stats Components */}
            <DashboardStatsClient
                locale={locale}
                stats={{
                    totalRevenue,
                    totalOrders,
                    totalProducts: productCount,
                    totalUsers: userCount,
                    pendingCount: pending.count,
                    pendingAmount: pending.amount,
                    confirmedCount: confirmed.count,
                    confirmedAmount: confirmed.amount,
                    preparingCount: preparing.count,
                    shippedCount: shipped.count,
                    deliveredCount: delivered.count,
                    deliveredAmount: delivered.amount,
                    totalPaidAmount,
                    trends: {
                        revenue: revenueTrend,
                        orders: orderTrend,
                        users: userTrend
                    }
                }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart & Recent Orders */}
                <div className="lg:col-span-2 space-y-8">
                    <DashboardChart data={chartData} locale={locale} />
                    <RecentOrdersTable orders={serializedRecentOrders} locale={locale} />
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-surface border border-border rounded-xl p-6 h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <AlertCircle className="text-warning" size={20} />
                        {isTr ? 'Kritik Stok' : 'Low Stock Alerts'}
                    </h2>

                    <div className="space-y-4">
                        {serializedLowStockProducts.length > 0 ? (
                            serializedLowStockProducts.map((variant: any) => (
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
