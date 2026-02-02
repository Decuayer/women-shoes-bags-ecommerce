'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const t = useTranslations('error')

    useEffect(() => {
        console.error('Application error:', error)
    }, [error])

    // Check if it's a database error
    const isDatabaseError =
        error.message?.toLowerCase().includes('prisma') ||
        error.message?.toLowerCase().includes('database') ||
        error.message?.toLowerCase().includes('connection')

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center max-w-2xl mx-auto animate-fadeIn">
                {/* Error Icon */}
                <div className="mb-8 inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-[#c9a959] to-[#d4b96a] rounded-full flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a959] to-[#d4b96a] rounded-full animate-pulse opacity-50"></div>
                        <svg
                            className="w-16 h-16 text-[#1a1a2e] relative z-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isDatabaseError ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            )}
                        </svg>
                    </div>
                </div>

                {/* Error Title */}
                <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
                    {isDatabaseError ? t('databaseError') : t('generalError')}
                </h1>

                {/* Error Description */}
                <p className="text-lg md:text-xl text-text-muted mb-8 leading-relaxed">
                    {isDatabaseError ? t('databaseDescription') : t('description')}
                </p>

                {/* Development Error Details */}
                {process.env.NODE_ENV === 'development' && error.message && (
                    <div className="mb-8 p-6 bg-surface border border-secondary/20 rounded-xl text-left overflow-hidden">
                        <div className="flex items-center gap-2 mb-3">
                            <svg
                                className="w-5 h-5 text-secondary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="text-sm font-semibold text-text-muted">
                                Hata Detayı (Sadece Geliştirme Modunda Görünür):
                            </p>
                        </div>
                        <code className="text-sm text-error block break-all bg-background p-4 rounded-lg overflow-x-auto">
                            {error.message}
                        </code>
                        {error.digest && (
                            <p className="text-xs text-text-dark mt-3">
                                {t('errorCode')}: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={reset}
                        className="group px-8 py-4 bg-secondary hover:bg-secondary-light text-primary font-semibold rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-secondary/30 hover:-translate-y-1 flex items-center gap-2"
                    >
                        <svg
                            className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        {t('tryAgain')}
                    </button>
                    <Link
                        href="/"
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
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        {t('goHome')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
