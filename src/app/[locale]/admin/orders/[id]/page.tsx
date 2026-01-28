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

    return (
        <OrderDetailClient order={order} locale={locale} />
    )
}
