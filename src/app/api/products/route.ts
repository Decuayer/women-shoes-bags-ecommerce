import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/products - List products with filtering
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Parse query parameters
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const colors = searchParams.get('color')?.split(',')
        const sizes = searchParams.get('size')?.split(',')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const locale = searchParams.get('locale') || 'tr'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {
            isActive: true,
        }

        if (category) {
            where.category = {
                slug: category,
            }
        }

        if (search) {
            where.OR = [
                { name_tr: { contains: search, mode: 'insensitive' } },
                { name_en: { contains: search, mode: 'insensitive' } },
                { description_tr: { contains: search, mode: 'insensitive' } },
                { description_en: { contains: search, mode: 'insensitive' } },
            ]
        }

        if (minPrice || maxPrice) {
            where.price = {}
            if (minPrice) where.price.gte = parseFloat(minPrice)
            if (maxPrice) where.price.lte = parseFloat(maxPrice)
        }

        // Filter by variants (color, size)
        if (colors || sizes) {
            where.variants = {
                some: {
                    AND: [
                        colors ? { color_tr: { in: colors } } : {},
                        sizes ? { size: { in: sizes } } : {},
                        { stock: { gt: 0 } },
                    ],
                },
            }
        }

        // Fetch products
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    category: true,
                    images: {
                        orderBy: { displayOrder: 'asc' },
                    },
                    variants: {
                        where: { isActive: true },
                    },
                    reviews: {
                        where: { isApproved: true },
                        select: {
                            rating: true,
                        },
                    },
                },
                orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
            }),
            prisma.product.count({ where }),
        ])

        // Calculate average ratings
        const productsWithRatings = products.map((product: any) => {
            const avgRating =
                product.reviews.length > 0
                    ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
                    : 0

            return {
                id: product.id,
                slug: product.slug,
                name: locale === 'tr' ? product.name_tr : product.name_en,
                description: locale === 'tr' ? product.description_tr : product.description_en,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                category: {
                    id: product.category.id,
                    slug: product.category.slug,
                    name: locale === 'tr' ? product.category.name_tr : product.category.name_en,
                },
                images: product.images,
                variants: product.variants,
                isFeatured: product.isFeatured,
                avgRating,
                reviewCount: product.reviews.length,
            }
        })

        return NextResponse.json({
            products: productsWithRatings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/products - Create new product (Admin only)
const createProductSchema = z.object({
    slug: z.string(),
    name_tr: z.string(),
    name_en: z.string(),
    description_tr: z.string(),
    description_en: z.string(),
    categoryId: z.string(),
    price: z.number(),
    compareAtPrice: z.number().optional(),
    material_tr: z.string().optional(),
    material_en: z.string().optional(),
    brand: z.string().optional(),
    isFeatured: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
    try {
        // TODO: Check if user is admin (from JWT token)
        const body = await request.json()
        const validatedData = createProductSchema.parse(body)

        const product = await prisma.product.create({
            data: validatedData,
            include: {
                category: true,
                images: true,
                variants: true,
            },
        })

        return NextResponse.json(product, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
        }

        console.error('Error creating product:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
