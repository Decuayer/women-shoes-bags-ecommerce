import MessagesClient from '@/components/admin/messages/MessagesClient'

interface MessagesPageProps {
    params: Promise<{ locale: string }>
}

export default async function MessagesPage({ params }: MessagesPageProps) {
    const { locale } = await params
    return <MessagesClient locale={locale} />
}
