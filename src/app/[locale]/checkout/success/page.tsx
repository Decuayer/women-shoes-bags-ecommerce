'use client'

import { useEffect, Suspense } from 'react'
import { useCart } from '@/components/cart/CartContext'
import Link from 'next/link'
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react'
import { useSearchParams, useParams } from 'next/navigation'

function SuccessContent() {
    const params = useParams()
    const searchParams = useSearchParams()

    // useParams returns string | string[], casting to string for locale
    const locale = params?.locale as string || 'tr'
    const orderId = searchParams.get('orderId')

    const { clearCart } = useCart()
    const isTr = locale === 'tr'

    useEffect(() => {
        // Force clear cart to ensure it's empty in UI
        clearCart()
    }, [clearCart])

    return (
        <div className="container">
            <div className="py-20">
                <div className="max-w-xl mx-auto text-center space-y-8">
                    <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto animate-fadeIn">
                        <CheckCircle size={48} />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">
                            {isTr ? 'Siparişiniz Alındı!' : 'Order Confirmed!'}
                        </h1>
                        <p className="text-text-muted text-lg">
                            {isTr
                                ? 'Ödemeniz başarıyla tamamlandı. Sipariş detayları e-posta adresinize gönderildi.'
                                : 'Your payment was successful. Order details have been sent to your email.'}
                        </p>
                        {orderId && (
                            <div className="bg-surface border border-border rounded-lg p-4 inline-block">
                                <span className="text-sm text-text-muted mr-2">
                                    {isTr ? 'Sipariş No:' : 'Order ID:'}
                                </span>
                                <span className="font-mono font-bold text-lg text-secondary">
                                    {orderId}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Link
                            href={`/${locale}/account/orders`}
                            className="btn btn-outline flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={20} />
                            {isTr ? 'Siparişlerim' : 'My Orders'}
                        </Link>
                        <Link
                            href={`/${locale}`}
                            className="btn btn-primary flex items-center justify-center gap-2"
                        >
                            {isTr ? 'Alışverişe Devam Et' : 'Continue Shopping'}
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
