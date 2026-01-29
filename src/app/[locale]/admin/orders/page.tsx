import { prisma } from '@/lib/prisma'
import OrderListClient from '@/components/admin/orders/OrderListClient'
import { Prisma } from '@prisma/client'

interface OrderListPageProps {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ page?: string; q?: string }>
}

export default async function OrderListPage({ params, searchParams }: OrderListPageProps) {
    const { locale } = await params
    const { page = '1', q = '' } = await searchParams

    const currentPage = Number(page) || 1
    const itemsPerPage = 10
    const skip = (currentPage - 1) * itemsPerPage

    // Build filter inputs
    const where: Prisma.OrderWhereInput = q ? {
        OR: [
            { orderNumber: { contains: q, mode: 'insensitive' } },
            {
                user: {
                    OR: [
                        { firstName: { contains: q, mode: 'insensitive' } },
                        { lastName: { contains: q, mode: 'insensitive' } },
                        { email: { contains: q, mode: 'insensitive' } }
                    ]
                }
            }
        ]
    } : {}

    // Fetch data
    const [orders, totalItems] = await Promise.all([
        prisma.order.findMany({
            where,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            skip,
            take: itemsPerPage,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.order.count({ where })
    ])

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    // Transform orders to plain objects
    const serializedOrders = orders.map(order => ({
        ...order,
        subtotal: order.subtotal.toNumber(),
        shippingCost: order.shippingCost.toNumber(),
        tax: order.tax.toNumber(),
        total: order.total.toNumber(),
    }))

    return (
        <OrderListClient
            data={serializedOrders}
            totalPages={totalPages}
            currentPage={currentPage}
            locale={locale}
        />
    )
}
