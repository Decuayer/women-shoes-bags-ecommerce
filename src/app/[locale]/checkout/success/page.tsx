import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react'

interface SuccessPageProps {
    params: Promise<{ locale: string }>
}

export default async function CheckoutSuccessPage({ params }: SuccessPageProps) {
    const { locale } = await params
    const isTr = locale === 'tr'

    // Generate a fake order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={locale} />

            <main className="flex-1 bg-background flex items-center justify-center">
                <div className="container py-16">
                    <div className="max-w-lg mx-auto text-center">
                        {/* Success Icon */}
                        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} className="text-success" />
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold mb-4">
                            {isTr ? 'Siparişiniz Alındı!' : 'Order Confirmed!'}
                        </h1>

                        {/* Order Number */}
                        <p className="text-text-muted mb-2">
                            {isTr ? 'Sipariş Numaranız:' : 'Order Number:'}
                        </p>
                        <p className="text-xl font-mono font-bold text-secondary mb-6">
                            {orderNumber}
                        </p>

                        {/* Description */}
                        <p className="text-text-muted mb-8">
                            {isTr
                                ? 'Siparişiniz başarıyla alındı. Sipariş detaylarını e-posta adresinize gönderdik. Siparişinizi hazırladığımızda sizi bilgilendireceğiz.'
                                : 'Your order has been successfully placed. We\'ve sent the order details to your email. We\'ll notify you when your order is ready for shipping.'
                            }
                        </p>

                        {/* Order Status Steps */}
                        <div className="flex items-center justify-center gap-4 mb-10">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-2">
                                    <CheckCircle size={24} className="text-success" />
                                </div>
                                <span className="text-xs text-text-muted">
                                    {isTr ? 'Onaylandı' : 'Confirmed'}
                                </span>
                            </div>
                            <div className="w-8 h-0.5 bg-border" />
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-2">
                                    <Package size={24} className="text-text-dark" />
                                </div>
                                <span className="text-xs text-text-muted">
                                    {isTr ? 'Hazırlanıyor' : 'Preparing'}
                                </span>
                            </div>
                            <div className="w-8 h-0.5 bg-border" />
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-2">
                                    <Truck size={24} className="text-text-dark" />
                                </div>
                                <span className="text-xs text-text-muted">
                                    {isTr ? 'Kargoda' : 'Shipped'}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href={`/${locale}/account/orders`} className="btn btn-secondary">
                                {isTr ? 'Siparişlerimi Görüntüle' : 'View My Orders'}
                            </Link>
                            <Link href={`/${locale}/products`} className="btn btn-primary">
                                {isTr ? 'Alışverişe Devam Et' : 'Continue Shopping'}
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    )
}

export async function generateMetadata({ params }: SuccessPageProps) {
    const { locale } = await params

    return {
        title: locale === 'tr' ? 'Sipariş Onaylandı | LUXEBAGS' : 'Order Confirmed | LUXEBAGS',
        description: locale === 'tr'
            ? 'Siparişiniz başarıyla alındı'
            : 'Your order has been successfully placed',
    }
}
