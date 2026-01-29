import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'

export default async function FavoritesPage({ params }: { params: Promise<{ locale: string }> }) {
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

    const wishlist = await prisma.wishlist.findMany({
        where: { userId: payload.userId as string },
        include: {
            product: {
                include: {
                    category: true,
                    images: true,
                    variants: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                {isTr ? 'Favorilerim' : 'My Favorites'}
            </h1>

            {wishlist.length === 0 ? (
                <div className="text-center py-16 bg-surface rounded-xl border border-border">
                    <Heart size={64} className="mx-auto text-text-muted mb-4" />
                    <h2 className="text-lg font-medium mb-2">
                        {isTr ? 'Favori listeniz boş.' : 'Your wishlist is empty.'}
                    </h2>
                    <p className="text-text-muted mb-6">
                        {isTr ? 'Beğendiğiniz ürünleri favorilere ekleyerek takip edebilirsiniz.' : 'Start adding items you love to your wishlist.'}
                    </p>
                    <Link href={`/${locale}/products`} className="btn btn-primary">
                        {isTr ? 'Alışverişe Başla' : 'Start Shopping'}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => {
                        const productData = {
                            id: item.product.id,
                            slug: item.product.slug,
                            name: isTr ? item.product.name_tr : item.product.name_en,
                            price: Number(item.product.price),
                            compareAtPrice: item.product.compareAtPrice
                                ? Number(item.product.compareAtPrice)
                                : null,
                            category: {
                                name: isTr
                                    ? item.product.category.name_tr
                                    : item.product.category.name_en,
                                slug: item.product.category.slug
                            },
                            images: item.product.images.map((img) => ({
                                url: img.url,
                                alt: (isTr ? img.alt_tr : img.alt_en) || (isTr ? item.product.name_tr : item.product.name_en)
                            }))
                        }

                        return (
                            <div key={item.id} className="relative group">
                                <ProductCard
                                    product={productData}
                                    locale={locale}
                                    isWishlisted={true}
                                />
                                {/* We could add a dedicated "Remove" button overlay here if needed, 
                                but ProductCard's WishlistButton handles toggle logic correctly */}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
