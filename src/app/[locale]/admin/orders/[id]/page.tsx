import { prisma } from '@/lib/prisma'
import OrderDetailClient from '@/components/admin/orders/OrderDetailClient'
import { notFound } from 'next/navigation'

interface OrderDetailPageProps {
    params: Promise<{ locale: string; id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { locale, id } = await params

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
                    variant: {
                        include: {
                            product: true
                        }
                    }
                }
            }
        }
    })

    if (!order) {
        notFound()
    }

    const serializedOrder = {
        ...order,
        subtotal: order.subtotal.toNumber(),
        shippingCost: order.shippingCost.toNumber(),
        tax: order.tax.toNumber(),
        total: order.total.toNumber(),
        shippingAddress: {
            address: order.shippingAddressLine1 + (order.shippingAddressLine2 ? ' ' + order.shippingAddressLine2 : ''),
            city: order.shippingCity,
            country: order.shippingCountry,
            zipCode: order.shippingPostalCode
        },
        items: order.items.map(item => {
            // Exclude original variant (contains Decimals) from ...rest
            const { variant, ...rest } = item
            return {
                ...rest,
                price: item.price.toNumber(),
                productVariant: {
                    ...variant,
                    priceAdjustment: variant.priceAdjustment ? variant.priceAdjustment.toNumber() : null,
                    product: {
                        ...variant.product,
                        price: variant.product.price.toNumber(),
                        compareAtPrice: variant.product.compareAtPrice ? variant.product.compareAtPrice.toNumber() : null
                    }
                }
            }
        })
    }

    return (
        <OrderDetailClient order={serializedOrder} locale={locale} />
    )
}
