import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const category = await prisma.category.findUnique({
            where: { id }
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
        const { name_en, name_tr } = body

        const category = await prisma.category.update({
            where: { id },
            data: { name_en, name_tr }
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
        const count = await prisma.product.count({ where: { categoryId: id } })
        if (count > 0) {
            return NextResponse.json({ error: 'Cannot delete category with products' }, { status: 400 })
        }

        await prisma.category.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}
