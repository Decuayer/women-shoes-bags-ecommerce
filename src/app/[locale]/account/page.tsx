import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const isTr = locale === 'tr'

    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
        redirect(`/${locale}/auth/login`)
    }

    const payload = await verifyAccessTokenEdge(token)
    if (!payload) {
        redirect(`/${locale}/auth/login`)
    }

    // Parallel fetch for valid user data and counts
    const [user, ordersCount, wishlistCount, addressCount] = await Promise.all([
        prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { firstName: true, role: true }
        }),
        prisma.order.count({
            where: { userId: payload.userId as string }
        }),
        prisma.wishlist.count({
            where: { userId: payload.userId as string }
        }),
        prisma.address.count({
            where: { userId: payload.userId as string }
        })
    ])

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                {isTr ? 'Hesap Özeti' : 'Dashboard'}
            </h1>

            {user?.role === 'ADMIN' && (
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6 mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-secondary mb-1">
                            {isTr ? 'Yönetici Erişimi' : 'Admin Access'}
                        </h2>
                        <p className="text-sm text-text-muted">
                            {isTr
                                ? 'Mağaza yönetim paneline buradan ulaşabilirsiniz.'
                                : 'Access store management panel from here.'}
                        </p>
                    </div>
                    <Link
                        href={`/${locale}/admin`}
                        className="btn btn-primary whitespace-nowrap"
                    >
                        {isTr ? 'Admin Paneline Git' : 'Go to Admin Panel'}
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-background border border-border p-6 rounded-xl">
                    <div className="text-text-muted text-sm mb-1">
                        {isTr ? 'Toplam Sipariş' : 'Total Orders'}
                    </div>
                    <div className="text-3xl font-bold">{ordersCount}</div>
                </div>

                <div className="bg-background border border-border p-6 rounded-xl">
                    <div className="text-text-muted text-sm mb-1">
                        {isTr ? 'Favoriler' : 'Wishlist'}
                    </div>
                    <div className="text-3xl font-bold">{wishlistCount}</div>
                </div>

                <div className="bg-background border border-border p-6 rounded-xl">
                    <div className="text-text-muted text-sm mb-1">
                        {isTr ? 'Kayıtlı Adresler' : 'Saved Addresses'}
                    </div>
                    <div className="text-3xl font-bold">{addressCount}</div>
                </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-2">
                    {isTr ? `Hoş geldiniz, ${user?.firstName}!` : `Welcome back, ${user?.firstName}!`}
                </h2>
                <p className="text-text-muted">
                    {isTr
                        ? 'Hesap paneline hoş geldiniz. Buradan siparişlerinizi takip edebilir, favori ürünlerinizi görüntüleyebilir ve hesap ayarlarınızı yönetebilirsiniz.'
                        : 'Welcome to your account dashboard. Here you can track your orders, view your favorite products, and manage your account settings.'
                    }
                </p>
            </div>
        </div>
    )
}
