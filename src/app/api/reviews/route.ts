import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'

// GET /api/reviews?productId=xxx — fetch approved reviews for a product
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')

        if (!productId) {
            return NextResponse.json({ error: 'productId is required' }, { status: 400 })
        }

        const reviews = await prisma.review.findMany({
            where: { productId, isApproved: true },
            include: {
                user: {
                    select: { firstName: true, lastName: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        const mapped = reviews.map(r => ({
            id: r.id,
            rating: r.rating,
            title: r.title,
            comment: r.comment,
            isVerifiedPurchase: r.isVerifiedPurchase,
            createdAt: r.createdAt,
            user: {
                name: `${r.user.firstName} ${r.user.lastName.charAt(0)}.`
            }
        }))

        const avgRating = reviews.length > 0
            ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
            : null

        return NextResponse.json({ reviews: mapped, avgRating, count: reviews.length })
    } catch (error) {
        console.error('GET reviews error:', error)
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }
}

// POST /api/reviews — submit a review (only if order is DELIVERED)
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = await verifyAccessTokenEdge(token)
        if (!payload?.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = payload.userId as string
        const body = await request.json()
        const { productId, rating, title, comment } = body

        if (!productId || !rating || !comment) {
            return NextResponse.json({ error: 'productId, rating and comment are required' }, { status: 400 })
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
        }

        // Check if user already reviewed this product
        const existingReview = await prisma.review.findUnique({
            where: { userId_productId: { userId, productId } }
        })

        if (existingReview) {
            return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 })
        }

        // Check if user has a DELIVERED order containing this product
        const deliveredOrder = await prisma.order.findFirst({
            where: {
                userId,
                status: 'DELIVERED',
                items: {
                    some: { productId }
                }
            }
        })

        if (!deliveredOrder) {
            return NextResponse.json({
                error: 'You can only review products from delivered orders'
            }, { status: 403 })
        }

        // Create the review
        const review = await prisma.review.create({
            data: {
                userId,
                productId,
                rating: Number(rating),
                title: title?.trim() || null,
                comment: comment.trim(),
                isVerifiedPurchase: true, // confirmed via delivered order check
                isApproved: false, // admin must approve
            }
        })

        return NextResponse.json({ success: true, review })
    } catch (error) {
        console.error('POST review error:', error)
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
    }
}
