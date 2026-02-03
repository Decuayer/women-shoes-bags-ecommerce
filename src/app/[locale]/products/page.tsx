import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/products/ProductCard'
import ProductFilters from '@/components/products/ProductFilters'
import ProductSort from '@/components/products/ProductSort'
import { prisma } from '@/lib/prisma'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'
import Link from 'next/link'

interface ProductsPageProps {
    params: Promise<{ locale: string }>
    searchParams: Promise<{
        category?: string
        color?: string
        size?: string
        minPrice?: string
        maxPrice?: string
        sort?: string
        page?: string
    }>
}

async function getProducts(locale: string, filters: {
    category?: string
    color?: string
    size?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
}) {
    const page = parseInt(filters.page || '1')
    const limit = 12
    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {
        isActive: true,
    }

    if (filters.category) {
        where.category = { slug: filters.category }
    }

    if (filters.minPrice || filters.maxPrice) {
        where.price = {}
        if (filters.minPrice) {
            (where.price as Record<string, unknown>).gte = parseFloat(filters.minPrice)
        }
        if (filters.maxPrice) {
            (where.price as Record<string, unknown>).lte = parseFloat(filters.maxPrice)
        }
    }

    if (filters.color || filters.size) {
        where.variants = {
            some: {
                stock: { gt: 0 },
                ...(filters.color && {
                    OR: [
                        { color_tr: { contains: filters.color, mode: 'insensitive' } },
                        { color_en: { contains: filters.color, mode: 'insensitive' } }
                    ]
                }),
                ...(filters.size && { size: filters.size }),
            }
        }
    }

    // Build order by
    let orderBy: Record<string, string> = { createdAt: 'desc' }
    if (filters.sort === 'price_asc') {
        orderBy = { price: 'asc' }
    } else if (filters.sort === 'price_desc') {
        orderBy = { price: 'desc' }
    }

    try {
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    images: {
                        orderBy: { displayOrder: 'asc' },
                        take: 1,
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ])

        return {
            products: products.map((product) => ({
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
                rating: 4.5, // Placeholder
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        }
    } catch (error) {
        console.error('❌ Database query failed in getProducts:', error)

        // Check if it's a timeout error
        const isTimeout = error instanceof Error && (
            error.message.includes('timeout') ||
            error.message.includes('exceeded')
        )

        if (isTimeout) {
            console.error('🕒 Database connection timeout - check your database connection and network')
        }

        // Return empty results instead of crashing the page
        return {
            products: [],
            total: 0,
            page,
            totalPages: 0,
        }
    }
}

async function getCategories(locale: string) {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
        })

        return categories.map((cat) => ({
            id: cat.id,
            slug: cat.slug,
            name: locale === 'tr' ? cat.name_tr : cat.name_en,
        }))
    } catch (error) {
        console.error('❌ Failed to fetch categories:', error)
        return []
    }
}

async function getFilterOptions() {
    try {
        // Get unique colors and sizes from variants
        const variants = await prisma.productVariant.findMany({
            where: { stock: { gt: 0 } },
            select: {
                color_tr: true,
                color_en: true,
                size: true,
            },
            distinct: ['color_tr', 'size'],
        })

        const colorsSet = new Set<string>()
        const sizesSet = new Set<string>()

        variants.forEach((v) => {
            if (v.color_tr) colorsSet.add(v.color_tr)
            if (v.size) sizesSet.add(v.size)
        })

        return {
            colors: Array.from(colorsSet),
            sizes: Array.from(sizesSet).sort((a, b) => {
                const numA = parseInt(a)
                const numB = parseInt(b)
                if (!isNaN(numA) && !isNaN(numB)) return numA - numB
                return a.localeCompare(b)
            }),
        }
    } catch (error) {
        console.error('❌ Failed to fetch filter options:', error)
        return { colors: [], sizes: [] }
    }
}

async function getWishlistIds() {
    try {
        const { cookies } = await import('next/headers')
        const { verifyAccessTokenEdge } = await import('@/lib/auth-edge')

        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value
        if (!token) return new Set<string>()

        const payload = await verifyAccessTokenEdge(token)
        if (!payload) return new Set<string>()

        const wishlistItems = await prisma.wishlist.findMany({
            where: { userId: payload.userId as string },
            select: { productId: true }
        })

        return new Set(wishlistItems.map(item => item.productId))
    } catch (e) {
        return new Set<string>()
    }
}

import { getGeneralSettings, getAnnouncementSettings } from '@/lib/settings'

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
    const { locale } = await params
    const filters = await searchParams
    const isTr = locale === 'tr'

    const [
        { products, total, page, totalPages },
        categories,
        filterOptions,
        wishlistIds,
        general,
        announcement
    ] = await Promise.all([
        getProducts(locale, filters),
        getCategories(locale),
        getFilterOptions(),
        getWishlistIds(),
        getGeneralSettings(),
        getAnnouncementSettings(),
    ])

    // Build pagination URL helper
    const buildPageUrl = (pageNum: number) => {
        const params = new URLSearchParams()
        if (filters.category) params.set('category', filters.category)
        if (filters.color) params.set('color', filters.color)
        if (filters.size) params.set('size', filters.size)
        if (filters.minPrice) params.set('minPrice', filters.minPrice)
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
        if (filters.sort) params.set('sort', filters.sort)
        params.set('page', pageNum.toString())
        return `/${locale}/products?${params.toString()}`
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={locale} settings={{ general, announcement }} />

            <main className="flex-1 bg-background">
                <div className="container">
                    <div className=" py-4">
                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                {filters.category
                                    ? categories.find(c => c.slug === filters.category)?.name || (isTr ? 'Ürünler' : 'Products')
                                    : (isTr ? 'Tüm Ürünler' : 'All Products')
                                }
                            </h1>
                            <p className="text-text-muted">
                                {total} {isTr ? 'ürün bulundu' : 'products found'}
                            </p>
                        </div>

                        <div className="flex gap-8">
                            {/* Filters Sidebar */}
                            <Suspense fallback={<div className="hidden lg:block w-64 shrink-0 skeleton h-96" />}>
                                <ProductFilters
                                    locale={locale}
                                    categories={categories}
                                    colors={filterOptions.colors}
                                    sizes={filterOptions.sizes}
                                />
                            </Suspense>

                            {/* Products Grid */}
                            <div className="flex-1">
                                {/* Sort Bar */}
                                <div className="flex items-center justify-between mb-6 p-4 bg-surface rounded-xl border border-border">
                                    <span className="text-sm text-text-muted">
                                        {isTr ? 'Sayfa' : 'Page'} {page} / {totalPages}
                                    </span>
                                    <Suspense fallback={<div className="skeleton w-40 h-10" />}>
                                        <ProductSort locale={locale} />
                                    </Suspense>
                                </div>

                                {/* Products */}
                                {products.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                        {products.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                locale={locale}
                                                isWishlisted={wishlistIds.has(product.id)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <Package size={64} className="mx-auto text-text-dark mb-4" />
                                        <h3 className="text-xl font-medium mb-2">
                                            {isTr ? 'Ürün bulunamadı' : 'No products found'}
                                        </h3>
                                        <p className="text-text-muted mb-6">
                                            {isTr
                                                ? 'Arama kriterlerinize uygun ürün bulunamadı.'
                                                : 'No products match your search criteria.'
                                            }
                                        </p>
                                        <Link href={`/${locale}/products`} className="btn btn-primary">
                                            {isTr ? 'Tüm Ürünleri Gör' : 'View All Products'}
                                        </Link>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-12">
                                        {page > 1 && (
                                            <Link
                                                href={buildPageUrl(page - 1)}
                                                className="btn btn-ghost p-3"
                                            >
                                                <ChevronLeft size={20} />
                                            </Link>
                                        )}

                                        {[...Array(totalPages)].map((_, i) => {
                                            const pageNum = i + 1
                                            // Show first, last, current, and adjacent pages
                                            if (
                                                pageNum === 1 ||
                                                pageNum === totalPages ||
                                                (pageNum >= page - 1 && pageNum <= page + 1)
                                            ) {
                                                return (
                                                    <Link
                                                        key={pageNum}
                                                        href={buildPageUrl(pageNum)}
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${pageNum === page
                                                            ? 'bg-secondary text-primary'
                                                            : 'bg-surface hover:bg-surface-light text-text-muted'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </Link>
                                                )
                                            } else if (
                                                (pageNum === page - 2 && page > 3) ||
                                                (pageNum === page + 2 && page < totalPages - 2)
                                            ) {
                                                return <span key={pageNum} className="text-text-dark">...</span>
                                            }
                                            return null
                                        })}

                                        {page < totalPages && (
                                            <Link
                                                href={buildPageUrl(page + 1)}
                                                className="btn btn-ghost p-3"
                                            >
                                                <ChevronRight size={20} />
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer locale={locale} />
        </div>
    )
}
