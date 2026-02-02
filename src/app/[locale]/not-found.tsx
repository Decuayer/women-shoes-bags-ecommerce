import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'

export default async function LocaleNotFound() {
    const t = await getTranslations('error')
    const locale = await getLocale()

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center max-w-3xl mx-auto animate-fadeIn">
                {/* 404 Large Number */}
                <div className="mb-8">
                    <h1 className="text-[150px] md:text-[200px] font-bold leading-none gradient-text opacity-20">
                        404
                    </h1>
                </div>

                {/* Error Icon & Title */}
                <div className="relative -mt-32 mb-8">
                    <div className="inline-block">
                        <div className="w-32 h-32 bg-gradient-to-br from-[#c9a959] to-[#d4b96a] rounded-full flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a959] to-[#d4b96a] rounded-full animate-pulse opacity-50"></div>
                            <svg
                                className="w-16 h-16 text-[#1a1a2e] relative z-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text">
                    {t('pageNotFound')}
                </h2>
                <p className="text-lg md:text-xl text-text-muted mb-12 leading-relaxed max-w-xl mx-auto">
                    {t('notFoundDescription')}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <Link
                        href={`/${locale}`}
                        className="group px-8 py-4 bg-secondary hover:bg-secondary-light text-primary font-semibold rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-secondary/30 hover:-translate-y-1 flex items-center gap-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        {t('goHome')}
                    </Link>
                    <Link
                        href={`/${locale}/products`}
                        className="px-8 py-4 bg-surface hover:bg-surface-light text-text font-semibold rounded-lg border border-border hover:border-secondary transition-all duration-300 flex items-center gap-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        Ürünleri Keşfet
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {[
                        { icon: '👠', label: 'Ayakkabılar', href: `/${locale}/products?category=shoes` },
                        { icon: '👜', label: 'Çantalar', href: `/${locale}/products?category=bags` },
                        { icon: '✨', label: 'Yeni Ürünler', href: `/${locale}/products?filter=new` },
                        { icon: '🔥', label: 'İndirimler', href: `/${locale}/products?filter=sale` },
                    ].map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="card p-6 hover:scale-105 transition-all duration-300 group"
                        >
                            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <p className="text-sm text-text-muted group-hover:text-secondary transition-colors">
                                {item.label}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
