interface OrderStatusBadgeProps {
    status: string
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const styles: Record<string, string> = {
        PENDING: 'bg-warning/10 text-warning border-warning/20',
        PROCESSING: 'bg-info/10 text-info border-info/20',
        SHIPPED: 'bg-secondary/10 text-secondary border-secondary/20',
        DELIVERED: 'bg-success/10 text-success border-success/20',
        CANCELLED: 'bg-error/10 text-error border-error/20',
        RETURNED: 'bg-text-muted/10 text-text-muted border-text-muted/20',
    }

    const labels: Record<string, string> = {
        PENDING: 'Beklemede',
        PROCESSING: 'Hazırlanıyor',
        SHIPPED: 'Kargolandı',
        DELIVERED: 'Teslim Edildi',
        CANCELLED: 'İptal Edildi',
        RETURNED: 'İade Edildi',
    }

    const labelsEn: Record<string, string> = {
        PENDING: 'Pending',
        PROCESSING: 'Processing',
        SHIPPED: 'Shipped',
        DELIVERED: 'Delivered',
        CANCELLED: 'Cancelled',
        RETURNED: 'Returned',
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    )
}
