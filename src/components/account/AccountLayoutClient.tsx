'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

import {
    LayoutDashboard,
    ShoppingBag,
    Heart,
    MapPin,
    User,
    Settings,
    LogOut,
    Shield
} from 'lucide-react'

interface AccountLayoutClientProps {
    children: React.ReactNode
}

export default function AccountLayoutClient({
    children
}: AccountLayoutClientProps) {
    const params = useParams()
    const locale = params.locale as string
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const isTr = locale === 'tr'

    const menuItems = [
        {
            icon: LayoutDashboard,
            label: isTr ? 'Hesap Özeti' : 'Dashboard',
            href: `/${locale}/account`
        },
        {
            icon: ShoppingBag,
            label: isTr ? 'Siparişlerim' : 'My Orders',
            href: `/${locale}/account/orders`
        },
        {
            icon: Heart,
            label: isTr ? 'Favorilerim' : 'Favorites',
            href: `/${locale}/account/favorites`
        },
        {
            icon: MapPin,
            label: isTr ? 'Adreslerim' : 'Addresses',
            href: `/${locale}/account/addresses`
        },
        {
            icon: User,
            label: isTr ? 'Profil Düzenle' : 'Edit Profile',
            href: `/${locale}/account/profile`
        },
        {
            icon: Settings,
            label: isTr ? 'Hesap Ayarları' : 'Settings',
            href: `/${locale}/account/settings`
        }
    ]

    return (
        <div className="container flex flex-col md:flex-row gap-8 !py-12">
            {/* Sidebar */}
            <aside className="w-full md:w-64 shrink-0 space-y-6">
                {/* User Card */}
                <div className="bg-surface border border-border rounded-xl p-6 text-center">
                    <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold">
                            {user?.firstName?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <h3 className="font-semibold text-lg">
                        {user ? `${user.firstName} ${user.lastName}` : 'User'}
                    </h3>
                    <p className="text-text-muted text-sm mb-4">{user?.email}</p>

                    {user?.role === 'ADMIN' && (
                        <Link
                            href={`/${locale}/admin`}
                            className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-2 hover:bg-primary/20 transition-colors"
                        >
                            <Shield size={14} />
                            {isTr ? 'Admin Paneli' : 'Admin Panel'}
                        </Link>
                    )}
                </div>

                {/* Navigation */}
                <nav className="bg-surface border border-border rounded-xl overflow-hidden">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-6 py-4 transition-colors ${isActive
                                    ? 'bg-primary/5 text-secondary border-l-4 border-primary'
                                    : 'text-text-muted hover:bg-surface-hover hover:text-text border-l-4 border-transparent'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-6 py-4 text-error hover:bg-error/5 transition-colors text-left border-l-4 border-transparent"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">{isTr ? 'Çıkış Yap' : 'Logout'}</span>
                    </button>
                </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 bg-surface border border-border rounded-xl p-6 min-h-[500px]">
                {children}
            </div>
        </div>
    )
}
