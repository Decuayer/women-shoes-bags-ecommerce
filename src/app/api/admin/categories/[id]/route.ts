import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                parent: { select: { id: true, name_en: true, name_tr: true } },
                children: { select: { id: true, name_en: true, name_tr: true } }
            }
        })

        if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        return NextResponse.json(category)
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { name_en, name_tr, parentId } = body

        // Prevent circular reference (category can't be its own parent)
        if (parentId === id) {
            return NextResponse.json({ error: 'Category cannot be its own parent' }, { status: 400 })
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                name_en,
                name_tr,
                parentId: parentId === '' ? null : (parentId || undefined)
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Check if has products
        const productCount = await prisma.product.count({ where: { categoryId: id } })
        if (productCount > 0) {
            return NextResponse.json({ error: 'Cannot delete category with products' }, { status: 400 })
        }

        // Check if has subcategories
        const childCount = await prisma.category.count({ where: { parentId: id } })
        if (childCount > 0) {
            return NextResponse.json({ error: 'Cannot delete category with subcategories' }, { status: 400 })
        }

        await prisma.category.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}
