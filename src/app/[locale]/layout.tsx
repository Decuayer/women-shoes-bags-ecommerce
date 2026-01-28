import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/components/cart/CartContext'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'LUXEBAGS - Premium Women Shoes & Bags',
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
        <html lang={locale}>
            <body className={inter.className}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
