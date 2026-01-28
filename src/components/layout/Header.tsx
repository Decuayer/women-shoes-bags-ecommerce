'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import {
    Search,
    ShoppingBag,
    Heart,
    User,
    Menu,
    X,
    Globe,
} from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'
import CartDrawer from '@/components/cart/CartDrawer'

interface HeaderProps {
    locale: string
}

export default function Header({ locale }: HeaderProps) {
    const t = useTranslations('common')
    const pathname = usePathname()
    const { itemCount } = useCart()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)

    const navLinks = [
        { href: `/${locale}`, label: t('home') },
        { href: `/${locale}/products`, label: t('products') },
        { href: `/${locale}/products?category=shoes`, label: t('shoes') },
        { href: `/${locale}/products?category=bags`, label: t('bags') },
    ]

    const otherLocale = locale === 'tr' ? 'en' : 'tr'
    const switchLocalePath = pathname.replace(`/${locale}`, `/${otherLocale}`)

    return (
        <>
            <header className="sticky top-0 z-50 glass">
                {/* Top Bar */}
                <div className="bg-secondary text-primary text-center py-2 text-sm font-medium">
                    {locale === 'tr'
                        ? '🚚 500 TL ve üzeri alışverişlerde ücretsiz kargo!'
                        : '🚚 Free shipping on orders over 500 TL!'
                    }
                </div>

                {/* Main Header */}
                <div className="container">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Mobile Menu Button */}
                        <button
                            className="btn-ghost p-2 md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Logo */}
                        <Link href={`/${locale}`} className="flex items-center gap-2">
                            <span className="text-xl md:text-2xl font-bold">
                                <span className="gradient-text">LUXE</span>
                                <span className="text-text-muted font-light">BAGS</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors hover:text-secondary ${pathname === link.href ? 'text-secondary' : 'text-text-muted'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Search */}
                            <button
                                className="btn-ghost p-2"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                aria-label="Search"
                            >
                                <Search size={20} />
                            </button>

                            {/* Wishlist - Hidden on mobile */}
                            <Link href={`/${locale}/wishlist`} className="btn-ghost p-2 hidden md:flex">
                                <Heart size={20} />
                            </Link>

                            {/* User Account */}
                            <Link href={`/${locale}/account`} className="btn-ghost p-2 hidden md:flex">
                                <User size={20} />
                            </Link>

                            {/* Cart */}
                            <button
                                className="btn-ghost p-2 relative"
                                onClick={() => setIsCartOpen(true)}
                                aria-label="Cart"
                            >
                                <ShoppingBag size={20} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-secondary text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </button>

                            {/* Language Switcher */}
                            <Link
                                href={switchLocalePath}
                                className="btn-ghost p-2 flex items-center gap-1 text-sm"
                                title={locale === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
                            >
                                <Globe size={18} />
                                <span className="hidden md:inline uppercase">{otherLocale}</span>
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    {isSearchOpen && (
                        <div className="py-4 animate-fadeIn">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={locale === 'tr' ? 'Ürün ara...' : 'Search products...'}
                                    className="input pl-12 pr-4"
                                    autoFocus
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark" size={20} />
                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dark hover:text-text"
                                    onClick={() => setIsSearchOpen(false)}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden glass animate-fadeIn">
                        <nav className="container py-4 flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`py-3 px-4 rounded-lg transition-colors ${pathname === link.href
                                            ? 'bg-secondary text-primary'
                                            : 'text-text-muted hover:bg-surface'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <hr className="border-border my-2" />
                            <Link
                                href={`/${locale}/account`}
                                className="py-3 px-4 rounded-lg text-text-muted hover:bg-surface flex items-center gap-3"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <User size={20} />
                                {locale === 'tr' ? 'Hesabım' : 'My Account'}
                            </Link>
                            <Link
                                href={`/${locale}/wishlist`}
                                className="py-3 px-4 rounded-lg text-text-muted hover:bg-surface flex items-center gap-3"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Heart size={20} />
                                {locale === 'tr' ? 'Favorilerim' : 'Wishlist'}
                            </Link>
                        </nav>
                    </div>
                )}
            </header>

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                locale={locale}
            />
        </>
    )
}
