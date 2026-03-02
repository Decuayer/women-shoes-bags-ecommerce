import CouponForm from '@/components/admin/CouponForm'

interface Props {
    params: Promise<{ locale: string }>
}

export default async function NewCouponPage({ params }: Props) {
    const { locale } = await params
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                {locale === 'tr' ? 'Yeni Kupon Oluştur' : 'Create New Coupon'}
            </h1>
            <CouponForm locale={locale} />
        </div>
    )
}

export async function generateMetadata() {
    return { title: 'Yeni Kupon | Admin' }
}
