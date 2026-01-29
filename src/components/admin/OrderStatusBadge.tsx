interface OrderStatusBadgeProps {
    status: string
    locale?: string
}

export default function OrderStatusBadge({ status, locale = 'tr' }: OrderStatusBadgeProps) {
    const isTr = locale === 'tr'

    const styles: Record<string, string> = {
        PENDING: 'bg-warning/10 text-warning border-warning/20',
        CONFIRMED: 'bg-info/10 text-info border-info/20',
        PREPARING: 'bg-indigo/10 text-indigo border-indigo/20',
        SHIPPED: 'bg-secondary/10 text-secondary border-secondary/20',
        DELIVERED: 'bg-success/10 text-success border-success/20',
        CANCELLED: 'bg-error/10 text-error border-error/20',
        REFUNDED: 'bg-text-muted/10 text-text-muted border-text-muted/20',
    }

    const labels: Record<string, { tr: string; en: string }> = {
        PENDING: { tr: 'Ödeme Bekleniyor', en: 'Pending Payment' },
        CONFIRMED: { tr: 'Onaylandı', en: 'Confirmed' },
        PREPARING: { tr: 'Hazırlanıyor', en: 'Preparing' },
        SHIPPED: { tr: 'Kargolandı', en: 'Shipped' },
        DELIVERED: { tr: 'Teslim Edildi', en: 'Delivered' },
        CANCELLED: { tr: 'İptal Edildi', en: 'Cancelled' },
        REFUNDED: { tr: 'İade Edildi', en: 'Refunded' },
    }

    // Fallback for old/mismatched statuses
    const label = labels[status] ? (isTr ? labels[status].tr : labels[status].en) : status

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {label}
        </span>
    )
}
