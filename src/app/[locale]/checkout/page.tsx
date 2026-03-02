import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CheckoutPageClient from '@/components/checkout/CheckoutPageClient'
import { prisma } from '@/lib/prisma'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { cookies } from 'next/headers'
import { getGeneralSettings, getAnnouncementSettings, getShippingSettings } from '@/lib/settings'

interface CheckoutPageProps {
    params: Promise<{ locale: string }>
}

async function getAddresses() {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value
    if (!token) return []

    const payload = await verifyAccessTokenEdge(token)
    if (!payload?.userId) return []

    const addresses = await prisma.address.findMany({
        where: { userId: payload.userId as string },
        orderBy: [
            { isDefault: 'desc' },
            { createdAt: 'desc' }
        ]
    })

    return addresses
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const { locale } = await params
    const [addresses, general, announcement, shippingSettings] = await Promise.all([
        getAddresses(),
        getGeneralSettings(),
        getAnnouncementSettings(),
        getShippingSettings(),
    ])

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={locale} settings={{ general, announcement }} />
            <main className="flex-1 bg-background">
                <CheckoutPageClient
                    locale={locale}
                    savedAddresses={addresses}
                    shippingSettings={shippingSettings}
                />
            </main>
            <Footer locale={locale} />
        </div>
    )
}


export async function generateMetadata({ params }: CheckoutPageProps) {
    const { locale } = await params

    return {
        title: locale === 'tr' ? 'Ödeme | CRAZYSHOES' : 'Checkout | CRAZYSHOES',
        description: locale === 'tr'
            ? 'Güvenli ödeme ile siparişinizi tamamlayın'
            : 'Complete your order with secure checkout',
    }
}
