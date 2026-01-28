import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true
                    }
                },
                items: {
                    include: {
                        productVariant: {
                            include: {
                                product: true
                            }
                        }
                    }
                },
                shippingAddress: true,
                billingAddress: true
            }
        })

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json(order)

    } catch (error) {
        console.error('Get order error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch order' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { status } = body

        // TODO: Add complex logic like updating stock if cancelling etc.
        // For now just update status

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json(order)

    } catch (error) {
        console.error('Update order error:', error)
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        )
    }
}
