'use client'

import StatsCard from '@/components/admin/StatsCard'
import { Package, ShoppingBag, Users, DollarSign, Clock, Truck, CheckCircle, Navigation } from 'lucide-react'

interface DashboardStatsClientProps {
    stats: {
        totalRevenue: number
        totalOrders: number
        totalProducts: number
        totalUsers: number
        pendingCount: number
        pendingAmount: number
        confirmedCount: number
        confirmedAmount: number
        preparingCount: number
        shippedCount: number
        deliveredCount: number
        deliveredAmount: number
        totalPaidAmount: number
        trends: {
            revenue: number
            orders: number
            users: number
        }
    }
    locale: string
}

export default function DashboardStatsClient({ stats, locale }: DashboardStatsClientProps) {
    const isTr = locale === 'tr'

    // Formatter
    const formatMoney = (amount: number) => {
        return amount.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' TL'
    }

    return (
        <div className="space-y-6">
            {/* Primary Stats Row - Financials & High Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <StatsCard
                    title={isTr ? 'Toplam Ciro' : 'Total Revenue'}
                    value={formatMoney(stats.totalRevenue)}
                    icon={DollarSign}
                    trend={{ value: stats.trends.revenue, isPositive: stats.trends.revenue >= 0 }}
                    description={isTr ? 'Geçen aya göre' : 'vs last month'}
                    className="bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800"
                />

                {/* Total Paid Revenue (Confirmed + Shipped + Delivered) */}
                <StatsCard
                    title={isTr ? 'Ödemesi Alınan' : 'Total Paid'}
                    value={formatMoney(stats.totalPaidAmount)}
                    icon={CheckCircle}
                    description={isTr ? 'Tamamlanan ödemeler' : 'Completed payments'}
                />

                {/* Total Orders */}
                <StatsCard
                    title={isTr ? 'Toplam Sipariş' : 'Total Orders'}
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    trend={{ value: stats.trends.orders, isPositive: stats.trends.orders >= 0 }}
                    description={isTr ? 'Geçen aya göre' : 'vs last month'}
                />

                {/* Users */}
                <StatsCard
                    title={isTr ? 'Müşteriler' : 'Total Users'}
                    value={stats.totalUsers}
                    icon={Users}
                    trend={{ value: stats.trends.users, isPositive: stats.trends.users >= 0 }}
                    description={isTr ? 'Geçen aya göre' : 'vs last month'}
                />
            </div>

            {/* Secondary Stats Row - Operational Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Pending */}
                <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-between hover:border-warning/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-warning/10 text-warning rounded-lg group-hover:bg-warning/20 transition-colors">
                            <Clock size={20} />
                        </div>
                        <span className="text-2xl font-bold">{stats.pendingCount}</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-text-muted mb-1">{isTr ? 'Ödeme Bekleyen' : 'Pending Payment'}</h3>
                        <p className="text-xs font-semibold text-warning">{formatMoney(stats.pendingAmount)}</p>
                    </div>
                </div>

                {/* Confirmed */}
                <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-between hover:border-info/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-info/10 text-info rounded-lg group-hover:bg-info/20 transition-colors">
                            <CheckCircle size={20} />
                        </div>
                        <span className="text-2xl font-bold">{stats.confirmedCount}</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-text-muted mb-1">{isTr ? 'Onaylanan' : 'Confirmed'}</h3>
                        <p className="text-xs font-semibold text-info">{formatMoney(stats.confirmedAmount)}</p>
                    </div>
                </div>

                {/* Preparing */}
                <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-between hover:border-secondary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-secondary/10 text-secondary rounded-lg group-hover:bg-secondary/20 transition-colors">
                            <Package size={20} />
                        </div>
                        <span className="text-2xl font-bold">{stats.preparingCount}</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-text-muted mb-1">{isTr ? 'Hazırlanan' : 'Preparing'}</h3>
                        {/* Usually preparation doesn't need monetary total displayed prominently, but consistent style */}
                        <p className="text-xs text-text-muted">{isTr ? 'İşleniyor' : 'Processing'}</p>
                    </div>
                </div>

                {/* Shipped */}
                <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-between hover:border-primary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Truck size={20} />
                        </div>
                        <span className="text-2xl font-bold">{stats.shippedCount}</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-text-muted mb-1">{isTr ? 'Kargoda' : 'Shipped'}</h3>
                        <p className="text-xs text-text-muted">{isTr ? 'Yolda' : 'On the way'}</p>
                    </div>
                </div>

                {/* Delivered */}
                <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-between hover:border-success/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-success/10 text-success rounded-lg group-hover:bg-success/20 transition-colors">
                            <CheckCircle size={20} />
                        </div>
                        <span className="text-2xl font-bold">{stats.deliveredCount}</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-text-muted mb-1">{isTr ? 'Teslim Edildi' : 'Delivered'}</h3>
                        <p className="text-xs font-semibold text-success">{formatMoney(stats.deliveredAmount)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
