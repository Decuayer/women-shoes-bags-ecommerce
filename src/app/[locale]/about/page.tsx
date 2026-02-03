import { Heart, Award, Truck, ShieldCheck } from 'lucide-react'
import { getGeneralSettings, getAnnouncementSettings } from '@/lib/settings'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface AboutPageProps {
    params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
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
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {isTr ? 'Hakkımızda' : 'About Us'}
                        </h1>
                        <p className="text-text-muted max-w-2xl mx-auto">
                            {isTr
                                ? 'Kadınların günlük yaşamını ve özel anlarını tamamlayan kaliteli ayakkabı ve çanta koleksiyonları sunuyoruz.'
                                : 'We offer quality shoe and bag collections that complement women\'s daily lives and special moments.'
                            }
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Our Story */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">
                                {isTr ? 'Hikayemiz' : 'Our Story'}
                            </h2>
                            <div className="space-y-4 text-text-muted leading-relaxed">
                                <p>
                                    {isTr
                                        ? 'CRAZYSHOES, kadınların ayak izlerini şık ve rahat bir şekilde bırakmaları için kuruldu. Her kadının kendini özel hissetmeyi hak ettiğine inanıyoruz ve bu inançla, en son trendleri takip eden, kaliteli ve uygun fiyatlı ürünler sunuyoruz.'
                                        : 'CRAZYSHOES was founded to help women leave their footprints stylishly and comfortably. We believe every woman deserves to feel special, and with this belief, we offer quality and affordable products that follow the latest trends.'
                                    }
                                </p>
                                <p>
                                    {isTr
                                        ? 'Sektördeki uzun yıllara dayanan deneyimimiz ve müşteri memnuniyetine verdiğimiz önemle, sizlere en iyi alışveriş deneyimini sunmak için çalışıyoruz. Her ürünü özenle seçiyor ve kalite kontrolünden geçiriyoruz.'
                                        : 'With our many years of experience in the industry and our commitment to customer satisfaction, we work to provide you with the best shopping experience. We carefully select each product and put it through quality control.'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Values */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-center">
                                {isTr ? 'Değerlerimiz' : 'Our Values'}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="card p-6">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                                        <Award className="text-secondary" size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">
                                        {isTr ? 'Kalite Önceliğimiz' : 'Quality First'}
                                    </h3>
                                    <p className="text-text-muted text-sm">
                                        {isTr
                                            ? 'Her ürünümüz titizlikle seçilir ve kalite standartlarımızdan geçer. Müşterilerimize sadece en iyisini sunmayı hedefliyoruz.'
                                            : 'Every product is carefully selected and passes our quality standards. We aim to offer only the best to our customers.'
                                        }
                                    </p>
                                </div>
                                <div className="card p-6">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                                        <Heart className="text-secondary" size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">
                                        {isTr ? 'Müşteri Memnuniyeti' : 'Customer Satisfaction'}
                                    </h3>
                                    <p className="text-text-muted text-sm">
                                        {isTr
                                            ? 'Müşteri memnuniyeti bizim için en önemli başarı kriteridir. Size en iyi hizmeti sunmak için sürekli kendimizi geliştiriyoruz.'
                                            : 'Customer satisfaction is our most important success criterion. We continuously improve ourselves to provide you with the best service.'
                                        }
                                    </p>
                                </div>
                                <div className="card p-6">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                                        <Truck className="text-secondary" size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">
                                        {isTr ? 'Hızlı Teslimat' : 'Fast Delivery'}
                                    </h3>
                                    <p className="text-text-muted text-sm">
                                        {isTr
                                            ? 'Siparişlerinizi en kısa sürede size ulaştırmak için çalışıyoruz. Güvenilir kargo firmalarıyla işbirliği yapıyoruz.'
                                            : 'We work to deliver your orders to you as quickly as possible. We collaborate with reliable courier companies.'
                                        }
                                    </p>
                                </div>
                                <div className="card p-6">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                                        <ShieldCheck className="text-secondary" size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">
                                        {isTr ? 'Güvenli Alışveriş' : 'Secure Shopping'}
                                    </h3>
                                    <p className="text-text-muted text-sm">
                                        {isTr
                                            ? 'Tüm ödemeleriniz 256-bit SSL şifrelemesi ile korunur. Kişisel bilgilerinizin güvenliği bizim için önemlidir.'
                                            : 'All your payments are protected with 256-bit SSL encryption. The security of your personal information is important to us.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mission & Vision */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="card p-6 md:p-8 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                                <h3 className="text-xl font-bold mb-3">
                                    {isTr ? 'Misyonumuz' : 'Our Mission'}
                                </h3>
                                <p className="text-text-muted">
                                    {isTr
                                        ? 'Her kadına kaliteli, şık ve rahat ayakkabı ve çantalar sunarak, günlük yaşamlarına değer katmak ve kendilerini özel hissetmelerini sağlamak.'
                                        : 'To add value to women\'s daily lives and make them feel special by offering quality, stylish and comfortable shoes and bags to every woman.'
                                    }
                                </p>
                            </div>
                            <div className="card p-6 md:p-8 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                                <h3 className="text-xl font-bold mb-3">
                                    {isTr ? 'Vizyonumuz' : 'Our Vision'}
                                </h3>
                                <p className="text-text-muted">
                                    {isTr
                                        ? 'Türkiye\'nin en güvenilir ve tercih edilen kadın ayakkabı ve çanta e-ticaret platformu olmak, kalite ve müşteri memnuniyetinde sektör lideri olmak.'
                                        : 'To be Turkey\'s most trusted and preferred women\'s shoe and bag e-commerce platform, and to be an industry leader in quality and customer satisfaction.'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Why Choose Us */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6">
                                {isTr ? 'Neden CRAZYSHOES?' : 'Why CRAZYSHOES?'}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex gap-3">
                                    <span className="text-secondary text-xl">✨</span>
                                    <div>
                                        <h4 className="font-semibold mb-1">
                                            {isTr ? 'Trendleri Takip Ediyoruz' : 'We Follow Trends'}
                                        </h4>
                                        <p className="text-sm text-text-muted">
                                            {isTr ? 'En son moda trendlerini koleksiyonlarımıza yansıtıyoruz.' : 'We reflect the latest fashion trends in our collections.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-secondary text-xl">💯</span>
                                    <div>
                                        <h4 className="font-semibold mb-1">
                                            {isTr ? '%100 Orijinal Ürünler' : '100% Original Products'}
                                        </h4>
                                        <p className="text-sm text-text-muted">
                                            {isTr ? 'Tüm ürünlerimiz orijinal ve garantilidir.' : 'All our products are original and guaranteed.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-secondary text-xl">🚚</span>
                                    <div>
                                        <h4 className="font-semibold mb-1">
                                            {isTr ? 'Ücretsiz Kargo Seçeneği' : 'Free Shipping Option'}
                                        </h4>
                                        <p className="text-sm text-text-muted">
                                            {isTr ? '1500 TL üzeri alışverişlerde ücretsiz kargo.' : 'Free shipping on purchases over 1500 TL.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-secondary text-xl">💳</span>
                                    <div>
                                        <h4 className="font-semibold mb-1">
                                            {isTr ? 'Taksit İmkanı' : 'Installment Options'}
                                        </h4>
                                        <p className="text-sm text-text-muted">
                                            {isTr ? '12 aya varan taksit seçenekleri.' : 'Installment options up to 12 months.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-secondary text-xl">🔄</span>
                                    <div>
                                        <h4 className="font-semibold mb-1">
                                            {isTr ? 'Kolay Değişim' : 'Easy Exchange'}
                                        </h4>
                                        <p className="text-sm text-text-muted">
                                            {isTr ? '14 gün içinde ücretsiz değişim hakkı.' : 'Free exchange right within 14 days.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-secondary text-xl">🎯</span>
                                    <div>
                                        <h4 className="font-semibold mb-1">
                                            {isTr ? 'Müşteri Odaklı' : 'Customer Focused'}
                                        </h4>
                                        <p className="text-sm text-text-muted">
                                            {isTr ? '7/24 müşteri hizmetleri desteği.' : '24/7 customer service support.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="card p-8 bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20 text-center">
                            <h3 className="text-2xl font-bold mb-3">
                                {isTr ? 'Alışverişe Başlayın' : 'Start Shopping'}
                            </h3>
                            <p className="text-text-muted mb-6">
                                {isTr
                                    ? 'Sizin için özenle seçtiğimiz koleksiyonlarımıza göz atın.'
                                    : 'Browse our collections carefully selected for you.'
                                }
                            </p>
                            <a href={`/${locale}/products`} className="btn btn-primary inline-flex">
                                {isTr ? 'Ürünleri Keşfet' : 'Discover Products'}
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer locale={locale} />
        </>
    )
}
