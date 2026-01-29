'use client'

import { useState } from 'react'
import { cancelOrder } from '@/actions/orderActions'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface CancelOrderButtonProps {
    orderId: string
    isTr: boolean
}

export default function CancelOrderButton({ orderId, isTr }: CancelOrderButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleCancel = async () => {
        if (!confirm(isTr ? 'Siparişi iptal etmek istediğinize emin misiniz?' : 'Are you sure you want to cancel this order?')) {
            return
        }

        setIsLoading(true)
        try {
            const result = await cancelOrder(orderId)

            if (result.success) {
                // Success logic could be handled via toast if available context is accessible here, 
                // but since this is a deep component, we might rely on UI update.
                // refresh happens via revalidatePath in action, but router.refresh helps client update instantly
                router.refresh()
            } else {
                alert(result.message || (isTr ? 'İptal işlemi başarısız oldu' : 'Cancellation failed'))
            }
        } catch (error) {
            alert(isTr ? 'Bir hata oluştu' : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full btn btn-outline border-error text-error hover:bg-error hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isTr ? 'Siparişi İptal Et' : 'Cancel Order'}
        </button>
    )
}
