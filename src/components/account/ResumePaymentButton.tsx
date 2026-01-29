'use client'

import { useState } from 'react'
import { CreditCard, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ResumePaymentButtonProps {
    orderId: string
    locale: string
}

export default function ResumePaymentButton({ orderId, locale }: ResumePaymentButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const isTr = locale === 'tr'
    const router = useRouter()

    const handleResumePayment = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/payment/resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, locale })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || (isTr ? 'Ödeme başlatılamadı' : 'Failed to initialize payment'))
                setIsLoading(false)
                return
            }

            if (data.paymentPageUrl) {
                window.location.href = data.paymentPageUrl
            } else {
                alert(isTr ? 'Ödeme sayfası bulunamadı' : 'Payment page not found')
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Resume error:', error)
            alert(isTr ? 'Bir hata oluştu' : 'An error occurred')
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleResumePayment}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 text-sm"
        >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
            {isTr ? 'Ödemeyi Tamamla' : 'Complete Payment'}
        </button>
    )
}
