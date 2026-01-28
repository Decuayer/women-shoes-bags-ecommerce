import { prisma } from '@/lib/prisma'
import SettingsClient from '@/components/admin/settings/SettingsClient'

interface SettingsPageProps {
    params: Promise<{ locale: string }>
}

export default async function SettingsPage({ params }: SettingsPageProps) {
    const { locale } = await params

    const settings = await prisma.siteSettings.findMany()

    return (
        <SettingsClient settings={settings} locale={locale} />
    )
}
