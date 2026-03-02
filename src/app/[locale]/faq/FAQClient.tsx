'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItemProps {
    question: string
    answer: string
    isOpen: boolean
    onToggle: () => void
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-surface-light transition-colors"
            >
                <span className="font-medium pr-4">{question}</span>
                <ChevronDown
                    className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    size={20}
                />
            </button>
            {isOpen && (
                <div className="px-4 md:px-5 pb-4 md:pb-5 text-text-muted animate-fadeIn">
                    {answer}
                </div>
            )}
        </div>
    )
}

interface FAQClientProps {
    locale: string
}

export default function FAQClient({ locale }: FAQClientProps) {
    const isTr = locale === 'tr'
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqCategories = [
        {
            title: isTr ? 'Genel Sorular' : 'General Questions',
            items: isTr ? [
                {
                    question: 'CRAZYSHOES nedir?',
                    answer: 'CRAZYSHOES, kadınlara yönelik kaliteli ayakkabı ve çanta koleksiyonları sunan premium bir e-ticaret platformudur. En son trendleri takip ederek, şık ve rahat ürünler sunuyoruz.'
                },
                {
                    question: 'Ürünleriniz orijinal mi?',
                    answer: 'Evet, tüm ürünlerimiz %100 orijinal ve güvenilir tedarikçilerden sağlanmaktadır. Her ürün kalite kontrolünden geçer ve garantilidir.'
                },
                {
                    question: 'Nasıl sipariş verebilirim?',
                    answer: 'Beğendiğiniz ürünü seçip, beden ve renk seçeneğini belirledikten sonra "Sepete Ekle" butonuna tıklayın. Sepetinizi kontrol ettikten sonra "Ödemeye Geç" ile siparişinizi tamamlayabilirsiniz.'
                },
                {
                    question: 'Üyelik zorunlu mu?',
                    answer: 'Hayır, misafir olarak da alışveriş yapabilirsiniz. Ancak üye olmanız durumunda sipariş takibi, favori ürünler ve hızlı ödeme gibi avantajlardan yararlanabilirsiniz.'
                }
            ] : [
                {
                    question: 'What is CRAZYSHOES?',
                    answer: 'CRAZYSHOES is a premium e-commerce platform offering quality shoe and bag collections for women. We follow the latest trends while providing stylish and comfortable products.'
                },
                {
                    question: 'Are your products authentic?',
                    answer: 'Yes, all our products are 100% authentic and sourced from reliable suppliers. Each product goes through quality control and comes with a guarantee.'
                },
                {
                    question: 'How can I place an order?',
                    answer: 'Select the product you like, choose the size and color option, then click "Add to Cart". After reviewing your cart, you can complete your order by clicking "Checkout".'
                },
                {
                    question: 'Is membership required?',
                    answer: 'No, you can shop as a guest. However, being a member gives you advantages such as order tracking, favorite products, and quick checkout.'
                }
            ]
        },
        {
            title: isTr ? 'Kargo ve Teslimat' : 'Shipping and Delivery',
            items: isTr ? [
                {
                    question: 'Kargo ücreti ne kadar?',
                    answer: '1750 TL ve üzeri siparişlerde kargo ücretsizdir. 1750 TL altı siparişlerde kargo bedeli 50 TL\'dir.'
                },
                {
                    question: 'Siparişim ne zaman kargoya verilir?',
                    answer: 'Siparişiniz ödeme onayından sonra 1-2 iş günü içinde kargoya teslim edilir. Hafta sonları ve resmi tatillerde kargolama yapılmamaktadır.'
                },
                {
                    question: 'Teslimat süresi ne kadar?',
                    answer: 'Kargo firması ürünü teslim aldıktan sonra ortalama 2-5 iş günü içinde adresinize teslim edilir. Bölgeye göre bu süre değişiklik gösterebilir.'
                },
                {
                    question: 'Kargo takibi nasıl yapılır?',
                    answer: 'Siparişiniz kargoya verildikten sonra e-posta adresinize takip numarası gönderilir. Bu numara ile kargo firmasının web sitesinden takip yapabilirsiniz.'
                },
                {
                    question: 'Yurtdışına gönderim yapıyor musunuz?',
                    answer: 'Şu anda sadece Türkiye içi teslimat yapmaktayız. Yurtdışı gönderim için lütfen müşteri hizmetleri ile iletişime geçin.'
                }
            ] : [
                {
                    question: 'How much is shipping?',
                    answer: 'Shipping is free for orders over 1750 TL. For orders under 1750 TL, the shipping cost is 50 TL.'
                },
                {
                    question: 'When will my order be shipped?',
                    answer: 'Your order will be shipped within 1-2 business days after payment confirmation. No shipping on weekends and public holidays.'
                },
                {
                    question: 'How long does delivery take?',
                    answer: 'After the courier receives the product, it will be delivered to your address within an average of 2-5 business days. This period may vary depending on the region.'
                },
                {
                    question: 'How can I track my shipment?',
                    answer: 'After your order is shipped, a tracking number will be sent to your email address. You can track it on the courier company\'s website with this number.'
                },
                {
                    question: 'Do you ship internationally?',
                    answer: 'We currently only deliver within Turkey. For international shipping, please contact customer service.'
                }
            ]
        },
        {
            title: isTr ? 'Ödeme' : 'Payment',
            items: isTr ? [
                {
                    question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
                    answer: 'Kredi kartı (Visa, Mastercard, American Express) ve banka kartı ile ödeme yapabilirsiniz. Tüm ödemeler güvenli SSL şifrelemesi ile korunmaktadır.'
                },
                {
                    question: 'Taksit seçeneği var mı?',
                    answer: 'Evet, anlaşmalı bankalarla 12 aya varan taksit imkanı sunuyoruz. Taksit seçenekleri ödeme sayfasında görüntülenecektir.'
                },
                {
                    question: 'Ödeme güvenli mi?',
                    answer: 'Evet, tüm ödemeler 256-bit SSL şifrelemesi ile güvence altındadır. Kredi kartı bilgileriniz bizimle paylaşılmaz, doğrudan ödeme altyapısı sağlayıcısı ile işlenir.'
                },
                {
                    question: 'Kapıda ödeme yapabilir miyim?',
                    answer: 'Şu anda kapıda ödeme seçeneğimiz bulunmamaktadır. Sadece online ödeme kabul edilmektedir.'
                }
            ] : [
                {
                    question: 'What payment methods do you accept?',
                    answer: 'You can pay with credit card (Visa, Mastercard, American Express) and debit card. All payments are protected with secure SSL encryption.'
                },
                {
                    question: 'Are installment options available?',
                    answer: 'Yes, we offer up to 12 installments with partner banks. Installment options will be displayed on the payment page.'
                },
                {
                    question: 'Is payment secure?',
                    answer: 'Yes, all payments are secured with 256-bit SSL encryption. Your credit card information is not shared with us, it is processed directly with the payment provider.'
                },
                {
                    question: 'Can I pay on delivery?',
                    answer: 'Cash on delivery option is not currently available. Only online payment is accepted.'
                }
            ]
        },
        {
            title: isTr ? 'Değişim' : 'Exchange',
            items: isTr ? [
                {
                    question: 'İade yapabilir miyim?',
                    answer: 'Hayır, ürünlerimizde iade kabul edilmemektedir. Sadece ürün değişimi yapılmaktadır.'
                },
                {
                    question: 'Değişim nasıl yapılır?',
                    answer: 'Ürününüzü teslim aldıktan sonra 14 gün içinde, kullanılmamış ve orijinal ambalajında ise değişim talebinde bulunabilirsiniz. Müşteri hizmetleri ile iletişime geçerek süreci başlatabilirsiniz.'
                },
                {
                    question: 'Değişim ücreti var mı?',
                    answer: 'İlk değişim işlemi ücretsizdir. Kargo masrafı tarafımızca karşılanır.'
                },
                {
                    question: 'Değişim için gereken şartlar nelerdir?',
                    answer: 'Ürün kullanılmamış, etiketi çıkarılmamış ve orijinal ambalajında olmalıdır. Ayakkabılar denenmiş olsa bile giyilmemiş olmalıdır.'
                },
                {
                    question: 'Beden değişimi yapabilir miyim?',
                    answer: 'Evet, stokta bulunması koşuluyla farklı beden ile değişim yapabilirsiniz.'
                }
            ] : [
                {
                    question: 'Can I return products?',
                    answer: 'No, we do not accept returns. Only product exchanges are available.'
                },
                {
                    question: 'How do I exchange a product?',
                    answer: 'You can request an exchange within 14 days after receiving your product, if it is unused and in its original packaging. You can start the process by contacting customer service.'
                },
                {
                    question: 'Is there an exchange fee?',
                    answer: 'The first exchange is free. Shipping costs are covered by us.'
                },
                {
                    question: 'What are the requirements for exchange?',
                    answer: 'The product must be unused, with tags attached and in its original packaging. Shoes must not be worn even if tried on.'
                },
                {
                    question: 'Can I exchange for a different size?',
                    answer: 'Yes, you can exchange for a different size if available in stock.'
                }
            ]
        },
        {
            title: isTr ? 'Ürünler' : 'Products',
            items: isTr ? [
                {
                    question: 'Beden tablosu var mı?',
                    answer: 'Evet, her ürün sayfasında detaylı beden tablosu bulunmaktadır. Doğru bedeni seçmek için tabloya göz atmanızı öneririz.'
                },
                {
                    question: 'Stokta olmayan ürün ne zaman gelir?',
                    answer: 'Stokta olmayan ürünler için bildirim talep edebilirsiniz. Ürün stoğa girdiğinde e-posta ile bilgilendirilirsiniz.'
                },
                {
                    question: 'Ürün resimleri gerçeği yansıtıyor mu?',
                    answer: 'Ürün görselleri gerçek ürünleri yansıtmaktadır. Ancak ekran ayarlarına göre renk tonları hafif farklılık gösterebilir.'
                },
                {
                    question: 'Ürün bakımı nasıl yapılmalı?',
                    answer: 'Her ürünle birlikte bakım talimatları gönderilmektedir. Genel olarak yumuşak bir bez ile silinmesi ve direkt güneş ışığından uzak tutulması önerilir.'
                }
            ] : [
                {
                    question: 'Is there a size chart?',
                    answer: 'Yes, there is a detailed size chart on each product page. We recommend checking the chart to select the right size.'
                },
                {
                    question: 'When will out-of-stock products be available?',
                    answer: 'You can request notification for out-of-stock products. You will be notified by email when the product is back in stock.'
                },
                {
                    question: 'Do product images reflect reality?',
                    answer: 'Product images reflect the actual products. However, color tones may vary slightly depending on screen settings.'
                },
                {
                    question: 'How should I care for the products?',
                    answer: 'Care instructions are sent with each product. Generally, wiping with a soft cloth and keeping away from direct sunlight is recommended.'
                }
            ]
        }
    ]

    return (
        <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                    <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
                    <div className="space-y-3">
                        {category.items.map((item, itemIndex) => {
                            const globalIndex = categoryIndex * 100 + itemIndex
                            return (
                                <FAQItem
                                    key={globalIndex}
                                    question={item.question}
                                    answer={item.answer}
                                    isOpen={openIndex === globalIndex}
                                    onToggle={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                                />
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}
