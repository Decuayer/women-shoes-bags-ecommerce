'use client'

import { useState } from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts'

interface DashboardChartProps {
    data: any[]
    locale: string
}

export default function DashboardChart({ data, locale }: DashboardChartProps) {
    const [activeTab, setActiveTab] = useState<'revenue' | 'orders'>('revenue')
    const isTr = locale === 'tr'

    // Format money for tooltip
    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0
        }).format(value)
    }

    // Calculate totals for the displayed period
    const totalRevenue = data.reduce((acc, curr) => acc + (curr.total || 0), 0)
    const totalOrders = data.reduce((acc, curr) => acc + (curr.count || 0), 0)

    return (
        <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold">
                        {isTr ? 'Satış Analizi' : 'Sales Analytics'}
                    </h2>
                    <p className="text-2xl font-bold mt-1 text-secondary">
                        {activeTab === 'revenue'
                            ? formatMoney(totalRevenue)
                            : totalOrders
                        }
                    </p>
                    <p className="text-xs text-text-muted">
                        {isTr ? 'Son 30 gün' : 'Last 30 days'}
                    </p>
                </div>

                {/* Toggles */}
                <div className="flex p-1 bg-surface-light rounded-lg border border-border">
                    <button
                        onClick={() => setActiveTab('revenue')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'revenue'
                            ? 'bg-white shadow text-primary'
                            : 'text-text-muted hover:text-text'
                            }`}
                    >
                        {isTr ? 'Gelir' : 'Revenue'}
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'orders'
                            ? 'bg-white shadow text-primary'
                            : 'text-text-muted hover:text-text'
                            }`}
                    >
                        {isTr ? 'Siparişler' : 'Orders'}
                    </button>
                </div>
            </div>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {activeTab === 'revenue' ? (
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#dbeafe" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#dbeafe" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                tickFormatter={(value) =>
                                    value >= 1000
                                        ? `${(value / 1000).toFixed(1)}k`
                                        : value
                                }
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number | undefined) => [formatMoney(value || 0), isTr ? 'Gelir' : 'Revenue']}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                            />
                        </AreaChart>
                    ) : (
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#F3F4F6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number | undefined) => [(value || 0), isTr ? 'Sipariş' : 'Order']}
                            />
                            <Bar
                                dataKey="count"
                                fill="#8b5cf6"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Summary Footer */}
            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>{isTr ? 'Toplam Gelir' : 'Total Revenue'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                    <span>{isTr ? 'Sipariş Adedi' : 'Order Count'}</span>
                </div>
            </div>
        </div>
    )
}
