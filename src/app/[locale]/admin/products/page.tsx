import { prisma } from '@/lib/prisma'
import ProductListClient from '@/components/admin/products/ProductListClient'
import { Prisma } from '@prisma/client'

interface ProductListPageProps {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ page?: string; q?: string }>
}

export default async function ProductListPage({ params, searchParams }: ProductListPageProps) {
    const { locale } = await params
    const { page = '1', q = '' } = await searchParams
    const isTr = locale === 'tr'

    const currentPage = Number(page) || 1
    const itemsPerPage = 10
    const skip = (currentPage - 1) * itemsPerPage

    // Build filter inputs
    const where: Prisma.ProductWhereInput = {
        OR: [
            { name_tr: { contains: q, mode: 'insensitive' } },
            { name_en: { contains: q, mode: 'insensitive' } },
        ]
    }

    // Fetch data
    const [products, totalItems] = await Promise.all([
        prisma.product.findMany({
            where: q ? where : undefined,
            include: {
                category: true,
                variants: true,
                images: {
                    orderBy: { displayOrder: 'asc' },
                    take: 1
                }
            },
            skip,
            take: itemsPerPage,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.product.count({
            where: q ? where : undefined
        })
    ])

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    // Transform data for client
    const localizedProducts = products.map(p => ({
        id: p.id,
        name: isTr ? p.name_tr : p.name_en,
        price: p.price.toNumber(),
        isActive: p.isActive,
        category: {
            name: isTr ? p.category.name_tr : p.category.name_en
        },
        variants: p.variants.map(v => ({
            ...v,
            priceAdjustment: v.priceAdjustment ? v.priceAdjustment.toNumber() : null
        })),
        images: p.images
    }))

    return (
        <ProductListClient
            data={localizedProducts}
            totalPages={totalPages}
            currentPage={currentPage}
            locale={locale}
        />
    )
}
