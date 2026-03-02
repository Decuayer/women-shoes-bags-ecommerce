import { Truck, Package, MapPin, Clock, Phone } from 'lucide-react'
import { getGeneralSettings, getAnnouncementSettings } from '@/lib/settings'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface ShippingPageProps {
    params: Promise<{ locale: string }>
}

export default async function ShippingPage({ params }: ShippingPageProps) {
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
                            <Truck className="text-secondary" size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {isTr ? 'Kargo ve Teslimat Bilgileri' : 'Shipping and Delivery Information'}
                        </h1>
                        <p className="text-text-muted max-w-2xl mx-auto">
                            {isTr
                                ? 'Siparişlerinizin kargolama ve teslimat süreçleri hakkında detaylı bilgiler.'
                                : 'Detailed information about shipping and delivery processes for your orders.'
                            }
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Shipping Costs */}
                        <div className="card p-6 md:p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                    <Package className="text-secondary" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">
                                        {isTr ? 'Kargo Ücretleri' : 'Shipping Costs'}
                                    </h2>
                                    <p className="text-text-muted">
                                        {isTr
                                            ? 'Alışveriş tutarınıza göre kargo ücretlendirmesi.'
                                            : 'Shipping pricing based on your purchase amount.'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4 pl-16">
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-green-600">
                                            {isTr ? 'Ücretsiz Kargo' : 'Free Shipping'}
                                        </span>
                                        <span className="text-2xl font-bold text-green-600">₺0</span>
                                    </div>
                                    <p className="text-sm text-text-muted">
                                        {isTr ? '1750 TL ve üzeri siparişlerde' : 'On orders over 1750 TL'}
                                    </p>
                                </div>
                                <div className="p-4 bg-surface-light rounded-lg border border-border">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">
                                            {isTr ? 'Standart Kargo' : 'Standard Shipping'}
                                        </span>
                                        <span className="text-2xl font-bold">₺50</span>
                                    </div>
                                    <p className="text-sm text-text-muted">
                                        {isTr ? '1750 TL altı siparişlerde' : 'On orders under 1750 TL'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Time */}
                        <div className="card p-6 md:p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                    <Clock className="text-secondary" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">
                                        {isTr ? 'Teslimat Süresi' : 'Delivery Time'}
                                    </h2>
                                    <p className="text-text-muted">
                                        {isTr
                                            ? 'Siparişinizin hazırlanma ve teslimat süreçleri.'
                                            : 'Order preparation and delivery timelines.'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4 pl-16">
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        {isTr ? '📦 Hazırlama Süresi' : '📦 Preparation Time'}
                                    </h3>
                                    <p className="text-text-muted">
                                        {isTr
                                            ? 'Siparişiniz ödeme onayından sonra 1-2 iş günü içinde kargoya teslim edilir. Hafta sonları ve resmi tatillerde kargolama yapılmamaktadır.'
                                            : 'Your order will be shipped within 1-2 business days after payment confirmation. No shipping on weekends and public holidays.'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        {isTr ? '🚚 Kargo Süresi' : '🚚 Shipping Duration'}
                                    </h3>
                                    <p className="text-text-muted">
                                        {isTr
                                            ? 'Kargo firması ürünü teslim aldıktan sonra ortalama 2-5 iş günü içinde adresinize ulaşır. Bölgeye göre bu süre değişiklik gösterebilir.'
                                            : 'After the courier receives the product, it will reach your address within an average of 2-5 business days. This period may vary by region.'
                                        }
                                    </p>
                                </div>
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <p className="text-sm">
                                        <strong>{isTr ? 'Toplam Süre:' : 'Total Time:'}</strong>{' '}
                                        {isTr ? '3-7 iş günü (siparişten teslimata)' : '3-7 business days (from order to delivery)'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Regions */}
                        <div className="card p-6 md:p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                    <MapPin className="text-secondary" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">
                                        {isTr ? 'Teslimat Bölgeleri' : 'Delivery Regions'}
                                    </h2>
                                    <p className="text-text-muted">
                                        {isTr
                                            ? 'Kargo hizmeti verdiğimiz bölgeler.'
                                            : 'Regions where we provide shipping service.'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="pl-16">
                                <p className="text-text-muted mb-4">
                                    {isTr
                                        ? 'Türkiye\'nin tüm illerine kargo gönderimi yapmaktayız. Şu anda yurtdışı gönderim hizmeti sunmamaktayız.'
                                        : 'We ship to all provinces in Turkey. We currently do not offer international shipping.'
                                    }
                                </p>
                                <div className="p-4 bg-surface-light rounded-lg">
                                    <p className="text-sm text-text-muted">
                                        {isTr
                                            ? '🌍 Yurtdışı gönderim için lütfen müşteri hizmetleri ile iletişime geçin.'
                                            : '🌍 For international shipping, please contact customer service.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tracking */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">
                                {isTr ? 'Kargo Takibi' : 'Shipment Tracking'}
                            </h2>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                        1
                                    </span>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'Kargo Bilgisi E-postası' : 'Shipping Notification Email'}
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'Siparişiniz kargoya verildikten sonra kayıtlı e-posta adresinize takip numarası gönderilir.'
                                                : 'A tracking number will be sent to your registered email address after your order is shipped.'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                        2
                                    </span>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'Hesabımdan Takip' : 'Track from My Account'}
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? '"Siparişlerim" bölümünden siparişinizin durumunu ve kargo bilgilerini görüntüleyebilirsiniz.'
                                                : 'You can view your order status and shipping information from the "My Orders" section.'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                        3
                                    </span>
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {isTr ? 'Kargo Firması Takip' : 'Courier Company Tracking'}
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            {isTr
                                                ? 'Takip numaranız ile kargo firmasının web sitesinden detaylı takip yapabilirsiniz.'
                                                : 'You can track in detail from the courier company\'s website with your tracking number.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="card p-6 md:p-8 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                                    <Phone className="text-secondary" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        {isTr ? 'Kargo ile İlgili Sorularınız' : 'Questions About Shipping?'}
                                    </h3>
                                    <p className="text-text-muted mb-4">
                                        {isTr
                                            ? 'Kargo ve teslimat hakkında daha fazla bilgi için müşteri hizmetleri ekibimizle iletişime geçebilirsiniz.'
                                            : 'Contact our customer service team for more information about shipping and delivery.'
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
