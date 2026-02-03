import { HelpCircle } from 'lucide-react'
import { getGeneralSettings, getAnnouncementSettings } from '@/lib/settings'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FAQClient from './FAQClient'

interface FAQPageProps {
    params: Promise<{ locale: string }>
}

export default async function FAQPage({ params }: FAQPageProps) {
    const { locale } = await params
    const isTr = locale === 'tr'

    const general = await getGeneralSettings()
    const announcement = await getAnnouncementSettings()

    return (
        <>
            <Header locale={locale} settings={{ general, announcement }} />
            <main className="min-h-screen bg-background">
                <div className="container !py-12">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                            <HelpCircle className="text-secondary" size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {isTr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
                        </h1>
                        <p className="text-text-muted max-w-2xl mx-auto">
                            {isTr
                                ? 'Aklınıza takılan soruların cevaplarını burada bulabilirsiniz. Daha fazla yardıma ihtiyacınız varsa bizimle iletişime geçebilirsiniz.'
                                : 'Find answers to common questions here. If you need more help, feel free to contact us.'
                            }
                        </p>
                    </div>

                    {/* FAQ Content */}
                    <div className="max-w-4xl mx-auto">
                        <FAQClient locale={locale} />
                    </div>

                    {/* Contact CTA */}
                    <div className="max-w-4xl mx-auto mt-12">
                        <div className="card p-8 text-center bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                            <h3 className="text-xl font-bold mb-2">
                                {isTr ? 'Sorunuza cevap bulamadınız mı?' : 'Didn\'t find your answer?'}
                            </h3>
                            <p className="text-text-muted mb-4">
                                {isTr
                                    ? 'Müşteri hizmetleri ekibimiz size yardımcı olmaktan mutluluk duyar.'
                                    : 'Our customer service team is happy to help you.'
                                }
                            </p>
                            <a href={`/${locale}/contact`} className="btn btn-secondary inline-flex">
                                {isTr ? 'Bizimle İletişime Geçin' : 'Contact Us'}
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer locale={locale} />
        </>
    )
}
