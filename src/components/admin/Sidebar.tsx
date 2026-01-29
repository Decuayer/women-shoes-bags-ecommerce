'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, Tags, LogOut } from 'lucide-react'

interface SidebarProps {
    locale: string
}

export default function Sidebar({ locale }: SidebarProps) {
    const pathname = usePathname()
    const isTr = locale === 'tr'

    const menuItems = [
        {
            title: isTr ? 'Panel' : 'Dashboard',
            icon: LayoutDashboard,
            href: `/${locale}/admin`
        },
        {
            title: isTr ? 'Ürünler' : 'Products',
            icon: Package,
            href: `/${locale}/admin/products`
        },
        {
            title: isTr ? 'Siparişler' : 'Orders',
            icon: ShoppingBag,
            href: `/${locale}/admin/orders`
        },
        {
            title: isTr ? 'Kategoriler' : 'Categories',
            icon: Tags,
            href: `/${locale}/admin/categories`
        },
        {
            title: isTr ? 'Müşteriler' : 'Customers',
            icon: Users,
            href: `/${locale}/admin/users`
        },
        {
            title: isTr ? 'Ayarlar' : 'Settings',
            icon: Settings,
            href: `/${locale}/admin/settings`
        }
    ]

    return (
        <aside className="w-64 bg-surface border-r border-border h-screen sticky top-0 flex flex-col">
            <div className="p-6 border-b border-border">
                <Link href={`/${locale}`} className="text-2xl font-bold font-heading tracking-wide">
                    CRAZY<span className="text-secondary">SHOES</span>
                    <span className="text-xs block font-sans font-normal text-text-muted mt-1">Admin Panel</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                    // Handle exact match for dashboard
                    const isExactActive = item.href === `/${locale}/admin`
                        ? pathname === `/${locale}/admin`
                        : pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isExactActive
                                    ? 'bg-secondary/10 text-secondary font-medium'
                                    : 'text-text-muted hover:text-text hover:bg-surface-light'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.title}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-colors"
                >
                    <LogOut size={20} />
                    {isTr ? 'Çıkış Yap' : 'Sign Out'}
                </button>
            </div>
        </aside>
    )
}
