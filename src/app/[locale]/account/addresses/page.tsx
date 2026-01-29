import { prisma } from '@/lib/prisma'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { cookies } from 'next/headers'
import AddressCard from '@/components/account/AddressCard'
import AddAddressButton from './AddAddressButton'
import { MapPin } from 'lucide-react'

async function getAddresses() {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value
    if (!token) return []

    const payload = await verifyAccessTokenEdge(token)
    if (!payload?.userId) return []

    const addresses = await prisma.address.findMany({
        where: { userId: payload.userId as string },
        orderBy: [
            { isDefault: 'desc' },
            { createdAt: 'desc' }
        ]
    })

    return addresses
}

export default async function AddressesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const isTr = locale === 'tr'
    const addresses = await getAddresses()

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">
                    {isTr ? 'Adreslerim' : 'My Addresses'}
                </h1>
                <AddAddressButton locale={locale} />
            </div>

            {addresses.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            locale={locale}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-surface rounded-xl border border-border">
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mx-auto mb-4 border border-border text-text-muted">
                        <MapPin size={32} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                        {isTr ? 'Kayıtlı adres bulunamadı' : 'No saved addresses'}
                    </h3>
                    <p className="text-text-muted mb-6 max-w-md mx-auto">
                        {isTr
                            ? 'Henüz bir adres eklemediniz. Yeni bir adres ekleyerek alışverişe başlayabilirsiniz.'
                            : 'You haven\'t added any addresses yet. Add a new address to start shopping.'
                        }
                    </p>
                    <AddAddressButton locale={locale} variant="primary" />
                </div>
            )}
        </div>
    )
}
