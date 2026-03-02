import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'


function createSlug(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
}

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                },
                parent: {
                    select: { id: true, name_en: true, name_tr: true }
                },
                children: {
                    select: {
                        id: true,
                        name_en: true,
                        name_tr: true,
                        slug: true,
                        isActive: true,
                        displayOrder: true,
                        _count: { select: { products: true } }
                    },
                    orderBy: { displayOrder: 'asc' }
                }
            },
            orderBy: [{ displayOrder: 'asc' }, { name_en: 'asc' }]
        })

        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name_en, name_tr, parentId } = body

        if (!name_en || !name_tr) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        // Generate unique slug with parent prefix to avoid collisions
        const baseSlug = createSlug(name_en)
        let slug = baseSlug

        // If parent exists, prefix slug to keep it unique
        if (parentId) {
            const parent = await prisma.category.findUnique({ where: { id: parentId }, select: { slug: true } })
            if (parent) slug = `${parent.slug}-${baseSlug}`
        }

        // Ensure unique slug
        const existing = await prisma.category.findUnique({ where: { slug } })
        if (existing) slug = `${slug}-${Date.now()}`

        const category = await prisma.category.create({
            data: {
                name_en,
                name_tr,
                slug,
                parentId: parentId || null,
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }
}
