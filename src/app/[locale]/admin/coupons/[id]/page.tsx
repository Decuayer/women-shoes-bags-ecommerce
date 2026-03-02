import { prisma } from '@/lib/prisma'
import CouponForm from '@/components/admin/CouponForm'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ locale: string; id: string }>
}

export default async function EditCouponPage({ params }: Props) {
    const { locale, id } = await params

    const coupon = await prisma.coupon.findUnique({ where: { id } })
    if (!coupon) notFound()

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                {locale === 'tr' ? 'Kupon Düzenle' : 'Edit Coupon'}
                <span className="text-secondary ml-2">— {coupon.code}</span>
            </h1>
            <CouponForm
                locale={locale}
                initialData={{
                    id: coupon.id,
                    code: coupon.code,
                    type: coupon.type,
                    value: Number(coupon.value),
                    description: coupon.description,
                    minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
                    maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
                    usageLimit: coupon.usageLimit,
                    isActive: coupon.isActive,
                    expiresAt: coupon.expiresAt?.toISOString() || null,
                }}
            />
        </div>
    )
}
