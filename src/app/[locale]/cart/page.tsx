import CartPageClient from '@/components/cart/CartPageClient'

interface CartPageProps {
    params: Promise<{ locale: string }>
}

export default async function CartPage({ params }: CartPageProps) {
    const { locale } = await params
    return <CartPageClient locale={locale} />
}

export async function generateMetadata({ params }: CartPageProps) {
    const { locale } = await params

    return {
        title: locale === 'tr' ? 'Sepetim | LUXEBAGS' : 'My Cart | LUXEBAGS',
        description: locale === 'tr'
            ? 'Alışveriş sepetinizdeki ürünleri görüntüleyin'
            : 'View products in your shopping cart',
    }
}
