import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import iyzico from '@/lib/iyzipay'
import { nanoid } from 'nanoid'
import { cookies } from 'next/headers'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { getShippingSettings } from '@/lib/settings'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { address, cartItems, locale } = body
        const isTr = locale === 'tr'

        // Securely get user from token
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        let userId = null
        let userEmail = 'guest@example.com'
        let userFirstName = 'Guest'
        let userLastName = 'User'
        let userPhone = '+905555555555'

        if (token) {
            const payload = await verifyAccessTokenEdge(token)
            if (payload) {
                userId = payload.userId as string
                userEmail = payload.email as string
                // Ideally fetch full user profile to get phone/name if missing in token
                // For now, trusting client body for address/name but ensuring userId is from token
            }
        }

        // Additional safety: If restrictions are on, reject if no userId
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get user details from DB to ensure fresh data for iyzico
        const dbUser = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (dbUser) {
            userFirstName = dbUser.firstName
            userLastName = dbUser.lastName
            userPhone = dbUser.phone || userPhone
            userEmail = dbUser.email
        }

        if (!address || !cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
        }

        // 1. Calculate Totals
        const { freeShippingThreshold, shippingCost: baseShippingCost } = await getShippingSettings()

        let subtotal = 0
        const items = []

        for (const item of cartItems) {
            const variant = await prisma.productVariant.findUnique({
                where: { id: item.variantId },
                include: { product: true }
            })

            if (!variant) throw new Error(`Product not found: ${item.variantId}`)

            // Check stock
            if (variant.stock < item.quantity) {
                return NextResponse.json({
                    error: isTr
                        ? `${variant.product.name_tr} için stok yetersiz`
                        : `Insufficient stock for ${variant.product.name_en}`
                }, { status: 400 })
            }

            const price = Number(variant.product.price)
            subtotal += price * item.quantity

            items.push({
                product: variant.product,
                variant: variant,
                quantity: item.quantity,
                price: price
            })
        }

        const shippingCost = subtotal >= freeShippingThreshold ? 0 : baseShippingCost
        const total = subtotal + shippingCost

        // 2. Create Pending Order
        const orderNumber = nanoid(10).toUpperCase()

        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: userId,
                status: 'PENDING',
                subtotal,
                shippingCost,
                total,
                paymentStatus: 'PENDING',

                // Shipping Address
                shippingFullName: address.fullName,
                shippingPhone: address.phone,
                shippingAddressLine1: address.addressLine1,
                shippingAddressLine2: address.addressLine2,
                shippingCity: address.city,
                shippingState: address.state || address.city, // Fallback to city if state not provided
                shippingPostalCode: address.postalCode,
                shippingCountry: address.country,

                // Items
                items: {
                    create: items.map(item => ({
                        productId: item.product.id,
                        variantId: item.variant.id,
                        quantity: item.quantity,
                        price: item.price,
                        productName_tr: item.product.name_tr,
                        productName_en: item.product.name_en,
                        variantSize: item.variant.size,
                        variantColor_tr: item.variant.color_tr,
                        variantColor_en: item.variant.color_en
                    }))
                }
            }
        })

        // 3. Initialize iyzico
        const requestData = {
            locale: isTr ? 'tr' : 'en',
            conversationId: order.id,
            price: subtotal.toFixed(2),
            paidPrice: total.toFixed(2),
            currency: 'TRY',
            basketId: orderNumber,
            paymentGroup: 'PRODUCT',
            callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
            enabledInstallments: [1, 2, 3, 6, 9],
            buyer: {
                id: userId || 'guest',
                name: userFirstName,
                surname: userLastName,
                gsmNumber: userPhone,
                email: userEmail,
                identityNumber: '11111111111', // Mandatory but can be placeholder for guest
                registrationAddress: address.addressLine1,
                ip: '85.34.78.112', // Should get real IP in prod
                city: address.city,
                country: address.country,
            },
            shippingAddress: {
                contactName: address.fullName,
                city: address.city,
                country: address.country,
                address: `${address.addressLine1} ${address.addressLine2 || ''}`,
                zipCode: address.postalCode
            },
            billingAddress: {
                contactName: address.fullName,
                city: address.city,
                country: address.country,
                address: `${address.addressLine1} ${address.addressLine2 || ''}`,
                zipCode: address.postalCode
            },
            basketItems: items.map(item => ({
                id: item.variant.id,
                name: item.product.name_tr, // iyzico likes TR usually or simple strings
                category1: 'Giyim', // Can be dynamic
                itemType: 'PHYSICAL',
                price: (item.price * item.quantity).toFixed(2)
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
            console.error('iyzico failure:', result)
            return NextResponse.json({ error: result.errorMessage }, { status: 400 })
        }

        return NextResponse.json({
            checkoutContent: result.checkoutFormContent,
            paymentPageUrl: result.paymentPageUrl,
            token: result.token
        })

    } catch (error) {
        console.error('Payment init error:', error)
        return NextResponse.json({ error: 'System error' }, { status: 500 })
    }
}
