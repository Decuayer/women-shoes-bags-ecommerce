import { getGeneralSettings, getAnnouncementSettings, getContactSettings } from '@/lib/settings'
import ContactContent from '@/components/contact/ContactContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface ContactPageProps {
    params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: ContactPageProps) {
    const { locale } = await params

    // Fetch all necessary settings on the server
    const general = await getGeneralSettings()
    const announcement = await getAnnouncementSettings()
    const contact = await getContactSettings()

    return (
        <>
            <Header locale={locale} settings={{ general, announcement }} />
            <ContactContent
                locale={locale}
                settings={{
                    general,
                    announcement,
                    contact
                }}
            />
            <Footer locale={locale} />
        </>
    )
}
