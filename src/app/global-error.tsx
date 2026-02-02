'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Global error:', error)
    }, [error])

    return (
        <html lang="tr">
            <body className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center p-4">
                <div className="text-center max-w-2xl mx-auto">
                    {/* Error Icon */}
                    <div className="mb-8 inline-block">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#c9a959] to-[#d4b96a] rounded-full flex items-center justify-center animate-pulse">
                            <svg
                                className="w-12 h-12 text-[#1a1a2e]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Error Message */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#c9a959] to-[#d4b96a] bg-clip-text text-transparent">
                        Bir Hata Oluştu
                    </h1>
                    <p className="text-lg text-[#a0a0b0] mb-8">
                        Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
                    </p>

                    {/* Error Details (in development) */}
                    {process.env.NODE_ENV === 'development' && error.message && (
                        <div className="mb-8 p-4 bg-[#1e1e2f] border border-[#c9a959]/20 rounded-lg text-left">
                            <p className="text-sm text-[#6b6b7b] mb-2">Hata Detayı:</p>
                            <code className="text-sm text-[#ef4444] break-all">
                                {error.message}
                            </code>
                            {error.digest && (
                                <p className="text-xs text-[#6b6b7b] mt-2">
                                    Hata Kodu: {error.digest}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={reset}
                            className="px-8 py-3 bg-[#c9a959] hover:bg-[#d4b96a] text-[#1a1a2e] font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#c9a959]/20 hover:-translate-y-0.5"
                        >
                            Tekrar Dene
                        </button>
                        <a
                            href="/"
                            className="px-8 py-3 bg-[#1e1e2f] hover:bg-[#2a2a3f] text-white font-semibold rounded-lg border border-[#c9a959]/20 hover:border-[#c9a959] transition-all duration-200"
                        >
                            Ana Sayfaya Dön
                        </a>
                    </div>
                </div>
            </body>
        </html>
    )
}
