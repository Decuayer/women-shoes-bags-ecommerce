import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import RegisterForm from '@/components/auth/RegisterForm'

interface RegisterPageProps {
    params: Promise<{ locale: string }>
}

import { getGeneralSettings, getAnnouncementSettings } from '@/lib/settings'

export default async function RegisterPage({ params }: RegisterPageProps) {
    const { locale } = await params
    const general = await getGeneralSettings()
    const announcement = await getAnnouncementSettings()

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={locale} settings={{ general, announcement }} />

            <main className="flex-1 bg-background flex items-center justify-center py-12">
                <div className="container">
                    <div className="bg-surface rounded-2xl border border-border p-8 max-w-md mx-auto">
                        <RegisterForm locale={locale} />
                    </div>
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    )
}

export async function generateMetadata({ params }: RegisterPageProps) {
    const { locale } = await params

    return {
        title: locale === 'tr' ? 'Kayıt Ol | CRAZYSHOES' : 'Sign Up | CRAZYSHOES',
        description: locale === 'tr'
            ? 'Hesap oluşturun ve alışverişe başlayın'
            : 'Create an account and start shopping',
    }
}
