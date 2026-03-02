import ReviewListClient from '@/components/admin/reviews/ReviewListClient'

interface Props {
    params: Promise<{ locale: string }>
}

export default async function AdminReviewsPage({ params }: Props) {
    const { locale } = await params

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    {locale === 'tr' ? 'Müşteri Değerlendirmeleri' : 'Customer Reviews'}
                </h1>
            </div>

            <ReviewListClient locale={locale} />
        </div>
    )
}

export async function generateMetadata() {
    return { title: 'Değerlendirmeler | Admin' }
}
