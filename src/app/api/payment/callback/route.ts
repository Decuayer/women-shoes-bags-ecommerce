import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import iyzico from '@/lib/iyzipay'

// Helper to convert iyzico callback to promise
const retrieveCheckoutForm = (token: string) => {
    return new Promise<any>((resolve, reject) => {
        iyzico.checkoutForm.retrieve({
            locale: 'tr',
            conversationId: '', // Optional here?
            token: token
        }, (err: any, result: any) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const token = formData.get('token') as string

        if (!token) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/en/checkout?error=token_missing`)
        }

        const result = await retrieveCheckoutForm(token)
        console.log('Iyzico Callback Result:', JSON.stringify(result, null, 2))

        let orderId = result.conversationId

        // Fallback: If conversationId is empty (common in some Iyzico modes/mocks),
        // try to find order by basketId (which stores our orderNumber)
        if (!orderId && result.basketId) {
            console.log('ConversationId missing, looking up by basketId:', result.basketId)
            const existingOrder = await prisma.order.findUnique({
                where: { orderNumber: result.basketId },
                select: { id: true }
            })
            if (existingOrder) {
                orderId = existingOrder.id
                console.log('Found ID via basketId:', orderId)
            }
        }

        if (!orderId) {
            console.error('Could not find order ID from callback')
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/tr/checkout?error=order_not_found`)
        }

        const isSuccess = result.status === 'success' && result.paymentStatus === 'SUCCESS'

        if (!isSuccess) {
            // Payment Failed
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: 'CANCELLED',
                    paymentStatus: 'FAILED',
                    paymentMethod: 'iyzico'
                }
            })
            const errorMsg = result.errorMessage || 'Payment failed'
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/tr/checkout?error=${encodeURIComponent(errorMsg)}`, { status: 303 })
        }

        // --- PAYMENT SUCCESS ---

        // 1. Update Order
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'CONFIRMED',
                paymentStatus: 'PAID',
                paymentId: result.paymentId,
                paymentMethod: 'iyzico'
            },
            include: { items: true }
        })

        // 2. Deduct Stock (Transactional)
        await prisma.$transaction(
            order.items.map((item: any) =>
                prisma.productVariant.update({
                    where: { id: item.variantId },
                    data: { stock: { decrement: item.quantity } }
                })
            )
        )

        // 3. Clear User Cart
        // Order has userId. Find cart by userId
        if (order.userId) {
            try {
                await prisma.cart.delete({
                    where: { userId: order.userId }
                })
            } catch (e) {
                // Cart might verify empty or already deleted
                console.log('Cart clearance error (minor):', e)
            }
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/tr/checkout/success?orderId=${order.orderNumber}`, { status: 303 })

    } catch (error) {
        console.error('Callback error:', error)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/tr/checkout?error=system_error`, { status: 303 })
    }
}
