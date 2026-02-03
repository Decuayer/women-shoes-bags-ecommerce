import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/components/cart/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { LoadingProvider } from '@/context/LoadingContext'
import ToastContainer from '@/components/ui/ToastContainer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import LoadingProgressBar from '@/components/ui/LoadingProgressBar'
import NavigationHandler from '@/components/layout/NavigationHandler'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'CRAZYSHOES - Premium Women Shoes & Bags',
    description: 'Discover premium women shoes and bags. Shop the latest collection of elegant footwear and luxury handbags.',
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const messages = await getMessages()

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={inter.className}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <AuthProvider>
                        <ToastProvider>
                            <LoadingProvider>
                                <CartProvider>
                                    <NavigationHandler />
                                    <LoadingProgressBar />
                                    {children}
                                </CartProvider>
                                <ToastContainer />
                                <LoadingSpinner />
                            </LoadingProvider>
                        </ToastProvider>
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
