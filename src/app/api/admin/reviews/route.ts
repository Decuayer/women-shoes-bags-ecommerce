import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

async function isAdmin() {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken') // Fixed: using accessToken instead of token

    if (!token) return false

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jwtVerify(token.value, secret)
        return payload.role === 'ADMIN'
    } catch {
        return false
    }
}

export async function GET(request: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') // 'PENDING', 'APPROVED', or 'ALL'

        let statusFilter = {}
        if (status === 'PENDING') {
            statusFilter = { isApproved: false }
        } else if (status === 'APPROVED') {
            statusFilter = { isApproved: true }
        }

        const reviews = await prisma.review.findMany({
            where: statusFilter,
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
                product: { select: { id: true, name_tr: true, name_en: true, slug: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(reviews)
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }
}
