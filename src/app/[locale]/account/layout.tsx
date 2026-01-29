import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AccountLayoutClient from '@/components/account/AccountLayoutClient'
import { getGeneralSettings, getAnnouncementSettings } from '@/lib/settings'

export default async function AccountLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const general = await getGeneralSettings()
    const announcement = await getAnnouncementSettings()

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={locale} settings={{ general, announcement }} />
            <main className="flex-1 bg-background">
                <AccountLayoutClient>
                    {children}
                </AccountLayoutClient>
            </main>
            <Footer locale={locale} />
        </div>
    )
}
