import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { User, Package, Heart, MapPin, CreditCard, Settings, LogOut, ChevronRight } from 'lucide-react'

interface AccountPageProps {
    params: Promise<{ locale: string }>
}

export default async function AccountPage({ params }: AccountPageProps) {
    const { locale } = await params
    const isTr = locale === 'tr'

    // TODO: Get user from session/cookie
    const user = {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
    }

    const menuItems = [
        {
            icon: Package,
            label: isTr ? 'Siparişlerim' : 'My Orders',
            href: `/${locale}/account/orders`,
            description: isTr ? 'Sipariş geçmişi ve takip' : 'Order history and tracking',
        },
        {
            icon: Heart,
            label: isTr ? 'Favorilerim' : 'Wishlist',
            href: `/${locale}/wishlist`,
            description: isTr ? 'Beğendiğiniz ürünler' : 'Products you love',
        },
        {
            icon: MapPin,
            label: isTr ? 'Adreslerim' : 'Addresses',
            href: `/${locale}/account/addresses`,
            description: isTr ? 'Teslimat adresleri' : 'Delivery addresses',
        },
        {
            icon: CreditCard,
            label: isTr ? 'Ödeme Yöntemlerim' : 'Payment Methods',
            href: `/${locale}/account/payments`,
            description: isTr ? 'Kayıtlı kartlar' : 'Saved cards',
        },
        {
            icon: Settings,
            label: isTr ? 'Hesap Ayarları' : 'Account Settings',
            href: `/${locale}/account/settings`,
            description: isTr ? 'Profil ve şifre' : 'Profile and password',
        },
    ]

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={locale} />

            <main className="flex-1 bg-background">
                <div className="container py-8">
                    <h1 className="text-3xl font-bold mb-8">{isTr ? 'Hesabım' : 'My Account'}</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* User Info Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-surface rounded-xl border border-border p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                                        <User size={32} className="text-secondary" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold">{user.firstName} {user.lastName}</h2>
                                        <p className="text-sm text-text-muted">{user.email}</p>
                                    </div>
                                </div>

                                <Link
                                    href={`/${locale}/account/settings`}
                                    className="btn btn-secondary w-full"
                                >
                                    {isTr ? 'Profili Düzenle' : 'Edit Profile'}
                                </Link>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="lg:col-span-2 space-y-3">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border hover:border-secondary transition-colors group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                                        <item.icon size={24} className="text-secondary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium group-hover:text-secondary transition-colors">
                                            {item.label}
                                        </h3>
                                        <p className="text-sm text-text-muted">{item.description}</p>
                                    </div>
                                    <ChevronRight size={20} className="text-text-dark group-hover:text-secondary transition-colors" />
                                </Link>
                            ))}

                            {/* Logout */}
                            <button className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border hover:border-error transition-colors group w-full text-left">
                                <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                                    <LogOut size={24} className="text-error" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-error">
                                        {isTr ? 'Çıkış Yap' : 'Sign Out'}
                                    </h3>
                                    <p className="text-sm text-text-muted">
                                        {isTr ? 'Hesabınızdan çıkış yapın' : 'Sign out of your account'}
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    )
}

export async function generateMetadata({ params }: AccountPageProps) {
    const { locale } = await params

    return {
        title: locale === 'tr' ? 'Hesabım | LUXEBAGS' : 'My Account | LUXEBAGS',
        description: locale === 'tr'
            ? 'Hesap bilgilerinizi yönetin'
            : 'Manage your account',
    }
}
