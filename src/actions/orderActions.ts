'use server'

import { prisma } from '@/lib/prisma'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function cancelOrder(orderId: string) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            return { success: false, message: 'Unauthorized' }
        }

        const payload = await verifyAccessTokenEdge(token)
        if (!payload) {
            return { success: false, message: 'Unauthorized' }
        }

        const userId = payload.userId as string

        // Fetch Order
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        })

        if (!order) {
            return { success: false, message: 'Order not found' }
        }

        // Verify Ownership
        if (order.userId !== userId) {
            return { success: false, message: 'Unauthorized access to this order' }
        }

        // Check Status
        if (!['PENDING', 'PREPARING'].includes(order.status)) {
            return { success: false, message: 'This order cannot be cancelled' }
        }

        // Perform Cancellation
        await prisma.$transaction(async (tx) => {
            // 1. Update Order Status
            await tx.order.update({
                where: { id: orderId },
                data: {
                    status: 'CANCELLED',
                    paymentStatus: order.paymentStatus === 'PAID' ? 'REFUNDED' : 'FAILED', // Simplified refund logic
                    adminNote: 'Cancelled by user',
                    updatedAt: new Date()
                }
            })

            // 2. Restore Stock
            for (const item of order.items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stock: { increment: item.quantity } }
                })
            }
        })

        revalidatePath('/[locale]/account/orders')
        revalidatePath(`/[locale]/account/orders/${order.orderNumber}`)

        return { success: true }

    } catch (error) {
        console.error('Cancel Order Error:', error)
        return { success: false, message: 'Failed to cancel order' }
    }
}
