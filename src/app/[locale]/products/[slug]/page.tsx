import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductDetailClient from '@/components/products/ProductDetailClient'
import ProductCard from '@/components/products/ProductCard'
import ProductReviews from '@/components/products/ProductReviews'
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
            category: {
                include: {
                    parent: {
                        select: { id: true, slug: true, name_tr: true, name_en: true }
                    }
                }
            },
            images: {
                orderBy: { displayOrder: 'asc' },
            },
            variants: {
                orderBy: [{ color_tr: 'asc' }, { size: 'asc' }],
            },
            reviews: {
                where: { isApproved: true },
                select: { rating: true }
            }
        },
    })

    if (!product || !product.isActive) {
        return null
    }

    // Calculate avg rating
    const approvedReviews = product.reviews || []
    const avgRating = approvedReviews.length > 0
        ? Number((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1))
        : null

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
            // Parent info for breadcrumb (if this is a subcategory)
            parent: product.category.parent ? {
                name: locale === 'tr' ? product.category.parent.name_tr : product.category.parent.name_en,
                slug: product.category.parent.slug,
            } : null,
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
        avgRating,
        reviewCount: approvedReviews.length,
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
            reviews: {
                where: { isApproved: true },
                select: { rating: true }
            }
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
    })

    return products.map((product) => {
        const approvedReviews = product.reviews || []
        const avgRating = approvedReviews.length > 0
            ? Number((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1))
            : null

        return {
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
            rating: avgRating,
            reviewCount: approvedReviews.length,
        }
    })
}

async function getReviewData(productId: string, userId: string | null) {
    const reviews = await prisma.review.findMany({
        where: { productId, isApproved: true },
        include: {
            user: { select: { firstName: true, lastName: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    const mapped = reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        isVerifiedPurchase: r.isVerifiedPurchase,
        createdAt: r.createdAt.toISOString(),
        user: { name: `${r.user.firstName} ${r.user.lastName.charAt(0)}.` }
    }))

    const avgRating = reviews.length > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
        : null

    let canReview = false
    let hasReviewed = false

    if (userId) {
        // Check if user has a delivered order with this product
        const [deliveredOrder, existingReview] = await Promise.all([
            prisma.order.findFirst({
                where: { userId, status: 'DELIVERED', items: { some: { productId } } }
            }),
            prisma.review.findUnique({
                where: { userId_productId: { userId, productId } }
            })
        ])
        canReview = !!deliveredOrder
        hasReviewed = !!existingReview
    }

    return { reviews: mapped, avgRating, reviewCount: reviews.length, canReview, hasReviewed }
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

    // Get current user for reviews gating
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value
    let userId: string | null = null
    let wishlistIds = new Set<string>()

    if (token) {
        try {
            const payload = await verifyAccessTokenEdge(token)
            if (payload) {
                userId = payload.userId as string
                const items = await prisma.wishlist.findMany({
                    where: { userId },
                    select: { productId: true }
                })
                wishlistIds = new Set(items.map(i => i.productId))
            }
        } catch { }
    }

    const isWishlisted = wishlistIds.has(product.id)

    const [relatedProducts, reviewData] = await Promise.all([
        getRelatedProducts(product.categoryId, product.slug, locale),
        getReviewData(product.id, userId)
    ])

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={locale} settings={{ general, announcement }} />
            <main className="flex-1 bg-background">
                <div className="container">
                    <div className="py-6">
                        {/* Breadcrumb — supports subcategory: Home > Products > Parent Cat > Sub Cat > Product */}
                        <nav className="flex items-center gap-2 text-sm mb-8 text-text-muted flex-wrap">
                            <Link href={`/${locale}`} className="hover:text-secondary flex items-center gap-1">
                                <Home size={14} />
                                {isTr ? 'Anasayfa' : 'Home'}
                            </Link>
                            <ChevronRight size={14} />
                            <Link href={`/${locale}/products`} className="hover:text-secondary">
                                {isTr ? 'Ürünler' : 'Products'}
                            </Link>
                            {/* If the category has a parent (i.e. it's a subcategory), show parent first */}
                            {product.category.parent && (
                                <>
                                    <ChevronRight size={14} />
                                    <Link
                                        href={`/${locale}/products?category=${product.category.parent.slug}`}
                                        className="hover:text-secondary"
                                    >
                                        {product.category.parent.name}
                                    </Link>
                                </>
                            )}
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

                        {/* Reviews Section */}
                        <ProductReviews
                            productId={product.id}
                            initialReviews={reviewData.reviews}
                            avgRating={reviewData.avgRating}
                            reviewCount={reviewData.reviewCount}
                            locale={locale}
                            canReview={reviewData.canReview}
                            hasReviewed={reviewData.hasReviewed}
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
