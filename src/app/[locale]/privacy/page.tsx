import { Shield, Lock, Eye, Database, Mail } from 'lucide-react'
import { getGeneralSettings, getAnnouncementSettings } from '@/lib/settings'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface PrivacyPageProps {
    params: Promise<{ locale: string }>
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
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
                            <Shield className="text-secondary" size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {isTr ? 'Gizlilik Politikası' : 'Privacy Policy'}
                        </h1>
                        <p className="text-text-muted max-w-2xl mx-auto">
                            {isTr
                                ? 'Kişisel verilerinizin korunması bizim için önemlidir. Bu sayfada verilerinizin nasıl toplandığı ve kullanıldığı hakkında bilgi bulabilirsiniz.'
                                : 'Protecting your personal data is important to us. On this page you can find information about how your data is collected and used.'
                            }
                        </p>
                        <p className="text-sm text-text-muted mt-2">
                            {isTr ? 'Son güncelleme: 3 Şubat 2026' : 'Last updated: February 3, 2026'}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Introduction */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">{isTr ? 'Giriş' : 'Introduction'}</h2>
                            <p className="text-text-muted leading-relaxed">
                                {isTr
                                    ? 'CRAZYSHOES olarak, kişisel verilerinizin güvenliğini ve gizliliğini korumayı taahhüt ediyoruz. Bu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde veya hizmetlerimizi kullandığınızda kişisel bilgilerinizin nasıl toplandığını, kullanıldığını, paylaşıldığını ve korunduğunu açıklamaktadır. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında hazırlanmıştır.'
                                    : 'As CRAZYSHOES, we are committed to protecting the security and privacy of your personal data. This Privacy Policy explains how your personal information is collected, used, shared and protected when you visit our website or use our services. It has been prepared within the scope of the Personal Data Protection Law No. 6698 (KVKK).'
                                }
                            </p>
                        </div>

                        {/* Data Collection */}
                        <div className="card p-6 md:p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                    <Database className="text-secondary" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">
                                        {isTr ? 'Topladığımız Bilgiler' : 'Information We Collect'}
                                    </h2>
                                </div>
                            </div>
                            <div className="space-y-4 pl-16">
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        {isTr ? '1. Kimlik Bilgileri' : '1. Identity Information'}
                                    </h3>
                                    <p className="text-text-muted text-sm">
                                        {isTr
                                            ? 'Ad, soyad, doğum tarihi, T.C. kimlik numarası (fatura düzenlemek için gerekli olduğunda)'
                                            : 'Name, surname, date of birth, ID number (when required for invoicing)'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        {isTr ? '2. İletişim Bilgileri' : '2. Contact Information'}
                                    </h3>
                                    <p className="text-text-muted text-sm">
                                        {isTr
                                            ? 'E-posta adresi, telefon numarası, teslimat ve fatura adresleri'
                                            : 'Email address, phone number, delivery and billing addresses'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        {isTr ? '3. Sipariş Bilgileri' : '3. Order Information'}
                                    </h3>
                                    <p className="text-text-muted text-sm">
                                        {isTr
                                            ? 'Satın alma geçmişi, sepet içeriği, favori ürünler, tercihleriniz'
                                            : 'Purchase history, cart contents, favorite products, your preferences'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        {isTr ? '4. Ödeme Bilgileri' : '4. Payment Information'}
                                    </h3>
                                    <p className="text-text-muted text-sm">
                                        {isTr
                                            ? 'Kredi kartı bilgileriniz güvenli ödeme altyapısı sağlayıcısı tarafından işlenir ve bizimle paylaşılmaz. Sadece işlem sonucu bilgilerini alırız.'
                                            : 'Your credit card information is processed by the secure payment infrastructure provider and is not shared with us. We only receive transaction result information.'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        {isTr ? '5. Teknik Bilgiler' : '5. Technical Information'}
                                    </h3>
                                    <p className="text-text-muted text-sm">
                                        {isTr
                                            ? 'IP adresi, tarayıcı türü, işletim sistemi, ziyaret edilen sayfalar, tıklama verileri (Google Analytics gibi araçlarla)'
                                            : 'IP address, browser type, operating system, visited pages, click data (with tools like Google Analytics)'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Data Usage */}
                        <div className="card p-6 md:p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                    <Eye className="text-secondary" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">
                                        {isTr ? 'Bilgilerinizi Nasıl Kullanıyoruz' : 'How We Use Your Information'}
                                    </h2>
                                </div>
                            </div>
                            <div className="space-y-3 pl-16">
                                <div className="flex gap-2">
                                    <span className="text-secondary">•</span>
                                    <p className="text-text-muted text-sm">
                                        {isTr ? 'Siparişlerinizi işlemek ve teslimat yapmak' : 'Processing your orders and making deliveries'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-secondary">•</span>
                                    <p className="text-text-muted text-sm">
                                        {isTr ? 'Müşteri hizmetleri desteği sağlamak' : 'Providing customer service support'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-secondary">•</span>
                                    <p className="text-text-muted text-sm">
                                        {isTr ? 'Size sipariş ve kargo güncellemeleri göndermek' : 'Sending you order and shipping updates'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-secondary">•</span>
                                    <p className="text-text-muted text-sm">
                                        {isTr ? 'Hizmetlerimizi iyileştirmek ve kişiselleştirmek' : 'Improving and personalizing our services'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-secondary">•</span>
                                    <p className="text-text-muted text-sm">
                                        {isTr ? 'Özel kampanya ve indirimler hakkında bilgilendirmek (izninizle)' : 'Informing about special campaigns and discounts (with your permission)'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-secondary">•</span>
                                    <p className="text-text-muted text-sm">
                                        {isTr ? 'Yasal yükümlülükleri yerine getirmek' : 'Fulfilling legal obligations'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Data Security */}
                        <div className="card p-6 md:p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                    <Lock className="text-secondary" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">
                                        {isTr ? 'Veri Güvenliği' : 'Data Security'}
                                    </h2>
                                </div>
                            </div>
                            <div className="space-y-4 pl-16">
                                <p className="text-text-muted">
                                    {isTr
                                        ? 'Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri alıyoruz:'
                                        : 'We take industry standard security measures to ensure the security of your personal data:'
                                    }
                                </p>
                                <div className="space-y-3">
                                    <div className="p-4 bg-surface-light rounded-lg">
                                        <h4 className="font-semibold mb-1">
                                            {isTr ? '256-bit SSL Şifreleme' : '256-bit SSL Encryption'}
                                        </h4>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'Tüm veri aktarımları şifrelenmiş kanallardan yapılır.'
                                                : 'All data transfers are made through encrypted channels.'
                                            }
                                        </p>
                                    </div>
                                    <div className="p-4 bg-surface-light rounded-lg">
                                        <h4 className="font-semibold mb-1">
                                            {isTr ? 'Güvenli Sunucular' : 'Secure Servers'}
                                        </h4>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'Verileriniz güvenli ve yedekli sunucularda saklanır.'
                                                : 'Your data is stored on secure and redundant servers.'
                                            }
                                        </p>
                                    </div>
                                    <div className="p-4 bg-surface-light rounded-lg">
                                        <h4 className="font-semibold mb-1">
                                            {isTr ? 'Erişim Kontrolü' : 'Access Control'}
                                        </h4>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'Verilerinize sadece yetkili personel erişebilir.'
                                                : 'Only authorized personnel can access your data.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cookies */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">
                                {isTr ? 'Çerezler (Cookies)' : 'Cookies'}
                            </h2>
                            <p className="text-text-muted mb-4">
                                {isTr
                                    ? 'Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanır. Çerezler, tarayıcınıza kaydedilen küçük metin dosyalarıdır.'
                                    : 'Our website uses cookies to improve user experience. Cookies are small text files saved to your browser.'
                                }
                            </p>
                            <div className="space-y-2 text-sm text-text-muted">
                                <p><strong>{isTr ? 'Zorunlu Çerezler:' : 'Essential Cookies:'}</strong> {isTr ? 'Sitenin çalışması için gereklidir.' : 'Required for the site to function.'}</p>
                                <p><strong>{isTr ? 'Analitik Çerezler:' : 'Analytics Cookies:'}</strong> {isTr ? 'Site kullanımını analiz etmemize yardımcı olur.' : 'Helps us analyze site usage.'}</p>
                                <p><strong>{isTr ? 'Pazarlama Çerezleri:' : 'Marketing Cookies:'}</strong> {isTr ? 'Kişiselleştirilmiş reklamlar göstermek için kullanılır.' : 'Used to show personalized ads.'}</p>
                            </div>
                        </div>

                        {/* Your Rights */}
                        <div className="card p-6 md:p-8 bg-blue-500/5 border-blue-500/20">
                            <h2 className="text-2xl font-bold mb-4">
                                {isTr ? 'Haklarınız (KVKK)' : 'Your Rights (GDPR)'}
                            </h2>
                            <div className="space-y-2 text-sm text-text-muted">
                                <p>• {isTr ? 'Kişisel verilerinizin işlenip işlenmediğini öğrenme' : 'Learning whether your personal data is being processed'}</p>
                                <p>• {isTr ? 'İşlenmişse buna ilişkin bilgi talep etme' : 'Requesting information about it if it has been processed'}</p>
                                <p>• {isTr ? 'Verilerin düzeltilmesini talep etme' : 'Requesting correction of data'}</p>
                                <p>• {isTr ? 'Verilerin silinmesini veya yok edilmesini talep etme' : 'Requesting deletion or destruction of data'}</p>
                                <p>• {isTr ? 'Verilerin aktarıldığı üçüncü kişileri bilme' : 'Knowing third parties to whom data is transferred'}</p>
                                <p>• {isTr ? 'İşlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi sonucu ortaya çıkan sonuçlara itiraz etme' : 'Objecting to the results of processing data exclusively through automated systems'}</p>
                                <p>• {isTr ? 'Verilerin kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme' : 'Requesting compensation for damages in case of unlawful processing of data'}</p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="card p-6 md:p-8 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                                    <Mail className="text-secondary" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        {isTr ? 'Bizimle İletişime Geçin' : 'Contact Us'}
                                    </h3>
                                    <p className="text-text-muted mb-4">
                                        {isTr
                                            ? 'Gizlilik politikamız veya kişisel verileriniz hakkında sorularınız varsa bizimle iletişime geçebilirsiniz.'
                                            : 'If you have questions about our privacy policy or your personal data, you can contact us.'
                                        }
                                    </p>
                                    <a href={`/${locale}/contact`} className="btn btn-secondary btn-sm inline-flex">
                                        {isTr ? 'İletişime Geç' : 'Contact Us'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer locale={locale} />
        </>
    )
}
