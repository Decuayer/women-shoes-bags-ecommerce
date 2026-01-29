import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoginForm from '@/components/auth/LoginForm'

interface LoginPageProps {
    params: Promise<{ locale: string }>
}

import { getGeneralSettings, getAnnouncementSettings } from '@/lib/settings'

export default async function LoginPage({ params }: LoginPageProps) {
    const { locale } = await params
    const general = await getGeneralSettings()
    const announcement = await getAnnouncementSettings()

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={locale} settings={{ general, announcement }} />

            <main className="flex-1 bg-background flex items-center justify-center py-12">
                <div className="container">
                    <div className="bg-surface rounded-2xl border border-border p-8 max-w-md mx-auto">
                        <LoginForm locale={locale} />
                    </div>
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    )
}

export async function generateMetadata({ params }: LoginPageProps) {
    const { locale } = await params

    return {
        title: locale === 'tr' ? 'Giriş Yap | CRAZYSHOES' : 'Sign In | CRAZYSHOES',
        description: locale === 'tr'
            ? 'Hesabınıza giriş yapın'
            : 'Sign in to your account',
    }
}
