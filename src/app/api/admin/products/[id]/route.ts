import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

// ... imports kept same

function createSlug(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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

        // Transaction for update
        const product = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Update Product
            const updatedProduct = await tx.product.update({
                where: { id },
                data: {
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

            // 2. Handle Images (Full replace strategy is safe here)
            await tx.productImage.deleteMany({ where: { productId: id } })
            if (images && images.length > 0) {
                await tx.productImage.createMany({
                    data: images.map((img: { url: string; colorKey?: string | null }, index: number) => ({
                        productId: id,
                        url: img.url,
                        colorKey: img.colorKey || null,
                        displayOrder: index
                    }))
                })
            }

            // 3. Handle Variants (Smart Sync)
            // Get existing variants IDs
            const currentVariants = await tx.productVariant.findMany({
                where: { productId: id },
                select: { id: true }
            })
            const currentVariantIds = currentVariants.map(v => v.id)

            // Incoming variant IDs
            const incomingVariantIds = variants
                .filter((v: any) => v.id)
                .map((v: any) => v.id)

            // Identify variants to delete (those in DB but not in incoming list)
            const toDelete = currentVariantIds.filter(vid => !incomingVariantIds.includes(vid))

            // Delete removed variants
            if (toDelete.length > 0) {
                // Check constraints? For now try delete, might fail if orders exist.
                // Ideally we should soft delete or block. 
                // Catch error for now or assume UI handled it?
                // Let's try silent fail or just skip deleting if unsafe?
                // We will force delete for now, assuming admin knows.
                // Actually, best to check orders. 
                // But inside transaction... complicated. 
                // We'll proceed with deleteMany, if it fails, whole transaction fails.
                await tx.productVariant.deleteMany({
                    where: { id: { in: toDelete } }
                })
            }

            // Update or Create
            for (const v of variants) {
                const variantData = {
                    size: v.size,
                    color_tr: v.color_tr,
                    color_en: v.color_en,
                    colorHex: v.colorHex,
                    stock: Number(v.stock),

                    sku: v.sku || `VAR-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`.toUpperCase()
                }

                if (v.id) {
                    // Update
                    await tx.productVariant.update({
                        where: { id: v.id },
                        data: variantData
                    })
                } else {
                    // Create
                    await tx.productVariant.create({
                        data: {
                            productId: id,
                            ...variantData
                        }
                    })
                }
            }

            return updatedProduct
        }, {
            timeout: 15000 // 15 seconds for complex updates with images and variants
        })

        return NextResponse.json(product)

    } catch (error) {
        console.error('Update product error:', error)

        // Provide detailed error messages
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2028') {
                return NextResponse.json(
                    {
                        error: 'Transaction timeout',
                        message: 'İşlem çok uzun sürdü. Lütfen daha az varyant veya resim ile tekrar deneyin.'
                    },
                    { status: 500 }
                )
            } else if (error.code === 'P2025') {
                return NextResponse.json(
                    {
                        error: 'Product not found',
                        message: 'Güncellenmek istenen ürün bulunamadı.'
                    },
                    { status: 404 }
                )
            } else if (error.code === 'P2003') {
                return NextResponse.json(
                    {
                        error: 'Invalid reference',
                        message: 'Geçersiz kategori veya referans.'
                    },
                    { status: 400 }
                )
            }
        }

        return NextResponse.json(
            {
                error: 'Failed to update product',
                message: 'Ürün güncellenirken bir hata oluştu. Lütfen tekrar deneyin.'
            },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // TODO: Add Authorization check here (ensure user is admin)
        // For now, assuming middleware handles it or we trust internal calls

        // Delete related data (variants, images will be handled by cascade or manual delete)
        // Prisma schema usually handles onDelete: Cascade if configured, otherwise we delete manually

        // Actually best to soft delete (isActive = false), but the UI says Delete
        // Let's check relation dependencies.
        // Product has Variants, Images, OrderItems, Reviews.

        // If there are order items, we probably shouldn't fully delete, or just deactivate.
        // For simplicity in this demo, we'll deactivate (Soft Delete) or try hard delete if no orders.

        // Check for orders
        const hasOrders = await prisma.orderItem.findFirst({
            where: { variant: { productId: id } }
        })

        if (hasOrders) {
            // Soft delete
            await prisma.product.update({
                where: { id },
                data: { isActive: false }
            })
            return NextResponse.json({ message: 'Product deactivated due to existing orders' })
        }

        // Hard delete
        // First delete variants and images
        await prisma.productVariant.deleteMany({ where: { productId: id } })
        await prisma.productImage.deleteMany({ where: { productId: id } })

        await prisma.product.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete product error:', error)

        // Provide detailed error messages
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return NextResponse.json(
                    {
                        error: 'Product not found',
                        message: 'Silinmek istenen ürün bulunamadı.'
                    },
                    { status: 404 }
                )
            } else if (error.code === 'P2003' || error.code === 'P2014') {
                return NextResponse.json(
                    {
                        error: 'Constraint violation',
                        message: 'Ürün silinemedi. Bu ürüne ait aktif siparişler var.'
                    },
                    { status: 400 }
                )
            }
        }

        return NextResponse.json(
            {
                error: 'Failed to delete product',
                message: 'Ürün silinirken bir hata oluştu. Lütfen tekrar deneyin.'
            },
            { status: 500 }
        )
    }
}
