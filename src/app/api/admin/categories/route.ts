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
                }
            },
            orderBy: { name_en: 'asc' }
        })

        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name_en, name_tr } = body

        if (!name_en || !name_tr) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        const slug = createSlug(name_en)

        const category = await prisma.category.create({
            data: {
                name_en,
                name_tr,
                slug
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }
}
