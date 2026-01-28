import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function createSlug(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            name_en, name_tr,
            description_en, description_tr,
            price, compareAtPrice,
            categoryId, brand,
            material_en, material_tr,
            isActive, isFeatured,
            images, variants
        } = body

        // Create slug from EN name
        const slug = createSlug(name_en) + '-' + Math.random().toString(36).substring(2, 7)

        // Transaction to create product + images + variants
        const product = await prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    slug,
                    name_en, name_tr,
                    description_en, description_tr,
                    price: Number(price),
                    compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
                    categoryId,
                    brand,
                    material_en, material_tr,
                    isActive,
                    isFeatured
                }
            })

            // Create images
            if (images && images.length > 0) {
                await tx.productImage.createMany({
                    data: images.map((url: string, index: number) => ({
                        productId: product.id,
                        url,
                        displayOrder: index
                    }))
                })
            }

            // Create variants
            if (variants && variants.length > 0) {
                await tx.productVariant.createMany({
                    data: variants.map((v: any) => ({
                        productId: product.id,
                        size: v.size,
                        color_tr: v.color_tr,
                        color_en: v.color_en,
                        colorHex: v.colorHex,
                        stock: Number(v.stock),
                        sku: v.sku
                    }))
                })
            }

            return product
        })

        return NextResponse.json(product)

    } catch (error) {
        console.error('Create product error:', error)
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        )
    }
}
