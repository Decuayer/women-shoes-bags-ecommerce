import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import iyzico from '@/lib/iyzipay'
import { cookies } from 'next/headers'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { orderId, locale } = body
        const isTr = locale === 'tr'

        // 1. Auth Check
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = await verifyAccessTokenEdge(token)
        if (!payload || !payload.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = payload.userId as string

        // 2. Fetch Order
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true
                    }
                }
            }
        })

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Security: Ensure order belongs to user
        if (order.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Validate Status
        if (order.status !== 'PENDING' || order.paymentStatus !== 'PENDING') {
            return NextResponse.json({ error: 'Order is not pending payment' }, { status: 400 })
        }

        // 3. Get User Details (for Buyer info)
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        const buyerName = user?.firstName || order.shippingFullName.split(' ')[0] || 'Guest'
        const buyerSurname = user?.lastName || (order.shippingFullName.split(' ').length > 1 ? order.shippingFullName.split(' ').slice(1).join(' ') : 'User')
        const buyerPhone = user?.phone || order.shippingPhone || '+905555555555'
        const buyerEmail = user?.email || 'guest@example.com'

        // 4. Initialize iyzico
        // Note: We use the EXISTING order ID and number.
        const requestData = {
            locale: isTr ? 'tr' : 'en',
            conversationId: order.id,
            price: Number(order.subtotal).toFixed(2),
            paidPrice: Number(order.total).toFixed(2),
            currency: 'TRY',
            basketId: order.orderNumber,
            paymentGroup: 'PRODUCT',
            callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
            enabledInstallments: [1, 2, 3, 6, 9],
            buyer: {
                id: userId,
                name: buyerName,
                surname: buyerSurname,
                gsmNumber: buyerPhone,
                email: buyerEmail,
                identityNumber: '11111111111',
                registrationAddress: order.shippingAddressLine1,
                ip: '85.34.78.112', // Should get real IP
                city: order.shippingCity,
                country: order.shippingCountry,
            },
            shippingAddress: {
                contactName: order.shippingFullName,
                city: order.shippingCity,
                country: order.shippingCountry,
                address: `${order.shippingAddressLine1} ${order.shippingAddressLine2 || ''}`,
                zipCode: order.shippingPostalCode || ''
            },
            billingAddress: {
                contactName: order.shippingFullName, // Assuming same for now
                city: order.shippingCity,
                country: order.shippingCountry,
                address: `${order.shippingAddressLine1} ${order.shippingAddressLine2 || ''}`,
                zipCode: order.shippingPostalCode || ''
            },
            basketItems: order.items.map(item => ({
                id: item.variantId,
                name: isTr ? item.productName_tr : item.productName_en,
                category1: 'Giyim',
                itemType: 'PHYSICAL',
                price: (Number(item.price) * item.quantity).toFixed(2)
            }))
        }

        // Helper for iyzico promise
        const initializeCheckout = (data: any) => {
            return new Promise<any>((resolve, reject) => {
                iyzico.checkoutFormInitialize.create(data, (err: any, result: any) => {
                    if (err) reject(err)
                    else resolve(result)
                })
            })
        }

        const result = await initializeCheckout(requestData)

        if (result.status !== 'success') {
            console.error('iyzico failure (resume):', result)
            return NextResponse.json({ error: result.errorMessage }, { status: 400 })
        }

        return NextResponse.json({
            checkoutContent: result.checkoutFormContent,
            paymentPageUrl: result.paymentPageUrl,
            token: result.token
        })

    } catch (error) {
        console.error('Resume payment error:', error)
        return NextResponse.json({ error: 'System error' }, { status: 500 })
    }
}
