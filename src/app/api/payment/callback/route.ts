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

        const orderId = result.conversationId
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
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/tr/checkout?error=${encodeURIComponent(errorMsg)}`)
        }

        // --- PAYMENT SUCCESS ---

        // 1. Update Order
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'CONFIRMED',
                paymentStatus: 'PAID',
                paymentId: result.paymentId,
                paymentMethod: 'iyzico',
                paidPrice: result.paidPrice // Store actual paid amount if needed
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
        try {
            await prisma.cart.delete({
                where: { userId: order.userId }
            })
        } catch (e) {
            // Cart might verify empty or already deleted
            console.log('Cart clearance error (minor):', e)
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/tr/checkout/success?orderId=${order.orderNumber}`)

    } catch (error) {
        console.error('Callback error:', error)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/tr/checkout?error=system_error`)
    }
}
