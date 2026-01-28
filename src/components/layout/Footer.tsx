import Link from 'next/link'
import {
    Facebook,
    Instagram,
    Twitter,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Truck,
    Shield,
    RefreshCw
} from 'lucide-react'

interface FooterProps {
    locale: string
}

export default function Footer({ locale }: FooterProps) {
    const isTr = locale === 'tr'

    const footerLinks = {
        shop: {
            title: isTr ? 'Mağaza' : 'Shop',
            links: [
                { href: `/${locale}/products`, label: isTr ? 'Tüm Ürünler' : 'All Products' },
                { href: `/${locale}/products?category=shoes`, label: isTr ? 'Ayakkabılar' : 'Shoes' },
                { href: `/${locale}/products?category=bags`, label: isTr ? 'Çantalar' : 'Bags' },
                { href: `/${locale}/products?featured=true`, label: isTr ? 'Öne Çıkanlar' : 'Featured' },
            ]
        },
        customer: {
            title: isTr ? 'Müşteri Hizmetleri' : 'Customer Service',
            links: [
                { href: `/${locale}/contact`, label: isTr ? 'İletişim' : 'Contact Us' },
                { href: `/${locale}/faq`, label: isTr ? 'S.S.S.' : 'FAQ' },
                { href: `/${locale}/shipping`, label: isTr ? 'Kargo Bilgileri' : 'Shipping Info' },
                { href: `/${locale}/returns`, label: isTr ? 'İade & Değişim' : 'Returns & Exchanges' },
            ]
        },
        company: {
            title: isTr ? 'Kurumsal' : 'Company',
            links: [
                { href: `/${locale}/about`, label: isTr ? 'Hakkımızda' : 'About Us' },
                { href: `/${locale}/privacy`, label: isTr ? 'Gizlilik Politikası' : 'Privacy Policy' },
                { href: `/${locale}/terms`, label: isTr ? 'Kullanım Koşulları' : 'Terms of Service' },
            ]
        }
    }

    const features = [
        {
            icon: Truck,
            title: isTr ? 'Ücretsiz Kargo' : 'Free Shipping',
            desc: isTr ? '500 TL üzeri siparişlerde' : 'On orders over 500 TL'
        },
        {
            icon: RefreshCw,
            title: isTr ? 'Kolay İade' : 'Easy Returns',
            desc: isTr ? '14 gün içinde ücretsiz' : 'Free within 14 days'
        },
        {
            icon: Shield,
            title: isTr ? 'Güvenli Ödeme' : 'Secure Payment',
            desc: isTr ? '256-bit SSL şifreleme' : '256-bit SSL encryption'
        },
        {
            icon: CreditCard,
            title: isTr ? 'Taksit İmkanı' : 'Installment',
            desc: isTr ? '12 aya varan taksit' : 'Up to 12 installments'
        }
    ]

    return (
        <footer className="bg-surface border-t border-border">
            {/* Features Bar */}
            <div className="border-b border-border">
                <div className="container py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                                    <feature.icon className="text-secondary" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">{feature.title}</h4>
                                    <p className="text-text-dark text-xs">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href={`/${locale}`} className="inline-block mb-4">
                            <span className="text-2xl font-bold">
                                <span className="gradient-text">LUXE</span>
                                <span className="text-text-muted font-light">BAGS</span>
                            </span>
                        </Link>
                        <p className="text-text-muted text-sm mb-6 max-w-sm">
                            {isTr
                                ? 'Kadın ayakkabı ve çanta koleksiyonlarında en yeni trendleri ve premium kaliteyi keşfedin.'
                                : 'Discover the latest trends and premium quality in women\'s shoes and bags collections.'
                            }
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm text-text-muted">
                            <a href="tel:+902121234567" className="flex items-center gap-2 hover:text-secondary">
                                <Phone size={16} />
                                +90 212 123 45 67
                            </a>
                            <a href="mailto:info@luxebags.com" className="flex items-center gap-2 hover:text-secondary">
                                <Mail size={16} />
                                info@luxebags.com
                            </a>
                            <p className="flex items-center gap-2">
                                <MapPin size={16} />
                                İstanbul, Türkiye
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 mt-6">
                            {[Facebook, Instagram, Twitter].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-surface-light flex items-center justify-center text-text-muted hover:bg-secondary hover:text-primary transition-colors"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.values(footerLinks).map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            href={link.href}
                                            className="text-text-muted text-sm hover:text-secondary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border">
                <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
                    <p>© 2024 LUXEBAGS. {isTr ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}</p>
                    <div className="flex items-center gap-4">
                        <img src="/images/payment/visa.svg" alt="Visa" className="h-6 opacity-60" />
                        <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-6 opacity-60" />
                        <img src="/images/payment/iyzico.svg" alt="iyzico" className="h-6 opacity-60" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
