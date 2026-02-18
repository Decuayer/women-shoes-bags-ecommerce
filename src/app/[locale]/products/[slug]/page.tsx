import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductDetailClient from '@/components/products/ProductDetailClient'
import ProductCard from '@/components/products/ProductCard'
import { prisma } from '@/lib/prisma'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { cookies } from 'next/headers'
import { ChevronRight, Home } from 'lucide-react'

interface ProductDetailPageProps {
    params: Promise<{ locale: string; slug: string }>
}

async function getProduct(slug: string, locale: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            images: {
                orderBy: { displayOrder: 'asc' },
            },
            variants: {
                orderBy: [{ color_tr: 'asc' }, { size: 'asc' }],
            },
        },
    })

    if (!product || !product.isActive) {
        return null
    }

    return {
        id: product.id,
        slug: product.slug,
        name: locale === 'tr' ? product.name_tr : product.name_en,
        description: locale === 'tr' ? product.description_tr : product.description_en,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        brand: product.brand,
        material: locale === 'tr' ? product.material_tr : product.material_en,
        category: {
            name: locale === 'tr' ? product.category.name_tr : product.category.name_en,
            slug: product.category.slug,
        },
        images: product.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: locale === 'tr' ? (img.alt_tr || product.name_tr) : (img.alt_en || product.name_en),
            colorKey: img.colorKey ?? null,
        })),
        variants: product.variants.map((v) => ({
            id: v.id,
            size: v.size,
            color: locale === 'tr' ? v.color_tr : v.color_en,
            colorHex: v.colorHex,
            stock: v.stock,
            sku: v.sku,
        })),
        categoryId: product.categoryId,
    }
}

async function getRelatedProducts(categoryId: string, excludeSlug: string, locale: string) {
    const products = await prisma.product.findMany({
        where: {
            categoryId,
            slug: { not: excludeSlug },
            isActive: true,
        },
        include: {
            category: true,
            images: {
                orderBy: { displayOrder: 'asc' },
                take: 1,
            },
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
    })

    return products.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: locale === 'tr' ? product.name_tr : product.name_en,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        category: {
            name: locale === 'tr' ? product.category.name_tr : product.category.name_en,
            slug: product.category.slug,
        },
        images: product.images.map((img) => ({
            url: img.url,
            alt: locale === 'tr' ? (img.alt_tr || product.name_tr) : (img.alt_en || product.name_en),
        })),
        rating: 4.5,
    }))
}

async function checkIsWishlisted(productId: string) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value
        if (!token) return false

        const payload = await verifyAccessTokenEdge(token)
        if (!payload) return false

        const count = await prisma.wishlist.count({
            where: {
                userId: payload.userId as string,
                productId: productId
            }
        })

        return count > 0
    } catch {
        return false
    }
}

import { getGeneralSettings, getAnnouncementSettings, getFeatureHighlights } from '@/lib/settings'

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { locale, slug } = await params
    const isTr = locale === 'tr'

    const product = await getProduct(slug, locale)
    const general = await getGeneralSettings()
    const announcement = await getAnnouncementSettings()
    const features = await getFeatureHighlights()

    if (!product) {
        notFound()
    }

    const relatedProducts = await getRelatedProducts(product.categoryId, product.slug, locale)

    // Check if main product is wishlisted
    const isWishlisted = await checkIsWishlisted(product.id)

    // We can also fetch wishlist IDs for related products if we want them to show hearts,
    // but for now let's focus on the main product detail as requested.
    // Actually, user expects related products to also have correct state.

    // Re-use logic for related products
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value
    let wishlistIds = new Set<string>()
    if (token) {
        try {
            const payload = await verifyAccessTokenEdge(token)
            if (payload) {
                const items = await prisma.wishlist.findMany({
                    where: { userId: payload.userId as string },
                    select: { productId: true }
                })
                wishlistIds = new Set(items.map(i => i.productId))
            }
        } catch { }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={locale} settings={{ general, announcement }} />
            <main className="flex-1 bg-background">
                <div className="container">
                    <div className="py-6">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-2 text-sm mb-8 text-text-muted">
                            <Link href={`/${locale}`} className="hover:text-secondary flex items-center gap-1">
                                <Home size={14} />
                                {isTr ? 'Anasayfa' : 'Home'}
                            </Link>
                            <ChevronRight size={14} />
                            <Link href={`/${locale}/products`} className="hover:text-secondary">
                                {isTr ? 'Ürünler' : 'Products'}
                            </Link>
                            <ChevronRight size={14} />
                            <Link
                                href={`/${locale}/products?category=${product.category.slug}`}
                                className="hover:text-secondary"
                            >
                                {product.category.name}
                            </Link>
                            <ChevronRight size={14} />
                            <span className="text-text truncate max-w-[200px]">{product.name}</span>
                        </nav>

                        {/* Product Detail */}
                        <ProductDetailClient
                            product={product}
                            locale={locale}
                            initialIsWishlisted={isWishlisted}
                            features={features}
                        />

                        {/* Related Products */}
                        {relatedProducts.length > 0 && (
                            <section className="mt-16 pt-12 border-t border-border">
                                <h2 className="text-2xl font-bold mb-8">
                                    {isTr ? 'Benzer Ürünler' : 'Related Products'}
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                    {relatedProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            locale={locale}
                                            isWishlisted={wishlistIds.has(product.id)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
            <Footer locale={locale} />
        </div>
    )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductDetailPageProps) {
    const { locale, slug } = await params

    const product = await prisma.product.findUnique({
        where: { slug },
        select: {
            name_tr: true,
            name_en: true,
            description_tr: true,
            description_en: true,
        },
    })

    if (!product) {
        return { title: 'Product Not Found' }
    }

    const name = locale === 'tr' ? product.name_tr : product.name_en
    const description = locale === 'tr' ? product.description_tr : product.description_en

    return {
        title: `${name} | CRAZYSHOES`,
        description: description?.slice(0, 160),
    }
}
