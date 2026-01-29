import PasswordForm from '@/components/account/PasswordForm'

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const isTr = locale === 'tr'

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                {isTr ? 'Hesap Ayarları' : 'Account Settings'}
            </h1>
            <p className="text-text-muted mb-8">
                {isTr
                    ? 'Şifre değişikliği ve hesap güvenliği işlemlerini buradan yapabilirsiniz.'
                    : 'You can manage password changes and account security here.'
                }
            </p>

            <div className="bg-background border border-border p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-6">
                    {isTr ? 'Şifre Değiştir' : 'Change Password'}
                </h2>
                <PasswordForm locale={locale} />
            </div>
        </div>
    )
}
