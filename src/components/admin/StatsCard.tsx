import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: {
        value: number // percentage
        isPositive: boolean
    }
    description?: string
    className?: string
}

export default function StatsCard({ title, value, icon: Icon, trend, description, className = '' }: StatsCardProps) {
    return (
        <div className={`bg-surface border border-border rounded-xl p-6 ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-text">{value}</h3>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                    <Icon size={24} />
                </div>
            </div>

            {(trend || description) && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                    {trend && (
                        <span className={`font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {trend.isPositive ? '+' : ''}{Math.round(trend.value)}%
                        </span>
                    )}
                    {description && (
                        <span className="text-text-muted">{description}</span>
                    )}
                </div>
            )}
        </div>
    )
}
