import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartPageClient from '@/components/cart/CartPageClient'
import { getGeneralSettings, getAnnouncementSettings } from '@/lib/settings'

interface CartPageProps {
    params: Promise<{ locale: string }>
}

export default async function CartPage({ params }: CartPageProps) {
    const { locale } = await params
    const general = await getGeneralSettings()
    const announcement = await getAnnouncementSettings()

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={locale} settings={{ general, announcement }} />
            <main className="flex-1 bg-background">
                <CartPageClient locale={locale} />
            </main>
            <Footer locale={locale} />
        </div>
    )
}

export async function generateMetadata({ params }: CartPageProps) {
    const { locale } = await params

    return {
        title: locale === 'tr' ? 'Sepetim | CRAZYSHOES' : 'My Cart | CRAZYSHOES',
        description: locale === 'tr'
            ? 'Alışveriş sepetinizdeki ürünleri görüntüleyin'
            : 'View products in your shopping cart',
    }
}
