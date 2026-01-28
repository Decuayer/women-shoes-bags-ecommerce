import CheckoutPageClient from '@/components/checkout/CheckoutPageClient'

interface CheckoutPageProps {
    params: Promise<{ locale: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const { locale } = await params
    return <CheckoutPageClient locale={locale} />
}

export async function generateMetadata({ params }: CheckoutPageProps) {
    const { locale } = await params

    return {
        title: locale === 'tr' ? 'Ödeme | LUXEBAGS' : 'Checkout | LUXEBAGS',
        description: locale === 'tr'
            ? 'Güvenli ödeme ile siparişinizi tamamlayın'
            : 'Complete your order with secure checkout',
    }
}
