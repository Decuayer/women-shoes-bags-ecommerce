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

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { isApproved } = body

        if (typeof isApproved !== 'boolean') {
            return NextResponse.json({ error: 'isApproved field is required and must be a boolean' }, { status: 400 })
        }

        const review = await prisma.review.update({
            where: { id },
            data: { isApproved }
        })

        return NextResponse.json(review)
    } catch (error) {
        console.error('Error updating review:', error)
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        await prisma.review.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting review:', error)
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
    }
}
