import Link from 'next/link'
import ProductCard from '@/components/products/ProductCard'
import { cookies } from 'next/headers'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { prisma } from '@/lib/prisma'

interface Product {
    id: string
    slug: string
    name: string
    price: number
    compareAtPrice?: number | null
    category: {
        name: string
        slug: string
    }
    images: {
        url: string
        alt: string
    }[]
    rating?: number
}

interface FeaturedProductsProps {
    locale: string
    products: Product[]
}

async function getUserWishlistIds(cookieStore: any) {
    const token = cookieStore.get('accessToken')?.value
    if (!token) return new Set<string>()

    const payload = await verifyAccessTokenEdge(token)
    if (!payload) return new Set<string>()

    const wishlistItems = await prisma.wishlist.findMany({
        where: { userId: payload.userId as string },
        select: { productId: true }
    })

    return new Set(wishlistItems.map(item => item.productId))
}

export default async function FeaturedProducts({ locale, products }: FeaturedProductsProps) {
    const isTr = locale === 'tr'

    const cookieStore = await cookies()
    const wishlistIds = await getUserWishlistIds(cookieStore)

    return (
        <section className="section">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {isTr ? 'Öne Çıkan Ürünler' : 'Featured Products'}
                    </h2>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        {isTr
                            ? 'En beğenilen ve en çok satan ürünlerimizi keşfedin'
                            : 'Discover our most loved and best-selling products'
                        }
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            locale={locale}
                            isWishlisted={wishlistIds.has(product.id)}
                        />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link href={`/${locale}/products`} className="btn btn-secondary">
                        {isTr ? 'Tüm Ürünleri Gör' : 'View All Products'}
                    </Link>
                </div>
            </div>
        </section>
    )
}
