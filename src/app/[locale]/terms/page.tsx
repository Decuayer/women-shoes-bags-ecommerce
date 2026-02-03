import { FileText, AlertTriangle, Scale } from 'lucide-react'
import { getGeneralSettings, getAnnouncementSettings } from '@/lib/settings'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface TermsPageProps {
    params: Promise<{ locale: string }>
}

export default async function TermsPage({ params }: TermsPageProps) {
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
                            <FileText className="text-secondary" size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {isTr ? 'Kullanım Koşulları' : 'Terms of Service'}
                        </h1>
                        <p className="text-text-muted max-w-2xl mx-auto">
                            {isTr
                                ? 'Web sitemizi ve hizmetlerimizi kullanırken uymanız gereken kurallar ve koşullar.'
                                : 'Rules and conditions you must follow when using our website and services.'
                            }
                        </p>
                        <p className="text-sm text-text-muted mt-2">
                            {isTr ? 'Son güncelleme: 3 Şubat 2026' : 'Last updated: February 3, 2026'}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Acceptance */}
                        <div className="card p-6 md:p-8 bg-amber-500/10 border-amber-500/20">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="font-bold mb-2">
                                        {isTr ? 'Önemli Bilgilendirme' : 'Important Notice'}
                                    </h3>
                                    <p className="text-sm text-text-muted">
                                        {isTr
                                            ? 'Web sitemizi kullanarak bu kullanım koşullarını kabul etmiş sayılırsınız. Koşulları kabul etmiyorsanız lütfen sitemizi kullanmayınız.'
                                            : 'By using our website, you are deemed to have accepted these terms of use. If you do not accept the terms, please do not use our site.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* General Terms */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">
                                {isTr ? '1. Genel Hükümler' : '1. General Provisions'}
                            </h2>
                            <div className="space-y-3 text-text-muted">
                                <p>
                                    {isTr
                                        ? 'Bu kullanım koşulları, CRAZYSHOES web sitesi (bundan sonra "Site" olarak anılacaktır) üzerinden sunulan tüm hizmetler için geçerlidir.'
                                        : 'These terms of use apply to all services offered through the CRAZYSHOES website (hereinafter referred to as the "Site").'
                                    }
                                </p>
                                <p>
                                    {isTr
                                        ? 'Site, kadınlara yönelik ayakkabı ve çanta ürünlerinin satışını gerçekleştiren bir e-ticaret platformudur.'
                                        : 'The Site is an e-commerce platform that sells shoe and bag products for women.'
                                    }
                                </p>
                                <p>
                                    {isTr
                                        ? 'Kullanıcı, 18 yaşından büyük ve kanuni ehliyete sahip olduğunu beyan ve taahhüt eder.'
                                        : 'The user declares and undertakes that they are over 18 years of age and have legal capacity.'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* User Obligations */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">
                                {isTr ? '2. Kullanıcı Yükümlülükleri' : '2. User Obligations'}
                            </h2>
                            <div className="space-y-3">
                                <p className="text-text-muted">
                                    {isTr ? 'Kullanıcı, siteyi kullanırken:' : 'When using the site, the user:'}
                                </p>
                                <div className="space-y-2 text-sm text-text-muted">
                                    <div className="flex gap-2">
                                        <span>•</span>
                                        <p>{isTr ? 'Doğru ve güncel bilgiler vermekle yükümlüdür' : 'Is obliged to provide accurate and up-to-date information'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>•</span>
                                        <p>{isTr ? 'Başkasının hesabını kullanamaz' : 'Cannot use someone else\'s account'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>•</span>
                                        <p>{isTr ? 'Şifresini güvenli saklamakla sorumludur' : 'Is responsible for keeping their password secure'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>•</span>
                                        <p>{isTr ? 'Yasa dışı faaliyetlerde bulunamaz' : 'Cannot engage in illegal activities'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>•</span>
                                        <p>{isTr ? 'Sitenin güvenliğini tehlikeye atabilecek işlemler yapamaz' : 'Cannot perform operations that may compromise site security'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>•</span>
                                        <p>{isTr ? 'Diğer kullanıcıların haklarını ihlal edemez' : 'Cannot violate the rights of other users'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orders and Payments */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">
                                {isTr ? '3. Sipariş ve Ödeme' : '3. Orders and Payments'}
                            </h2>
                            <div className="space-y-3 text-text-muted text-sm">
                                <p>
                                    <strong>{isTr ? 'Sipariş Süreci:' : 'Order Process:'}</strong>{' '}
                                    {isTr
                                        ? 'Kullanıcı, sipariş vermekle birlikte ürünün özelliklerini, fiyatını, teslimat koşullarını kabul etmiş sayılır.'
                                        : 'By placing an order, the user is deemed to have accepted the product features, price, and delivery conditions.'
                                    }
                                </p>
                                <p>
                                    <strong>{isTr ? 'Ödeme:' : 'Payment:'}</strong>{' '}
                                    {isTr
                                        ? 'Ödemeler güvenli ödeme altyapısı üzerinden gerçekleştirilir. Kredi kartı bilgileriniz bizimle paylaşılmaz.'
                                        : 'Payments are made through secure payment infrastructure. Your credit card information is not shared with us.'
                                    }
                                </p>
                                <p>
                                    <strong>{isTr ? 'Sipariş Onayı:' : 'Order Confirmation:'}</strong>{' '}
                                    {isTr
                                        ? 'Ödeme onaylandıktan sonra siparişiniz işleme alınır ve e-posta ile bilgilendirilirsiniz.'
                                        : 'After payment confirmation, your order is processed and you are notified by email.'
                                    }
                                </p>
                                <p>
                                    <strong>{isTr ? 'İptal Hakkı:' : 'Cancellation Right:'}</strong>{' '}
                                    {isTr
                                        ? 'Ürün kargoya verilmeden önce siparişinizi iptal edebilirsiniz. Kargoya verildikten sonra değişim politikamız geçerlidir.'
                                        : 'You can cancel your order before the product is shipped. After shipping, our exchange policy applies.'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Delivery */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">
                                {isTr ? '4. Teslimat' : '4. Delivery'}
                            </h2>
                            <div className="space-y-3 text-text-muted text-sm">
                                <p>
                                    {isTr
                                        ? 'Teslimat süreleri ve koşulları "Kargo Bilgileri" sayfamızda detaylı olarak açıklanmıştır.'
                                        : 'Delivery times and conditions are explained in detail on our "Shipping Information" page.'
                                    }
                                </p>
                                <p>
                                    {isTr
                                        ? 'Tahmini teslimat süresi: 3-7 iş günü (bölgeye göre değişebilir)'
                                        : 'Estimated delivery time: 3-7 business days (may vary by region)'
                                    }
                                </p>
                                <p>
                                    {isTr
                                        ? 'Teslimat sırasında ürünü kontrol etmek kullanıcının sorumluluğundadır. Hasarlı veya yanlış ürün teslim edilmişse kargo görevlisine beyan edilmeli ve teslim alınmamalıdır.'
                                        : 'It is the user\'s responsibility to check the product during delivery. If a damaged or wrong product is delivered, it must be declared to the courier and not accepted.'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Returns and Exchanges */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">
                                {isTr ? '5. Değişim Politikası' : '5. Exchange Policy'}
                            </h2>
                            <div className="space-y-3 text-text-muted text-sm">
                                <p className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded border border-amber-200 dark:border-amber-800">
                                    <strong className="text-amber-900 dark:text-amber-200">
                                        {isTr ? 'Önemli:' : 'Important:'}
                                    </strong>{' '}
                                    {isTr
                                        ? 'İade işlemi yapılmamaktadır. Sadece ürün değişimi kabul edilmektedir.'
                                        : 'Returns are not accepted. Only product exchanges are accepted.'
                                    }
                                </p>
                                <p>
                                    {isTr
                                        ? 'Değişim koşulları ve süreci "Değişim" sayfamızda detaylı olarak açıklanmıştır.'
                                        : 'Exchange conditions and process are explained in detail on our "Exchange" page.'
                                    }
                                </p>
                                <p>
                                    {isTr ? '14 gün içinde değişim hakkı mevcuttur.' : '14-day exchange right is available.'}
                                </p>
                            </div>
                        </div>

                        {/* Intellectual Property */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">
                                {isTr ? '6. Fikri Mülkiyet Hakları' : '6. Intellectual Property Rights'}
                            </h2>
                            <div className="space-y-3 text-text-muted text-sm">
                                <p>
                                    {isTr
                                        ? 'Site üzerindeki tüm içerik, tasarım, logo, metin, görsel, video ve diğer materyaller CRAZYSHOES\'un fikri mülkiyetidir.'
                                        : 'All content, design, logo, text, images, videos and other materials on the Site are the intellectual property of CRAZYSHOES.'
                                    }
                                </p>
                                <p>
                                    {isTr
                                        ? 'İçeriklerin izinsiz kopyalanması, çoğaltılması, dağıtılması yasaktır ve yasal işlem gerektirir.'
                                        : 'Unauthorized copying, reproduction, and distribution of content is prohibited and requires legal action.'
                                    }
                                </p>
                                <p>
                                    {isTr
                                        ? 'Kullanıcılar, siteyi yalnızca kişisel ve ticari olmayan amaçlarla kullanabilir.'
                                        : 'Users may use the site only for personal and non-commercial purposes.'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Liability */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">
                                {isTr ? '7. Sorumluluk Sınırlaması' : '7. Limitation of Liability'}
                            </h2>
                            <div className="space-y-3 text-text-muted text-sm">
                                <p>
                                    {isTr
                                        ? 'CRAZYSHOES, site içeriğinin doğruluğu, güncelliği ve eksiksizliği konusunda azami özeni gösterir ancak garanti vermez.'
                                        : 'CRAZYSHOES exercises maximum care regarding the accuracy, timeliness and completeness of site content but does not guarantee it.'
                                    }
                                </p>
                                <p>
                                    {isTr
                                        ? 'Teknik arızalar, kesintiler ve veri kayıpları nedeniyle oluşabilecek zararlardan sorumluluk kabul etmeyiz.'
                                        : 'We do not accept liability for damages that may occur due to technical failures, interruptions and data loss.'
                                    }
                                </p>
                                <p>
                                    {isTr
                                        ? 'Üçüncü taraf web sitelerine verilen linklerden dolayı oluşabilecek zararlardan sorumlu değiliz.'
                                        : 'We are not responsible for damages that may occur from links to third-party websites.'
                                    }
                                </p>
                                <p>
                                    {isTr
                                        ? 'Ürün resimleri ekran ayarlarına göre farklılık gösterebilir, bu durum ayıplı mal kapsamında değerlendirilmez.'
                                        : 'Product images may vary depending on screen settings, this is not considered defective goods.'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Force Majeure */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">
                                {isTr ? '8. Mücbir Sebepler' : '8. Force Majeure'}
                            </h2>
                            <div className="space-y-3 text-text-muted text-sm">
                                <p>
                                    {isTr
                                        ? 'Doğal afetler, savaş, terör, salgın hastalıklar, grev, kargo firması sorunları gibi kontrolümüz dışındaki durumlardan kaynaklanan gecikmeler ve aksamalardan sorumlu tutulamayız.'
                                        : 'We cannot be held responsible for delays and disruptions caused by situations beyond our control such as natural disasters, war, terrorism, epidemics, strikes, courier company problems.'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Changes */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">
                                {isTr ? '9. Değişiklikler' : '9. Changes'}
                            </h2>
                            <div className="space-y-3 text-text-muted text-sm">
                                <p>
                                    {isTr
                                        ? 'CRAZYSHOES, bu kullanım koşullarını önceden haber vermeksizin değiştirme hakkını saklı tutar. Değişiklikler site üzerinde yayınlandığı tarihte yürürlüğe girer.'
                                        : 'CRAZYSHOES reserves the right to change these terms of use without prior notice. Changes take effect on the date they are published on the site.'
                                    }
                                </p>
                                <p>
                                    {isTr
                                        ? 'Kullanıcılar, siteyi kullanmaya devam ederek yeni koşulları kabul etmiş sayılır.'
                                        : 'Users are deemed to have accepted the new conditions by continuing to use the site.'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Governing Law */}
                        <div className="card p-6 md:p-8 bg-blue-500/5 border-blue-500/20">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Scale className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-2">
                                        {isTr ? '10. Uygulanacak Hukuk ve Yetki' : '10. Governing Law and Jurisdiction'}
                                    </h2>
                                    <p className="text-sm text-text-muted">
                                        {isTr
                                            ? 'Bu sözleşmeden doğabilecek her türlü uyuşmazlıkta Türkiye Cumhuriyeti yasaları uygulanır. Manisa Mahkemeleri ve İcra Daireleri yetkilidir.'
                                            : 'Turkish Republic laws apply to all disputes arising from this agreement. Manisa Courts and Enforcement Offices have jurisdiction.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="card p-6 md:p-8 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 text-center">
                            <h3 className="text-xl font-bold mb-2">
                                {isTr ? 'Sorularınız mı Var?' : 'Have Questions?'}
                            </h3>
                            <p className="text-text-muted mb-4">
                                {isTr
                                    ? 'Kullanım koşulları hakkında sorularınız için bizimle iletişime geçebilirsiniz.'
                                    : 'You can contact us for questions about the terms of use.'
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
