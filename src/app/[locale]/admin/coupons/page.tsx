import { prisma } from '@/lib/prisma'
import CouponListClient from '@/components/admin/coupons/CouponListClient'

interface Props {
    params: Promise<{ locale: string }>
}

export default async function AdminCouponsPage({ params }: Props) {
    const { locale } = await params

    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <CouponListClient
            coupons={coupons.map(c => ({
                ...c,
                value: Number(c.value),
                minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
                maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null,
                expiresAt: c.expiresAt?.toISOString() || null,
                createdAt: c.createdAt.toISOString(),
            }))}
            locale={locale}
        />
    )
}

export async function generateMetadata() {
    return { title: 'Kupon Yönetimi | Admin' }
}
