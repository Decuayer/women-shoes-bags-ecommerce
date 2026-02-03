import { RefreshCw, AlertCircle, CheckCircle, Package } from 'lucide-react'
import { getGeneralSettings, getAnnouncementSettings } from '@/lib/settings'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface ExchangePageProps {
    params: Promise<{ locale: string }>
}

export default async function ExchangePage({ params }: ExchangePageProps) {
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
                            <RefreshCw className="text-secondary" size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {isTr ? 'Değişim Politikası' : 'Exchange Policy'}
                        </h1>
                        <p className="text-text-muted max-w-2xl mx-auto">
                            {isTr
                                ? 'Ürün değişimi ile ilgili tüm bilgileri bu sayfada bulabilirsiniz.'
                                : 'Find all information about product exchanges on this page.'
                            }
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Important Notice */}
                        <div className="card p-6 bg-amber-500/10 border-amber-500/20">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="text-amber-600 shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2">
                                        {isTr ? 'Önemli Bilgilendirme' : 'Important Notice'}
                                    </h3>
                                    <p className="text-sm text-amber-800 dark:text-amber-200">
                                        {isTr
                                            ? 'Mağazamızda iade işlemi yapılmamaktadır. Sadece ürün değişimi kabul edilmektedir. Lütfen sipariş vermeden önce beden ve renk seçimlerinizi dikkatlice yapınız.'
                                            : 'We do not accept returns. Only product exchanges are accepted. Please choose your size and color carefully before placing an order.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Exchange Conditions */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6">
                                {isTr ? 'Değişim Koşulları' : 'Exchange Conditions'}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? '14 Günlük Değişim Hakkı' : '14-Day Exchange Right'}
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'Ürünü teslim aldıktan sonraki 14 gün içinde değişim talebinde bulunabilirsiniz.'
                                                : 'You can request an exchange within 14 days after receiving the product.'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'Kullanılmamış Ürün' : 'Unused Product'}
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'Ürün kullanılmamış, giyilmemiş ve deneme dışında test edilmemiş olmalıdır.'
                                                : 'The product must be unused, unworn and not tested except for trying on.'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'Orijinal Ambalaj ve Etiketler' : 'Original Packaging and Tags'}
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'Ürünün orijinal ambalajı, kutusu, etiketi ve tüm aksesuarları eksiksiz olmalıdır.'
                                                : 'The product must have its original packaging, box, tags and all accessories intact.'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'Fatura' : 'Invoice'}
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'Değişim işlemi için ürünle birlikte fatura veya irsaliye gönderilmelidir.'
                                                : 'Invoice or waybill must be sent with the product for exchange.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Exchange Process */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6">
                                {isTr ? 'Değişim Süreci' : 'Exchange Process'}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <span className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center font-bold shrink-0">
                                        1
                                    </span>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'Müşteri Hizmetleri ile İletişim' : 'Contact Customer Service'}
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'İletişim sayfası veya e-posta yoluyla müşteri hizmetleri ile iletişime geçin. Sipariş numaranızı ve değişim sebebinizi belirtin.'
                                                : 'Contact customer service via the contact page or email. Specify your order number and reason for exchange.'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <span className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center font-bold shrink-0">
                                        2
                                    </span>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'Onay ve Kargo Bilgisi' : 'Approval and Shipping Info'}
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'Değişim talebiniz onaylandıktan sonra size kargo bilgileri gönderilecektir. İlk değişim işlemi ücretsizdir.'
                                                : 'After your exchange request is approved, shipping information will be sent to you. The first exchange is free.'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <span className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center font-bold shrink-0">
                                        3
                                    </span>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'Ürünü Kargoya Verin' : 'Ship the Product'}
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'Ürünü orijinal ambalajı ve faturası ile birlikte belirtilen kargo firmasına teslim edin.'
                                                : 'Deliver the product with its original packaging and invoice to the specified courier company.'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <span className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center font-bold shrink-0">
                                        4
                                    </span>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'İnceleme ve Onay' : 'Review and Approval'}
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'Ürün tarafımıza ulaştıktan sonra kalite kontrolü yapılır. Ürün koşullara uygunsa değişim işlemi başlatılır.'
                                                : 'After the product reaches us, a quality control is performed. If the product meets the conditions, the exchange process begins.'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <span className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center font-bold shrink-0">
                                        5
                                    </span>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'Yeni Ürün Gönderimi' : 'New Product Shipment'}
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'Değişim ürününüz 1-2 iş günü içinde kargoya verilir ve takip numarası size iletilir.'
                                                : 'Your exchange product will be shipped within 1-2 business days and the tracking number will be sent to you.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Exchange Types */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6">
                                {isTr ? 'Değişim Seçenekleri' : 'Exchange Options'}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-surface-light rounded-lg border border-border">
                                    <h3 className="font-semibold mb-2">
                                        {isTr ? '🔄 Beden Değişimi' : '🔄 Size Exchange'}
                                    </h3>
                                    <p className="text-sm text-text-muted">
                                        {isTr
                                            ? 'Aynı üründen farklı beden ile değişim yapabilirsiniz (stokta bulunması koşuluyla).'
                                            : 'You can exchange for a different size of the same product (subject to availability).'
                                        }
                                    </p>
                                </div>
                                <div className="p-4 bg-surface-light rounded-lg border border-border">
                                    <h3 className="font-semibold mb-2">
                                        {isTr ? '🎨 Renk Değişimi' : '🎨 Color Exchange'}
                                    </h3>
                                    <p className="text-sm text-text-muted">
                                        {isTr
                                            ? 'Aynı üründen farklı renk seçeneği ile değişim yapabilirsiniz (stokta bulunması koşuluyla).'
                                            : 'You can exchange for a different color of the same product (subject to availability).'
                                        }
                                    </p>
                                </div>
                                <div className="p-4 bg-surface-light rounded-lg border border-border">
                                    <h3 className="font-semibold mb-2">
                                        {isTr ? '👜 Farklı Ürün' : '👜 Different Product'}
                                    </h3>
                                    <p className="text-sm text-text-muted">
                                        {isTr
                                            ? 'Aynı fiyat aralığındaki farklı bir ürün ile değişim yapabilirsiniz.'
                                            : 'You can exchange for a different product in the same price range.'
                                        }
                                    </p>
                                </div>
                                <div className="p-4 bg-surface-light rounded-lg border border-border">
                                    <h3 className="font-semibold mb-2">
                                        {isTr ? '💰 Fark Ödeme' : '💰 Price Difference'}
                                    </h3>
                                    <p className="text-sm text-text-muted">
                                        {isTr
                                            ? 'Daha yüksek fiyatlı ürün ile değişimde fark ödenebilir.'
                                            : 'Price difference can be paid for exchanges to higher-priced products.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cannot Be Exchanged */}
                        <div className="card p-6 md:p-8 bg-red-500/5 border-red-500/20">
                            <div className="flex items-start gap-3 mb-4">
                                <Package className="text-red-600 shrink-0 mt-1" size={24} />
                                <div>
                                    <h2 className="text-xl font-bold mb-2">
                                        {isTr ? 'Değişim Yapılamayan Durumlar' : 'Non-Exchangeable Situations'}
                                    </h2>
                                    <ul className="space-y-2 text-sm text-text-muted list-disc list-inside">
                                        <li>{isTr ? 'Ürün kullanılmış veya giyilmişse' : 'If the product has been used or worn'}</li>
                                        <li>{isTr ? 'Ürünün etiketi çıkarılmışsa' : 'If the product tags have been removed'}</li>
                                        <li>{isTr ? 'Orijinal ambalaj zarar görmüşse' : 'If the original packaging is damaged'}</li>
                                        <li>{isTr ? 'Ürünün herhangi bir aksesuarı eksikse' : 'If any accessory of the product is missing'}</li>
                                        <li>{isTr ? 'İndirimli veya kampanya ürünlerinde (belirtilmişse)' : 'For discounted or promotional products (if specified)'}</li>
                                        <li>{isTr ? '14 günlük süre geçmişse' : 'If the 14-day period has passed'}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Contact CTA */}
                        <div className="card p-6 md:p-8 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 text-center">
                            <h3 className="text-xl font-bold mb-2">
                                {isTr ? 'Değişim İşlemi İçin İletişime Geçin' : 'Contact Us for Exchange'}
                            </h3>
                            <p className="text-text-muted mb-4">
                                {isTr
                                    ? 'Değişim talebiniz için müşteri hizmetleri ekibimizle iletişime geçebilirsiniz.'
                                    : 'You can contact our customer service team for your exchange request.'
                                }
                            </p>
                            <a href={`/${locale}/contact`} className="btn btn-secondary inline-flex">
                                {isTr ? 'İletişime Geç' : 'Contact Us'}
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer locale={locale} />
        </>
    )
}
